"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, Flip);

// ── Data ──────────────────────────────────────────────────────────────────────

interface Tile {
  src: string;
  href: string;
  title: string;
  caption: string;
}

// Order matches the art-direction SLOTS below:
// 0 left tall · 1 right short · 2 center large · 3 left short · 4 right tall.
const TILES: Tile[] = [
  {
    src: "/assets/works/Continents-Legacy-1.webp",
    href: "#",
    title: "Continents Legacy",
    caption: "Brand identity for a Qatari classic-car house.",
  },
  {
    src: "/assets/works/Continents-Legacy-2.webp",
    href: "#",
    title: "Continents Legacy",
    caption: "A digital home serving Al Wakrah since 1983.",
  },
  {
    src: "/assets/works/Al-Sharqi.webp",
    href: "https://alsharqityres.netlify.app/",
    title: "Al Sharqi",
    caption: "A legacy of precision, rebuilt for the web.",
  },
  {
    src: "/assets/works/The-Usual.webp",
    href: "#",
    title: "The Usual",
    caption: "Brand identity, down to the business card.",
  },
  {
    src: "/assets/works/Desert-Drive.webp",
    href: "https://desertdrive.netlify.app/",
    title: "Desert Drive",
    caption: "Branding and web for an off-road experience.",
  },
];

// ── Art direction (noth.in works grid — see docs/nothin-design-reference.md) ──

// Per-item grid slots cycling every 6; row = floor(i/6)*4 + rowOffset + 1.
const SLOTS = [
  { col: "1 / 7", rowOffset: 0, alignSelf: "", h: "43.125rem" },
  { col: "9 / 13", rowOffset: 0, alignSelf: "end", h: "26.875rem" },
  { col: "3 / 11", rowOffset: 1, alignSelf: "", h: "42.25rem" },
  { col: "1 / 5", rowOffset: 2, alignSelf: "end", h: "26.875rem" },
  { col: "7 / 13", rowOffset: 2, alignSelf: "", h: "43.125rem" },
  { col: "3 / 11", rowOffset: 3, alignSelf: "", h: "42.25rem" },
];
const ROWS_PER_CYCLE = 4;

// Directional clip-path reveal origins, alternating corner per tile.
const CLIP_FROM = [
  "inset(100% 100% 0% 0%)",
  "inset(100% 0% 0% 100%)",
  "inset(100% 0% 0% 0%)",
];
const CLIP_TO = "inset(0% 0% 0% 0%)";

// Card drift distances (px) — layer 1 of the double parallax.
const DRIFT = [80, -150, -100, -160, 100, -90];

const WORD = ["W", "O", "R", "K", "S"];

// Decorative repulsion glyphs: type + resting position/rotation/size.
// "Nuqta" means dot — dots, rings, plus and asterisk glyphs in the accent color.
const GLYPHS = [
  { kind: "dot", top: "6%", left: "58%", size: 22, rot: 0 },
  { kind: "asterisk", top: "13%", left: "83%", size: 54, rot: 15 },
  { kind: "ring", top: "34%", left: "4%", size: 44, rot: 0 },
  { kind: "plus", top: "52%", left: "88%", size: 40, rot: -12 },
  { kind: "dot", top: "66%", left: "48%", size: 16, rot: 0 },
  { kind: "asterisk", top: "84%", left: "8%", size: 46, rot: -20 },
] as const;

function Glyph({ kind, size }: { kind: (typeof GLYPHS)[number]["kind"]; size: number }) {
  const c = "#c8b89a";
  switch (kind) {
    case "dot":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill={c} />
        </svg>
      );
    case "ring":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeWidth="3" />
        </svg>
      );
    case "plus":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v18M3 12h18" stroke={c} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "asterisk":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7"
            stroke={c}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

// ── WorksSection ──────────────────────────────────────────────────────────────

