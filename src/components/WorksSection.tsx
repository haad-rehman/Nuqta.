"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────────────────────

const CUBES = [
  {
    images: [
      "/assets/works/Al-Ayoon-1.webp",
      "/assets/works/Al-Ayoon-2.webp",
      "/assets/works/Al-Ayoon-3.webp",
    ],
    title: "Web Design",
    tagline: "Your ideas brought to life",
    position: "left" as const,
    href: "https://alayoon4x4.netlify.app/",
  },
  {
    images: [
      "/assets/works/Desert-Drive-1.webp",
      "/assets/works/Desert-Drive-2.webp",
      "/assets/works/Desert-Drive-3.webp",
    ],
    title: "Branding",
    tagline: "Your story matters",
    position: "right" as const,
    href: "https://desertdrive.netlify.app/",
  },
  {
    images: [
      "/assets/works/Al-Sharqi-1.webp",
      "/assets/works/Al-Sharqi-2.webp",
      "/assets/works/Al-Sharqi-3.webp",
    ],
    title: "3D Development",
    tagline: "Your own shaped reality",
    position: "left" as const,
    href: "https://alsharqityres.netlify.app/",
  },
];

const POSITIONS = ["justify-start", "justify-end", "justify-start"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getImageForFace(images: string[], faceIndex: number) {
  if (!images.length) return null;
  return images[faceIndex % images.length];
}

function snapToNearest90(deg: number) {
  return Math.round(deg / 90) * 90;
}

// ── Particle ──────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; size: number; dark: boolean;
}

// ── ImageCube ─────────────────────────────────────────────────────────────────

