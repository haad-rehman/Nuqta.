"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "\"We had a basic website that looked like it was made in 2010. After working with Nuqta we started getting inquiries from clients we'd never have reached otherwise. People actually call us now saying the site convinced them to come in.\"",
    name: "Nour Al Rashid",
    role: "British Polishing",
    avatar: "/assets/reviews/1.jpg",
  },
  {
    quote: "\"Our old website was embarrassing for a shop our size. The rebrand changed how corporate clients see us — we've landed three fleet contracts since launch. The site does the selling before we even pick up the phone.\"",
    name: "Tariq Mansour",
    role: "Desert Drive",
    avatar: "/assets/reviews/3.jpg",
  },
  {
    quote: "\"I was skeptical about spending on branding but the numbers don't lie. Bookings for our premium detailing packages went up noticeably in the first two months. The new identity finally matches the quality of our work.\"",
    name: "Saeed Al Sharqi",
    role: "Al Sharqi",
    avatar: "/assets/reviews/4.jpg",
  },
  {
    quote: "\"We've been in this business for over 15 years and always relied on word of mouth. The new website gave us a professional presence that holds up against much bigger competitors. Clients mention it every single week.\"",
    name: "Faisal Al Ayoon",
    role: "Al Ayoon",
    avatar: "/assets/reviews/5.jpg",
  },
  {
    quote: "\"The team understood our trade straightaway — no generic agency talk. They translated what we do into a brand that actually makes sense for a detailing shop. It's made a real difference to the quality of enquiries we get.\"",
    name: "Hamdan Al Nasser",
    role: "British Polishing",
    avatar: "/assets/reviews/6.jpg",
  },
];

const INTERVAL = 5000;

const MONO: React.CSSProperties = {
  fontFamily: '"Suisse Mono", "Courier New", monospace',
  fontSize: "11.92px",
  fontWeight: 500,
  color: "rgb(147, 143, 138)",
  letterSpacing: "0",
  lineHeight: "15.5px",
};

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (idx: number) => setActive((idx + TESTIMONIALS.length) % TESTIMONIALS.length);
  const prev = () => { setPaused(true); go(active - 1); };
  const next = () => { setPaused(true); go(active + 1); };

  // Auto-advance — resets on manual interaction
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, paused]);

  // Resume auto-advance 8s after manual interaction
  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(t);
  }, [paused]);

  const t = TESTIMONIALS[active];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Progress bar — resets via key when slide changes */}
      <div style={{ height: "0.8px", background: "rgb(57, 54, 50)", marginBottom: "12px", position: "relative" }}>
        <div
          key={`${active}-${paused}`}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            background: "rgb(232, 232, 227)",
            animation: paused ? "none" : `fill-bar ${INTERVAL}ms linear forwards`,
            width: paused ? `${((active) / TESTIMONIALS.length) * 100}%` : "0%",
          }}
        />
      </div>

      {/* Nav row: arrows + counter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgb(232, 232, 227)",
              fontFamily: "Khteka, Arial, sans-serif",
              fontSize: "17.9px", lineHeight: 1,
              minWidth: "44px", minHeight: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >←</button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgb(232, 232, 227)",
              fontFamily: "Khteka, Arial, sans-serif",
              fontSize: "17.9px", lineHeight: 1,
              minWidth: "44px", minHeight: "44px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >→</button>
        </div>
        <span style={{ ...MONO }}>{String(active + 1).padStart(2, "0")}/{String(TESTIMONIALS.length).padStart(2, "0")}</span>
      </div>

      {/* "(REAL CLIENT STORIES)" label */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ ...MONO, margin: 0, textTransform: "uppercase" }}>(Real client stories)</h3>
      </div>

      {/* Quote */}
      <p
        key={active}
        style={{
          margin: 0,
          fontFamily: "Khteka, Arial, sans-serif",
          fontSize: "17.9px", fontWeight: 500,
          lineHeight: "23.27px",
          color: "rgb(232, 232, 227)",
          flex: 1,
        }}
      >
        {t.quote}
      </p>

      {/* Attribution */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "9999px", overflow: "hidden", flexShrink: 0, background: "rgb(26, 26, 26)" }}>
          <Image src={t.avatar} alt={t.name} width={72} height={72} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: "Khteka, Arial, sans-serif", fontSize: "17.9px", fontWeight: 400, color: "rgb(232, 232, 227)", lineHeight: "1.3" }}>{t.name}</p>
          <p style={{ ...MONO, margin: 0, marginTop: "2px" }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}
