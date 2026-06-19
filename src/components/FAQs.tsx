"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "Who will actually be working on our project?",
    a: "Haad leads every engagement from strategy, creative direction, and your primary point of contact throughout.\n\nDepending on scope, a carefully selected team of collaborators supports on design and development. The level of care and craft stays consistent, regardless of project size.",
  },
  {
    q: "How long do your projects usually take?",
    a: "Most projects run 1-2 weeks end-to-end.\n\nTimelines can flex based on scope, but we set milestones from day one so there are no surprises.",
  },
  {
    q: "How do you communicate and manage work?",
    a: "We keep things simple and transparent with a dedicated Notion portal to manage our project (timelines and deliverables).\n\nYou'll also have weekly check-in calls on Google Meets, receive Loom updates and weekly communication via Slack or WhatsApp. Or we can integrate with your tools so the process stays structured yet flexible.",
  },
  {
    q: "What do you need to start working together?",
    a: "We'll discuss your specific needs during a discovery call and we will provide a tailored proposal to match your project needs.\n\nAfterwards, we just need a signed contract proposal and the initial project deposit payment. That's all. We make onboarding fast so we can get to work ASAP.",
  },
  {
    q: "What happens after launch?",
    a: "We provide 90 days of hands-on support to make sure everything runs smoothly and your brand is set to steal the spotlight. You'll also get tailored documentation and CMS training videos so non-technical team members can update the site with ease.\n\nAfter that, you're fully equipped to manage things in-house, and if you ever want ongoing support, we offer care plans tailored to your needs.",
  },
  {
    q: "Can you handle branding, design and development?",
    a: "Absolutely. Our specialty is delivering all three under one roof and focus on what matters most to you and your business.\n\nWhether you're a team of 10 or a brand operating in 50 countries, your narrative, identity, visuals, and functionality are aligned from day one, creating a cohesive final experience.",
  },
  {
    q: "What is the project investment?",
    a: "Project investment ranges from 500 to 1,500 QAR depending on scope and project complexity.\n\nThe bigger your challenges and goals, the more resources are required to build a solution that solves your problems. We focus on value, not just a list of deliverables, ensuring your site pays for itself by attracting better clients, bigger opportunities, and lasting results.",
  },
];

const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

function AccordionItem({ q, a, open, onToggle }: {
  q: string; a: string; open: boolean; onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.height  = open ? "auto" : "0";
      el.style.opacity = open ? "1"    : "0";
      return;
    }
    if (open) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.42, ease: "power2.out" });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [open]);

  return (
    <div className="border-b border-[#393632]" style={{ borderBottomWidth: "0.8px" }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left group"
        style={{ paddingTop: "15.75px", paddingBottom: "15.75px" }}
      >
        <span className="text-[#e8e8e3] text-[17.75px] font-normal leading-snug group-hover:opacity-70 transition-opacity duration-200" style={{ paddingRight: "24px" }}>
          {q}
        </span>
        <span
          className="text-[#e8e8e3] shrink-0 text-xl leading-none transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div style={{ paddingBottom: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {a.split("\n\n").map((para, i) => (
            <p key={i} className="text-[#938f8a] text-[15px] leading-[1.7]">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function FounderCTA() {
  return (
    <div className="flex flex-col gap-5">
      <Image
        src="/assets/founder-haad.jpeg"
        alt="A headshot of Haad"
        width={276}
        height={276}
        className="object-cover shrink-0"
        style={{
          width: "138px",
          height: "138px",
          // Feather the hard rectangular edges so the photo melts into the dark
          // section background instead of sitting in a sharp box.
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 64% at 50% 43%, #000 42%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(ellipse 60% 64% at 50% 43%, #000 42%, rgba(0,0,0,0) 100%)",
        }}
      />
      <p className="text-[#e8e8e3] text-[clamp(1.1rem,1.5vw,1.35rem)] font-normal leading-snug">
        Got more questions? Chat with Haad.
      </p>
      <a
        href={CAL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-[#e8e8e3]/30 text-[#e8e8e3] text-[13px] tracking-[0.06em] hover:bg-[#e8e8e3] hover:text-[#0a0a0a] hover:border-[#e8e8e3] transition-all duration-200 w-fit"
        style={{ padding: "8px 16px" }}
      >
        Book a call with Haad&nbsp;↗
      </a>
    </div>
  );
}

export function FAQs() {
  // Start closed — user opens what they need
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const heading = headingRef.current;
      if (heading) {
        const text = heading.textContent ?? "";
        const words = text.split(" ");
        heading.innerHTML = words
          .map((w) => `<span class="sweep-word" style="color:#2e2c2a;display:inline">${w} </span>`)
          .join("");

        const wordEls = heading.querySelectorAll(".sweep-word");
        gsap.to(wordEls, {
          color: "#e8e8e3",
          stagger: { each: 0.04, from: "start" },
          ease: "none",
          scrollTrigger: {
            trigger: heading,
            start: "top 90%",
            end: "center 35%",
            scrub: true,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-[#393632] bg-[#181715]"
      style={{
        borderTopWidth: "0.8px",
        // Padding set inline because the global `* { padding:0 }` reset (unlayered)
        // beats Tailwind's layered px-*/py-* utilities. clamp() reproduces the
        // intended px-6→px-10 / py-16→py-24 responsive ramp.
        padding: "clamp(64px, 8vw, 96px) clamp(24px, 5vw, 40px)",
      }}
    >
      <div className="max-w-[1440px]" style={{ margin: "0 auto" }}>

        {/* ── Desktop: 2-col [left: eyebrow+CTA] [right: heading+accordion] ── */}
        <div className="hidden lg:grid lg:grid-cols-[4fr_8fr] gap-12 lg:gap-16 min-h-[500px]">
          {/* Left col */}
          <div className="flex flex-col justify-between gap-16">
            <div className="flex items-center gap-3">
              <span className="shrink-0 rounded-full bg-[#938f8a]" style={{ width: "13.6px", height: "13.6px" }} />
              <span className="text-[#e8e8e3] text-[19.75px] font-medium leading-none">FAQs</span>
            </div>
            <FounderCTA />
          </div>

          {/* Right col */}
          <div className="flex flex-col" style={{ gap: "61px" }}>
            <h2
              ref={headingRef}
              className="font-medium leading-[1] text-[#e8e8e3]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              We&apos;ve heard every concern. Here&apos;s what you really need to know.
            </h2>
            <div>
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile: stacked — heading → accordion → CTA ── */}
        <div className="flex flex-col gap-10 lg:hidden">
          <div className="flex items-center gap-3">
            <span className="shrink-0 rounded-full bg-[#938f8a]" style={{ width: "13.6px", height: "13.6px" }} />
            <span className="text-[#e8e8e3] text-[19.75px] font-medium leading-none">FAQs</span>
          </div>

          <h2
            className="font-medium leading-[1.1] text-[#e8e8e3]"
            style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            We&apos;ve heard every concern. Here&apos;s what you really need to know.
          </h2>

          <div>
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                q={faq.q}
                a={faq.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>

          {/* CTA at the bottom on mobile */}
          <div className="border-t border-[#393632]" style={{ borderTopWidth: "0.8px", paddingTop: "16px" }}>
            <FounderCTA />
          </div>
        </div>

      </div>
    </section>
  );
}
