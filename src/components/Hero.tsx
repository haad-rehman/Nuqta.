"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { HeroBackground } from "@/components/HeroBackground";

gsap.registerPlugin(ScrollTrigger);

function GlobeSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      viewBox="0 0 57 25"
      fill="none"
      className="text-white opacity-80 mb-6 shrink-0"
    >
      <path d="M28.5 0.356445C36.3328 0.356445 43.407 1.74332 48.5098 3.97168C51.0617 5.08613 53.1051 6.40434 54.5049 7.84961C55.9028 9.29309 56.6436 10.846 56.6436 12.4463C56.6435 14.0465 55.9028 15.5995 54.5049 17.043C53.1051 18.4882 51.0617 19.8065 48.5098 20.9209C43.407 23.1492 36.3327 24.5361 28.5 24.5361C20.6673 24.5361 13.593 23.1492 8.49023 20.9209C5.93831 19.8065 3.8949 18.4882 2.49512 17.043C1.09715 15.5995 0.356472 14.0465 0.356445 12.4463C0.356445 10.846 1.09718 9.29309 2.49512 7.84961C3.8949 6.40434 5.93831 5.08613 8.49023 3.97168C13.593 1.74332 20.6672 0.356445 28.5 0.356445Z" stroke="currentColor" strokeWidth="0.7125" />
      <path d="M56.6436 12.5C56.6436 12.6467 56.5489 12.8582 56.2031 13.125C55.8642 13.3865 55.3422 13.6542 54.6357 13.918C53.2265 14.444 51.1665 14.9243 48.5967 15.3301C43.4627 16.1407 36.3572 16.6436 28.5 16.6436C20.6428 16.6436 13.5373 16.1407 8.40332 15.33C5.83351 14.9243 3.77352 14.444 2.36426 13.918C1.65778 13.6542 1.13579 13.3865 0.796875 13.125C0.451055 12.8582 0.356445 12.6467 0.356445 12.5C0.356446 12.3533 0.451056 12.1418 0.796875 11.875C1.13579 11.6135 1.65778 11.3458 2.36426 11.082C3.77352 10.5559 5.83351 10.0757 8.40332 9.66992C13.5373 8.85931 20.6428 8.35644 28.5 8.35644C36.3572 8.35644 43.4627 8.85931 48.5967 9.66992C51.1665 10.0757 53.2265 10.556 54.6357 11.082C55.3422 11.3458 55.8642 11.6135 56.2031 11.875C56.5489 12.1418 56.6436 12.3533 56.6436 12.5Z" stroke="currentColor" strokeWidth="0.7125" />
      <path d="M28.5 0.356445C33.816 0.356645 38.2451 5.69623 38.2451 12.4463C38.2451 19.1963 33.816 24.5359 28.5 24.5361C23.1839 24.5361 18.7549 19.1964 18.7549 12.4463C18.7549 5.6961 23.1839 0.356445 28.5 0.356445Z" stroke="currentColor" strokeWidth="0.7125" />
      <path d="M28.501 0.356445C33.1152 0.356517 37.2782 1.72972 40.2793 3.93262C43.2806 6.13571 45.0996 9.14997 45.0996 12.4463C45.0996 15.7426 43.2806 18.7569 40.2793 20.96C37.2783 23.1628 33.1151 24.5361 28.501 24.5361C23.8867 24.5361 19.7228 23.1629 16.7217 20.96C13.7204 18.7569 11.9014 15.7425 11.9014 12.4463C11.9014 9.15004 13.7205 6.1357 16.7217 3.93262C19.7228 1.72966 23.8867 0.356445 28.501 0.356445Z" stroke="currentColor" strokeWidth="0.7125" />
      <path d="M28.501 0.356445C35.0302 0.356505 40.9237 1.74032 45.1719 3.96094C49.4372 6.19053 51.9541 9.2087 51.9541 12.4463C51.9541 15.6838 49.4372 18.7021 45.1719 20.9316C40.9237 23.1522 35.0302 24.5361 28.501 24.5361C21.9716 24.5361 16.0774 23.1523 11.8291 20.9316C7.56383 18.7021 5.04692 15.6838 5.04688 12.4463C5.04688 9.20872 7.56383 6.19053 11.8291 3.96094C16.0774 1.74026 21.9716 0.356445 28.501 0.356445Z" stroke="currentColor" strokeWidth="0.7125" />
    </svg>
  );
}


function HeroLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden leading-[1.3]">
      <span className="hero-line block">{children}</span>
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On reduced motion: reveal everything instantly, skip parallax
    if (prefersReducedMotion()) {
      gsap.set(globeRef.current, { opacity: 0.8, scale: 1 });
      const lines = contentRef.current?.querySelectorAll(".hero-line");
      if (lines?.length) gsap.set(lines, { yPercent: 0 });
      gsap.set(wordmarkRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        globeRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 0.8, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.05 }
      );

      const lines = contentRef.current?.querySelectorAll(".hero-line");
      if (lines?.length) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.055, delay: 0.15 }
        );
      }

      gsap.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.3 }
      );

      gsap.to(wordmarkRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* Background canvas animation (ported from the old hero-bg.html iframe) */}
      <HeroBackground />

      {/* Top vignette — keeps nav area very dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 28%, transparent 52%)",
          pointerEvents: "none",
        }}
      />

      {/* Globe + text block — positioned ~35% from top, well above MONOLOG letters */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          top: "32%",
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <div ref={globeRef} style={{ opacity: 0 }}>
          <GlobeSVG />
        </div>

        <p
          style={{
            color: "#ffffff",
            fontSize: "clamp(1rem,1.45vw,1.15rem)",
            fontWeight: 600,
            lineHeight: 1.6,
            maxWidth: "320px",
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          <HeroLine>We design change-making website</HeroLine>
          <HeroLine>and brand experiences that finally</HeroLine>
          <HeroLine>match the business behind them.</HeroLine>
        </p>

        <p
          style={{
            color: "#ffffff",
            fontSize: "clamp(0.8rem,1.1vw,0.9rem)",
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: "300px",
          }}
        >
          <HeroLine>For established founder-led&nbsp;B2B brands</HeroLine>
          <HeroLine>whose presence hasn&apos;t caught up</HeroLine>
          <HeroLine>to what they&apos;ve built.</HeroLine>
        </p>
      </div>

      {/* Nuqta. — pinned to bottom, overflows below the fold intentionally */}
      <div
        ref={wordmarkRef}
        style={{
          position: "absolute",
          bottom: "8vh",
          paddingBottom: "0",
          left: 0,
          right: 0,
          zIndex: 10,
          width: "100%",
          opacity: 0,
          lineHeight: 1,
          textAlign: "center",
          padding: "0 2vw",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Animo, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem, 13vw, 13rem)",
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          Nuqta.
        </span>
      </div>
    </section>
  );
}
