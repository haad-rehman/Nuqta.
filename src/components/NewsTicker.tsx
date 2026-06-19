"use client";

const NEWS_ITEMS = [
  "MONOLOG × Supersolid — New website launch",
  "Awwwards SOTD for OH Architecture",
  "Booking projects for Q2 2026",
  "FWA SOTD × 5 — CSSDA SOTD × 5",
  "MONOLOG × Mammoth Murals — $100K in 30 days",
];

export function NewsTicker() {
  // Quadruple the items so the seamless loop works at any viewport width
  const items = [...NEWS_ITEMS, ...NEWS_ITEMS, ...NEWS_ITEMS, ...NEWS_ITEMS];

  return (
    // Positioned immediately under the nav (nav is h-[53px] when not scrolled, ~h-[45px] when scrolled)
    // Using a top-[53px] sticky strip so it always sits flush below nav
    <div className="w-full bg-[#f5f0eb] overflow-hidden z-40">
      <div className="py-2 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap">
          {items.map((text, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-5 px-8 text-[#0a0a0a] text-[11px] tracking-[0.18em] uppercase font-medium"
            >
              <span className="w-1 h-1 rounded-full bg-[#0a0a0a] shrink-0" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
