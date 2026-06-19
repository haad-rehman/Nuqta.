"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/LoadingScreen";

// Decorative, pointer-gated, fixed-position overlay (non-layout) → no CLS risk.
// Deferred client-only so it stays out of the critical first-load bundle.
const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div
        style={{
          opacity:    loaded ? 1 : 0,
          transition: loaded ? "opacity 0.8s ease" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
