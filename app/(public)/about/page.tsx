import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Music2, Wrench, Code2, Shield, Mic } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden MacLean — Hyperform Fitness co-founder, FRC Team 254, ChargerTools, computer vision, robotics, and music.",
};

/* ── Skills, organized by domain ─────────────────────────────────── */
const skills = [
  {
    category: "Programming",
    items: ["Python", "Swift", "JavaScript", "HTML/CSS", "Linux CLI"],
  },
  {
    category: "Frameworks",
    items: ["SwiftUI", "AppKit", "Anthropic API", "OAuth2/PKCE", "OpenCV"],
  },
  {
    category: "Manufacturing",
    items: [
      "CNC Router",
      "Lathe",
      "TIG Welding",
      "Mill",
      "Shear/Brake",
      "Soldering",
      "PCB Design",
      "CAD",
    ],
  },
  {
    category: "Systems",
    items: [
      "Embedded Linux",
      "Cybersecurity",
      "Networking",
      "Computer Vision",
      "3D Pose Estimation",
      "RF & Optics",
    ],
  },
];

/* ── Career timeline ─────────────────────────────────────────────── */
const timeline = [
  {
    period: "2025 — Present",
    title: "Hyperform Fitness — Co-Founder & Engineering Lead",
    description:
      "Co-founded a computer vision startup building real-time movement analysis at 30fps. Architecting an edge-first inference pipeline now deployed across gyms, rehab centers, and sports medicine programs — over 1M reps analyzed to date. Managing a team of interns across software, hardware, and client deployment.",
  },
  {
    period: "2025 — 2026",
    title: "FIRST Hall of Fame Student Advisory Council",
    description:
      "Selected as Team 254 Student Representative on the FIRST Hall of Fame Student Advisory Council. Representing one of the world's top-ranked FRC teams in conversations about the future of student robotics.",
  },
  {
    period: "Summer 2025",
    title: "National Student Leadership Conference — Invited Speaker",
    description:
      "Delivered a presentation at Georgetown University's International Security Conference on foreign nuclear weapons threats and crude nuclear device proliferation risks to homeland security.",
  },
  {
    period: "2024 — Present",
    title: "FRC Team 254 — The Cheesy Poofs",
    description:
      "Manufacturing, Assembly & Wiring, Human Player. Trained on CNC router, lathe, TIG welding, mill, shear, and brake. Contributed to robot fabrication and rapid in-competition repairs at Sacramento Regional, East Bay Regional, and Houston World Championships — where the team won the Autonomous Award.",
  },
  {
    period: "2024 — Present",
    title: "ChargerTools LLC — Founder & Developer",
    description:
      "Native macOS development and personal R&D. Built ChargerAgent (SwiftUI AI agent with Anthropic tool use), Charger Mail (unified inbox with local Ollama AI), an interactive optics simulator, an RF radar simulator with 3D penetration physics, and a digital art program from scratch.",
  },
  {
    period: "2023 — 2024",
    title: "CyberPatriot — Team Captain",
    description:
      "Led a four-person competitive cybersecurity team to National Semi-Finalist placement, specializing in Linux system hardening, vulnerability identification, and timed security operations.",
  },
];

/* ── Awards & recognition ────────────────────────────────────────── */
const awards = [
  {
    icon: Award,
    title: "FRC World Championship Competitor",
    detail: "Autonomous Award, Houston Championships",
  },
  {
    icon: Shield,
    title: "CyberPatriot National Semi-Finalist",
    detail: "Air & Space Forces Association",
  },
  {
    icon: Wrench,
    title: "FIRST Hall of Fame Student Advisory Council",
    detail: "Team 254 Student Representative, 2025–2026",
  },
  {
    icon: Mic,
    title: "Invited Speaker, Georgetown NSLC",
    detail: "International Security Conference, Summer 2025",
  },
  {
    icon: Award,
    title: "Certificate of Excellence",
    detail: "Columbia University",
  },
  {
    icon: Music2,
    title: "Certificate of Merit Piano — Level 7",
    detail: "Training toward CMTA Level 10",
  },
  {
    icon: Music2,
    title: "Honors Performance Series Cello",
    detail: "Runner-up",
  },
  {
    icon: Award,
    title: "Black Belt — Tae Kwon Do",
    detail: "2012 — 2020",
  },
  {
    icon: Code2,
    title: "4th Place, UIL Math Competition",
    detail: "Calculator-Assisted division",
  },
];

/* ── Music & performing arts ─────────────────────────────────────── */
const music = [
  {
    instrument: "Piano",
    period: "2012 — Present",
    detail: "Concert pianist, training toward CMTA Level 10 Certificate of Merit",
  },
  {
    instrument: "Cello",
    period: "2020 — Present",
    detail: "Honors Performance Series Runner-up",
  },
  {
    instrument: "Viola",
    period: "2021 — Present",
    detail: "Continuing chamber and orchestral performance",
  },
  {
    instrument: "Bass",
    period: "2025 — Present",
    detail: "Principal Bassist, BCP Chamber Orchestra",
  },
];

