# noth.in — Design & Effects Reference

> Reverse-engineered 2026-07-14 from https://www.noth.in/ (live DOM inspection + de-minified
> bundle analysis of `https://nothinv1.netlify.app/main.js`).
> Purpose: reference for implementing similar effects in the Nuqta works section.

---

## Tech stack

| Layer | Tool | Notes |
|---|---|---|
| CMS/shell | Webflow | Custom JS injected over Webflow markup |
| Bundle | Vite (IIFE build) | Hosted on Netlify, loaded via `<script src>` |
| Animation | GSAP 3.13 | + **ScrollTrigger** + **Flip** plugins |
| Smooth scroll | Lenis | `duration: 1.2`, easing `1.001 - 2^(-10t)` (expo-out), `smoothTouch: false` |
| WebGL | Three.js (subset) | Hero fluid simulation only |
| Video CDN | bunny.net (`noth-in.b-cdn.net`) | All hero/showreel/work videos |

Global CSS injected by the bundle: `[line],[letter],[opacity]{opacity:0}`,
`[scale]{transform:scale(0)}` — attribute-based pre-hide for reveal targets, so
elements never flash before their intro animation.

---

## 1. Hero "ink wipe" — GPU fluid simulation mask

The signature effect. A Three.js canvas (`.mask-reveal-canvas`) overlays the hero and runs a
classic **Navier-Stokes GPU fluid sim** (Pavel Dobryakov architecture) whose **dye buffer is
used as a reveal mask**.

**Pipeline (per frame, all ping-pong FBOs):**
1. Mouse delta → **splat** into velocity buffer + white dye splat: `exp(-dot(p,p)/radius) * color`
2. Curl → vorticity confinement (strength 0 — disabled but wired)
3. Advection with dissipation (semi-Lagrangian, manual bilerp)
4. Divergence → 20 Jacobi pressure iterations → gradient subtract
5. Composite shader:

```glsl
float dye  = texture2D(uDye, vUv).r;
float raw  = dye * uRevealSize;                                  // 3.9
float mask = smoothstep(uEdgeSoftness, uEdgeSoftness + uEdgeWidth, raw); // 0.5, 0.01
gl_FragColor = mix(baseColor, revealColor, mask);
```

**Settings:**
```js
{
  simResolution: 256, dyeResolution: 512,
  velocityDissipation: 0.962, dyeDissipation: 0.988,
  pressureIterations: 20, curlStrength: 0,
  splatRadius: 6e-5, splatForce: 5900,
  revealSize: 3.9, edgeSoftness: 0.5, edgeWidth: 0.01,
}
```

**Clever bits:**
- Base layer = the "Nothin'" **SVG logo baked to a canvas texture on white**; reveal layer =
  `rgba(0,0,0,0)`. Wiping reveals *transparency* → the background `<video>` at z-index 0 shows
  through. The mask canvas sits at z-index 1 with `pointer-events: none`.
- Scroll fade: `fade = clamp(-rect.top / rect.height, 0, 1)`; splat force scaled by
  `(1 - fade²)`, dye dissipation raised toward 0.97 → trails die as hero scrolls away.
- Sim pauses + clears itself while the showreel isn't fullscreen (reads inline width %).
- `setPixelRatio(min(dpr, 2))`, `powerPreference: "high-performance"`, no depth/stencil buffers.

---

## 2. Showreel shrink-on-scroll

Full-viewport video scrubs down as you scroll through the pinned section:

```js
gsap.fromTo(".video-showreel-full-w",
  { width: "100%",  height: "100%" },
  { width: "33.3%", height: "35%",
    ease: "power4.inOut", immediateRender: false,
    scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom",
                     scrub: 3, invalidateOnRefresh: true } });
```
Desktop only (`max-width: 991px` bails).

---

## 3. WORKS letters flying across the page ⭐ (works-section signature)

**GSAP Flip re-parenting scrubbed by scroll.** Each letter of "WORKS" lives in
`.works-word-block-state1` (big title, top-left); matching empty `.works-word-block-state2`
slots sit ~1400px away (top-right, small).

