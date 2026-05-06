import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { getSiteText } from "@/lib/site-text";
import { SkillsBoard } from "@/components/skills-board";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden MacLean — Hyperform Fitness co-founder, FRC Team 254, ChargerTools, computer vision, robotics, and music.",
};

const timeline = [
  {
    period: "2025 — Present",
    title: "Hyperform Fitness — Co-Founder & Engineering Lead",
    description:
      "Co-founded a computer vision startup building real-time movement analysis at 30fps. Architecting an edge-first inference pipeline now deployed across gyms, rehab centers, and sports medicine programs — over 1M reps analyzed. Managing a team of interns across software, hardware, and deployment.",
  },
  {
    period: "2025 — 2026",
    title: "FIRST Hall of Fame Student Advisory Council",
    description:
      "Selected as Team 254 Student Representative. Representing one of the world's top-ranked FRC teams on the future of student robotics.",
  },
  {
    period: "Summer 2025",
    title: "Georgetown NSLC — Invited Speaker",
    description:
      "Delivered a presentation at Georgetown University's International Security Conference on foreign nuclear weapons threats and crude nuclear device proliferation.",
  },
  {
    period: "2024 — Present",
    title: "FRC Team 254 — The Cheesy Poofs",
    description:
      "Manufacturing, Assembly & Wiring, Human Player. Trained on CNC router, lathe, TIG welding, mill, shear, and brake. Contributed to fabrication and in-competition repairs at Sacramento Regional, East Bay Regional, and the Houston World Championships — where the team won the Autonomous Award.",
  },
  {
    period: "2024 — Present",
    title: "ChargerTools LLC — Founder",
    description:
      "Native macOS development and personal R&D. Built Meridian, Probe, ChargerAgent, Charger Mail, Futz, Zenith, an interactive optics simulator, and an RF radar simulator with 3D penetration physics.",
  },
  {
    period: "2023 — 2024",
    title: "CyberPatriot — Team Captain",
    description:
      "Led a four-person competitive cybersecurity team to National Semi-Finalist placement, specializing in Linux system hardening and timed security operations.",
  },
];

const music = [
  { instrument: "Piano", period: "2012 — Present", detail: "Concert pianist, training toward CMTA Level 10" },
  { instrument: "Cello", period: "2020 — Present", detail: "Honors Performance Series Runner-up" },
  { instrument: "Viola", period: "2021 — Present", detail: "Chamber and orchestral performance" },
  { instrument: "Bass", period: "2025 — Present", detail: "Principal Bassist, BCP Chamber Orchestra" },
];

function PhotoFrame({ caption }: { caption: string }) {
  return (
    <figure className="border border-border rounded-md bg-card/40 overflow-hidden">
      <div className="aspect-[4/3] grid place-items-center bg-card/40 relative overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full text-border/60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch)" opacity="0.5" />
        </svg>
        <Camera size={20} className="text-muted-foreground/60 relative z-10" />
      </div>
      <figcaption className="px-4 py-3 border-t border-border text-[11px] font-mono text-muted-foreground flex items-center justify-between">
        <span>{caption}</span>
        <span className="text-muted-foreground/55">photo</span>
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  const text = getSiteText();
  const about = text.about;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4">
            About · Vol. 01
          </p>
          <h1 className="font-serif tracking-tightest text-foreground leading-[0.92]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            About <em className="text-accent italic">me</em>.
          </h1>
        </header>

        {/* Bio with dropcap + marginalia + photo column */}
        <div className="grid grid-cols-12 gap-6 md:gap-12 mb-24 border-t border-border pt-12">
          <div className="col-span-12 md:col-span-8">
            <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-[1.2] mb-8">
              {about.quote}
            </p>
            <div className="space-y-5 text-foreground/85 leading-[1.75] text-[17px]">
              {about.bio.map((paragraph, i) => (
                <p key={i}>
                  {i === 0 && (
                    <span className="float-left font-serif italic text-accent text-7xl leading-[0.85] pr-3 pt-1.5 -mt-1">
                      {paragraph.charAt(0)}
                    </span>
                  )}
                  {i === 0 ? paragraph.slice(1) : paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="col-span-12 md:col-span-4 space-y-8">
            <PhotoFrame caption="At the bench / 2026" />
            <div className="border-l-2 border-accent pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Quick facts
              </p>
              <dl className="space-y-2.5 text-[13px]">
                {about.quickFacts.map((f) => (
                  <div key={f.k} className="flex gap-3">
                    <dt className="font-mono text-[11px] text-muted-foreground/70 w-20 shrink-0">
                      {f.k}
                    </dt>
                    <dd className="text-foreground/85">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="text-xs text-muted-foreground italic font-serif leading-relaxed">
              &ldquo;{about.pullQuote}&rdquo;
            </p>
          </aside>
        </div>

        <div className="mx-auto max-w-3xl">
          {/* Timeline */}
          <section className="py-12 border-t border-border">
            <div className="flex items-baseline gap-3 mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Timeline
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground mb-10">
              The path so far.
            </h2>
            <div className="space-y-10">
              {timeline.map((item) => (
                <div key={item.title} className="grid grid-cols-12 gap-4 md:gap-8">
                  <div className="col-span-12 md:col-span-3">
                    <p className="font-mono text-xs text-muted-foreground">
                      {item.period}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/75 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="py-12 border-t border-border">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Skills &amp; tools
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="text-sm text-muted-foreground mb-10">
              Tap a skill to see what it is and where I learned it.
            </p>
            <SkillsBoard groups={about.skills} />
          </section>

          {/* Music */}
          <section className="py-12 border-t border-border">
            <div className="flex items-baseline gap-3 mb-10">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Music
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="font-serif text-2xl md:text-3xl text-foreground italic leading-snug mb-8">
              Four instruments, twelve years of practice.
            </p>
            <div>
              {music.map((item) => (
                <div
                  key={item.instrument}
                  className="grid grid-cols-12 gap-4 md:gap-8 items-baseline py-4 border-b border-border last:border-0"
                >
                  <div className="col-span-6 md:col-span-3">
                    <p className="font-serif text-xl text-foreground">
                      {item.instrument}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <p className="text-sm text-foreground/75">{item.detail}</p>
                  </div>
                  <div className="col-span-6 md:col-span-3 md:text-right">
                    <p className="font-mono text-xs text-muted-foreground">
                      {item.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="py-12 border-t border-border">
            <p className="text-foreground/75 leading-relaxed mb-5">
              {about.cta}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              Get in touch <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
