const STATS = [
  {
    value: "1M+",
    label: "Reps analyzed",
    note: "by Hyperform's vision pipeline across pilot installations",
  },
  {
    value: "10",
    label: "Projects built",
    note: "from native macOS apps to AR optics to a real CV startup",
  },
  {
    value: "12",
    label: "Years of piano",
    note: "and counting — training toward CMTA Level 10",
  },
  {
    value: "254",
    label: "FRC team",
    note: "The Cheesy Poofs — manufacturing, wiring, Human Player",
  },
];

export function NumbersSpread() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="flex items-baseline gap-3 mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            By the numbers
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground/70">
            Index
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="relative pl-5"
            >
              <span
                aria-hidden="true"
                className="absolute -top-2 left-0 font-mono text-[10px] text-muted-foreground/60"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="font-serif text-foreground tracking-tightest leading-none"
                style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              >
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed max-w-[14rem]">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
