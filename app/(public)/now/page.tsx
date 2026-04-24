import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Now",
  description: "What Kaden MacLean is currently working on, reading, and thinking about.",
};

const SECTIONS = [
  {
    label: "Building",
    items: [
      {
        title: "Meridian",
        body: "Native macOS life-OS — calendar, tasks, Canvas LMS, all in one keyboard-first surface. The unified CalendarFeed architecture is finally solid; now I'm focused on the planning engine's slot-finder and getting the recurrence expander 100% deterministic.",
        href: "/products/meridian",
      },
      {
        title: "Probe",
        body: "Notch-anchored class copilot. The notch UI works; the prompt engineering for fidelity across five note styles is where the time is going. Small local LLMs love to fabricate structure, and I'm building anti-fabrication heuristics into every template.",
        href: "/products/probe",
      },
      {
        title: "Hyperform Fitness",
        body: "Edge-first computer-vision platform we co-founded. Past 1M reps. Currently focused on multi-camera sync improvements and pushing toward real-time corrective feedback at sub-100ms across more lift variations.",
        href: "/products/hyperform-fitness",
      },
    ],
  },
  {
    label: "Reading",
    items: [
      { title: "Antenna theory & Maxwell's equations", body: "For the next iteration of the RF radar simulator — finally trying to understand the math under the propagation engine I built two years ago." },
      { title: "The Mythical Man-Month", body: "Re-reading after a year of managing interns at Hyperform. Lots of \"oh that's why\" moments." },
      { title: "Designing Data-Intensive Applications", body: "Background reading for the Meridian sync layer." },
    ],
  },
  {
    label: "Listening",
    items: [
      { title: "Bach — Cello Suite No. 1, Prelude", body: "Practicing this on cello and piano simultaneously. They make different sense in each hand." },
      { title: "Bon Iver — SABLE,", body: "On heavy rotation in the workshop." },
    ],
  },
  {
    label: "Tinkering",
    items: [
      { title: "Glove chord input", body: "Capacitive touch + ESP32, mapped to a stenotype-style chord set for the AR glasses." },
      { title: "Rebuilding my workshop", body: "Better dust collection on the lathe, a proper soldering station, and a CNC fixture plate that doesn't wobble." },
    ],
  },
];

export default function NowPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Home
        </Link>

        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Now · Updated April 23, 2026
          </p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tightest text-foreground leading-[1.0]">
            What I&apos;m doing,{" "}
            <em className="text-accent">right now</em>.
          </h1>
          <p className="mt-6 text-foreground/75 leading-relaxed max-w-xl">
            A snapshot of what&apos;s on my workbench, my desk, and my mind.
            Inspired by{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground link-underline"
            >
              Derek Sivers&apos; /now movement
            </a>
            . I update this when something meaningfully changes.
          </p>
        </header>

        <div className="space-y-16">
          {SECTIONS.map((section) => (
            <section key={section.label}>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  {section.label}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[11px] text-muted-foreground/70">
                  {section.items.length}
                </span>
              </div>
              <ul className="space-y-7">
                {section.items.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-12 gap-4 md:gap-6"
                  >
                    <div className="col-span-12 md:col-span-4">
                      {"href" in item && item.href ? (
                        <Link
                          href={item.href as string}
                          className="font-serif text-xl md:text-2xl text-foreground hover:text-accent transition-colors leading-tight"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="font-serif text-xl md:text-2xl text-foreground leading-tight">
                          {item.title}
                        </span>
                      )}
                    </div>
                    <p className="col-span-12 md:col-span-8 text-foreground/75 leading-relaxed text-[15px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
