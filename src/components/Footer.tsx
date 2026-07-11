"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// The interactive NUQTA particle canvas is far below the fold and pulls in its
// own getImageData/particle code. Code-split it client-only; the loading
// placeholder reserves the exact box (48px padding + 220px canvas) so deferring
// it causes no layout shift.
const NuqtaCanvas = dynamic(
  () => import("@/components/NuqtaCanvas").then((m) => m.NuqtaCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        style={{ width: "100%", height: "268px", background: "#060606" }}
      />
    ),
  }
);

const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

const NAV_LINKS = [
  { label: "About", href: "/about", soon: false },
  { label: "Work", href: "#work", soon: false },
  { label: "Process", href: "#process", soon: false },
  { label: "Services", href: "#services", soon: false },
  { label: "Contact", href: CAL_LINK, soon: false },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  // Clock written straight to the DOM via refs — no per-second re-render.
  const timeRef = useRef<HTMLParagraphElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);

  // Live Doha time (UTC+3, no DST)
  useEffect(() => {
    const timeFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Qatar",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const dateFmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Qatar",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const update = () => {
      const now = new Date();
      if (timeRef.current) timeRef.current.textContent = `Doha, Qatar ${timeFmt.format(now)}`;
      if (dateRef.current) dateRef.current.textContent = `${dateFmt.format(now)} (GMT +03)`;
      if (yearRef.current) yearRef.current.textContent = `©${now.getFullYear()} Nuqta Studio`;
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

            {/* Studio details — Instagram + based in */}
            <div className="md:pt-14 min-w-[220px]">
              <p className="text-[#888880] text-[10px] tracking-[0.22em] uppercase mb-4">(Studio Details)</p>
              <a
                href="https://www.instagram.com/studionuqtaa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram — @studionuqtaa"
                className="flex w-fit items-center gap-2 text-[#f5f0eb] hover:text-[#c8b89a] transition-colors duration-200 text-[13px]"
                style={{ marginBottom: "12px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#ig-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <defs>
                    {/* Official Instagram brand gradient (warm bottom-left → pink → purple top-right) */}
                    <linearGradient id="ig-gradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#feda75" />
                      <stop offset="25%" stopColor="#fa7e1e" />
                      <stop offset="50%" stopColor="#d62976" />
                      <stop offset="75%" stopColor="#962fbf" />
                      <stop offset="100%" stopColor="#4f5bd5" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
              <p className="text-[#f5f0eb] text-[13px]">Based in Doha, Qatar</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 md:items-center gap-3">
            {/* Left: Doha time + date — populated via refs in useEffect */}
            <div className="text-[#888880] text-[11px]" style={{ fontFamily: '"Suisse Mono", "Courier New", monospace' }}>
              <p ref={timeRef}>Doha, Qatar</p>
              <p ref={dateRef}>(GMT +03)</p>
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
              <p className="text-[#888880] text-[11px]"><span ref={yearRef}>Nuqta Studio</span></p>
            </div>
          </div>
        </div>

        {/* ── Bottom interactive NUQTA canvas ── */}
        <NuqtaCanvas />

      </div>
    </footer>
  );
}