export function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glyphRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Desktop = art-directed grid + all scroll effects; mobile = simple stack.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ── Effect B: clip reveals + double parallax ───────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      TILES.forEach((_, i) => {
        const tile = tileRefs.current[i];
        const frame = frameRefs.current[i];
        const imgWrap = imgWrapRefs.current[i];
        if (!tile || !frame) return;

        if (reduced) {
          gsap.set(frame, { clipPath: CLIP_TO });
          return;
        }

        // Directional corner wipe, plays once.
        gsap.set(frame, { clipPath: CLIP_FROM[i % CLIP_FROM.length] });
        gsap.to(frame, {
          clipPath: CLIP_TO,
          ease: "power4.inOut",
          duration: 1,
          scrollTrigger: {
            trigger: tile,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });

        if (!isDesktop) return;

        // Double parallax — card drifts, image counter-slides inside its frame.
        gsap.fromTo(
          tile,
          { y: 0 },
          {
            y: DRIFT[i % DRIFT.length],
            ease: "none",
            scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: 1.5 },
          }
        );
        if (imgWrap) {
          gsap.fromTo(
            imgWrap,
            { yPercent: -5 },
            {
              yPercent: -20,
              ease: "none",
              scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom center", scrub: 3 },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isDesktop]);

  // ── Effect A: Flip letter-travel title ─────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !isDesktop || prefersReducedMotion()) return;

    let tl: gsap.core.Timeline | null = null;
    let trigger: ScrollTrigger | null = null;
    let originals: { el: HTMLSpanElement; parent: Node; next: Node | null }[] = [];

    const restore = () => {
      trigger?.kill();
      trigger = null;
      tl?.kill();
      tl = null;
      originals.forEach(({ el, parent, next }) => {
        gsap.killTweensOf(el);
        // clearProps:"all" would also wipe React's inline display:inline-block,
        // leaving the span non-transformable on rebuild — restore it explicitly.
        el.style.cssText = "display:inline-block;will-change:transform";
        if (next && next.parentNode === parent) parent.insertBefore(el, next);
        else parent.appendChild(el);
      });
      originals = [];
    };

    const build = () => {
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      const slots = slotRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (letters.length === 0 || slots.length < letters.length) return;

      originals = letters.map((el) => ({
        el,
        parent: el.parentElement as Node,
        next: el.nextSibling,
      }));

      // Capture state, re-parent each letter into its far slot, then Flip back
      // from the captured state — the scrubbed timeline plays the journey.
      // Letters are absolutely positioned inside fixed-size slots so the slot
      // row never reflows mid-tween (in-flow letters would shift each other's
      // landing positions and invalidate Flip's measured deltas).
      const state = Flip.getState(letters);
      letters.forEach((el, i) => {
        slots[i].appendChild(el);
        el.style.position = "absolute";
        el.style.top = "0";
        el.style.left = "0";
      });

      tl = Flip.from(state, {
        ease: "power4.inOut",
        duration: 1.4,
        stagger: { each: 0.2, from: "end" },
        repeat: 1,
        yoyo: true, // letters are back home by the section's end
        paused: true,
      }) as gsap.core.Timeline;

      // Mid-flight scale dip per letter.
      letters.forEach((el, i) => {
        const at = (letters.length - 1 - i) * 0.1;
        tl!.to(el, { scale: 0.2, duration: 0.8, ease: "power4.inOut" }, at);
        tl!.to(el, { scale: 1, duration: 0.8, ease: "power4.inOut" }, at + 0.8);
      });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
        animation: tl,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__worksDbg = { tl, trigger };
    };

    build();

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        restore();
        build();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      restore(); // put letters back in their original parents before unmount
    };
  }, [isDesktop]);

  // ── Effect C: mouse-repulsion glyphs ───────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const R = 460; // influence radius
    const MAX_PUSH = 380;
    const ROT_FORCE = 30;
    const SCALE_FORCE = 0.2;

    const glyphs = glyphRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!glyphs.length) return;

    const baseRot = (el: HTMLDivElement) => parseFloat(el.dataset.baseRot ?? "0") || 0;

    // Resting center of a glyph, excluding its current x/y offset.
    const centerOf = (el: HTMLDivElement) => {
      const x = Number(gsap.getProperty(el, "x")) || 0;
      const y = Number(gsap.getProperty(el, "y")) || 0;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - x, y: r.top + r.height / 2 - y };
    };

    const repel = (mx: number, my: number) => {
      glyphs.forEach((el) => {
        const c = centerOf(el);
        const dist = Math.hypot(c.x - mx, c.y - my);
        if (dist < R) {
          const angle = Math.atan2(my - c.y, mx - c.x); // cursor → glyph, inverted below
          const falloff = Math.pow((R - dist) / R, 1.6);
          gsap.to(el, {
            x: -Math.cos(angle) * falloff * MAX_PUSH,
            y: -Math.sin(angle) * falloff * MAX_PUSH,
            rotation: baseRot(el) - Math.cos(angle) * falloff * ROT_FORCE,
            scale: 1 + falloff * SCALE_FORCE,
            duration: 0.45,
            ease: "power4.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(el, {
            x: 0,
            y: 0,
            rotation: baseRot(el),
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.35)",
            overwrite: "auto",
          });
        }
      });
    };

    const releaseAll = () => {
      glyphs.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotation: baseRot(el),
          scale: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.35)",
          overwrite: "auto",
        });
      });
    };

    let inside = false;
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      inside = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      repel(mouse.x, mouse.y);
    };
    const onLeave = () => {
      inside = false;
      releaseAll();
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    // Re-evaluate while scrolling so glyphs dodge a stationary cursor too.
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: () => {
        if (inside) repel(mouse.x, mouse.y);
      },
      onLeave: releaseAll,
      onLeaveBack: releaseAll,
    });

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      st.kill();
      glyphs.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  const setLetterRef = useCallback((el: HTMLSpanElement | null, i: number) => {
    letterRefs.current[i] = el;
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f5f0eb",
        position: "relative",
        overflow: "hidden",
        // Inline padding: the global unlayered `* { padding: 0 }` reset beats
        // Tailwind v4's layered py-* utilities.
        paddingTop: "clamp(100px, 10vw, 140px)",
        paddingBottom: "clamp(120px, 12vw, 180px)",
      }}
    >
      {/* Decorative repulsion glyphs — behind the grid, never interactive */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        {GLYPHS.map((g, i) => (
          <div
            key={i}
            ref={(el) => {
              glyphRefs.current[i] = el;
            }}
            data-base-rot={g.rot}
            style={{
              position: "absolute",
              top: g.top,
              left: g.left,
              transform: `rotate(${g.rot}deg)`,
              opacity: 0.5,
              willChange: "transform",
            }}
          >
            <Glyph kind={g.kind} size={g.size} />
          </div>
        ))}
      </div>

      <div style={{ width: "min(1248px, 86.667vw)", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Title band — state1: big WORKS letters (left); state2: far slots (right).
            On scroll the letters physically re-parent and Flip scrubs the journey. */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "clamp(48px, 6vw, 96px)",
            minHeight: isDesktop ? "clamp(80px, 9vw, 140px)" : undefined,
          }}
        >
          <h2
            aria-label="Works"
            style={{
              display: "flex",
              margin: 0,
              fontFamily: "Animo, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(3rem, 9vw, 8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {WORD.map((ch, i) => (
              <span
                key={i}
                ref={(el) => setLetterRef(el, i)}
                style={{ display: "inline-block", willChange: "transform" }}
              >
                {ch}
              </span>
            ))}
          </h2>
          {isDesktop && (
            <div
              aria-hidden="true"
              style={{
                display: "flex",
                fontFamily: "Animo, Arial, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1rem, 1.4vw, 1.5rem)",
                lineHeight: 1,
                textTransform: "uppercase",
                paddingTop: "0.4em",
              }}
            >
              {WORD.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    slotRefs.current[i] = el;
                  }}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "0.55em",
                    height: "1em",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Art-directed works grid */}
        <div
          ref={gridRef}
          style={
            isDesktop
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gridAutoFlow: "row dense",
                  alignItems: "start",
                  columnGap: "1.25rem",
                }
              : {
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(40px, 10vw, 64px)",
                }
          }
        >
          {TILES.map((tile, i) => {
            const slot = SLOTS[i % SLOTS.length];
            const row = Math.floor(i / SLOTS.length) * ROWS_PER_CYCLE + slot.rowOffset + 1;
            const hasLink = tile.href !== "#";
            return (
              <a
                key={i}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                href={tile.href}
                target={hasLink ? "_blank" : undefined}
                rel={hasLink ? "noopener noreferrer" : undefined}
                data-cursor-text="Explore"
                aria-label={hasLink ? `${tile.title} — opens in new tab` : tile.title}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  ...(isDesktop
                    ? {
                        gridColumn: slot.col,
                        gridRow: String(row),
                        alignSelf: slot.alignSelf || undefined,
                        marginBottom: "clamp(64px, 6vw, 110px)",
                        willChange: "transform",
                      }
                    : {}),
                }}
              >
                {/* Label + caption sit above the image (noth.in .title-work / .short-p-work) */}
                <h3
                  style={{
                    margin: "0 0 1rem",
                    fontFamily: "Khteka, Arial, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: "#8e8e8e",
                  }}
                >
                  {tile.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 1.25rem",
                    fontFamily: "Khteka, Arial, sans-serif",
                    fontSize: "clamp(1.15rem, 1.7vw, 1.5625rem)",
                    fontWeight: 500,
                    lineHeight: 1,
                    letterSpacing: "0.01em",
                  }}
                >
                  {tile.caption}
                </p>
                <div
                  ref={(el) => {
                    frameRefs.current[i] = el;
                  }}
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: "0.25rem",
                    height: isDesktop ? slot.h : "auto",
                    aspectRatio: isDesktop ? undefined : "4 / 3",
                  }}
                >
                  {/* 120% tall wrapper gives the counter-parallax headroom */}
                  <div
                    ref={(el) => {
                      imgWrapRefs.current[i] = el;
                    }}
                    style={{ position: "absolute", inset: "0 0 -20% 0", willChange: "transform" }}
                  >
                    <Image
                      src={tile.src}
                      alt=""
                      fill
                      sizes="(max-width: 991px) 92vw, 60vw"
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
