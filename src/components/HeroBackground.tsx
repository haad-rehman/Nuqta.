"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Hero background — a direct React port of the old public/hero-bg.html canvas
 * (which lived in a 2.7MB iframe with the image base64-inlined into the HTML).
 *
 * Same animation, in-page: the backdrop image is sliced into 2px rows and each
 * row is offset by a wave + a mouse "pull" + a ripple, plus film grain and a
 * radial glow that follows the cursor. The image is now an external AVIF/WebP
 * (~60KB) instead of a 2MB base64 blob.
 *
 * - Lazy-inits after first paint (requestIdleCallback -> setTimeout).
 * - Runs on the shared gsap.ticker (one page rAF) and is removed from it while
 *   the hero is scrolled out of view (IntersectionObserver).
 * - Under prefers-reduced-motion: draws a single static frame, no loop.
 */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];

    // Smoothed + target mouse, in 0..1 (centre by default, matches original).
    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, t = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    const drawDistorted = (img: HTMLImageElement) => {
      const c = canvas;
      const w = c.width, h = c.height;
      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < h; y += 2) {
        const p = y / h;
        const wave = Math.sin(p * 18 + t * 3) * 18;
        const pull = (mx - 0.5) * 2 * 90 * Math.exp(-Math.pow((p - my) * 4, 2));
        const ripple = Math.sin(p * 80 - t * 12) * 20 * Math.exp(-Math.pow((p - my) * 8, 2));
        const off = wave + pull + ripple;
        ctx.drawImage(img, 0, p * img.height, img.width, 2, off, y, w, 2);
      }
      // Film grain (faithful to original: reuses the prior fillStyle).
      for (let n = 0; n < 4500; n++) {
        ctx.globalAlpha = Math.random() * 0.08;
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      }
      ctx.globalAlpha = 1;
      // Cursor glow.
      const gx = mx * w, gy = my * h;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 180);
      g.addColorStop(0, "rgba(255,255,255,.12)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const drawStatic = (img: HTMLImageElement) => {
      // Cover-fit the image, no distortion — reduced-motion fallback.
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const start = () => {
      if (disposed) return;
      resize();

      const img = new Image();
      img.decoding = "async";
      // AVIF first; fall back to WebP if the browser can't decode it.
      let triedFallback = false;
      img.onerror = () => {
        if (triedFallback) return;
        triedFallback = true;
        img.src = "/hero-bg.webp";
      };
      img.src = "/hero-bg.avif";

      const onResize = () => resize();
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      img.onload = () => {
        if (disposed) return;

        if (prefersReducedMotion()) {
          drawStatic(img);
          const onR = () => drawStatic(img);
          window.addEventListener("resize", onR);
          cleanups.push(() => window.removeEventListener("resize", onR));
          return;
        }

        const onMove = (e: MouseEvent) => {
          tx = e.clientX / window.innerWidth;
          ty = e.clientY / window.innerHeight;
        };
        window.addEventListener("mousemove", onMove);
        cleanups.push(() => window.removeEventListener("mousemove", onMove));

        const tick = () => {
          if (!img.complete) return;
          t += 0.03;
          mx += (tx - mx) * 0.12;
          my += (ty - my) * 0.12;
          drawDistorted(img);
        };

        // One shared rAF for the whole page.
        let running = false;
        const run = () => { if (!running) { gsap.ticker.add(tick); running = true; } };
        const stop = () => { if (running) { gsap.ticker.remove(tick); running = false; } };

        // Pause the loop entirely while the hero is off-screen.
        const io = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) run(); else stop(); },
          { threshold: 0 }
        );
        io.observe(canvas);
        cleanups.push(() => { io.disconnect(); stop(); });
      };
    };

    // Defer init until the browser is idle / past first paint.
    const ric = window.requestIdleCallback;
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof ric === "function") {
      idleId = ric(start, { timeout: 500 });
    } else {
      timeoutId = setTimeout(start, 1);
    }

    return () => {
      disposed = true;
      if (idleId && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "#080808",
      }}
    />
  );
}
