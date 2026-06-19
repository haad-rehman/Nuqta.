"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const preRef    = useRef<HTMLSpanElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Skip entirely on return visits or reduced motion
    if (sessionStorage.getItem("nuqta-loaded") || prefersReducedMotion()) {
      setGone(true);
      onComplete();
      return;
    }

    const pre    = preRef.current;
    const dot    = dotRef.current;
    const screen = screenRef.current;
    if (!pre || !dot || !screen) return;

    // 1. Reveal "nuqta" text + shrink dot — at 300ms (was 600)
    const t1 = setTimeout(() => {
      pre.style.transition = "opacity 1.2s ease-in-out, max-width 1.5s cubic-bezier(0.25,0.1,0.25,1)";
      pre.style.opacity    = "1";
      pre.style.maxWidth   = "220px";
      dot.style.transition = "transform 1.2s ease-in-out";
      dot.style.transform  = "translate(0,0) scale(1)";
    }, 300);

    // 2. Collapse "nuqta" back, dot re-enlarges — at 1800ms (was 3800)
    const t2 = setTimeout(() => {
      pre.style.transition = "opacity 0.9s ease-in-out, max-width 1.2s cubic-bezier(0.4,0,0.2,1)";
      pre.style.opacity    = "0";
      pre.style.maxWidth   = "0px";
      dot.style.transition = "transform 1.2s ease-in-out";
      dot.style.transform  = "translate(0,0) scale(1.7)";
    }, 1800);

    // 3. Dot flies to top-left corner — at 2700ms (was 5800)
    const t3 = setTimeout(() => {
      const rect    = screen.getBoundingClientRect();
      const targetX = -(rect.width  / 2) + 45;
      const targetY = -(rect.height / 2) + 37;
      dot.style.transition = "transform 1.4s cubic-bezier(0.45,0,0.2,1), opacity 0.3s ease 1.2s";
      dot.style.transform  = `translate(${targetX}px, ${targetY}px) scale(0.8)`;
    }, 2700);

    // 4. Fade out, reveal main site — at 3600ms (was 8000)
    const t4 = setTimeout(() => {
      dot.style.opacity        = "0";
      screen.style.transition  = "opacity 0.7s ease";
      screen.style.opacity     = "0";
      setTimeout(() => {
        sessionStorage.setItem("nuqta-loaded", "1");
        setGone(true);
        onComplete();
      }, 720);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div
      ref={screenRef}
      style={{
        position:       "fixed",
        inset:          0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         9999,
        background:     "#080808",
        pointerEvents:  "none",
      }}
    >
      <div
        style={{
          display:      "flex",
          alignItems:   "baseline",
          fontFamily:   '"Khteka", Arial, sans-serif',
          fontSize:     "44px",
          fontWeight:   300,
          color:        "#f0ece4",
          letterSpacing:"8px",
        }}
      >
        {/* "nuqta" text — reveals and collapses */}
        <span
          ref={preRef}
          style={{
            opacity:    0,
            display:    "inline-block",
            overflow:   "hidden",
            whiteSpace: "nowrap",
            maxWidth:   "0px",
          }}
        >
          nuqta
        </span>

        {/* The dot */}
        <div
          ref={dotRef}
          style={{
            display:      "inline-block",
            width:        "11px",
            height:       "11px",
            background:   "#f0ece4",
            borderRadius: "50%",
            marginLeft:   "10px",
            transform:    "translate(0,0) scale(1.7)",
            position:     "relative",
            zIndex:       20,
            flexShrink:   0,
          }}
        />
      </div>
    </div>
  );
}
