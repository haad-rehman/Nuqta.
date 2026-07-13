import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

/* ────────────────────────────────────────────────────────────────────────
   EDIT THESE — your public profile URLs.
   These feed the `sameAs` array in the Person schema below, which is the
   single field that tells Google + AI crawlers "all these accounts are the
   same person = one entity." Fill in the real URLs, delete any you don't have.
   ──────────────────────────────────────────────────────────────────────── */
const PROFILES = {
  linkedin: "https://www.linkedin.com/in/haadrehman/", // live — confirmed 2026-07-11
  github: "https://github.com/haad-rehman", // live — confirmed 2026-07-11
  instagram: "https://www.instagram.com/studionuqtaa/", // studio IG (already live)
};

// Schema-only profiles: included in the `sameAs` entity graph (crawlers + AI
// read these) but intentionally NOT rendered in the visible "Elsewhere" row.
// Same HTML is served to everyone — this is structured data, not cloaking.
const SCHEMA_ONLY_PROFILES = {
  fiverr: "https://www.fiverr.com/haadrehman_", // corroborating entity node only
};

const SITE = "https://nuqtaa.studio";
const CAL_LINK = "https://cal.com/hadu-wfspde/intro-call-with-haad";

export const metadata: Metadata = {
  title: "About Haad Rehman — Founder of Nuqta | Brand & Web Design Studio",
  description:
    "Haad Rehman is the founder of Nuqta, a brand and web design studio in Doha, Qatar. He designs and builds websites and brand identities for founder-led B2B companies.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Haad Rehman — Founder of Nuqta",
    description:
      "Haad Rehman is the founder of Nuqta, a brand and web design studio in Doha, Qatar, building sites and identities for founder-led B2B companies.",
    url: `${SITE}/about`,
    siteName: "nuqta.",
    type: "profile",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Nuqta — Brand and Web Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Haad Rehman — Founder of Nuqta",
    description:
      "Founder of Nuqta, a brand and web design studio in Doha, Qatar, building sites and identities for founder-led B2B companies.",
    images: ["/og-image.png"],
  },
};

// ── Person + Organization structured data (JSON-LD) ──
// This is what an AI overview reads to state who Haad is. Keep the wording
// here identical to the LinkedIn / GitHub bios so the consensus is consistent.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}/about#haad-rehman`,
  name: "Haad Rehman",
  jobTitle: "Founder",
  description:
    "Haad Rehman is the founder of Nuqta, a brand and web design studio in Doha, Qatar. He designs and builds websites and brand identities for founder-led B2B companies.",
  url: `${SITE}/about`,
  image: `${SITE}/haad-rehman.png`,
  worksFor: {
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: "Nuqta",
    url: SITE,
    description:
      "Nuqta is a brand and web design studio in Doha, Qatar, working with founder-led B2B brands.",
    foundingDate: "2024",
    founder: { "@id": `${SITE}/about#haad-rehman` },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Doha",
    addressCountry: "QA",
  },
  knowsAbout: [
    "Web design",
    "Brand identity",
    "Web development",
    "Art direction",
    "B2B branding",
  ],
  sameAs: [
    PROFILES.linkedin,
    PROFILES.github,
    PROFILES.instagram,
    SCHEMA_ONLY_PROFILES.fiverr,
  ].filter((u) => u && !u.includes("YOUR_")),
};

