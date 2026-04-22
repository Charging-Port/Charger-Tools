"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EVENTS = [
  {
    date: "2026-01",
    title: "Charger Mail",
    blurb: "Native macOS email client with on-device Ollama AI. OAuth2/PKCE auth.",
    tag: "macOS",
  },
  {
    date: "2025-12",
    title: "ChargerAgent v0.4",
    blurb: "Swift agent with Claude tool use over terminal & filesystem.",
    tag: "Agent",
  },
  {
    date: "2025-09",
    title: "AR Glasses MK-II",
    blurb: "Collimating optics + chord glove input. iPhone companion compute.",
    tag: "AR",
  },
  {
    date: "2025-06",
    title: "Hyperform 1M reps",
    blurb: "Crossed 1M analyzed reps across pilot installations.",
    tag: "CV",
  },
  {
    date: "2024-11",
    title: "Optics Simulator",
    blurb: "Built ray-tracer to design the AR collimator. Open source.",
    tag: "Tools",
  },
  {
    date: "2024-08",
    title: "RF Radar Sim",
    blurb: "Volumetric RF propagation w/ material penetration physics.",
    tag: "RF",
  },
];

export function TimelineRow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineLength = useTransform(scrollYProgress, [0, 0.3, 1], ["0%", "100%", "100%"]);

  return (
    <div ref={ref} className="relative">
      {/* Vertical timeline rail (mobile/desktop both) */}
      <div className="absolute left-[14px] md:left-[calc(11%-1px)] top-0 bottom-0 w-px bg-border/40">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-accent via-accent/50 to-transparent origin-top"
          style={{ height: lineLength }}
        />
      </div>

      <div className="space-y-12 md:space-y-16">
        {EVENTS.map((e, i) => (
          <motion.div
            key={e.date}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid grid-cols-12 gap-6 md:gap-8 items-start group"
          >
            {/* Date column */}
            <div className="col-span-12 md:col-span-2 pl-10 md:pl-0 md:text-right">
              <span className="font-mono text-xs text-foreground/70 group-hover:text-accent transition-colors">
                {e.date}
              </span>
            </div>

            {/* Marker */}
            <div className="absolute left-[7px] md:left-[calc(11%-7px)] top-1.5">
              <div className="relative w-[15px] h-[15px]">
                <div className="absolute inset-0 rounded-full bg-background border border-border/60 group-hover:border-accent transition-colors" />
                <div className="absolute inset-[3px] rounded-full bg-accent/0 group-hover:bg-accent transition-all" />
              </div>
            </div>

            {/* Content */}
            <div className="col-span-12 md:col-span-9 md:col-start-4 pl-10 md:pl-0">
              <div className="flex items-baseline gap-3 mb-1.5">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {e.title}
                </h3>
                <span className="text-[10px] font-mono text-accent/70 uppercase tracking-widest border border-accent/25 bg-accent/8 px-2 py-0.5 rounded">
                  {e.tag}
                </span>
              </div>
              <p className="text-sm text-foreground/65 leading-relaxed max-w-xl">
                {e.blurb}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
