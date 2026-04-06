import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden and ChargerTools — FRC robotics, fitness tech, wearable computing, and more.",
};

const skills = [
  {
    category: "Languages",
    items: ["Swift", "Python", "TypeScript", "C/C++", "Arduino"],
  },
  {
    category: "Frameworks",
    items: ["SwiftUI", "AppKit", "React", "Next.js", "OpenCV"],
  },
  {
    category: "Hardware",
    items: ["ESP32", "Arduino", "OLED Displays", "BLE", "PCB Design"],
  },
  {
    category: "Domains",
    items: [
      "Robotics",
      "Computer Vision",
      "Optics",
      "Biomechanics",
      "Directed Energy",
      "Particle Acceleration",
    ],
  },
];

const timeline = [
  {
    period: "2025 — Present",
    title: "ChargerTools LLC",
    description:
      "Founded a personal technology company building wearable AR systems, native macOS tools, and AI-powered applications.",
  },
  {
    period: "2024 — Present",
    title: "FRC Team 254 — The Cheesy Poofs",
    description:
      "Joined one of the most competitive robotics teams in the world. Learned systems engineering, rapid prototyping, and shipping under pressure.",
  },
  {
    period: "2024 — Present",
    title: "Hyperform Fitness",
    description:
      "Working on fitness technology that combines biomechanics analysis with AI coaching. Applying computer vision to movement quality assessment.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* Hero bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-28">
          <div className="lg:col-span-7">
            <SectionHeader number="01" title="About" className="mb-8" />
            <div className="space-y-5 text-muted-foreground/65 leading-relaxed">
              <p className="text-foreground text-xl leading-relaxed font-medium">
                I&apos;m Kaden — a high school junior who builds things at the
                intersection of hardware and software.
              </p>
              <p>
                I started ChargerTools LLC as a way to formalize the projects I
                was already building. The name comes from my approach: take an
                idea, charge at it, build the tools to make it real.
              </p>
              <p>
                My interests span a wide range of technical domains. On the
                hardware side, I work with optics, embedded systems, and sensor
                design — building things like the AR glasses project that
                combines custom collimating optics with BLE-connected input
                devices. On the software side, I focus on native macOS
                development in Swift and AI-powered tools.
              </p>
              <p>
                Outside of ChargerTools, I&apos;m a member of FRC Team 254
                (The Cheesy Poofs), where I learned that the best engineering
                happens under constraints. I also work on Hyperform Fitness,
                applying computer vision and biomechanics to movement analysis.
              </p>
              <p>
                I&apos;m deeply curious about the physical world — optics,
                directed energy, particle acceleration — and how these domains
                connect to practical engineering. Most of my projects start as
                &ldquo;I wonder if I could build...&rdquo; and evolve from
                there.
              </p>
            </div>
          </div>

          {/* Right column — identity card */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-4">
              {/* Big K monogram */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/6 via-orange-600/3 to-violet-600/4 border border-border/35 flex items-center justify-center relative overflow-hidden">
                <span
                  className="font-display font-bold text-foreground/4 select-none leading-none"
                  style={{ fontSize: "clamp(6rem, 18vw, 14rem)" }}
                  aria-hidden="true"
                >
                  K
                </span>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground/50">
                      open to collaboration
                    </span>
                  </div>
                  <p className="font-display font-bold text-foreground text-lg">
                    Kaden
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground/45 mt-0.5">
                    ChargerTools LLC · San Jose, CA
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="rounded-2xl border border-border/35 bg-card/40 overflow-hidden">
                {[
                  { label: "School year", value: "Junior (11th)" },
                  { label: "Primary lang", value: "Swift" },
                  { label: "Side lang", value: "Python / TypeScript" },
                  { label: "FRC Team", value: "254 — Cheesy Poofs" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-border/20 last:border-0"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono text-foreground/70">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-28">
          <h2 className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-12">
            Timeline
          </h2>
          <div className="relative">
            <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-border/60 via-border/30 to-transparent" />
            <div className="space-y-12 pl-8">
              {timeline.map((item) => (
                <div key={item.title} className="relative group">
                  <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full border-2 border-accent/60 bg-background group-hover:border-accent transition-colors" />
                  <span className="font-mono text-[10px] text-accent/60 mb-2.5 block tracking-wider">
                    {item.period}
                  </span>
                  <h3 className="font-display font-bold text-foreground text-xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-28">
          <h2 className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-12">
            Skills & Tools
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-mono text-accent/60 uppercase tracking-[0.15em] mb-5">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative rounded-2xl border border-border/35 bg-card/40 p-8 md:p-12 overflow-hidden group hover:border-border/60 transition-all duration-500 card-lift">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/3 rounded-full blur-3xl group-hover:bg-accent/6 transition-colors pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-600/3 rounded-full blur-2xl pointer-events-none" />
          <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">
            Let&apos;s work together
          </p>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
            Want to collaborate?
          </h2>
          <p className="text-muted-foreground/60 max-w-lg mb-8 text-sm leading-relaxed">
            I&apos;m always interested in talking about new projects, technical
            challenges, or collaboration opportunities.
          </p>
          <Link
            href="/contact"
            className="btn-accent-glow inline-flex items-center gap-2.5 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Get in touch <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
