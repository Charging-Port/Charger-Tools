const ITEMS = [
  "SWIFT",
  "PYTHON",
  "TYPESCRIPT",
  "COMPUTER VISION",
  "AR GLASSES",
  "SWIFTUI",
  "MACOS",
  "EMBEDDED SYSTEMS",
  "FRC 254",
  "MACHINE LEARNING",
  "OPTICS",
  "ESP32",
  "BLE",
  "CHARGERTOOLS",
  "WEARABLE COMPUTING",
  "DIRECTED ENERGY",
];

export function MarqueeStrip({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="border-y border-border/25 py-3 overflow-hidden select-none bg-muted/10">
      <div
        className={`marquee-track ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/35"
          >
            {item}
            <span className="text-accent/25">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
