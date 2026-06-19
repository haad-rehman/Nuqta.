import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "nuqta. | Brand and Web Design Studio",
  description:
    "We design change-making website and brand experiences that finally match the business behind them.",
  openGraph: {
    title: "nuqta. | Brand and Web Design Studio",
    description:
      "We design change-making website and brand experiences that finally match the business behind them.",
    url: "https://nuqtaa.studio",
    siteName: "nuqta.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "nuqta. Brand and Web Design Studio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nuqta. | Brand and Web Design Studio",
    description:
      "We design change-making website and brand experiences that finally match the business behind them.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <CustomCursor />
        <AppShell>
          <SmoothScroll>{children}</SmoothScroll>
        </AppShell>
      </body>
    </html>
  );
}
