"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  {
    src: "/assets/69490bd9af84227880218311_InUse_UHT_KD_180.avif",
    alt: "Moc Chau product",
  },
  {
    src: "/assets/6a0fca70a987b29b18cb687d_OH_SIDNEY©ANDYMACPHERSON-11.avif",
    alt: "OH Architecture",
  },
];

export function GapStatement() {
  // ── Desktop refs ──────────────────────────────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Mobile refs ───────────────────────────────────────────────────────────
  const mobileSectionRef = useRef<HTMLElement>(null);
  const mobilePanelRef   = useRef<HTMLDivElement>(null);
  const mLeftRef         = useRef<HTMLDivElement>(null);
  const mRightRef        = useRef<HTMLDivElement>(null);
  const mImageRef        = useRef<HTMLDivElement>(null);
  const mBottomRef       = useRef<HTMLDivElement>(null);

  // ── Desktop animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth < 768) return;

    if (prefersReducedMotion()) {
      gsap.set(panelRef.current,   { y: 0 });
      gsap.set(leftRef.current,    { x: 0 });
      gsap.set(rightRef.current,   { x: 0 });
      gsap.set(imageRef.current,   { width: "244px" });
      gsap.set(overlayRef.current, { opacity: 1 });
      gsap.set(bottomRef.current,  { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current, { y: "100vh" }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom+=500", end: "top top", scrub: true },
      });
      gsap.fromTo(leftRef.current,  { x: "-38vw" }, {
        x: "0vw", ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "center center", scrub: 0.3 },
      });
      gsap.fromTo(rightRef.current, { x: "38vw" }, {
        x: "0vw", ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "center center", scrub: 0.3 },
      });
      gsap.fromTo(imageRef.current, { width: "80px" }, {
        width: "244px", ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "center center", scrub: 0.3 },
      });
      gsap.fromTo(overlayRef.current, { opacity: 0 }, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top top", scrub: true },
      });
      gsap.fromTo(bottomRef.current, { y: 48, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: bottomRef.current, start: "top 85%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Mobile animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    if (prefersReducedMotion()) {
      gsap.set(mLeftRef.current,  { x: 0 });
      gsap.set(mRightRef.current, { x: 0 });
      gsap.set(mImageRef.current, { width: "clamp(120px,40vw,200px)" });
      gsap.set(mBottomRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const sec = mobileSectionRef.current;
      if (!sec) return;

      // "We Close" slides in from the RIGHT
      gsap.fromTo(mLeftRef.current, { x: "100vw" }, {
        x: "0vw", ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: "35% top", scrub: 0.6 },
      });
      // "That Gap" slides in from the LEFT
      gsap.fromTo(mRightRef.current, { x: "-100vw" }, {
        x: "0vw", ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: "35% top", scrub: 0.6 },
      });
      // Center image expands
      gsap.fromTo(mImageRef.current, { width: "48px" }, {
        width: "clamp(120px, 42vw, 200px)", ease: "none",
        scrollTrigger: { trigger: sec, start: "top top", end: "45% top", scrub: 0.6 },
      });
      // Bottom quote fades in
      gsap.fromTo(mBottomRef.current, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: sec, start: "55% top", end: "65% top", scrub: false },
      });
    }, mobileSectionRef);

    return () => ctx.revert();
  }, []);

  const Testimonial = () => (
    <div className="flex flex-col items-center text-center">
      <blockquote
        className="text-[#f5f0eb] font-light leading-[1.9] max-w-md mb-10"
        style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)", fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        &ldquo;Since the new site went live, we get more calls than before. Most people who book in say they found us through it.&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shrink-0">
          <img src="/assets/liwa-review.jpg" alt="Muhammad Fazal"
            className="w-full h-full object-cover" loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        </div>
        <div className="text-left">
          <p className="text-[#f5f0eb] text-[13px] font-medium">Muhammad Fazal</p>
          <p className="text-[#888880] text-[11px] mt-0.5">Liwa car and tyre service</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: scroll-driven sticky layout ── */}
      <section
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: "200vh", zIndex: 20, backgroundColor: "#0a0a0a" }}
      >
        <div ref={panelRef} className="sticky top-0 h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
          <div ref={overlayRef} className="absolute inset-0 bg-[#0a0a0a] z-0 pointer-events-none" style={{ opacity: 0 }} />

          <p className="relative z-10 text-[#888880] text-[10px] tracking-[0.22em] uppercase pt-24 md:pt-28 pb-0 text-center">
            The gap
          </p>

          <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
            <div ref={leftRef} className="absolute right-1/2 flex items-center justify-end z-20" style={{ paddingRight: "clamp(8px, 1.5vw, 20px)", willChange: "transform" }}>
              <h2 className="text-[#f5f0eb] font-bold uppercase whitespace-nowrap leading-none tracking-tight" style={{ fontSize: "clamp(3.5rem, 8.5vw, 8rem)" }}>
                We Close
              </h2>
            </div>

            <div ref={imageRef} className="relative z-10 shrink-0 overflow-hidden" style={{ width: "80px", aspectRatio: "3/4" }}>
              {IMAGES.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: i === 0 ? 1 : 0 }} loading="lazy" />
              ))}
            </div>

            <div ref={rightRef} className="absolute left-1/2 flex items-center justify-start z-20" style={{ paddingLeft: "clamp(8px, 1.5vw, 20px)", willChange: "transform" }}>
              <h2 className="text-[#f5f0eb] font-bold uppercase whitespace-nowrap leading-none tracking-tight" style={{ fontSize: "clamp(3.5rem, 8.5vw, 8rem)" }}>
                That Gap
              </h2>
            </div>
          </div>

          <div ref={bottomRef} className="relative z-10 pb-20 md:pb-28 px-6 flex flex-col items-center text-center" style={{ opacity: 0 }}>
            <Testimonial />
          </div>
        </div>
      </section>

      {/* ── Mobile: scroll-driven sticky with slide-in animation ── */}
      <section
        ref={mobileSectionRef}
        className="block md:hidden relative"
        style={{ height: "185vh", zIndex: 20, backgroundColor: "#0a0a0a" }}
      >
        <div
          ref={mobilePanelRef}
          className="sticky top-0 h-screen flex flex-col overflow-hidden bg-[#0a0a0a]"
        >
          {/* Eyebrow */}
          <p className="text-[#888880] text-[10px] tracking-[0.22em] uppercase pt-24 pb-0 text-center">
            The gap
          </p>

          {/* Animation stage */}
          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden gap-5 px-6">

            {/* "We Close" — slides in from the RIGHT */}
            <div
              ref={mLeftRef}
              className="w-full text-right"
              style={{ willChange: "transform", transform: "translateX(100vw)" }}
            >
              <h2
                className="text-[#f5f0eb] font-bold uppercase leading-none tracking-tight whitespace-nowrap"
                style={{ fontSize: "clamp(2.8rem, 12vw, 5rem)" }}
              >
                We Close
              </h2>
            </div>

            {/* Center image — expands */}
            <div
              ref={mImageRef}
              className="shrink-0 overflow-hidden"
              style={{ width: "48px", aspectRatio: "3/4" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES[0].src} alt={IMAGES[0].alt} className="w-full h-full object-cover" loading="lazy" />
            </div>

            {/* "That Gap" — slides in from the LEFT */}
            <div
              ref={mRightRef}
              className="w-full text-left"
              style={{ willChange: "transform", transform: "translateX(-100vw)" }}
            >
              <h2
                className="text-[#f5f0eb] font-bold uppercase leading-none tracking-tight whitespace-nowrap"
                style={{ fontSize: "clamp(2.8rem, 12vw, 5rem)" }}
              >
                That Gap
              </h2>
            </div>
          </div>

          {/* Testimonial — fades in after animation */}
          <div
            ref={mBottomRef}
            className="pb-20 px-6"
            style={{ opacity: 0 }}
          >
            <Testimonial />
          </div>
        </div>
      </section>
    </>
  );
}
