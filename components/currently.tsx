import Link from "next/link";

const ENTRIES = [
  {
    label: "Building",
    body: "Meridian — a calm, keyboard-first life-OS for macOS that pulls calendar, tasks, and Canvas LMS into one surface.",
    href: "/products/meridian",
  },
  {
    label: "Shipping",
    body: "Probe — a notch-anchored class copilot that records lectures and turns them into real study notes via a local LLM.",
    href: "/products/probe",
  },
  {
    label: "Reading",
    body: "Antenna theory and Maxwell's equations, for the next iteration of the RF radar simulator.",
  },
];

export function Currently() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="mb-6 flex items-baseline gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Currently
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground/70">
            Apr 2026
          </span>
        </div>
        <ul className="space-y-3">
          {ENTRIES.map((entry) => (
            <li
              key={entry.label}
              className="grid grid-cols-12 gap-4 items-baseline"
            >
              <span className="col-span-3 sm:col-span-2 font-mono text-xs text-accent">
                {entry.label}
              </span>
              <p className="col-span-9 sm:col-span-10 text-foreground/85 leading-relaxed text-[15px]">
                {entry.href ? (
                  <Link href={entry.href} className="link-underline">
                    {entry.body}
                  </Link>
                ) : (
                  entry.body
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
