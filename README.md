# nuqta. studio website

Next.js 16 (App Router) · React 19 · Tailwind v4 · GSAP + ScrollTrigger · Lenis.
A single long, animation-heavy landing page assembled in `src/app/page.tsx`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Turbopack)
npm run lint
```

## Media optimization

Background-loop videos and large images are optimized ahead of time, not at
build. Optimized outputs are committed; pristine originals are kept in the
gitignored `public/_originals/` directory so encodes can be re-run from source.

### `npm run encode-media`

Re-encodes the site's background videos (`scripts/encode-media.mjs`). For each
input MP4 it writes, alongside the source:

| Output | Codec | Notes |
| --- | --- | --- |
| `<name>.mp4` | H.264 | max width 1280, CRF 28, faststart, no audio |
| `<name>.webm` | VP9 | CRF ~34, no audio |
| `<name>.av1.mp4` | AV1 (SVT-AV1) | CRF 38 — smallest, best compression |
| `assets/posters/<name>.webp` | WebP | first-frame poster (~q70) |

```bash
npm run encode-media                 # default: the videos the site renders
npm run encode-media -- foo.mp4      # specific files (paths under public/)
```

Requires `ffmpeg` on PATH built with `libx264`, `libvpx-vp9`, `libsvtav1`, and
`libwebp` (the gyan.dev "full" Windows build has all four).

`<video>` elements list sources **AV1 → WebM(VP9) → MP4** so capable browsers
pick the smallest file and the rest fall back gracefully. Videos are loaded
lazily (poster first, real source only when the section nears the viewport — see
`src/hooks/useAutoplayVideos.ts`).

### Images

Raster images are served through `next/image` (AVIF/WebP negotiated per request,
see `next.config.ts`). Oversized sources were resized/re-encoded with `ffmpeg`
(e.g. `liwa-review.jpg`, `New-people-bg.webp`); originals are in
`public/_originals/`.
