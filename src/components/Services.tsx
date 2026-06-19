"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const SERVICES = [
  { name: "Brand Strategy",      thumb: "/assets/697ef10d5fcc93485bf8dfb4_Brand_Strategy.avif" },
  { name: "Visual Identity",     thumb: "/assets/697ef16f889c1ea502d8ee65_Visual_Identity.avif" },
  { name: "Website Strategy",    thumb: "/assets/697ef17ae082299197a3aa88_Website_Strategy.avif" },
  { name: "Website Design",      thumb: "/assets/697ef15eca91ffc3ae831e4e_Web_Design.avif" },
  { name: "Website Development", thumb: "/assets/697ef13b8c2c03a57cff1df0_Webflow_Development.avif" },
  { name: "3D Development",      thumb: "/assets/697ef14da1c89e5e19e5cca4_3D_Development.avif" },
];

const IMG_W = 231;
const IMG_H = 289;

export function Services() {
  const [active, setActive] = useState(0);
  const [imgTop, setImgTop] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const handlePointerEnter = (i: number) => {
    setActive(i);
    const row = rowRefs.current[i];
    const list = listRef.current;
    if (row && list) {
      const rowRect = row.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setImgTop(rowRect.top - listRect.top + rowRect.height / 2 - IMG_H / 2);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", gap: "8.5px", marginBottom: "24px" }}>
        <div style={{ width: "13.6px", height: "13.6px", borderRadius: "9999px", backgroundColor: "rgb(147, 143, 138)", flexShrink: 0 }} />
        <span style={{ fontFamily: "Khteka, Arial, sans-serif", fontSize: "17.9px", fontWeight: 400, color: "rgb(232, 232, 227)", letterSpacing: "-0.179px", lineHeight: "1" }}>
          What we can help with
        </span>
      </div>

      {/* Service list */}
      <div ref={listRef} style={{ position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SERVICES.map((s, i) => (
            <div key={s.name}>
              {/* Service name — the <h2> keeps its heading semantics; the
                  interactive control is a real nested <button> so screen
                  readers and keyboard users get a proper button (native
                  Enter/Space + focus) without overriding the heading role.
                  Padding lives on the button so the click target is unchanged. */}
              <h2
                ref={(el) => { rowRefs.current[i] = el; }}
                onPointerEnter={() => handlePointerEnter(i)}
                style={{
                  margin: 0,
                  fontFamily: "Khteka, Arial, sans-serif",
                  fontSize: "clamp(1.6rem, 5vw, 76px)",
                  fontWeight: 500,
                  lineHeight: "1",
                  letterSpacing: "-0.03em",
                  color: "rgb(232, 232, 227)",
                  opacity: active === i ? 1 : 0.3,
                  transition: "opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  userSelect: "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActive(active === i ? -1 : i)}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: "11.9px 0",
                    border: "none",
                    background: "none",
                    font: "inherit",
                    color: "inherit",
                    letterSpacing: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {s.name}
                </button>
              </h2>

              {/* ── Mobile inline accordion image ── */}
              <div
                className="md:hidden overflow-hidden"
                style={{
                  maxHeight: active === i ? "200px" : "0",
                  opacity: active === i ? 1 : 0,
                  transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
                  marginBottom: active === i ? "8px" : "0",
                }}
              >
                <Image
                  src={s.thumb}
                  alt={s.name}
                  width={IMG_W * 2}
                  height={360}
                  sizes="(max-width: 768px) 100vw, 231px"
                  style={{ width: "100%", height: "180px", objectFit: "cover", display: "block", borderRadius: "2px" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop floating thumbnail */}
        <div
          aria-hidden="true"
          className="hidden md:block"
          style={{
            position: "absolute",
            top: imgTop !== null ? imgTop : 0,
            right: 0,
            width: `${IMG_W}px`,
            height: `${IMG_H}px`,
            pointerEvents: "none",
            overflow: "hidden",
            transition: "top 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {SERVICES.map((s, i) => (
            <Image
              key={s.name}
              src={s.thumb}
              alt=""
              fill
              sizes="231px"
              style={{
                objectFit: "cover",
                opacity: active === i ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
