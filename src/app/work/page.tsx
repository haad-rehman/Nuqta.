import type { Metadata } from "next";
import { NuqtaStaggeredMenu } from "@/components/NuqtaStaggeredMenu";
import { WorksSection } from "@/components/WorksSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Work | Nuqta",
  description: "Explore Nuqta's selected brand and website case studies.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <>
      <NuqtaStaggeredMenu />
      <main><WorksSection showCta={false} /></main>
      <Footer />
    </>
  );
}
