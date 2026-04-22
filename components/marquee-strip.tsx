const ITEMS = [
  { label: "SWIFT", glyph: "▸" },
  { label: "PYTHON", glyph: "◆" },
  { label: "TYPESCRIPT", glyph: "▸" },
  { label: "COMPUTER VISION", glyph: "◇" },
  { label: "AR GLASSES", glyph: "▸" },
  { label: "SWIFTUI", glyph: "◆" },
  { label: "MACOS", glyph: "▸" },
  { label: "EMBEDDED", glyph: "◇" },
  { label: "FRC 254", glyph: "▸" },
  { label: "ML / CV", glyph: "◆" },
  { label: "OPTICS", glyph: "▸" },
  { label: "ESP32", glyph: "◇" },
  { label: "BLE", glyph: "▸" },
  { label: "CHARGERTOOLS", glyph: "◆" },
  { label: "WEARABLES", glyph: "▸" },
  { label: "RF / RADAR", glyph: "◇" },
];

export function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative border-y border-border/40 py-3.5 overflow-hidden select-none bg-card/30 backdrop-blur-sm">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        className={`marquee-track ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/55 hover:text-accent transition-colors"
          >
            {item.label}
            <span className="text-accent/40">{item.glyph}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
