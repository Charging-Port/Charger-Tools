"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles, X } from "lucide-react";
import type { SkillGroup } from "@/types/site-text";
import { cn } from "@/lib/utils";

type Props = {
  groups: SkillGroup[];
};

/**
 * Click any skill chip → a detail panel appears under that group with the
 * skill's description and where it was learned. Click again to close.
 *
 * Keyboard: Tab to a chip, Enter/Space to toggle, Esc to close the open one.
 */
export function SkillsBoard({ groups }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(null);
      }}
    >
      {groups.map((group) => {
        const activeSkill = group.items.find(
          (s) => `${group.category}:${s.name}` === open
        );
        return (
          <div key={group.category}>
            <h3 className="font-serif text-xl text-foreground mb-4">
              {group.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => {
                const key = `${group.category}:${skill.name}`;
                const isOpen = open === key;
                return (
                  <button
                    key={skill.name}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`skill-detail-${group.category}`}
                    onClick={() => setOpen(isOpen ? null : key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[13px] transition-all",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                      isOpen
                        ? "border-accent bg-accent text-accent-foreground shadow-sm"
                        : "border-border bg-card/60 text-foreground/85 hover:border-accent/60 hover:text-accent hover:bg-card"
                    )}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>

            <AnimatePresence initial={false}>
              {activeSkill && (
                <motion.div
                  id={`skill-detail-${group.category}`}
                  key={activeSkill.name}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg border border-accent/30 bg-accent/[0.04] p-4 relative">
                    <button
                      type="button"
                      onClick={() => setOpen(null)}
                      aria-label="Close skill detail"
                      className="absolute top-3 right-3 text-muted-foreground/60 hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <p className="font-serif text-lg text-foreground mb-3 pr-6">
                      {activeSkill.name}
                    </p>
                    <div className="space-y-3 text-[14px] leading-relaxed">
                      <div className="flex gap-3">
                        <Sparkles
                          size={14}
                          className="text-accent shrink-0 mt-1"
                          aria-hidden
                        />
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                            What it is
                          </p>
                          <p className="text-foreground/85">
                            {activeSkill.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <GraduationCap
                          size={14}
                          className="text-accent shrink-0 mt-1"
                          aria-hidden
                        />
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                            Where I learned it
                          </p>
                          <p className="text-foreground/85">
                            {activeSkill.whereLearned}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
