"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function CaseHero({ src, alt }: { src: string; alt: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!rootRef.current || !imageRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(imageRef.current, { yPercent: -8, scale: 1.2 }, {
        yPercent: 8,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="case-hero">
      <Image ref={imageRef} src={src} alt={alt} fill priority sizes="100vw" />
    </div>
  );
}

export function CaseFilm({ src, poster, title }: { src: string; poster: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlayback = () => {
      if (media.matches) video.pause();
      else void video.play().catch(() => {});
    };
    updatePlayback();
    media.addEventListener("change", updatePlayback);
    return () => media.removeEventListener("change", updatePlayback);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  return (
    <figure className="case-film">
      <button
        type="button"
        className="case-film-screen"
        onClick={togglePlayback}
        aria-label={`${playing ? "Pause" : "Play"} ${title} website walkthrough`}
      >
        <Image src={poster} alt="" fill sizes="100vw" />
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={playing ? "is-playing" : ""}
          aria-hidden="true"
        />
      </button>
      <figcaption>Explore the website in motion</figcaption>
    </figure>
  );
}
