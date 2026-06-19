"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const PARA1 = [
  "Great", "founders", "changing", "the", "world", "deserve", "a",
  "presence", "as", "powerful", "as", "what", "they're", "building.",
  "Most", "founders", "we", "work", "with", "are", "building",
  "something", "significant", "but", "their", "presence", "doesn't",
  "show", "it", "yet.",
];
const PARA2 = [
  "That", "gap", "costs", "more", "than", "revenue.", "It", "costs",
  "the", "certainty", "that", "your", "brand", "is", "finally",
  "being", "understood.",
];

const STATS = [
  { num: "15+", desc: "Founder-led brands from disruptive creative agencies to consumer brands" },
];

function MonologBgWordmark() {
  return (
    <div
      aria-hidden="true"
      style={{
        fontFamily: '"Animo", Arial, sans-serif',
        fontWeight: 900,
        fontSize: "clamp(8rem, 22vw, 22rem)",
        color: "#ffffff",
        letterSpacing: "-0.03em",
        lineHeight: 0.85,
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      Nuqta.
    </div>
  );
}

const TEXT_STYLE = {
  fontSize: "clamp(32px, 3.1vw, 45px)" as const,
  fontWeight: 700,
  lineHeight: 1.10,
  letterSpacing: "-0.025em",
  color: "rgb(232, 232, 227)",
};

export function ProblemsSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const wordmarkRef    = useRef<HTMLDivElement>(null);
  const wordRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const mobileWordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Mobile word-by-word animation
  useEffect(() => {
    const mobileSec = mobileSectionRef.current;
    if (!mobileSec || window.innerWidth >= 768) return;
    if (prefersReducedMotion()) {
      mobileWordRefs.current.forEach((el) => { if (el) el.style.opacity = "1"; });
      return;
    }
    mobileWordRefs.current.forEach((el) => { if (el) el.style.opacity = "0.15"; });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: mobileSec,
        start: "top 88%",
        end: "bottom 25%",
        scrub: true,
        onUpdate(self) {
          const p = self.progress;
          const N = mobileWordRefs.current.length;
          mobileWordRefs.current.forEach((el, i) => {
            if (!el) return;
            const revealStart = (i / N) * 0.78;
            const revealEnd   = revealStart + 0.07;
            const wordP = gsap.utils.clamp(0, 1, (p - revealStart) / (revealEnd - revealStart));
            el.style.opacity = String(0.15 + wordP * 0.85);
          });
        },
      });
    }, mobileSectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Skip scroll-driven animation on mobile or reduced motion
    if (window.innerWidth < 768 || prefersReducedMotion()) {
      wordRefs.current.forEach((el) => { if (el) el.style.opacity = "1"; });
      if (wordmarkRef.current) wordmarkRef.current.style.opacity = "0.55";
      return;
    }

    wordRefs.current.forEach((el) => { if (el) el.style.opacity = "0.15"; });
    if (wordmarkRef.current) wordmarkRef.current.style.opacity = "0";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate(self) {
          const p = self.progress;

          // MONOLOG reveal 0-20%
          if (wordmarkRef.current) {
            wordmarkRef.current.style.opacity = String(gsap.utils.clamp(0, 0.55, p / 0.2 * 0.55));
          }

          // Word-by-word reveal 10-80%
          const N = wordRefs.current.length;
          wordRefs.current.forEach((el, i) => {
            if (!el) return;
            const revealStart = 0.10 + (i / N) * 0.70;
            const revealEnd = revealStart + 0.06;
            const wordP = gsap.utils.clamp(0, 1, (p - revealStart) / (revealEnd - revealStart));
            el.style.opacity = String(0.15 + wordP * 0.85);
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── Desktop: scroll-driven sticky layout ── */}
      <section
        ref={sectionRef}
        className="hidden md:block"
        style={{ height: "300vh", position: "relative" }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#080807" }}>

          {/* MONOLOG background */}
          <div ref={wordmarkRef} style={{ position: "absolute", top: 0, left: "26px", right: "26px", zIndex: 1, pointerEvents: "none", opacity: 0 }}>
            <MonologBgWordmark />
          </div>

          {/* LEFT COLUMN */}
          <div style={{
            position: "absolute", left: "26px", top: 0, bottom: "80px", width: "360px",
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            gap: "24px", paddingTop: "80px", zIndex: 10,
          }}>
            {/* Divider */}
            <div>
              <div style={{ height: "1px", background: "rgb(232, 232, 227)" }} />
            </div>

            {/* Stat */}
            <div>
              <div style={{ fontSize: "clamp(44px, 5.5vw, 72px)", fontWeight: 700, color: "rgb(232,232,227)", lineHeight: 1, marginBottom: "12px", letterSpacing: "-0.02em" }}>
                {STATS[0].num}
              </div>
              <p style={{ fontSize: "14px", color: "rgb(160,156,150)", lineHeight: 1.55, maxWidth: "280px", fontWeight: 400 }}>
                {STATS[0].desc}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN — paragraphs placed directly, no intermediate wrapper */}
          <div style={{
            position: "absolute", right: "26px", maxWidth: "795px", width: "calc(100% - 400px)",
            top: "50%", transform: "translateY(-50%)", zIndex: 10,
          }}>
            <p style={{ ...TEXT_STYLE, margin: 0, marginBottom: "0.85em" }}>
              {PARA1.map((word, i) => (
                <span key={i} ref={(el) => { wordRefs.current[i] = el; }} style={{ opacity: 0.15 }}>
                  {word}{i < PARA1.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <p style={{ ...TEXT_STYLE, margin: 0, marginBottom: "48px" }}>
              {PARA2.map((word, i) => {
                const gi = PARA1.length + i;
                return (
                  <span key={i} ref={(el) => { wordRefs.current[gi] = el; }} style={{ opacity: 0.15 }}>
                    {word}{i < PARA2.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </p>

            {/* Founder attribution */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/founder-haad.jpeg" alt="Haad Rehman"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(232,232,227)", lineHeight: 1.3 }}>
                  Haad Rehman
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "rgb(130,126,120)", lineHeight: 1.3, marginTop: "2px" }}>
                  Founder, Nuqta.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Mobile: stacked layout with scroll word reveal ── */}
      <section
        ref={mobileSectionRef}
        className="block md:hidden"
        style={{ background: "#080807", padding: "80px 24px 64px" }}
        aria-label="Our mission"
      >
        {/* Paragraphs — word-by-word opacity reveal */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{
            fontSize: "clamp(1.5rem, 6.5vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.025em",
            margin: 0,
            marginBottom: "1em",
          }}>
            {[...PARA1, ...PARA2].map((word, i) => {
              const isP2Start = i === PARA1.length;
              return (
                <span key={i}>
                  {isP2Start && <br />}
                  <span
                    ref={(el) => { mobileWordRefs.current[i] = el; }}
                    style={{ opacity: 0.15 }}
                  >
                    {word}{i < PARA1.length + PARA2.length - 1 ? " " : ""}
                  </span>
                </span>
              );
            })}
          </p>
        </div>

        {/* Stat */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "40px" }}>
          {STATS.map((s) => (
            <div key={s.num}>
              <div style={{ fontSize: "clamp(2.5rem, 12vw, 4rem)", fontWeight: 700, color: "rgb(232,232,227)", lineHeight: 1, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                {s.num}
              </div>
              <p style={{ fontSize: "13px", color: "rgb(160,156,150)", lineHeight: 1.55, fontWeight: 400, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Founder attribution */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", borderTop: "1px solid #1a1a1a", paddingTop: "28px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/founder-haad.jpeg" alt="Haad Rehman"
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "rgb(232,232,227)", lineHeight: 1.3 }}>
              Haad Rehman
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "rgb(130,126,120)", lineHeight: 1.3, marginTop: "2px" }}>
              Founder, Nuqta.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
