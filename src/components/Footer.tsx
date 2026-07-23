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
                rel="me noopener noreferrer"
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
              <a
                href="https://www.facebook.com/nuqtaa.studio/"
                target="_blank"
                rel="me noopener noreferrer"
                aria-label="Facebook — Nuqta Studio"
                className="flex w-fit items-center gap-2 text-[#f5f0eb] hover:text-[#c8b89a] transition-colors duration-200 text-[13px]"
                style={{ marginBottom: "12px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://www.tiktok.com/@nuqtaa.studio"
                target="_blank"
                rel="me noopener noreferrer"
                aria-label="TikTok — @nuqtaa.studio"
                className="flex w-fit items-center gap-2 text-[#f5f0eb] hover:text-[#c8b89a] transition-colors duration-200 text-[13px]"
                style={{ marginBottom: "12px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span>TikTok</span>
              </a>
              <p className="text-[#f5f0eb] text-[13px]">Based in Doha, Qatar</p>

              {/* Awards */}
              <p className="text-[#888880] text-[10px] tracking-[0.22em] uppercase mt-10 mb-4">(Recognition)</p>
              <a
                href="https://www.astonishingawards.com/nominee/nuqta"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Nuqta on Astonishing Awards"
                className="group block w-fit"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/awards/astonishing-awards-badge.svg"
                  alt="Astonishing Awards nominee badge"
                  width={100}
                  height={55}
                  loading="lazy"
                  className="opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                />
              </a>
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
