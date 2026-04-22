"use client";

import { motion } from "framer-motion";

const COLORS: Record<string, { primary: string; secondary: string }> = {
  "hyperform-fitness": { primary: "hsl(160 90% 50%)", secondary: "hsl(180 90% 55%)" },
  "ar-glasses": { primary: "hsl(265 90% 65%)", secondary: "hsl(220 95% 65%)" },
  "charger-agent": { primary: "hsl(35 100% 60%)", secondary: "hsl(15 95% 60%)" },
  "charger-mail": { primary: "hsl(195 95% 60%)", secondary: "hsl(220 90% 65%)" },
  "optics-simulator": { primary: "hsl(195 95% 60%)", secondary: "hsl(170 90% 55%)" },
  "rf-radar-simulator": { primary: "hsl(340 95% 65%)", secondary: "hsl(300 90% 65%)" },
};

interface Props {
  slug: string;
  name: string;
}

export function ProductGlyph({ slug, name }: Props) {
  const colors = COLORS[slug] ?? { primary: "hsl(168 100% 55%)", secondary: "hsl(38 100% 60%)" };

  return (
    <div
      className="relative aspect-square rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden group"
      style={{
        background: `radial-gradient(120% 120% at 30% 0%, ${colors.primary}11, transparent 60%), radial-gradient(120% 120% at 70% 100%, ${colors.secondary}11, transparent 60%), hsl(var(--card) / 0.4)`,
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(circle at center, #000 30%, transparent 75%)",
        }}
      />

      {/* Per-product symbol */}
      <Symbol slug={slug} colors={colors} />

      {/* Crosshairs */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <Crosshair key={corner} corner={corner} />
      ))}

      {/* Bottom label */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase">
        <span>◆ {name}</span>
        <span style={{ color: colors.primary }}>signal</span>
      </div>
    </div>
  );
}

function Symbol({
  slug,
  colors,
}: {
  slug: string;
  colors: { primary: string; secondary: string };
}) {
  // Concentric / orbital glyph for hyperform (joints + connections)
  if (slug === "hyperform-fitness") {
    return (
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Skeleton pose */}
        {[
          [100, 50, 100, 110],
          [100, 110, 70, 145],
          [100, 110, 130, 145],
          [100, 70, 75, 95],
          [100, 70, 125, 95],
        ].map(([x1, y1, x2, y2], i) => (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={colors.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
          />
        ))}
        {[[100, 50], [100, 110], [70, 145], [130, 145], [75, 95], [125, 95]].map(
          ([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={3.5}
              fill={colors.primary}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
            />
          )
        )}
        {/* Pulse */}
        <motion.circle
          cx={100}
          cy={100}
          r={70}
          stroke={colors.secondary}
          strokeWidth={1}
          fill="none"
          initial={{ scale: 0.5, opacity: 0.6 }}
          animate={{ scale: [0.5, 1.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "100px 100px" }}
        />
      </motion.svg>
    );
  }

  // AR glasses: layered hex frames
  if (slug === "ar-glasses") {
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {[60, 90, 120, 150].map((s, i) => (
          <motion.polygon
            key={s}
            points="100,15 165,52 165,127 100,165 35,127 35,52"
            transform={`translate(${100 - s / 2 - 50 + s / 2} ${100 - s / 2 - 50 + s / 2}) scale(${s / 200}) translate(${(200 - s) * (200 / s) / 2}, ${(200 - s) * (200 / s) / 2})`}
            stroke={i % 2 === 0 ? colors.primary : colors.secondary}
            strokeWidth={1}
            fill="none"
            opacity={0.3 + i * 0.15}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30 + i * 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          />
        ))}
        <circle cx={100} cy={100} r={4} fill={colors.primary} />
      </svg>
    );
  }

  // Agent: terminal cursor + shifting characters
  if (slug === "charger-agent") {
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <text
          x={50}
          y={95}
          fontFamily="monospace"
          fontSize={14}
          fill={colors.primary}
          opacity={0.8}
        >
          $ chargeragent
        </text>
        <motion.rect
          x={154}
          y={82}
          width={8}
          height={14}
          fill={colors.primary}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <text
          x={50}
          y={120}
          fontFamily="monospace"
          fontSize={11}
          fill={colors.secondary}
          opacity={0.5}
        >
          {"> tools.ready()"}
        </text>
        {/* Pulsing waveform */}
        <motion.path
          d="M 30 145 Q 60 130, 90 145 T 150 145 T 210 145"
          stroke={colors.primary}
          strokeWidth={1.2}
          fill="none"
          opacity={0.6}
          animate={{ d: [
            "M 30 145 Q 60 130, 90 145 T 150 145 T 210 145",
            "M 30 145 Q 60 160, 90 145 T 150 145 T 210 145",
            "M 30 145 Q 60 130, 90 145 T 150 145 T 210 145",
          ] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // Charger Mail: stacked envelopes
  if (slug === "charger-mail") {
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {[0, 1, 2].map((i) => (
          <motion.g
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: i * 14, opacity: 1 - i * 0.25 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <rect
              x={50 + i * 4}
              y={70 + i * 4}
              width={100 - i * 8}
              height={60 - i * 4}
              rx={4}
              stroke={colors.primary}
              strokeWidth={1.5}
              fill="hsl(var(--background) / 0.5)"
              opacity={0.9 - i * 0.2}
            />
            <line
              x1={50 + i * 4}
              y1={70 + i * 4}
              x2={100}
              y2={104 + i * 2}
              stroke={colors.primary}
              strokeWidth={1}
              opacity={0.6}
            />
            <line
              x1={150 - i * 4}
              y1={70 + i * 4}
              x2={100}
              y2={104 + i * 2}
              stroke={colors.primary}
              strokeWidth={1}
              opacity={0.6}
            />
          </motion.g>
        ))}
      </svg>
    );
  }

  // Optics Sim: rays + lens
  if (slug === "optics-simulator") {
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {/* lens */}
        <ellipse cx={100} cy={100} rx={20} ry={70} stroke={colors.primary} strokeWidth={1.5} fill={`${colors.primary}10`} />
        {/* rays */}
        {[40, 70, 100, 130, 160].map((y, i) => (
          <g key={y}>
            <motion.line
              x1={0}
              y1={y}
              x2={80}
              y2={y}
              stroke={colors.primary}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
            <motion.line
              x1={120}
              y1={y}
              x2={200}
              y2={100 + (y - 100) * 0.3}
              stroke={colors.secondary}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
            />
          </g>
        ))}
      </svg>
    );
  }

  // RF Radar: concentric circles
  if (slug === "rf-radar-simulator") {
    return (
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {[20, 40, 60, 80].map((r, i) => (
          <motion.circle
            key={r}
            cx={100}
            cy={100}
            r={r}
            stroke={colors.primary}
            strokeWidth={1}
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1.4], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "100px 100px" }}
          />
        ))}
        <circle cx={100} cy={100} r={5} fill={colors.secondary} />
        <line x1={100} y1={100} x2={100} y2={20} stroke={colors.primary} strokeWidth={0.5} opacity={0.4} />
        <line x1={100} y1={100} x2={180} y2={100} stroke={colors.primary} strokeWidth={0.5} opacity={0.4} />
      </svg>
    );
  }

  return null;
}

function Crosshair({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const positions = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  } as const;
  return (
    <div className={`absolute ${positions[corner]} w-3 h-3`}>
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-foreground/30" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-foreground/30" />
    </div>
  );
}
