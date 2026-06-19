"use client";

import { useEffect, type RefObject } from "react";

/**
 * iOS/Safari refuse muted-autoplay unless the element is genuinely muted at
 * play() time — and React does not reliably mirror the `muted` prop to the DOM.
 * This forces muted imperatively, then plays each video once it has data,
 * retrying when it scrolls into view and on the first user gesture.
 */
export function useAutoplayVideos(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll("video"));
    if (!videos.length) return;

    const cleanups: (() => void)[] = [];

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
          if (entry.isIntersecting) play(entry.target as HTMLVideoElement);
        });
      },
      { threshold: 0.1 }
    );
    videos.forEach((v) => io.observe(v));
    cleanups.push(() => io.disconnect());

    // Last-resort fallback (e.g. iOS Low Power Mode): kick on first interaction.
    const onGesture = () => videos.forEach(play);
    document.addEventListener("touchstart", onGesture, { once: true, passive: true });
    document.addEventListener("click", onGesture, { once: true });
    cleanups.push(() => {
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    });

    return () => cleanups.forEach((fn) => fn());
  }, [ref]);
}
