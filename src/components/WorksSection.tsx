"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function WorksSection({ showCta = true }: { showCta?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>(".work-image").forEach((image) => {
        gsap.fromTo(image, { yPercent: -10, scale: 1.25 }, {
          yPercent: 10,
          scale: 1.25,
          ease: "none",
          scrollTrigger: {
            trigger: image.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} className={`works-section${showCta ? "" : " works-section-archive"}`} aria-labelledby="works-heading">
      <div className="works-inner">
        <div className="works-rail">
          <h2 id="works-heading"><span aria-hidden="true" className="works-dot" />Success Stories</h2>
        </div>

        <div className="works-list">
          {projects.map((project, index) => (
            <article className="work-item" key={project.slug}>
              <Link href={`/work/${project.slug}`} className="work-link" aria-label={`View ${project.title} case study`}>
                <div className="work-visual">
                  <Image
                    src={project.listingCover}
                    alt={project.listingCoverAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 584px"
                    className="work-image"
                  />
                  <span className="work-overlay" aria-hidden="true" />
                  <span className="work-reel" aria-hidden="true">
                    <video src={project.video} muted loop playsInline autoPlay preload="none" className="work-video" />
                  </span>
                </div>

                <div className="work-content">
                  <div className="work-index" aria-hidden="true">
                    <span>SS</span><span className="work-index-line" /><span className="work-index-count">{String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="work-description">{project.listingDescription}</p>
                  <div className="work-result">
                    <span className="work-result-tag">CASE</span>
                    <span className="work-result-label">Explore the full story ↗</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
      {showCta && (
        <Link className="works-cta" href="/work">
          <span>{String(projects.length).padStart(2, "0")}</span>
          <span>View All Stories</span>
          <span aria-hidden="true">(→)</span>
        </Link>
      )}
    </section>
  );
}
