"use client";

import { useEffect, type RefObject } from "react";

/**
 * Lazy, viewport-driven autoplay for muted background <video> loops.
 *
 * Markup contract (see Process.tsx): each <video> has preload="none", a poster,
 * and its <source> children carry the URL in `data-src` (NOT `src`) so the
 * browser fetches nothing until we opt in. This hook:
 *   - attaches the real sources (data-src -> src) + .load() + .play() only when
 *     the element nears the viewport (IntersectionObserver),
 *   - pauses and releases the buffer (detaches src) when it scrolls away,
 *   - shows the poster and never loads a byte under prefers-reduced-motion or
 *     Save-Data (touch/mobile DO autoplay — muted + playsInline, lazy per view).
 *
 * iOS/Safari refuse muted-autoplay unless the element is genuinely muted at
 * play() time and React does not reliably mirror the `muted` prop to the DOM —
 * so we force it imperatively and retry on the first user gesture.
 */
export function useAutoplayVideos(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll("video"));
    if (!videos.length) return;

    // Poster-only modes: never fetch video bytes. We honour the user's explicit
    // preferences (reduced-motion, Save-Data) but DO play on touch/mobile — the
    // videos are muted+playsInline and lazy-loaded per viewport, so they autoplay
    // there too.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;
    if (reduced || saveData) return; // poster stays, sources never attach

    const cleanups: (() => void)[] = [];

    const attach = (v: HTMLVideoElement) => {
      const sources = Array.from(v.querySelectorAll("source"));
      let changed = false;
      sources.forEach((s) => {
        const lazy = s.getAttribute("data-src");
        if (lazy && s.getAttribute("src") !== lazy) {
          s.setAttribute("src", lazy);
          changed = true;
        }
      });
      if (changed) v.load();
    };

    const release = (v: HTMLVideoElement) => {
      v.pause();
      const sources = Array.from(v.querySelectorAll("source"));
      const had = sources.some((s) => s.hasAttribute("src"));
      sources.forEach((s) => s.removeAttribute("src"));
      if (had) v.load(); // drop the decoded buffer to free memory
    };

    const play = (v: HTMLVideoElement) => {
      v.muted = true;
      v.defaultMuted = true;
      if (v.readyState >= 2) {
        v.play().catch(() => {});
      } else {
        const onReady = () => v.play().catch(() => {});
        v.addEventListener("loadeddata", onReady, { once: true });
        cleanups.push(() => v.removeEventListener("loadeddata", onReady));
      }
    };

    videos.forEach((v) => {
      v.muted = true;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            attach(v);
            play(v);
          } else {
            release(v);
          }
        });
      },
      // Start loading just before the section is fully on screen.
      { threshold: 0.1, rootMargin: "200px 0px" }
    );
    videos.forEach((v) => io.observe(v));
    cleanups.push(() => io.disconnect());

    // Last-resort fallback (e.g. iOS Low Power Mode): kick currently-loaded
    // videos on the first user gesture.
    const onGesture = () =>
      videos.forEach((v) => {
        if (v.querySelector("source[src]")) play(v);
      });
    document.addEventListener("touchstart", onGesture, { once: true, passive: true });
    document.addEventListener("click", onGesture, { once: true });
    cleanups.push(() => {
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}
