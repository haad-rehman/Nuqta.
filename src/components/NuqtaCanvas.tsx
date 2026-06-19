"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

// ── Interactive NUQTA particle canvas ──────────────────────────────────────────
// Code-split out of Footer via next/dynamic (ssr:false). The footer reserves the
// exact box this occupies (48px padding + 220px canvas) with a matching
// placeholder so deferring it introduces no layout shift.
export function NuqtaCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef     = useRef({ x: -9999, y: -9999, pressing: false });
  const particlesRef = useRef<{ ox: number; oy: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const readyRef     = useRef(false);

  useEffect(() => {
    // Skip particle canvas entirely on reduced motion
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const FONT_SIZE = Math.round(canvas.clientWidth * 0.18);
    const SPACING = 4;
    const REPEL_R = 80;
    const REPEL_FORCE = 4.5;
    const FRICTION = 0.82;
    const RETURN = 0.12;

    const buildParticles = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d")!;
      offCtx.fillStyle = "#ffffff";
      offCtx.font = `900 ${FONT_SIZE}px "Animo", Arial, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText("NUQTA", w / 2, h / 2);

      const imageData = offCtx.getImageData(0, 0, w, h);
      const pts: { ox: number; oy: number; x: number; y: number; vx: number; vy: number }[] = [];
      for (let y = 0; y < h; y += SPACING) {
        for (let x = 0; x < w; x += SPACING) {
          const idx = (y * w + x) * 4;
          if (imageData.data[idx + 3] > 128) {
            pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
          }
        }
      }
      particlesRef.current = pts;
      readyRef.current = true;
    };

    buildParticles();

    const tick = () => {
      if (!readyRef.current) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(245,240,235,0.92)";

      const { x: mx, y: my, pressing } = mouseRef.current;
      const r = pressing ? REPEL_R * 2 : REPEL_R;
      const force = pressing ? REPEL_FORCE * 1.8 : REPEL_FORCE;

      for (const p of particlesRef.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r && dist > 0) {
          const angle = Math.atan2(dy, dx);
          const push = (r - dist) / r * force;
          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push;
        }
        p.vx += (p.ox - p.x) * RETURN;
        p.vy += (p.oy - p.y) * RETURN;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Run on the shared gsap.ticker (one page rAF); fully add/remove on
    // visibility so nothing ticks while the footer is off-screen.
    let running = false;
    const startTicker = () => { if (!running) { gsap.ticker.add(tick); running = true; } };
    const stopTicker = () => { if (running) { gsap.ticker.remove(tick); running = false; } };
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) startTicker(); else stopTicker(); },
      { threshold: 0 }
    );
    io.observe(containerRef.current ?? canvas);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };
    const onDown  = () => { mouseRef.current.pressing = true; };
    const onUp    = () => { mouseRef.current.pressing = false; };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; mouseRef.current.pressing = false; };
    // Debounced — mobile URL-bar show/hide fires resize continuously, and
    // rebuilding the particle field is expensive (getImageData over the text).
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { readyRef.current = false; buildParticles(); }, 200);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove as EventListener, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchend", onUp);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      stopTicker();
      io.disconnect();
      clearTimeout(resizeTimer);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove as EventListener);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchend", onUp);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", background: "#060606", paddingTop: "48px" }}>
      <canvas
        ref={canvasRef}
        title="Hold to disrupt"
        style={{ display: "block", width: "100%", height: "220px", cursor: "crosshair" }}
      />
      <span
        style={{
          position: "absolute",
          bottom: "12px",
          right: "clamp(16px,2vw,28px)",
          fontFamily: '"Suisse Mono","Courier New",monospace',
          fontSize: "11px",
          color: "rgba(245,240,235,0.35)",
          letterSpacing: "0.06em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        [Refuse to be underestimated.]
      </span>
    </div>
  );
}
