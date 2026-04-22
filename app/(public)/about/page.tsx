import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Music2, Wrench, Code2, Shield, Mic } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden MacLean — Hyperform Fitness co-founder, FRC Team 254, ChargerTools, computer vision, robotics, and music.",
};

const skills = [
  { category: "Programming", items: ["Python", "Swift", "TypeScript", "JS", "Linux CLI"] },
  { category: "Frameworks", items: ["SwiftUI", "AppKit", "Anthropic API", "OAuth2/PKCE", "OpenCV"] },
  { category: "Manufacturing", items: ["CNC Router", "Lathe", "TIG Welding", "Mill", "Brake", "Soldering", "PCB Design", "CAD"] },
  { category: "Systems", items: ["Embedded Linux", "Cybersecurity", "Networking", "Computer Vision", "3D Pose Estimation", "RF & Optics"] },
];

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
      "Selected as Team 254 Student Representative on the FIRST Hall of Fame Student Advisory Council. Representing one of the world's top-ranked FRC teams.",
  },
  {
    period: "Summer 2025",
    title: "National Student Leadership Conference — Invited Speaker",
    description:
      "Delivered a presentation at Georgetown University's International Security Conference on foreign nuclear weapons threats and crude nuclear device proliferation.",
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
      "Native macOS development and personal R&D. Built ChargerAgent, Charger Mail, an interactive optics simulator, an RF radar simulator with 3D penetration physics, and a digital art program from scratch.",
  },
  {
    period: "2023 — 2024",
    title: "CyberPatriot — Team Captain",
    description:
      "Led a four-person competitive cybersecurity team to National Semi-Finalist placement, specializing in Linux system hardening and timed security operations.",
  },
];

const awards = [
  { icon: Award, title: "FRC World Championship Competitor", detail: "Autonomous Award, Houston Championships" },
  { icon: Shield, title: "CyberPatriot National Semi-Finalist", detail: "Air & Space Forces Association" },
  { icon: Wrench, title: "FIRST Hall of Fame Student Advisory", detail: "Team 254 Student Rep, 2025–2026" },
  { icon: Mic, title: "Invited Speaker, Georgetown NSLC", detail: "International Security Conference, 2025" },
  { icon: Award, title: "Certificate of Excellence", detail: "Columbia University" },
  { icon: Music2, title: "Certificate of Merit Piano — Level 7", detail: "Training toward CMTA Level 10" },
  { icon: Music2, title: "Honors Performance Series Cello", detail: "Runner-up" },
  { icon: Award, title: "Black Belt — Tae Kwon Do", detail: "2012 — 2020" },
  { icon: Code2, title: "4th Place, UIL Math", detail: "Calculator-Assisted division" },
];

