"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { useAutoplayVideos } from "@/hooks/useAutoplayVideos";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "We uncover your story",
    body: "We dig deep into your brand, surface what makes you irreplaceable, and shape it into sharp positioning and a website strategy that connects in seconds.",
    video: "/step1",
    poster: "/assets/posters/step1.webp",
  },
  {
    number: "02",
    title: "We shape your digital presence",
    body: "With your narrative locked, we design and direct a brand and website that feels premium, signals credibility, and gives your audience one clear reason to lean in and act.",
    video: "/assets/Design_FINAL_compressed",
    poster: "/assets/posters/Design_FINAL_compressed.webp",
  },
  {
    number: "03",
    title: "We send it into the world",
    body: "Your brand and website goes live as a long-term asset that turns attention into opportunity, attracts the clients you're built for, and grows with you.",
    video: "/step3",
    poster: "/assets/posters/step3.webp",
  },
];

function StepIndex({ number }: { number: string }) {
  return (
    <div className="flex items-center shrink-0">
      <div className="flex items-center border border-[#f5f0eb]/25 px-1.5 py-0.5">
        <span style={{ fontFamily: '"Suisse Mono", "Courier New", monospace', fontSize: "10px", letterSpacing: "0.1em", color: "#f5f0eb" }}>{number}</span>
      </div>
    </div>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useAutoplayVideos(sectionRef);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
      sectionRef.current?.querySelectorAll(".process-step").forEach((row) => {
        gsap.set(row, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
            },
          }
        );
      }

      const rows = sectionRef.current?.querySelectorAll(".process-step");
      rows?.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="bg-[#0a0a0a] border-t border-[#1a1a1a]"
    >
      {/* "PROJECT JOURNEY" giant heading */}
      <div ref={headingRef} className="overflow-hidden border-b border-[#1a1a1a]">
        <h2
          className="text-[#f5f0eb] uppercase w-full"
          style={{
            fontFamily: "Animo, Arial, sans-serif",
            fontSize: "clamp(4rem, 10.5vw, 12rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            paddingLeft: "0.05em",
          }}
        >
          PROJECT JOURNEY
        </h2>
      </div>

      {/* Steps */}
      <div className="divide-y divide-[#1a1a1a]">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="process-step grid grid-cols-1 md:grid-cols-2 min-h-[520px]"
          >
            {/* Left: step info */}
            <div className="flex flex-col justify-between border-r border-[#1a1a1a]" style={{ padding: "clamp(32px, 4vw, 48px)" }}>
              <div>
                <StepIndex number={step.number} />
                <h3
                  className="text-[#f5f0eb] leading-tight mt-8 mb-6"
                  style={{ fontFamily: "Khteka, sans-serif", fontWeight: 500, fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#888880] text-[14px] leading-[1.7] max-w-[420px]">
                  {step.body}
                </p>
              </div>
            </div>

            {/* Right: video — lazy-loaded via useAutoplayVideos. Sources carry
                their URL in data-src (not src) + preload="none" so nothing is
                fetched until the section nears the viewport; the poster shows
                meanwhile (and is the only thing loaded on touch/save-data). */}
            <div className="relative overflow-hidden bg-[#060606]" style={{ minHeight: "clamp(180px, 25vw, 320px)" }}>
              <video
                poster={step.poster}
                preload="none"
                muted
                loop
                playsInline
                disablePictureInPicture
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source data-src={`${step.video}.av1.mp4`} type='video/mp4; codecs="av01.0.05M.08"' />
                <source data-src={`${step.video}.webm`} type="video/webm" />
                <source data-src={`${step.video}.mp4`} type="video/mp4" />
              </video>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
