import { NuqtaStaggeredMenu } from "@/components/NuqtaStaggeredMenu";
import { Hero } from "@/components/Hero";
import { ProblemsSection } from "@/components/ProblemsSection";
import { ClientsMarquee } from "@/components/ClientsMarquee";
import { GapStatement } from "@/components/GapStatement";
import { WorksSection } from "@/components/WorksSection";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { FAQs } from "@/components/FAQs";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const SITE = "https://nuqtaa.studio";

// Organization schema on the highest-authority page (the root URL), cross-linked
// to the Person schema on /about. Reinforces one distinct entity — Nuqta, Doha,
// founded by Haad Rehman — to counter name-conflation in search/AI results.
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}#organization`,
  name: "Nuqta",
  alternateName: "Nuqta Studio",
  url: SITE,
  logo: `${SITE}/icon.png`,
  description:
    "Nuqta is a brand and web design studio in Doha, Qatar, working with founder-led B2B brands.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    "@id": `${SITE}/about#haad-rehman`,
    name: "Haad Rehman",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Doha",
    addressCountry: "QA",
  },
  award: "Astonishing Awards nominee (2026)",
  sameAs: [
    "https://www.instagram.com/studionuqtaa/",
    "https://www.astonishingawards.com/nominee/nuqta",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <NuqtaStaggeredMenu />
      <main>
        <Hero />
        <ProblemsSection />
        {/* Clients + Gap stack: Gap slides up over Clients as you scroll */}
        <div style={{ position: "relative" }}>
          <ClientsMarquee />
          <GapStatement />
        </div>
        {/* Breathing room between gap statement and works */}
        <div style={{ height: "clamp(80px, 10vw, 120px)", background: "#0a0a0a" }} />
        {/* Works section — noth.in-style grid (Flip letter travel, clip reveals, double parallax) */}
        <WorksSection />
        {/* Services section: dark two-column layout */}
        <section id="services" style={{ background: "rgb(8, 8, 7)" }}>
          <div style={{ padding: "clamp(80px, 15.2vw, 218.4px) 27.2px 78.4px" }}>
            <div className="flex flex-col md:flex-row" style={{ gap: "16px", alignItems: "flex-start" }}>
              {/* Left column — testimonials */}
              <div className="w-full md:w-[354.6px] md:shrink-0">
                <Testimonials />
              </div>
              {/* Right column — "What we can help with" */}
              <div className="flex-1 min-w-0">
                <Services />
              </div>
            </div>
          </div>
        </section>
        <Process />
        <FAQs />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