export default function AboutPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Hero bio ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-28">
          <div className="lg:col-span-7">
            <SectionHeader number="01" title="About" className="mb-8" />
            <div className="space-y-5 text-muted-foreground/65 leading-relaxed">
              <p className="text-foreground text-xl leading-relaxed font-medium">
                I&apos;m Kaden MacLean — a junior at Bellarmine College Prep
                building things at the intersection of hardware, software, and
                human movement.
              </p>
              <p>
                I co-founded{" "}
                <a
                  href="https://hyperformfit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-accent transition-colors underline underline-offset-4 decoration-border"
                >
                  Hyperform Fitness
                </a>
                , a computer vision startup that tracks human movement in real
                time and delivers corrective feedback to athletes during their
                actual sets — not minutes later in a video review, but right
                then, while the bar is still on their back. We&apos;ve analyzed
                over a million reps across gyms, rehab centers, and sports
                medicine programs.
              </p>
              <p>
                I also run ChargerTools LLC, where I build native macOS
                applications and dive into hardware projects: ChargerAgent (a
                Swift AI agent with real tool use), Charger Mail (a privacy-first
                email client with local AI), and a series of physics simulators
                — including an interactive optics ray tracer and a 3D RF
                propagation engine — that started as research tools for my AR
                glasses prototype.
              </p>
              <p>
                Outside of those, I&apos;m on FRC Team 254 (The Cheesy Poofs),
                where I work in manufacturing, assembly &amp; wiring, and serve
                as Human Player. I was selected to the FIRST Hall of Fame
                Student Advisory Council and represent Team 254 for the
                2025–2026 season. I previously captained a CyberPatriot team to
                National Semi-Finalist in Linux security competition, and was an
                invited speaker at Georgetown&apos;s National Student Leadership
                Conference on nuclear weapons threats to homeland security.
              </p>
              <p>
                When I&apos;m not in front of a screen or a lathe, I&apos;m
                playing piano, cello, viola, or bass — I&apos;m the principal
                bassist of BCP Chamber Orchestra and have been training in
                classical piano since I was four. There&apos;s a thread between
                practicing a Chopin etude and debugging a pose estimation
                pipeline that I find hard to articulate but easy to feel.
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
                    Kaden MacLean
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground/45 mt-0.5">
                    Bellarmine &apos;27 · Soquel, CA
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="rounded-2xl border border-border/35 bg-card/40 overflow-hidden">
                {[
                  { label: "School", value: "Bellarmine '27" },
                  { label: "Startup", value: "Hyperform Fitness" },
                  { label: "FRC Team", value: "254 — Cheesy Poofs" },
                  { label: "Languages", value: "Swift · Python · JS" },
                  { label: "Instruments", value: "Piano · Cello · Bass" },
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

        {/* ── Timeline ────────────────────────────────────────── */}
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
                  <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Skills ──────────────────────────────────────────── */}
        <div className="mb-28">
          <h2 className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-12">
            Skills &amp; Tools
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-mono text-accent/60 uppercase tracking-[0.15em] mb-5">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awards & Recognition ────────────────────────────── */}
        <div className="mb-28">
          <h2 className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-12">
            Awards &amp; Recognition
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award) => {
              const Icon = award.icon;
              return (
                <div
                  key={award.title}
                  className="group rounded-xl border border-border/30 bg-card/40 p-5 hover:border-border/60 hover:bg-card/60 transition-all"
                >
                  <Icon
                    size={16}
                    className="text-accent/60 mb-3 group-hover:text-accent transition-colors"
                  />
                  <h3 className="text-sm font-medium text-foreground leading-snug mb-1">
                    {award.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground/45">
                    {award.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Music & Performing Arts ─────────────────────────── */}
        <div className="mb-28">
          <h2 className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-12">
            Music &amp; Performing Arts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-foreground text-lg leading-relaxed font-medium mb-4">
                Four instruments. Twelve years of practice.
              </p>
              <p className="text-sm text-muted-foreground/65 leading-relaxed">
                Music has been a constant since I was four. I&apos;m a concert
                pianist training toward the CMTA Level 10 Certificate of Merit,
                and currently the principal bassist of the BCP Chamber
                Orchestra. The discipline carries over into engineering — both
                require obsession with detail, deliberate practice, and the
                patience to slow down on the parts that aren&apos;t working
                yet.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-3">
              {music.map((item) => (
                <div
                  key={item.instrument}
                  className="flex items-start justify-between gap-6 py-4 border-b border-border/20 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {item.instrument}
                    </h3>
                    <p className="text-xs text-muted-foreground/55 mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-accent/50 tracking-wider whitespace-nowrap pt-1.5">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
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
            challenges, or anything at the intersection of computer vision,
            wearables, and software.
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
