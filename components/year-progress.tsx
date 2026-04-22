"use client";

import { useEffect, useState } from "react";

/**
 * A small footer widget that shows the current year and how far through it we
 * are. Tactile detail — adds a sense that the page is alive.
 */
export function YearProgress() {
  const [pct, setPct] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setYear(now.getFullYear());
      const start = new Date(now.getFullYear(), 0, 1).getTime();
      const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
      setPct(((now.getTime() - start) / (end - start)) * 100);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-t border-border/30 pt-6 pb-2">
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="font-mono text-[10px] text-muted-foreground/55 uppercase tracking-[0.2em]">
          year / {year}
        </span>
        <span className="font-mono text-[10px] text-accent/80 tabular-nums">
          {pct.toFixed(2)}% complete
        </span>
      </div>
      <div className="relative h-[3px] bg-border/40 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent via-secondary to-tertiary rounded-full"
          style={{ width: `${pct}%`, transition: "width 1s ease-out" }}
        />
      </div>
    </div>
  );
}
