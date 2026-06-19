"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

const NAV_LINKS = [
  { label: "About", href: "#", soon: false },
  { label: "Work", href: "#work", soon: false },
  { label: "Process", href: "#process", soon: false },
  { label: "Services", href: "#services", soon: false },
  { label: "Contact", href: CAL_LINK, soon: false },
];

// ── Interactive NUQTA particle canvas ──────────────────────────────────────────
function NuqtaCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const visibleRef   = useRef(false);
  const mouseRef     = useRef({ x: -9999, y: -9999, pressing: false });
  const particlesRef = useRef<{ ox: number; oy: number; x: number; y: number; vx: number; vy: number }[]>([]);
  const readyRef     = useRef(false);

  // IntersectionObserver — pause rendering when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      // Skip rendering when canvas is off-screen
      if (!readyRef.current || !visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
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

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

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
    const onResize = () => { readyRef.current = false; buildParticles(); };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove as EventListener, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchend", onUp);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
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

export function Footer() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Live Doha time (UTC+3, no DST)
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Qatar",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      );
      setDate(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Qatar",
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(now)
      );
      setYear(now.getFullYear().toString());
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Footer parallax — skip on reduced motion
  useEffect(() => {
    if (!footerRef.current || !innerRef.current) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -15 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-[#0a0a0a] overflow-hidden">
      <div ref={innerRef} className="will-change-transform">

        {/* ── Main footer body ── */}
        <div className="px-6 md:px-10 max-w-[1440px] mx-auto pt-20 md:pt-28">

          {/* Top: large nav links + studio details */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 border-b border-[#1a1a1a] pb-14 md:pb-20">

            {/* Big nav links */}
            <div>
              <p className="text-[#888880] text-[10px] tracking-[0.22em] uppercase mb-8">Navigation</p>
              <nav>
                <ul className="space-y-0 divide-y divide-[#1a1a1a]">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center justify-between py-3 md:py-4 hover:text-[#c8b89a] transition-colors duration-200"
                      >
                        <span
                          className="text-[#f5f0eb] font-medium leading-none transition-colors duration-200 group-hover:text-[#c8b89a]"
                          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
                        >
                          {link.label}
                        </span>
                        <span className="text-[#f5f0eb]/30 group-hover:text-[#c8b89a] transition-colors duration-200 text-xl md:text-2xl">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Studio details — Based in only */}
            <div className="md:pt-14 min-w-[220px]">
              <p className="text-[#888880] text-[10px] tracking-[0.22em] uppercase mb-4">(Studio Details)</p>
              <p className="text-[#f5f0eb] text-[13px]">Based in Doha, Qatar</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 md:items-center gap-3">
            {/* Left: Doha time + date */}
            <div className="text-[#888880] text-[11px]" style={{ fontFamily: '"Suisse Mono", "Courier New", monospace' }}>
              <p>Doha, Qatar {time}</p>
              <p>{date} (GMT +03)</p>
            </div>
            {/* Center: back to top */}
            <div className="flex flex-col items-start md:items-center gap-1">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-[#888880] hover:text-[#f5f0eb] text-[11px] transition-colors duration-200"
              >
                Back to top ↑
              </button>
            </div>
            {/* Right: copyright */}
            <div className="flex flex-col items-start md:items-end gap-1">
              <p className="text-[#888880] text-[11px]">©{year} Nuqta Studio</p>
            </div>
          </div>
        </div>

        {/* ── Bottom interactive NUQTA canvas ── */}
        <NuqtaCanvas />

      </div>
    </footer>
  );
}
