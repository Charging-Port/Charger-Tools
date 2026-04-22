"use client";

import { useEffect, useState } from "react";

/**
 * Decorative single horizontal scan-line that sweeps the viewport every
 * ~12 seconds. Subtle CRT signal effect — adds life without being noisy.
 * Skipped for prefers-reduced-motion users.
 */
export function ScanLine() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
    >
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--accent) / 0.55), transparent)",
          boxShadow: "0 0 24px hsl(var(--accent) / 0.4)",
          animation: "scan-line 12s linear infinite",
        }}
      />
    </div>
  );
}
