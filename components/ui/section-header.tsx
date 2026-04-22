"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number: string;
  title: string;
  description?: string;
  italic?: string;
  className?: string;
}

export function SectionHeader({
  number,
  title,
  description,
  italic,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-mono text-[11px] text-accent tabular-nums tracking-[0.22em]">
          [ {number} ]
        </span>
        <motion.div
          className="h-px origin-left bg-gradient-to-r from-accent/60 via-border/60 to-transparent flex-1 max-w-[120px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[0.92]"
      >
        {title}
        {italic && (
          <span className="ml-3 font-editorial font-normal italic text-foreground/45">
            {italic}
          </span>
        )}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 text-base text-foreground/60 max-w-xl leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
