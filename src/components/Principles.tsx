"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    number: "01",
    title: "Outcomes first, taste second",
    body: "Every creative decision is interrogated against whether it serves growth. Beautiful work that doesn't convert is just expensive decoration.",
  },
  {
    number: "02",
    title: "All in or nothing",
    body: "We take fewer projects so we can give each one full investment. You get our best thinking, not a version of it.",
  },
  {
    number: "03",
    title: "Human-first, always",
    body: "Behind every brand is a real person with real stakes. We never lose sight of that.",
  },
  {
    number: "04",
    title: "Intention over speed",
    body: "Rushed work compounds into regret. We move deliberately because the cost of getting it wrong is higher than the cost of taking the time to get it right.",
  },
];

export function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const eyebrow = sectionRef.current?.querySelector(".eyebrow");
      if (eyebrow) gsap.fromTo(
        eyebrow,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      const cards = cardsRef.current?.querySelectorAll(".principle-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 78%",
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-10 max-w-[1440px] mx-auto border-t border-[#1a1a1a]"
    >
      <div className="eyebrow mb-14">
        <span className="text-[#888880] text-[10px] tracking-[0.22em] uppercase">
          Our principles
        </span>
      </div>
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
        {PRINCIPLES.map((p) => (
          <div
            key={p.number}
            className="principle-card bg-[#0a0a0a] hover:bg-[#0d0d0d] p-8 md:p-10 group transition-colors duration-300"
          >
            <span className="text-[#2a2a2a] text-[10px] tracking-widest block mb-6">{p.number}</span>
            <h3 className="text-[clamp(1rem,1.4vw,1.25rem)] font-light text-[#f5f0eb] mb-4 leading-snug group-hover:text-[#c8b89a] transition-colors duration-300">
              &ldquo;{p.title}&rdquo;
            </h3>
            <p className="text-[#888880] text-[13px] leading-[1.7]">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
