"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
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
