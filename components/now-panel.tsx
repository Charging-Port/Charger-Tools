"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Beaker, Wrench } from "lucide-react";

const ITEMS = [
  {
    icon: Wrench,
    label: "Building",
    value: "Hyperform Fitness — multi-camera 3D pose at 30fps with sub-100ms feedback.",
    accent: "text-emerald-400",
  },
  {
    icon: Beaker,
    label: "Tinkering",
    value: "Glove chord input — capacitive touch + ESP32, mapped to a full character set.",
    accent: "text-violet-400",
  },
  {
    icon: Zap,
    label: "Shipping",
    value: "ChargerAgent v0.4 — Claude tool use over local terminal & file primitives.",
    accent: "text-amber-400",
  },
  {
    icon: Sparkles,
    label: "Reading",
    value: "RF antenna theory + Maxwell's equations for the radar simulator.",
    accent: "text-cyan-400",
  },
];

export function NowPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="font-mono text-[10px] text-accent/80 uppercase tracking-[0.2em]">
            now / live status
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground/50 hidden sm:inline">
          updated daily · last sync today
        </span>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              className={`p-6 md:p-7 border-border/40 ${
                i % 2 === 0 ? "md:border-r" : ""
              } ${i < ITEMS.length - 2 ? "border-b md:border-b" : "border-b md:border-b-0"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 ${item.accent}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {item.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
