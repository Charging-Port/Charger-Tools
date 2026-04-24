import Link from "next/link";

type Entry = {
  date: string;
  project?: string;
  projectSlug?: string;
  body: string;
  tag?: "shipped" | "milestone" | "fix" | "note";
};

const ENTRIES: Entry[] = [
  {
    date: "Apr 22",
    project: "Probe",
    projectSlug: "probe",
    body: "v0.3 — five note styles finalized; notch hit-testing stable over fullscreen apps.",
    tag: "shipped",
  },
  {
    date: "Apr 20",
    project: "Meridian",
    projectSlug: "meridian",
    body: "Beta invites to 14 testers. CalendarFeed merge bug across Canvas + EventKit fixed.",
    tag: "milestone",
  },
  {
    date: "Apr 18",
    project: "Hyperform",
    projectSlug: "hyperform-fitness",
    body: "Crossed 1.2M reps analyzed across pilot installations.",
    tag: "milestone",
  },
  {
    date: "Apr 12",
    project: "Zenith",
    projectSlug: "zenith",
    body: "Dragon Build 4-day program seeded; muscle-load view shipped.",
    tag: "shipped",
  },
  {
    date: "Apr 03",
    project: "ChargerAgent",
    projectSlug: "charger-agent",
    body: "Tool-use latency down ~40% via prompt-cache hit warming.",
    tag: "fix",
  },
  {
    date: "Mar 26",
    body: "Finished re-reading Mythical Man-Month. Agreed with my past self and also not.",
    tag: "note",
  },
];

const TAG_STYLE: Record<NonNullable<Entry["tag"]>, string> = {
  shipped: "text-accent border-accent/40 bg-accent/10",
  milestone: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  fix: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  note: "text-muted-foreground border-border bg-muted/40",
};

export function ShippingLog() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <header className="flex items-baseline justify-between mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
              Shipping log · Apr 2026
            </p>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground leading-[1.05]">
              Lately, from the bench.
            </h2>
          </div>
          <Link
            href="/now"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline whitespace-nowrap"
          >
            /now →
          </Link>
        </header>

        <ol className="relative border-l border-border pl-6 space-y-7 max-w-3xl">
          {ENTRIES.map((entry, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[27px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-background" />
              <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {entry.date}
                </span>
                {entry.tag && (
                  <span
                    className={`text-[9px] font-mono uppercase tracking-[0.2em] border px-1.5 py-px rounded ${TAG_STYLE[entry.tag]}`}
                  >
                    {entry.tag}
                  </span>
                )}
                {entry.project &&
                  (entry.projectSlug ? (
                    <Link
                      href={`/products/${entry.projectSlug}`}
                      className="font-serif text-base text-foreground link-underline"
                    >
                      {entry.project}
                    </Link>
                  ) : (
                    <span className="font-serif text-base text-foreground">
                      {entry.project}
                    </span>
                  ))}
              </div>
              <p className="text-[15px] text-foreground/75 leading-relaxed">
                {entry.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
