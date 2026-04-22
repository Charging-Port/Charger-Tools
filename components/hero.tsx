"use client";

import Link from "next/link";
import { ArrowRight, Command as CommandIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ParticleField } from "./particle-field";

const TICKER = [
  { label: "STATUS", value: "Open to collaboration" },
  { label: "BUILDING", value: "Hyperform Fitness" },
  { label: "READING", value: "RF & antenna theory" },
  { label: "STACK", value: "Swift · Python · CV" },
  { label: "BASED IN", value: "Soquel, CA" },
];

function StatusTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TICKER.length), 2800);
    return () => clearInterval(id);
  }, []);
  const item = TICKER[i];
  return (
    <div className="inline-flex items-center gap-3">
      <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.22em]">
        {item.label}
      </span>
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono text-[11px] text-foreground/85"
      >
        {item.value}
      </motion.span>
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Los_Angeles",
        }) + " PT"
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[10px] text-muted-foreground/55 tracking-widest tabular-nums">
      {now || "·· : ·· : ··"}
    </span>
  );
}

const STAT_ROWS = [
  { k: "01", label: "Active projects", value: "6" },
  { k: "02", label: "Reps analyzed", value: "1M+" },
  { k: "03", label: "Stack focus", value: "CV · macOS · AR" },
  { k: "04", label: "Last shipped", value: "ChargerAgent" },
];

export function Hero() {
  return (
    <section className="relative isolate min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Particle field — interactive */}
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Ambient color blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-32 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-32 w-[36rem] h-[36rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--tertiary) / 0.12), transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 w-full px-6 md:px-10 pt-28 md:pt-32 pb-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <StatusTicker />
          </div>
          <LiveClock />
        </div>
      </div>

      {/* Headline */}
      <div className="relative z-10 w-full px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[11px] text-muted-foreground/60 tracking-[0.22em] uppercase mb-6">
              <span className="text-accent">●</span>&nbsp;&nbsp;ChargerTools&nbsp;//&nbsp;Index 00
            </p>
          </motion.div>

          <h1
            className="font-display font-bold tracking-tighter leading-[0.86]"
            style={{ fontSize: "clamp(3.25rem, 12vw, 13rem)" }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 60, skewY: 4 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <span className="text-foreground">Signal</span>{" "}
              <span className="font-editorial italic text-foreground/40">in the</span>
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 60, skewY: 4 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            >
              <span className="text-iridescent">noise</span>
              <span className="text-foreground">.</span>
            </motion.span>
          </h1>

          {/* Underline divider */}
          <motion.div
            className="my-8 md:my-10 h-px origin-left bg-gradient-to-r from-accent via-accent/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />

          {/* Bio + stats grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <p className="text-lg md:text-2xl text-foreground/80 leading-snug max-w-2xl font-editorial">
                I&apos;m{" "}
                <span className="text-foreground border-b border-accent/60">
                  Kaden MacLean
                </span>
                — a junior at Bellarmine building at the intersection of{" "}
                <span className="text-accent">hardware</span>,{" "}
                <span className="text-secondary">software</span>, and{" "}
                <span className="text-tertiary italic">human movement</span>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  data-cursor-magnet
                  className="group magnet-zone inline-flex items-center gap-3 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)]"
                >
                  See the work
                  <span className="inline-flex w-5 h-5 rounded-full bg-accent-foreground/15 items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={11} />
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border/70 px-5 py-3.5 rounded-full hover:text-foreground hover:border-border transition-colors"
                >
                  Read the bio
                </Link>
                <button
                  data-cursor-hover
                  onClick={() =>
                    window.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "k",
                        metaKey: true,
                      })
                    )
                  }
                  className="hidden md:inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-full border border-border/40"
                >
                  <CommandIcon size={11} />
                  K to navigate
                </button>
              </div>
            </motion.div>

            {/* Spec sheet */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
            >
              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.2em]">
                    spec / system
                  </span>
                  <span className="text-[10px] font-mono text-accent/70">v0.27</span>
                </div>
                {STAT_ROWS.map((row, i) => (
                  <motion.div
                    key={row.k}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 + i * 0.07 }}
                    className="flex items-baseline justify-between px-5 py-3.5 border-b border-border/30 last:border-0 group"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-[10px] font-mono text-accent/50">{row.k}</span>
                      <span className="text-[11px] font-mono text-muted-foreground/70 uppercase tracking-widest truncate">
                        {row.label}
                      </span>
                    </div>
                    <span className="text-sm font-mono text-foreground/90 group-hover:text-accent transition-colors">
                      {row.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <div className="relative w-px h-12 overflow-hidden bg-border">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/3 bg-accent"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[9px] font-mono text-muted-foreground/40 tracking-[0.3em] uppercase">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