```js
const letters = [...section.querySelectorAll(".works-word-block-state1 .works-word")];
const slots   = [...section.querySelectorAll(".works-word-block-state2")];

const state = Flip.getState(letters);
letters.forEach((el, i) => slots[i].appendChild(el));   // physically re-parent

const tl = Flip.from(state, {
  ease: "power4.inOut", duration: 1.4,
  stagger: { each: 0.2, from: "end" },
  repeat: 1, yoyo: true,          // ← letters return home by section end
  paused: true,
});
// per-letter scale dip mid-flight
letters.forEach((el, i) => {
  const at = (letters.length - 1 - i) * 0.1;
  tl.to(el, { scale: 0.2, duration: 0.8, ease: "power4.inOut" }, at);
  tl.to(el, { scale: 1,   duration: 0.8, ease: "power4.inOut" }, at + 0.8);
});

ScrollTrigger.create({ trigger: section, start: "top top", end: "bottom bottom",
                       scrub: 3, animation: tl });
```

Resize: debounced 200ms → restore letters to original parents (`clearProps: "all"`), kill
trigger, rebuild. Original positions remembered as `{word, parent, next}` triples.

---

## 4. Works grid — art-directed layout + clip reveals + double parallax

**Layout** (desktop ≥992px): 12-col CSS grid, JS-assigned per-item art direction cycling
every 6 items, `gridAutoFlow: "row dense"`:

```js
const SLOTS = [
  { col: "1 / 7",  rowOffset: 0, alignSelf: "",    imgH: "43.125rem" },
  { col: "9 / 13", rowOffset: 0, alignSelf: "end", imgH: "26.875rem" },
  { col: "3 / 11", rowOffset: 1, alignSelf: "",    imgH: "42.25rem"  },
  { col: "1 / 5",  rowOffset: 2, alignSelf: "end", imgH: "26.875rem" },
  { col: "7 / 13", rowOffset: 2, alignSelf: "",    imgH: "43.125rem" },
  { col: "3 / 11", rowOffset: 3, alignSelf: "",    imgH: "42.25rem"  },
]; // row = floor(i/6)*4 + rowOffset + 1
```

**Clip-path reveal** — directional wipe, corner alternates per item:

```js
const FROM = ["inset(100% 100% 0% 0%)", "inset(100% 0% 0% 100%)", "inset(100% 0% 0% 0%)", /* repeat */];
gsap.set(wrapper, { clipPath: FROM[i % FROM.length], overflow: "hidden" });
gsap.to(wrapper, { clipPath: "inset(0% 0% 0% 0%)", ease: "power4.inOut", duration: 1,
  scrollTrigger: { trigger: item, start: "top 88%", toggleActions: "play none none none" } });
```

**Double parallax** (the "window into the photo" feel):

```js
// Layer 1 — whole card drifts, unique offset per slot
const DRIFT = [80, -150, -100, -160, 100, -90];
gsap.fromTo(item, { y: 0 }, { y: DRIFT[i % 6], ease: "none",
  scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 1.5 } });

// Layer 2 — image counter-slides inside its overflow-hidden frame
gsap.fromTo(img, { yPercent: -5 }, { yPercent: -20, ease: "none",
  scrollTrigger: { trigger: item, start: "top bottom", end: "bottom center", scrub: 3 } });
```

---

## 5. Custom "explore" cursor on work links

`cursor: none` on the link; a pill badge lerps toward the pointer:

```js
// per-frame rAF: lag factor 0.09
cx += (tx - cx) * 0.09;  cy += (ty - cy) * 0.09;
// enter: scale 0→1, back.out(1.8), 0.6s ; leave: scale→0, power3.in, 0.38s
// rAF self-terminates when |cx-tx| < 0.05 and not active (no idle loop)
```

Cursor coordinates are relative to the link's rect (`clientX - rect.left`), badge is
`position: absolute; xPercent:-50; yPercent:-50` inside the link.

---

## 6. Mouse-repulsion foil objects (`.formes-w`)

