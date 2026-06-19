"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Read cursor-text from hovered element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const textEl = el?.closest("[data-cursor-text]");
      const text = textEl?.getAttribute("data-cursor-text") ?? "";
      setCursorText(text);
    };
    const onLeave = () => setIsVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // Lagged ring follower
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* Dot — follows cursor exactly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
          marginLeft: "-4px",
          marginTop: "-4px",
          transition: "opacity 0.2s",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#f5f0eb]" />
      </div>

      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
          marginLeft: "-20px",
          marginTop: "-20px",
          transition: "opacity 0.3s",
        }}
      >
        <div
          className="relative w-10 h-10 rounded-full border border-[#f5f0eb]/40 flex items-center justify-center"
          style={{
            transform: cursorText ? "scale(3)" : "scale(1)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            background: cursorText ? "rgba(200,184,154,0.15)" : "transparent",
          }}
        >
          {cursorText && (
            <span
              className="text-[#f5f0eb] whitespace-nowrap"
              style={{
                fontSize: "5px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {cursorText}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
