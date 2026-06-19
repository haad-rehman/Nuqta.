"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Lenis on touch devices — native mobile scroll is already smooth
    // and Lenis' touchMultiplier fights iOS/Android momentum, causing jitter
    const isTouch = navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Drive Lenis from GSAP's shared ticker so the whole page runs on a single
    // rAF loop instead of Lenis maintaining its own parallel one. gsap.ticker
    // time is in seconds; Lenis.raf expects milliseconds.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