Floating decorative objects (foil balloons, candy wrappers as transparent PNGs/WebPs) that
dodge the cursor:

```js
// per object within influence radius R of cursor:
const falloff = Math.pow((R - dist) / R, 1.6);         // R = 460 desktop / 260 mobile
const push    = falloff * maxDistance;                  // 380px desktop / 110 mobile
gsap.to(obj, { x: -cos(angle)*push, y: -sin(angle)*push,
               rotation: baseRot - cos(angle)*falloff*30, scale: 1 + falloff*0.2,
               duration: 0.45, ease: "power4.out", overwrite: "auto" });
// outside radius / mouseleave:
gsap.to(obj, { x: 0, y: 0, rotation: baseRot, scale: 1,
               duration: 1.2, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
```

Base rotation cached in `dataset.formesBaseRot` so repulsion composes with authored tilt.
Also re-evaluated on ScrollTrigger `onUpdate` so objects react while scrolling past a
stationary cursor.

---

## 7. Videos smuggled in `alt` text (Webflow CMS workaround)

Work images carry `alt="https://cdn/.../file.mp4, full, portrait"`. JS regexes the alt for an
`.mp4` URL, creates a muted/looping/autoplay `<video>`, appends it over the `<img>`, and
crossfades on `canplay` (0.4s). Keywords `full` → `span 12`, `portrait` → `aspect-ratio: 3/4`.

---

## 8. Loader

- Counter animates 100 → 000 (`power2.inOut`, textContent padded to 3 digits)
- Foil images cycle with `back.out(1.2)` pop-ins while a wrapper expands `1rem → 20rem`
- Exit: current image scales to 0 → wrapper collapses to `width: 1rem` → whole loader
  animates `height → 0` (`power4.inOut`, 1.8s) — a curtain lift
- Hero SVG paths then stagger up `yPercent: 120 → 0` in **randomized order** (1.8s,
  `power4.inOut`, stagger 0.07); apostrophe pops `scale 0 → 1` with `back.out(0.9)`
- Plays **once per session**: `sessionStorage["nothin:loader-played"]`
- Events: `loader:hero-reveal-start` / `loader:hero-revealed` gate Lenis start + fluid init
- ⚠️ Observed failure mode: if CDN videos stall (readyState 0), loader hangs — guard with a
  timeout fallback when reimplementing

---

## Shared patterns worth stealing

1. **Scrub-driven paused timelines** — build a rich timeline once, let ScrollTrigger scrub it
   (`scrub: 1.5–3` everywhere; nothing uses instant scrub). The high scrub values + Lenis give
   the site its floaty, liquid feel.
2. **`power4.inOut` is the house ease** for reveals/transitions; `elastic.out(1, 0.35)` for
   returns; `back.out(~1.2–1.8)` for pop-ins.
3. **Everything is rebuildable** — every effect keeps kill-lists (`triggers[]`, handler refs)
   and full teardown functions, re-run on a custom `NAVIGATE_END` event (SPA-style page swaps).
4. **rAF loops self-terminate** when values converge (cursor lerp) or the effect is
   off-screen (fluid sim) — nothing burns frames idle.
5. **Direct DOM writes for per-frame values** (transforms via GSAP ticker), never per-frame
   React-style state.

---

## Mapping to Nuqta-Netlify works section

Already present in the project: GSAP 3.15 (Flip ships with it), `@studio-freight/lenis`,
ScrollTrigger, section-scoped custom cursor (`WorksSection.tsx` cursor label), lerp cursor
pattern, `prefersReducedMotion()` guard in `lib/motion.ts`.

Candidate ports (each standalone):
- **A. Flip letter travel** for the "Works"/section title, scrubbed across the section
- **B. Clip-path directional reveals** on work cards (`inset(100%…)` → `inset(0)`)
- **C. Double parallax** (card drift + inner image counter-slide) on work images
- **D. Mouse-repulsion decorative objects** in the section background
- **E. Fluid-sim reveal mask** (needs Three.js or raw WebGL — heaviest, hero-scale effect)