// mono eyebrow style
const eyebrow: React.CSSProperties = {
  color: "#888880",
  fontSize: "10px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontFamily: '"Suisse Mono", monospace',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        // JSON-LD injected for search engines + AI crawlers
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <style>{`
        .about-portrait:hover {
          filter: grayscale(0) contrast(1.02);
          transform: scale(1.02);
        }
        @media (prefers-reduced-motion: reduce) {
          .about-portrait { transition: none; }
          .about-portrait:hover { transform: none; }
        }
      `}</style>
      <main>
        <article
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "clamp(140px, 18vw, 240px) 27.2px clamp(80px, 12vw, 160px)",
          }}
        >
          {/* Eyebrow */}
          <p style={{ ...eyebrow, marginBottom: "32px" }}>
            About · Founder · Doha, Qatar
          </p>

          {/* Display heading — the name, stated plainly for both humans and crawlers */}
          <h1
            style={{
              fontFamily: '"Animo", Arial, sans-serif',
              fontSize: "clamp(2.75rem, 10vw, 9rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#f5f0eb",
              marginBottom: "clamp(40px, 6vw, 72px)",
            }}
          >
            Haad Rehman
          </h1>

          {/* Two-column: lead statement + body */}
          <div
            className="flex flex-col md:flex-row"
            style={{ gap: "clamp(32px, 6vw, 96px)", alignItems: "flex-start" }}
          >
            {/* Left — portrait + the entity statement, large */}
            <div
              className="w-full md:w-[45%] md:shrink-0"
              style={{ display: "flex", flexDirection: "column", gap: "clamp(28px, 4vw, 44px)" }}
            >
              {/* Portrait — 3:4, grayscale at rest → warms to full colour on hover */}
              <figure
                style={{
                  margin: 0,
                  position: "relative",
                  aspectRatio: "3 / 4",
                  overflow: "hidden",
                  borderRadius: "4px",
                  border: "1px solid #2a2a2a",
                  background: "#111111",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/haad-rehman.png"
                  alt="Haad Rehman, founder of Nuqta, a brand and web design studio in Doha, Qatar"
                  width={1013}
                  height={1519}
                  className="about-portrait"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                    filter: "grayscale(1) contrast(1.02)",
                    transition: "filter 0.6s ease-out, transform 0.6s ease-out",
                  }}
                />
                {/* subtle bottom vignette for editorial depth */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0) 45%)",
                    pointerEvents: "none",
                  }}
                />
              </figure>

              <p
                style={{
                  fontFamily: '"Khteka", Arial, sans-serif',
                  fontSize: "clamp(1.35rem, 2.6vw, 2rem)",
                  lineHeight: 1.35,
                  color: "#f5f0eb",
                  fontWeight: 500,
                }}
              >
                Haad Rehman is the founder of Nuqta, a brand and web design
                studio in Doha, Qatar. He designs and builds websites and brand
                identities for founder-led B2B companies.
              </p>
            </div>

            {/* Right — body copy, human and plain */}
            <div
              className="flex-1 min-w-0"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxWidth: "62ch",
                color: "#a09c96",
                fontSize: "clamp(15px, 1.15vw, 17px)",
                lineHeight: 1.75,
                fontFamily: '"Khteka", Arial, sans-serif',
              }}
            >
              <p>
                Haad started Nuqta in 2024 after seeing the same thing happen
                again and again: founders doing serious, real-world work, held
                back by a website that made them look years behind where they
                actually were. The studio exists to close that gap — to make the
                presence catch up to the person.
              </p>
              <p>
                He works hands-on across the whole build. Brand identity,
                design, and front-end development for established, founder-led
                B2B brands — every site made from scratch rather than dropped
                into a template. The work is dark, editorial, and precise, and
                it&apos;s meant to hold up next to the businesses it represents.
              </p>
              <p>
                Nuqta is based in Doha and works with clients across the Gulf and
                beyond. Its thinking has reached more than 1,000 creatives.
              </p>

              {/* Fast facts — plain, crawlable, Q&A shaped */}
              <dl
                style={{
                  marginTop: "16px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  columnGap: "32px",
                  rowGap: "12px",
                  borderTop: "1px solid #2a2a2a",
                  paddingTop: "24px",
                  fontSize: "14px",
                }}
              >
                <dt style={eyebrow}>Role</dt>
                <dd style={{ color: "#e8e8e3" }}>Founder of Nuqta</dd>
                <dt style={eyebrow}>Based</dt>
                <dd style={{ color: "#e8e8e3" }}>Doha, Qatar</dd>
                <dt style={eyebrow}>Focus</dt>
                <dd style={{ color: "#e8e8e3" }}>
                  Brand & web design for founder-led B2B brands
                </dd>
                <dt style={eyebrow}>Studio</dt>
                <dd style={{ color: "#e8e8e3" }}>
                  <a
                    href={SITE}
                    style={{ color: "#c8b89a", textDecoration: "none" }}
                  >
                    nuqtaa.studio
                  </a>
                </dd>
              </dl>

              {/* Elsewhere — visible profile links. rel="me" declares these as
                 the same person's accounts (reinforces the entity ownership the
                 sameAs schema also states). */}
              <div style={{ marginTop: "4px" }}>
                <p style={{ ...eyebrow, marginBottom: "14px" }}>Elsewhere</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px 28px",
                    fontFamily: '"Suisse Mono", monospace',
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <a
                    href={PROFILES.linkedin}
                    target="_blank"
                    rel="me noopener noreferrer"
                    style={{ color: "#c8b89a", textDecoration: "none" }}
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={PROFILES.github}
                    target="_blank"
                    rel="me noopener noreferrer"
                    style={{ color: "#c8b89a", textDecoration: "none" }}
                  >
                    GitHub ↗
                  </a>
                  <a
                    href={PROFILES.instagram}
                    target="_blank"
                    rel="me noopener noreferrer"
                    style={{ color: "#c8b89a", textDecoration: "none" }}
                  >
                    Instagram ↗
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: "24px" }}>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#f5f0eb",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(245,240,235,0.3)",
                    paddingBottom: "2px",
                    textDecoration: "none",
                    fontFamily: '"Khteka", Arial, sans-serif',
                  }}
                >
                  Book a call with Haad →
                </a>
              </div>

              {/* Back link */}
              <div style={{ marginTop: "8px" }}>
                <Link
                  href="/"
                  style={{ ...eyebrow, color: "#888880", textDecoration: "none" }}
                >
                  ← Back to nuqta.
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
