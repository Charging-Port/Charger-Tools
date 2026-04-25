"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  num: string;
  label: string;
};

export function SectionMarker({ num, label }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="mx-auto max-w-5xl px-6 pt-10 pb-2 flex items-center gap-4"
    >
      <span
        className={`font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80 transition-opacity duration-700 ${
          seen ? "opacity-100" : "opacity-0"
        }`}
      >
        {num}
      </span>
      <span
        className={`h-px flex-1 bg-gradient-to-r from-accent/60 via-border to-transparent origin-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          seen ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <span
        className={`font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/80 transition-opacity duration-700 delay-300 ${
          seen ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
