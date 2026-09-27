export type Project = {
  slug: string;
  title: string;
  summary: string;
  listingDescription: string;
  category: string;
  cover: string;
  coverAlt: string;
  listingCover: string;
  listingCoverAlt: string;
  video: string;
  website: string;
  introduction: string;
  direction: string;
  details: string[];
};

export const projects: Project[] = [
  {
    slug: "al-ayoon",
    title: "Al Ayoon",
    summary: "A digital home for a Qatari classic-car house.",
    listingDescription: "Website for a Qatari classic-car house, with a cinematic first impression and clear routes into its services, work, shop, and booking.",
    category: "Automotive · Website",
    cover: "/assets/works/AlAyoon.webp",
    coverAlt: "Al Ayoon classic-car website displayed on a tablet",
    listingCover: "/assets/works/Continents-Legacy-1.webp",
    listingCoverAlt: "Al Ayoon classic-car project imagery presented in an editorial layout",
    video: "/assets/works/alayoon.webm",
    website: "https://alayoon.netlify.app/",
    introduction: "A classic-car house needs a presence that gives its vehicles the room and attention they deserve. Al Ayoon’s site leads with the cars, using a restrained palette and a bold editorial voice.",
    direction: "The opening pairs monochrome automotive imagery with large, expressive type. A spare navigation lets the work, services, and shop remain easy to find without competing with the vehicles.",
    details: ["A cinematic first impression built around a classic car", "Expressive display typography against a quiet black canvas", "Clear routes into services, work, the shop, and booking"],
  },
  {
    slug: "rivymun",
    title: "RIVYMUN",
    summary: "A bold digital presence for debate and diplomacy.",
    listingDescription: "Website for a Model UN event built around debate, diplomacy, and resolution, with registration visible from the first screen.",
    category: "Education · Website",
    cover: "/assets/works/RIVYMUN.webp",
    coverAlt: "RIVYMUN website displayed on a laptop",
    listingCover: "/assets/works/RIVYMUN.webp",
    listingCoverAlt: "RIVYMUN website displayed on a laptop",
    video: "/assets/works/rivymun.webm",
    website: "https://rivy-mun-web.vercel.app/",
    introduction: "RIVYMUN brings debate, diplomacy, and resolution together in a digital space. The site gives the event a distinct visual presence while keeping registration visible from the start.",
    direction: "The design uses an oversized wordmark and stark black-and-white contrast to make the identity unmistakable. Small navigation and a direct registration action keep the experience focused.",
    details: ["An oversized wordmark as the main visual anchor", "High-contrast typography with generous white space", "A registration action placed in the opening view"],
  },
  {
    slug: "the-usual",
    title: "The Usual",
    summary: "A considered identity for a student-built haircare brand.",
    listingDescription: "Identity and website for a student-built haircare brand, pairing direct language with product-led imagery and a clear path to shop.",
    category: "Haircare · Identity & website",
    cover: "/assets/works/TheUsual.png",
    coverAlt: "The Usual haircare website presented as an editorial spread",
    listingCover: "/assets/works/the-usual-cover.webp",
    listingCoverAlt: "The Usual haircare product against a warm dark background",
    video: "/assets/works/the-usual.webm",
    website: "https://the-usual-delta.vercel.app/",
    introduction: "The Usual is a student-built haircare brand with a simple, confident point of view. Its digital presentation puts the product and the people behind it in the foreground.",
    direction: "The identity works through direct language, monochrome product imagery, and generous type. The site’s opening makes the brand’s student-built story immediately legible and offers a clear path to shop.",
    details: ["Product-led imagery and a quiet monochrome palette", "Direct messaging about the brand’s student-built origin", "A simple path from introduction to shopping"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
