"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const SKILLS = [
  { label: "Computer Vision", weight: 5, family: "ai" },
  { label: "3D Pose Estimation", weight: 4, family: "ai" },
  { label: "Wearable Computing", weight: 5, family: "hw" },
  { label: "Augmented Reality", weight: 4, family: "hw" },
  { label: "macOS / SwiftUI", weight: 5, family: "sw" },
  { label: "AI / ML", weight: 4, family: "ai" },
  { label: "Robotics / FRC", weight: 4, family: "hw" },
  { label: "Optics", weight: 3, family: "physics" },
  { label: "RF Propagation", weight: 3, family: "physics" },
  { label: "Embedded / ESP32", weight: 4, family: "hw" },
  { label: "Cybersecurity", weight: 3, family: "sw" },
  { label: "Manufacturing", weight: 3, family: "hw" },
  { label: "PCB Design", weight: 3, family: "hw" },
  { label: "Anthropic API", weight: 4, family: "ai" },
  { label: "Python", weight: 5, family: "sw" },
  { label: "Swift", weight: 5, family: "sw" },
  { label: "TypeScript", weight: 4, family: "sw" },
];

const FAMILY_COLOR: Record<string, string> = {
  ai: "hsl(168 100% 55%)",
  hw: "hsl(38 100% 60%)",
  sw: "hsl(220 90% 65%)",
  physics: "hsl(320 100% 70%)",
};

const FAMILIES = [
  { id: "ai", label: "AI / Vision", color: FAMILY_COLOR.ai },
  { id: "hw", label: "Hardware", color: FAMILY_COLOR.hw },
  { id: "sw", label: "Software", color: FAMILY_COLOR.sw },
  { id: "physics", label: "Physics", color: FAMILY_COLOR.physics },
];

export function SkillCloud() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/20">
        <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]">
          stack / domains
        </span>
        <span className="font-mono text-[10px] text-accent/70">{SKILLS.length}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 py-3 border-b border-border/30">
        {FAMILIES.map((f) => (
          <button
            key={f.id}
            onMouseEnter={() => setHovered(f.id)}
            onMouseLeave={() => setHovered(null)}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: f.color }}
            />
            {f.label}
          </button>
        ))}
      </div>

      {/* Cloud */}
      <div className="p-5 flex flex-wrap gap-1.5">
        {SKILLS.map((s, i) => {
          const dimmed = hovered && hovered !== s.family;
          return (
            <motion.span
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              transition={{ delay: i * 0.025, duration: 0.4 }}
              animate={{ opacity: dimmed ? 0.18 : 1, y: 0 }}
              onMouseEnter={() => setHovered(s.family)}
              onMouseLeave={() => setHovered(null)}
              className="inline-flex items-center text-[11px] font-mono px-2.5 py-1.5 rounded-lg border transition-colors cursor-default"
              style={{
                background: `${FAMILY_COLOR[s.family]}10`,
                borderColor: `${FAMILY_COLOR[s.family]}30`,
                color: `${FAMILY_COLOR[s.family]}`,
              }}
            >
              {s.label}
            </motion.span>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground/55 uppercase tracking-widest">
        <span>hover a family ↑</span>
        <span>to filter</span>
      </div>
    </div>
  );
}