interface ImageCubeProps {
  images: string[];
  size: number;
  isHovered: boolean;
  isDefocused: boolean;
  isOpen: boolean;
  shadowScale: number;
  isMobile: boolean;
  sectionVisibleRef: React.RefObject<boolean>;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

function ImageCube({
  images,
  size,
  isHovered,
  isDefocused,
  isOpen,
  shadowScale,
  isMobile,
  sectionVisibleRef,
  onPointerEnter,
  onPointerLeave,
}: ImageCubeProps) {
  const cubeRef    = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fanRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const rxRef      = useRef(0);
  const ryRef      = useRef(0);
  const frameRef   = useRef<number>(0);
  const isHoveredRef = useRef(false);
  const isOpenRef    = useRef(false);
  const spinVelocity = useRef({ rx: 0, ry: 0 });

  const startSpin = useCallback(() => {
    const step = () => {
      // Gently ramp velocity toward target — cube eases in from stationary instead of snapping to full speed
      spinVelocity.current.rx += (0.12 - spinVelocity.current.rx) * 0.05;
      spinVelocity.current.ry += (0.18 - spinVelocity.current.ry) * 0.05;
      rxRef.current += spinVelocity.current.rx;
      ryRef.current += spinVelocity.current.ry;
      if (cubeRef.current && !isHoveredRef.current && !isOpenRef.current && sectionVisibleRef.current) {
        cubeRef.current.style.transform = `rotateX(${rxRef.current}deg) rotateY(${ryRef.current}deg)`;
      }
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSpin = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    spinVelocity.current = { rx: 0, ry: 0 };
  }, []);

  useEffect(() => {
    startSpin();
    return () => stopSpin();
  }, [startSpin, stopSpin]);

  // Preload images on first hover
  const preloadedRef = useRef(false);
  useEffect(() => {
    if (isHovered && !preloadedRef.current && images.length) {
      preloadedRef.current = true;
      images.forEach((src) => { const img = new window.Image(); img.src = src; });
    }
  }, [isHovered, images]);

  // ── Open / close ──────────────────────────────────────────────────────────
  useEffect(() => {
    isOpenRef.current = isOpen;
    const fanScale = size / 208;
    const fanW = Math.round(108 * fanScale);
    const fanH = Math.round(144 * fanScale);
    const fanPositions = [
      { x: -140 * fanScale, y: 40 * fanScale, rotation: -13 },
      { x: 0,               y: 60 * fanScale, rotation:   0 },
      { x: 140 * fanScale,  y: 40 * fanScale, rotation:  13 },
    ];

    // Update fan card dimensions when size changes
    fanRefs.current.forEach((el) => {
      if (!el) return;
      el.style.width  = `${fanW}px`;
      el.style.height = `${fanH}px`;
      el.style.marginTop  = `${-fanH / 2}px`;
      el.style.marginLeft = `${-fanW / 2}px`;
    });

    if (isOpen && !isHoveredRef.current) {
      stopSpin();
      gsap.to(cubeRef.current, {
        rotateX: snapToNearest90(rxRef.current),
        rotateY: snapToNearest90(ryRef.current),
        duration: 0.45,
        ease: "power3.out",
      });
      // On mobile: cube fades away completely so fan cards take full stage
      gsap.to(wrapperRef.current, {
        scale:   isMobile ? 0.5  : 0.75,
        opacity: isMobile ? 0    : 0.45,
        duration: isMobile ? 0.6 : 0.4,
        ease: "power2.out",
      });

      fanRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.25, x: 0, y: 0, rotation: 0 },
          {
            opacity: 1,
            scale: 1,
            x: fanPositions[i].x,
            y: fanPositions[i].y,
            rotation: fanPositions[i].rotation,
            duration: 0.65,
            delay: i * 0.08,
            ease: "power3.out",
          }
        );
      });
    } else if (!isOpen && !isHoveredRef.current) {
      fanRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, { opacity: 0, scale: 0.2, x: 0, y: 0, rotation: 0, duration: 0.28, ease: "power2.in" });
      });
      gsap.to(wrapperRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
        ease: "power2.out",
        onComplete: () => {
          if (!isHoveredRef.current && !isOpenRef.current) startSpin();
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, size, isMobile]);

  // ── Hover ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    isHoveredRef.current = isHovered;

    if (isHovered) {
      stopSpin();
      const snapX = snapToNearest90(rxRef.current);
      const snapY = snapToNearest90(ryRef.current);

      gsap.to(cubeRef.current, {
        rotateX: snapX,
        rotateY: snapY,
        duration: 0.55,
        ease: "power3.out",
        onUpdate() {
          const tr = cubeRef.current?.style.transform ?? "";
          const mX = tr.match(/rotateX\(([-\d.]+)deg\)/);
          const mY = tr.match(/rotateY\(([-\d.]+)deg\)/);
          if (mX) rxRef.current = parseFloat(mX[1]);
          if (mY) ryRef.current = parseFloat(mY[1]);
        },
      });
      gsap.to(wrapperRef.current, { scale: 1.22, opacity: 1, duration: 0.55, ease: "power3.out" });
    } else {
      if (isOpenRef.current) {
        gsap.to(wrapperRef.current, {
          scale:   isMobile ? 0.5  : 0.75,
          opacity: isMobile ? 0    : 0.45,
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(wrapperRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () => {
            if (!isHoveredRef.current && !isOpenRef.current) startSpin();
          },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, isMobile]);

  const half = size / 2;
  const faces = [
    { transform: `rotateY(0deg) translateZ(${half}px)` },
    { transform: `rotateY(90deg) translateZ(${half}px)` },
    { transform: `rotateY(180deg) translateZ(${half}px)` },
    { transform: `rotateY(-90deg) translateZ(${half}px)` },
    { transform: `rotateX(90deg) translateZ(${half}px)` },
    { transform: `rotateX(-90deg) translateZ(${half}px)` },
  ];

  const fanScale = size / 208;
  const fanW = Math.round(108 * fanScale);
  const fanH = Math.round(144 * fanScale);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        perspective: size * 3,
        filter: isDefocused ? "blur(3px)" : "none",
        opacity: isDefocused ? 0.32 : 1,
        transition: "opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1), filter 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
        zIndex: isHovered ? 10 : 1,
      }}
      className="flex items-center justify-center"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Contact shadow — width is fixed; scaleX handles the hover expansion to avoid layout reflow */}
      <div
        style={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          width: size * 1.1,
          height: 28,
          background: "radial-gradient(ellipse at center, rgba(26,26,26,0.38) 0%, rgba(26,26,26,0.12) 55%, transparent 100%)",
          filter: "blur(6px)",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: `translateX(-50%) scaleX(${((isHovered ? 1.4 : 1.1) * shadowScale) / 1.1})`,
          transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          opacity: isDefocused ? 0.18 : 0.7,
          zIndex: 0,
        }}
      />

      {/* Cube wrapper */}
      <div ref={wrapperRef} style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", zIndex: 2 }}>
        <div ref={cubeRef} style={{ width: size, height: size, transformStyle: "preserve-3d", position: "relative" }}>
          {faces.map((face, i) => {
            const img = getImageForFace(images, i);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: size,
                  height: size,
                  transform: face.transform,
                  overflow: "hidden",
                  border: images.length ? "none" : "1px solid #1a1a1a",
                  background: images.length ? "transparent" : i % 2 === 0 ? "rgba(26,26,26,0.03)" : "rgba(26,26,26,0.06)",
                }}
              >
                {img && (
                  <Image src={img} alt="" fill sizes="208px" unoptimized style={{ objectFit: "cover" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fan cards */}
      {[0, 1, 2].map((i) => {
        const img = images[i] ?? null;
        return (
          <div
            key={`fan-${i}`}
            ref={(el) => { fanRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: fanW,
              height: fanH,
              marginTop: -fanH / 2,
              marginLeft: -fanW / 2,
              opacity: 0,
              borderRadius: 6,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 30,
              boxShadow: "0 10px 36px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)",
            }}
          >
            {img ? (
              <Image src={img} alt="" fill sizes="160px" unoptimized style={{ objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(234,234,234,0.8)" }}>
                <span style={{ fontSize: 9, color: "rgba(26,26,26,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Soon</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── WorksSection ──────────────────────────────────────────────────────────────

export function WorksSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const rowRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cubeWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef      = useRef<SVGPathElement>(null);
  const basePathRef  = useRef<SVGPathElement>(null);
  const glowPathRef  = useRef<SVGPathElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lineProgressRef = useRef(0);
  const rafRef       = useRef<number>(0);
  const sectionVisibleRef = useRef<boolean>(true);

  const [hoveredCube, setHoveredCube] = useState<number | null>(null);
  const [pathD, setPathD]   = useState("");
  const [pathLen, setPathLen] = useState(0);
  const [svgDims, setSvgDims] = useState({ w: 0, h: 0 });

  // Responsive cube size
  const [cubeSize, setCubeSize] = useState(208);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 380)      { setCubeSize(100); setIsMobile(true); }
      else if (w < 480) { setCubeSize(115); setIsMobile(true); }
      else if (w < 768) { setCubeSize(130); setIsMobile(true); }
      else              { setCubeSize(208); setIsMobile(false); }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { sectionVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cursor follower
  const rawMouseRef    = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cursorRafRef = useRef<number>(0);

  useEffect(() => {
    let alive = true;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, rawMouseRef.current.x, 0.13);
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, rawMouseRef.current.y, 0.13);
      if (sectionVisibleRef.current) {
        setCursorPos({ x: smoothMouseRef.current.x, y: smoothMouseRef.current.y });
      }
      if (alive) cursorRafRef.current = requestAnimationFrame(tick);
    };
    cursorRafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(cursorRafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSectionMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      rawMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, []);

  const openedRef = useRef<boolean[]>([false, false, false]);
  const [openedCubes, setOpenedCubes] = useState<boolean[]>([false, false, false]);

  const computePath = useCallback(() => {
    if (!sectionRef.current) return;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const points = cubeWrapRefs.current.slice(0, 3).map((el) => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - sectionRect.left + r.width / 2,
        y: r.top  - sectionRect.top  + r.height / 2,
      };
    });

    if (points.some((p) => p.x === 0 && p.y === 0)) return;

    const w = sectionRect.width;
    const h = sectionRef.current.scrollHeight ?? sectionRect.height;
    setSvgDims({ w, h });

    const [p0, p1, p2] = points;
    const cx1 = (p0.x + p1.x) / 2;
    const cx2 = (p1.x + p2.x) / 2;
    const d = `M ${p0.x} ${p0.y} C ${cx1} ${p0.y}, ${cx1} ${p1.y}, ${p1.x} ${p1.y} S ${cx2} ${p2.y}, ${p2.x} ${p2.y}`;
    setPathD(d);

    setTimeout(() => {
      if (pathRef.current) setPathLen(pathRef.current.getTotalLength());
    }, 50);
  }, []);

  useEffect(() => {
    computePath();
    window.addEventListener("resize", computePath);
    return () => window.removeEventListener("resize", computePath);
  }, [computePath]);

  // Also recompute path when cubeSize changes (cube positions shift)
  useEffect(() => {
    setTimeout(computePath, 100);
  }, [cubeSize, computePath]);

  // ── Particle RAF loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!pathLen) return;

    const tick = () => {
      if (!sectionVisibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const canvas = canvasRef.current;
      const path   = pathRef.current;

      if (canvas && path && pathLen > 0) {
        const drawn = pathLen * lineProgressRef.current;
        const ctx   = canvas.getContext("2d");

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (drawn > 8 && lineProgressRef.current < 0.985) {
            const pt    = path.getPointAtLength(Math.max(0, drawn - 3));
            const count = Math.random() < 0.45 ? 2 : 1;
            for (let n = 0; n < count; n++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.5 + Math.random() * 1.4;
              particlesRef.current.push({
                x: pt.x + (Math.random() - 0.5) * 5,
                y: pt.y + (Math.random() - 0.5) * 5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.4,
                life: 1,
                size: 0.8 + Math.random() * 2.4,
                dark: Math.random() > 0.5,
              });
            }
          }

          const alive: Particle[] = [];
          for (const p of particlesRef.current) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += 0.025;
            p.life -= 0.022;
            if (p.life <= 0) continue;
            alive.push(p);
            ctx.globalAlpha = Math.max(0, p.life * 0.9);
            ctx.fillStyle   = p.dark ? "rgba(18,18,18,0.88)" : "rgba(255,255,255,0.92)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          particlesRef.current = alive;
          ctx.globalAlpha = 1;

          if (drawn > 4 && lineProgressRef.current < 0.99) {
            const tip = path.getPointAtLength(drawn);
            const halo = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 18);
            halo.addColorStop(0, "rgba(255,255,255,0.55)");
            halo.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2);
            ctx.fill();
            const core = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 5);
            core.addColorStop(0, "rgba(255,255,255,1)");
            core.addColorStop(0.5, "rgba(200,200,200,0.8)");
            core.addColorStop(1, "rgba(150,150,150,0)");
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pathLen]);

  // ── GSAP scroll animations ────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    if (prefersReducedMotion()) {
      const pathTargets = [glowPathRef.current, basePathRef.current, pathRef.current].filter(Boolean);
      pathTargets.forEach((el) => {
        if (el) { (el as SVGPathElement).style.strokeDashoffset = "0"; }
      });
      lineProgressRef.current = 1;
      openedRef.current = [true, true, true];
      setOpenedCubes([true, true, true]);
      textRefs.current.forEach((el) => { if (el) el.style.color = "#000000"; });
      return;
    }

    const ctx = gsap.context(() => {
      if (pathRef.current && basePathRef.current && pathLen > 0) {
        const pathTargets = [glowPathRef.current, basePathRef.current, pathRef.current].filter(Boolean);
        gsap.fromTo(
          pathTargets,
          { strokeDasharray: pathLen, strokeDashoffset: pathLen },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: cubeWrapRefs.current[0] ?? sectionRef.current,
              endTrigger: cubeWrapRefs.current[2] ?? sectionRef.current,
              start: "center 85%",
              end: "center 15%",
              scrub: true,
              onUpdate(self) {
                lineProgressRef.current = self.progress;
                const thresholds = [0.03, 0.47, 0.78];
                thresholds.forEach((threshold, i) => {
                  const shouldOpen = self.progress >= threshold;
                  if (shouldOpen !== openedRef.current[i]) {
                    openedRef.current[i] = shouldOpen;
                    setOpenedCubes([...openedRef.current]);
                  }
                });
              },
            },
          }
        );
      }

      textRefs.current.slice(0, 3).forEach((el, i) => {
        if (!el) return;
        const row = rowRefs.current[i];
        if (!row) return;
        gsap.fromTo(el,
          { color: "#FFFFFF" },
          {
            color: "#000000",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 0.6,
              onUpdate(self) {
                if (!el) return;
                const p = self.progress;
                const g = p < 0.5
                  ? Math.round((p / 0.5) * 136)
                  : Math.round(136 * (1 - (p - 0.5) / 0.5));
                el.style.color = `rgb(${g},${g},${g})`;
              },
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [pathLen, pathD]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathD, pathLen]);

  return (
    <section
      id="work"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      style={{ backgroundColor: "#eaeaea", color: "#1a1a1a", position: "relative", cursor: hoveredCube !== null ? "none" : "default" }}
      className="overflow-hidden py-[clamp(120px,12vw,140px)]"
    >
      {/* SVG connector line */}
      {pathD && (
        <svg
          ref={svgRef}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}
          viewBox={`0 0 ${svgDims.w} ${svgDims.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={svgDims.h}>
              <stop offset="0%"   stopColor="#111111" />
              <stop offset="38%"  stopColor="#ffffff" />
              <stop offset="68%"  stopColor="#111111" />
              <stop offset="100%" stopColor="#cccccc" />
            </linearGradient>
            <filter id="lineBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path ref={glowPathRef} d={pathD} fill="none" stroke="rgba(200,200,200,0.35)" strokeWidth="14" strokeLinecap="round" filter="url(#lineBlur)" style={{ strokeDasharray: pathLen || 9999, strokeDashoffset: pathLen || 9999 }} />
          <path ref={basePathRef} d={pathD} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: pathLen || 9999, strokeDashoffset: pathLen || 9999 }} />
          <path ref={pathRef}     d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: pathLen || 9999, strokeDashoffset: pathLen || 9999 }} />
        </svg>
      )}

      {/* Particle canvas */}
      {pathD && (
        <canvas
          ref={canvasRef}
          width={svgDims.w || 1}
          height={svgDims.h || 1}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
        />
      )}

      {/* Cursor label — desktop only */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 100,
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`,
          opacity: hoveredCube !== null ? 1 : 0,
          transition: "opacity 0.22s ease",
          willChange: "transform",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            color: "#eaeaea",
            fontFamily: '"Khteka", Arial, sans-serif',
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "10px 18px",
            borderRadius: "100px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            transform: hoveredCube !== null ? "scale(1)" : "scale(0.72)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span style={{ display: "inline-block", fontSize: "9px", opacity: 0.55 }}>↗</span>
          Click to view
        </div>
      </div>

      <div style={{ width: "min(1248px, 86.667vw)", margin: "0 auto", position: "relative" }}>
        <div className="flex flex-col" style={{ position: "relative" }}>
          {CUBES.map((cube, i) => {
            const isHovered   = hoveredCube === i;
            const isDefocused = hoveredCube !== null && hoveredCube !== i;
            const shadowScale = isHovered ? 1.22 : 1;
            const textOnRight = cube.position === "left";
            const isOpen      = openedCubes[i] ?? false;

            return (
              <div
                key={i}
                ref={(el) => { rowRefs.current[i] = el; }}
                className={`flex items-center ${POSITIONS[i]}`}
                style={{ marginTop: i === 0 ? 0 : "clamp(240px, 20.833vw, 300px)", position: "relative" }}
              >
                {/* Text label */}
                {i < 3 && (
                  <div
                    ref={(el) => { textRefs.current[i] = el; }}
                    style={{
                      position: "absolute",
                      left:  textOnRight ? "auto" : 0,
                      right: textOnRight ? 0 : "auto",
                      top: "50%",
                      transform: "translateY(-50%)",
                      textAlign: textOnRight ? "right" : "left",
                      pointerEvents: "none",
                      zIndex: 2,
                      color: "#FFFFFF",
                      maxWidth: "38%",
                    }}
                  >
                    <p style={{
                      fontSize: "clamp(1.8rem, 5.2vw, 5.5rem)",
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                      margin: 0,
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}>
                      {cube.title}
                    </p>
                    <p style={{
                      fontSize: "clamp(0.8rem, 1.7vw, 1.9rem)",
                      fontWeight: 400,
                      lineHeight: 1.4,
                      marginTop: "0.4em",
                      opacity: 0.85,
                    }}>
                      {cube.tagline}
                    </p>
                  </div>
                )}

                {/* Cube — wrapped in link */}
                <a
                  href={cube.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${cube.title} project — opens in new tab`}
                  style={{ display: "block", textDecoration: "none" }}
                  ref={(el) => { cubeWrapRefs.current[i] = el as HTMLDivElement | null; }}
                >
                  <ImageCube
                    images={cube.images}
                    size={cubeSize}
                    isHovered={isHovered}
                    isDefocused={isDefocused}
                    isOpen={isOpen}
                    shadowScale={shadowScale}
                    isMobile={isMobile}
                    sectionVisibleRef={sectionVisibleRef}
                    onPointerEnter={() => setHoveredCube(i)}
                    onPointerLeave={() => setHoveredCube(null)}
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
