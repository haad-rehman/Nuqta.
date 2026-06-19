"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef    = useRef<HTMLElement>(null);
  const imgRef        = useRef<HTMLImageElement>(null);  // desktop parallax only
  const peopleRowRef  = useRef<HTMLSpanElement>(null);
  const linesRef      = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const lines = linesRef.current?.querySelectorAll(".cta-line");
      if (lines?.length) gsap.set(lines, { yPercent: 0 });
      if (btnRef.current) gsap.set(btnRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Background image parallax
      if (imgRef.current) {
        gsap.fromTo(imgRef.current, { y: 0 }, {
          y: "-18%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // "→ People" row slides right on scroll
      if (peopleRowRef.current) {
        gsap.fromTo(peopleRowRef.current, { x: "0%" }, {
          x: "20%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Text line reveal
      const lines = linesRef.current?.querySelectorAll(".cta-line");
      if (lines?.length) {
        gsap.fromTo(lines, { yPercent: 110 }, {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: linesRef.current, start: "top 85%" },
        });
      }

      // Button fade in
      if (btnRef.current) {
        gsap.fromTo(btnRef.current, { opacity: 0, y: 16 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: btnRef.current, start: "top 95%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const lineStyle: React.CSSProperties = {
    fontFamily: "Animo, Arial, sans-serif",
    color: "#e8e8e3",
    fontWeight: 500,
    textTransform: "uppercase",
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
    fontSize: "clamp(2.5rem, 9.4vw, 9.1rem)",
    display: "block",
    whiteSpace: "nowrap",
  };

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", background: "#080807" }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/assets/New-people-bg.png"
          alt=""
          loading="lazy"
          className="object-cover object-[28%_center] md:object-center"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "118%",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(48px,6.5vh,84px) clamp(20px,1.8vw,28px) clamp(36px,5vh,56px)",
        }}
      >
        <div />

        {/* Headlines */}
        <div
          ref={linesRef}
          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div style={{ overflow: "hidden" }}>
            <div className="cta-line" style={lineStyle}>Let&apos;s build</div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="cta-line" style={lineStyle}>An experience</div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="cta-line" style={lineStyle}>That moves</div>
          </div>

          {/* → PEOPLE — slides right on scroll */}
          <span ref={peopleRowRef} style={{ display: "inline-flex", alignItems: "baseline", gap: "0.2em", willChange: "transform" }}>
            <span style={{ overflow: "hidden", display: "inline-block" }}>
              <span className="cta-line" style={{ ...lineStyle, display: "inline-block" }}>→</span>
            </span>
            <span style={{ overflow: "hidden", display: "inline-block" }}>
              <span className="cta-line" style={{ ...lineStyle, display: "inline-block" }}>People</span>
            </span>
          </span>
        </div>

        {/* Button */}
        <div style={{ marginTop: "clamp(28px,4vh,52px)", textAlign: "center" }}>
          <a
            ref={btnRef}
            href="https://cal.com/hadu-wfspde/intro-call-with-haad"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "stretch",
              background: "#e8e8e3",
              color: "#080807",
              borderRadius: "2px",
              textDecoration: "none",
              opacity: 0,
              overflow: "hidden",
            }}
          >
            <span style={{
              display: "flex", alignItems: "center",
              fontFamily: "Khteka, Arial, sans-serif",
              fontSize: "clamp(13px, 1vw, 15px)", fontWeight: 500, letterSpacing: "0.01em",
              padding: "0 16px 0 20px", whiteSpace: "nowrap",
              height: "clamp(44px, 3.5vw, 52px)",
            }}>
              Tell us your story
            </span>
            <span style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(44px, 3.5vw, 52px)", height: "clamp(44px, 3.5vw, 52px)",
              background: "#080807", flexShrink: 0,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="#e8e8e3" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
