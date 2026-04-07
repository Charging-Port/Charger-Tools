"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";

/**
 * Cycling words are rendered as a vertical stack inside an `overflow-hidden`
 * container. A pure CSS keyframe animation (`animate-word-cycle`) slides the
 * stack upward through each word in sequence. The first word is duplicated at
 * the end so the loop resets seamlessly.
 *
 * This is intentionally JS-free: it works even if React hydration never runs.
 */
const CYCLING_WORDS = [
  "hardware.",
  "software.",
  "AR glasses.",
  "macOS apps.",
  "AI tools.",
  "the future.",
];
// NOTE: word-cycle Tailwind keyframe is hardcoded to 6 words. If this list
// changes length, update tailwind.config.ts → keyframes['word-cycle'].

const STATS = [
  { label: "Active projects", value: "6" },
  { label: "Primary stack", value: "Swift · Python · CV" },
  { label: "Current focus", value: "Hyperform Fitness" },
  { label: "Based in", value: "Soquel, CA" },
];

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-5 left-5",
    tr: "top-5 right-5",
    bl: "bottom-14 left-5",
    br: "bottom-14 right-5",
  }[position];

  return (
    <div className={`corner-mark absolute ${posClass} opacity-40`} aria-hidden="true" />
  );
}

export function Hero() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetPos = useRef({ x: 50, y: 50 });
  const currentPos = useRef({ x: 50, y: 50 });

  // Mouse spotlight — smooth lerp
  const onMouseMove = useCallback((e: MouseEvent) => {
    targetPos.current = {
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.06;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.06;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${currentPos.current.x}% ${currentPos.current.y}%, hsl(var(--accent) / 0.04), transparent 65%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Mouse spotlight */}
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/3 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 -right-1/6 w-1/3 h-1/3 bg-violet-600/3 rounded-full blur-[160px]" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Corner marks */}
      <CornerMark position="tl" />
      <CornerMark position="tr" />
      <CornerMark position="bl" />
      <CornerMark position="br" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 w-full">
        {/* Top status row */}
        <div
          className="flex items-center gap-4 mb-14 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase">
              ChargerTools LLC
            </span>
          </div>
          <span className="text-border/60">·</span>
          <span className="font-mono text-[11px] text-muted-foreground/50 tracking-widest uppercase">
            Est. 2025
          </span>
          <span className="text-border/60">·</span>
          <span className="font-mono text-[11px] text-muted-foreground/50 tracking-widest uppercase">
            Soquel, CA
          </span>
        </div>

        {/* Main headline block */}
        <div className="mb-8">
          <h1
            className="font-display font-bold tracking-tight leading-[0.88] animate-fade-in-up"
            style={{ fontSize: "clamp(4rem, 11.5vw, 11.5rem)", animationDelay: "0.2s" }}
          >
            <span className="block text-foreground">Kaden.</span>
            <span className="block text-muted-foreground/30">Building</span>

            {/* Pure-CSS cycling words — no JavaScript required */}
            <span className="block overflow-hidden" style={{ height: "1.1em" }}>
              <span className="block animate-word-cycle text-accent will-change-transform">
                {CYCLING_WORDS.map((word, i) => (
                  <span key={i} className="block" style={{ height: "1.1em" }}>
                    {word}
                  </span>
                ))}
                {/* Duplicate of first word for a seamless loop */}
                <span className="block" style={{ height: "1.1em" }}>
                  {CYCLING_WORDS[0]}
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* Thin metadata separator bar */}
        <div
          className="flex items-center gap-4 py-4 border-t border-b border-border/25 mb-12 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            High school junior
          </span>
          <span className="text-border/40">·</span>
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            Hardware & Software
          </span>
          <span className="text-border/40">·</span>
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
            FRC Team 254
          </span>
          <span className="text-border/40 hidden md:block">·</span>
          <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] hidden md:block">
            ChargerTools LLC
          </span>
        </div>

        {/* Bottom two-column: bio + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end">
          {/* Left: Bio + CTAs */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
              Building at the intersection of hardware and software — wearable AR
              systems, native macOS tools, and AI applications under{" "}
              <span className="text-foreground font-medium">ChargerTools LLC</span>.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group btn-accent-glow inline-flex items-center gap-2.5 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
              >
                See my work
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 text-sm font-medium text-muted-foreground border border-border/50 px-6 py-3 rounded-xl hover:text-foreground hover:border-border/80 transition-all"
              >
                About me
              </Link>
            </div>
          </div>

          {/* Right: Stats spec sheet */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="space-y-0">
              {STATS.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between py-3.5 border-b border-border/30 group last:border-0 animate-fade-in"
                  style={{ animationDelay: `${0.7 + i * 0.07}s` }}
                >
                  <span className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <span className="text-sm text-foreground/80 font-medium font-mono group-hover:text-foreground transition-colors">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
        style={{ animationDelay: "1.4s" }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent" />
        <span className="text-[9px] font-mono text-muted-foreground/30 tracking-[0.3em] uppercase">
          scroll
        </span>
      </div>
    </section>
  );
}
