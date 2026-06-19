#!/usr/bin/env node
/**
 * encode-media — re-encode background-loop videos to small, modern formats.
 *
 * For each input MP4 it produces, next to the source:
 *   <name>.mp4        H.264 (max width 1280, CRF 28, faststart, no audio)
 *   <name>.webm       VP9   (CRF 34, no audio)
 *   <name>.av1.mp4    AV1   (SVT-AV1 CRF 38, no audio)         [best compression]
 *   assets/posters/<name>.webp   first-frame poster (~1280w, q70)
 *
 * The original MP4 is backed up to public/_originals/ (gitignored) before the
 * H.264 output overwrites it in place. Outputs are committed; this script is a
 * one-off authoring tool and is NOT part of `next build`.
 *
 * Requirements: ffmpeg on PATH, built with libx264, libvpx-vp9, libsvtav1,
 * libwebp (the gyan.dev "full" build has all of these).
 *
 * Usage:
 *   npm run encode-media                 # re-encode the default TARGETS below
 *   npm run encode-media -- a.mp4 b.mp4  # re-encode specific files (paths under public/)
 *
 * <source> ordering in markup should be AV1 -> WebM(VP9) -> MP4 so capable
 * browsers pick the smallest file and others fall back gracefully.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { dirname, join, basename, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const ORIGINALS = join(PUBLIC, "_originals");
const POSTERS = join(PUBLIC, "assets", "posters");

// Videos actually rendered by the site (paths relative to public/).
const TARGETS = [
  "step1.mp4",
  "step3.mp4",
  "assets/Design_FINAL_compressed.mp4",
];

const MAX_W = 1280;
const SCALE = `scale='min(${MAX_W},iw)':-2`; // keep aspect, even height, never upscale

const ff = (args) =>
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

const kb = (p) => (statSync(p).size / 1024).toFixed(0);

function encodeOne(rel) {
  const src = join(PUBLIC, rel);
  if (!existsSync(src)) {
    console.warn(`! skip (missing): ${rel}`);
    return;
  }
  const dir = dirname(src);
  const stem = basename(rel, extname(rel));
  const out = (suffix) => join(dir, `${stem}${suffix}`);

  // Back up the pristine original once (so re-runs encode from the original,
  // not from a previously-compressed MP4).
  const backup = join(ORIGINALS, rel);
  mkdirSync(dirname(backup), { recursive: true });
  if (!existsSync(backup)) copyFileSync(src, backup);
  const input = backup;

  console.log(`\n• ${rel}  (source ${kb(input)} KB)`);

  // H.264 MP4 — overwrites the original path in place.
  ff(["-i", input, "-vf", SCALE, "-an", "-c:v", "libx264", "-crf", "28",
      "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out(".mp4")]);
  console.log(`  mp4  (h264) ${kb(out(".mp4"))} KB`);

  // VP9 WebM.
  ff(["-i", input, "-vf", SCALE, "-an", "-c:v", "libvpx-vp9", "-crf", "34",
      "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", out(".webm")]);
  console.log(`  webm (vp9)  ${kb(out(".webm"))} KB`);

  // AV1 MP4 (SVT-AV1).
  ff(["-i", input, "-vf", SCALE, "-an", "-c:v", "libsvtav1", "-crf", "38",
      "-preset", "6", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out(".av1.mp4")]);
  console.log(`  av1  (mp4)  ${kb(out(".av1.mp4"))} KB`);

  // Poster — first frame.
  mkdirSync(POSTERS, { recursive: true });
  const poster = join(POSTERS, `${stem}.webp`);
  ff(["-ss", "0", "-i", input, "-frames:v", "1", "-vf", SCALE,
      "-c:v", "libwebp", "-quality", "70", poster]);
  console.log(`  poster      ${kb(poster)} KB  -> ${relative(PUBLIC, poster)}`);
}

const argv = process.argv.slice(2);
const list = argv.length ? argv : TARGETS;
console.log(`encode-media: ${list.length} file(s)`);
for (const rel of list) encodeOne(rel.replace(/^public[\\/]/, ""));
console.log("\ndone.");
