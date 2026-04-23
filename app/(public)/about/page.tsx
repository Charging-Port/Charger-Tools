import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kaden MacLean — Hyperform Fitness co-founder, FRC Team 254, ChargerTools, computer vision, robotics, and music.",
};

const skills = [
  { category: "Programming", items: ["Python", "Swift", "TypeScript", "JavaScript", "Linux CLI"] },
  { category: "Frameworks", items: ["SwiftUI", "AppKit", "Anthropic API", "OAuth2/PKCE", "OpenCV"] },
  { category: "Manufacturing", items: ["CNC Router", "Lathe", "TIG Welding", "Mill", "Brake", "Soldering", "PCB Design", "CAD"] },
  { category: "Systems", items: ["Embedded Linux", "Cybersecurity", "Networking", "Computer Vision", "3D Pose Estimation", "RF & Optics"] },
];

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
      "Native macOS development and personal R&D. Built ChargerAgent, Charger Mail, an interactive optics simulator, and an RF radar simulator with 3D penetration physics.",
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

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-14 md:mb-20">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            About
          </h1>
          <div className="mt-8 space-y-5 text-foreground/80 leading-[1.7]">
            <p className="text-xl text-foreground font-serif italic leading-snug">
              I&apos;m Kaden MacLean — a junior at Bellarmine College Prep
              building at the intersection of hardware, software, and human
              movement.
            </p>
            <p>
              I co-founded{" "}
              <a
                href="https://hyperformfit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground link-underline"
              >
                Hyperform Fitness
              </a>
              , a computer-vision startup that tracks human movement in real
              time and delivers corrective feedback to athletes during their
              actual sets — not minutes later in a video review, but right
              then, while the bar is still on their back. We&apos;ve analyzed
              over a million reps across gyms, rehab centers, and sports
              medicine programs.
            </p>
            <p>
              I also run <span className="text-foreground">ChargerTools LLC</span>,
              where I build native macOS applications and dive into hardware
              projects: ChargerAgent (a Swift AI agent with real tool use),
              Charger Mail (a privacy-first email client with local AI), and
              a series of physics simulators that started as research tools
              for my AR glasses prototype.
            </p>
            <p>
              I&apos;m on FRC Team 254 (The Cheesy Poofs), where I work in
              manufacturing, assembly &amp; wiring, and serve as Human Player.
              I was selected to the FIRST Hall of Fame Student Advisory Council
              and represent Team 254 for 2025–2026. I previously captained a
              CyberPatriot team to National Semi-Finalist in Linux security
              competition, and was an invited speaker at Georgetown&apos;s
              NSLC on nuclear-weapons threats to homeland security.
            </p>
            <p>
              When I&apos;m not in front of a screen or a lathe, I&apos;m
              playing piano, cello, viola, or bass — principal bassist of BCP
              Chamber Orchestra and a classical pianist since I was four.
              There&apos;s a thread between practicing a Chopin etude and
              debugging a pose-estimation pipeline that I find hard to
              articulate but easy to feel.
            </p>
          </div>
        </header>

        {/* Timeline */}
        <section className="py-12 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mb-10">
            Timeline
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
                  <h3 className="text-base font-medium text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="py-12 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mb-10">
            Skills &amp; tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-medium text-foreground mb-3">
                  {group.category}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {group.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Music */}
        <section className="py-12 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mb-6">
            Music
          </h2>
          <p className="text-foreground/70 leading-relaxed mb-8 max-w-xl">
            Four instruments, twelve years of practice. Music has been a
            constant since I was four.
          </p>
          <div className="space-y-3">
            {music.map((item) => (
              <div
                key={item.instrument}
                className="grid grid-cols-12 gap-4 md:gap-8 items-baseline py-3 border-b border-border last:border-0"
              >
                <div className="col-span-6 md:col-span-3">
                  <p className="font-medium text-foreground">{item.instrument}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-sm text-foreground/70">{item.detail}</p>
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

        <div className="py-12 border-t border-border">
          <p className="text-foreground/70 leading-relaxed mb-5">
            Want to collaborate? I&apos;m open to talking about projects,
            technical challenges, or anything at the intersection of
            computer vision, wearables, and software.
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
  );
}