const music = [
  { instrument: "Piano", period: "2012 — Present", detail: "Concert pianist, training toward CMTA Level 10" },
  { instrument: "Cello", period: "2020 — Present", detail: "Honors Performance Series Runner-up" },
  { instrument: "Viola", period: "2021 — Present", detail: "Chamber and orchestral performance" },
  { instrument: "Bass", period: "2025 — Present", detail: "Principal Bassist, BCP Chamber Orchestra" },
];

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Hero bio ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-32">
          <div className="lg:col-span-7">
            <SectionHeader number="00" title="Kaden" italic="MacLean" className="mb-10" />
            <div className="space-y-5 text-foreground/70 leading-relaxed">
              <p className="text-foreground/95 text-2xl md:text-3xl leading-snug font-editorial">
                A junior at Bellarmine College Prep building at the intersection of{" "}
                <span className="text-accent">hardware</span>,{" "}
                <span className="text-secondary">software</span>, and{" "}
                <span className="text-tertiary italic">human movement</span>.
              </p>
              <p className="text-base md:text-[17px] text-foreground/65 leading-[1.75]">
                I co-founded{" "}
                <a
                  href="https://hyperformfit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground border-b border-accent/40 hover:border-accent transition-colors"
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
              <p className="text-base md:text-[17px] text-foreground/65 leading-[1.75]">
                I also run{" "}
                <span className="text-foreground">ChargerTools LLC</span>, where
                I build native macOS applications and dive into hardware projects:
                ChargerAgent (a Swift AI agent with real tool use), Charger Mail
                (a privacy-first email client with local AI), and a series of
                physics simulators that started as research tools for my AR
                glasses prototype.
              </p>
              <p className="text-base md:text-[17px] text-foreground/65 leading-[1.75]">
                Outside of those, I&apos;m on FRC Team 254 (The Cheesy Poofs)
                where I work in manufacturing, assembly &amp; wiring, and serve
                as Human Player. I was selected to the FIRST Hall of Fame
                Student Advisory Council and represent Team 254 for 2025–2026.
                I previously captained a CyberPatriot team to National
                Semi-Finalist in Linux security competition, and was an invited
                speaker at Georgetown&apos;s NSLC on nuclear-weapons threats to
                homeland security.
              </p>
              <p className="text-base md:text-[17px] text-foreground/65 leading-[1.75]">
                When I&apos;m not in front of a screen or a lathe, I&apos;m
                playing piano, cello, viola, or bass — principal bassist of BCP
                Chamber Orchestra and a classical pianist since I was four.
                There&apos;s a thread between practicing a Chopin etude and
                debugging a pose-estimation pipeline that I find hard to
                articulate but easy to feel.
              </p>
            </div>
          </div>

          {/* Right column — identity card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div
                className="relative aspect-square rounded-2xl border border-border/50 overflow-hidden"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 0%, hsl(var(--accent) / 0.15), transparent 60%), radial-gradient(120% 120% at 70% 100%, hsl(var(--tertiary) / 0.15), transparent 60%), hsl(var(--card) / 0.4)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                    maskImage:
                      "radial-gradient(circle at center, #000 30%, transparent 75%)",
                  }}
                />
                <span
                  className="absolute inset-0 grid place-items-center font-editorial italic select-none leading-none text-foreground/8"
                  style={{ fontSize: "clamp(8rem, 22vw, 18rem)" }}
                  aria-hidden="true"
                >
                  K
                </span>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    <span className="font-mono text-[11px] text-accent/85">
                      open to collaboration
                    </span>
                  </div>
                  <p className="font-display font-bold text-foreground text-xl">
                    Kaden MacLean
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground/60 mt-0.5">
                    Bellarmine &apos;27 · Soquel, CA
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-border/40 bg-muted/20">
                  <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.2em]">
                    spec sheet
                  </span>
                </div>
                {[
                  { label: "School", value: "Bellarmine '27" },
                  { label: "Startup", value: "Hyperform Fitness" },
                  { label: "FRC Team", value: "254 — Cheesy Poofs" },
                  { label: "Languages", value: "Swift · Python · TS" },
                  { label: "Instruments", value: "Piano · Cello · Bass" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-5 py-3 border-b border-border/20 last:border-0"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground/55 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono text-foreground/85">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Timeline ────────────────────────────────────────── */}
        <div className="mb-32">
          <SectionHeader number="01" title="Timeline" italic="of things" />
          <div className="relative mt-12">
            <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-accent via-border to-transparent" />
            <div className="space-y-12 pl-8">
              {timeline.map((item) => (
                <div key={item.title} className="relative group">
                  <div className="absolute -left-[33px] top-1.5 w-3 h-3 rounded-full border-2 border-accent/60 bg-background group-hover:border-accent group-hover:bg-accent/20 transition-colors" />
                  <span className="font-mono text-[11px] text-accent/80 mb-2.5 block tracking-wider">
                    {item.period}
                  </span>
                  <h3 className="font-display font-bold text-foreground text-xl md:text-2xl mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-foreground/65 leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Skills ──────────────────────────────────────────── */}
        <div className="mb-32">
          <SectionHeader number="02" title="Skills" italic="& tools" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-[10px] font-mono text-accent uppercase tracking-[0.18em] mb-5">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-foreground/75 hover:text-accent transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awards ──────────────────────────────────────────── */}
        <div className="mb-32">
          <SectionHeader number="03" title="Awards" italic="& recognition" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {awards.map((award) => {
              const Icon = award.icon;
              return (
                <div
                  key={award.title}
                  className="group rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-5 hover:border-accent/40 hover:bg-card/70 transition-all"
                >
                  <Icon
                    size={16}
                    className="text-accent/70 mb-3 group-hover:text-accent transition-colors"
                  />
                  <h3 className="text-sm font-medium text-foreground leading-snug mb-1">
                    {award.title}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground/55">
                    {award.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Music ───────────────────────────────────────────── */}
        <div className="mb-32">
          <SectionHeader number="04" title="Music" italic="& performance" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-10">
            <div className="lg:col-span-5">
              <p className="font-editorial text-2xl md:text-3xl text-foreground/90 leading-snug mb-5">
                Four instruments. Twelve years of practice.
              </p>
              <p className="text-sm text-foreground/65 leading-relaxed">
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
                  className="flex items-start justify-between gap-6 py-5 border-b border-border/40 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground text-xl">
                      {item.instrument}
                    </h3>
                    <p className="text-xs text-foreground/55 mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-accent/80 tracking-wider whitespace-nowrap pt-2">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 md:p-12 overflow-hidden group hover:border-accent/40 transition-all duration-500">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/15 rounded-full blur-3xl group-hover:bg-accent/25 transition-colors pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary/12 rounded-full blur-3xl pointer-events-none" />
          <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-5">
            ◆ collaborate
          </p>
          <h2 className="font-editorial text-3xl md:text-5xl text-foreground mb-4 leading-[1.05]">
            Want to build something{" "}
            <span className="italic text-accent">together?</span>
          </h2>
          <p className="text-foreground/65 max-w-lg mb-8 text-base leading-relaxed">
            I&apos;m always interested in talking about new projects, technical
            challenges, or anything at the intersection of computer vision,
            wearables, and software.
          </p>
          <Link
            href="/contact"
            data-cursor-magnet
            className="magnet-zone inline-flex items-center gap-3 bg-accent text-accent-foreground text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)]"
          >
            Get in touch <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
