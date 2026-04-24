import Link from "next/link";
import { ProjectGlyph } from "./project-glyph";

const CURRENTLY = [
  { label: "Building", body: "Meridian", href: "/products/meridian" },
  { label: "Shipping", body: "Probe", href: "/products/probe" },
  { label: "Reading", body: "Antenna theory" },
];

export function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Issue stamp */}
        <div
          className="flex items-center justify-between gap-4 pb-8 border-b border-border animate-fade-in"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            ChargerTools <span className="text-border mx-2">·</span> Vol. 01{" "}
            <span className="text-border mx-2">·</span> Apr 2026
          </p>
          <p className="hidden sm:flex font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
            </span>
            Open to collaboration
          </p>
        </div>

        {/* Editorial nameplate — the centerpiece */}
        <div
          className="pt-12 md:pt-16 pb-10 md:pb-14 animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          <h1 className="font-serif tracking-tightest leading-[0.85] text-foreground">
            <span
              className="block"
              style={{ fontSize: "clamp(4.5rem, 16vw, 14rem)" }}
            >
              Kaden
            </span>
            <span
              className="block italic text-accent"
              style={{ fontSize: "clamp(4.5rem, 16vw, 14rem)" }}
            >
              MacLean
            </span>
          </h1>
        </div>

        {/* Asymmetric body grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 pt-8 border-t border-border">
          {/* Manifesto pull-quote */}
          <div
            className="col-span-12 md:col-span-7 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <p className="font-serif text-2xl md:text-[2rem] text-foreground leading-[1.18] tracking-tight">
              I build things that sit at the intersection of{" "}
              <em className="text-accent not-italic">hardware</em>,{" "}
              <em className="text-accent not-italic">software</em>, and{" "}
              <em className="text-accent italic">human movement</em>
              <span className="text-accent">.</span>
            </p>
            <div className="mt-8 space-y-4 text-foreground/80 leading-[1.7] max-w-xl">
              <p>
                I&apos;m a junior at Bellarmine College Prep, the co-founder
                and engineering lead of{" "}
                <Link
                  href="/products/hyperform-fitness"
                  className="text-foreground link-underline"
                >
                  Hyperform Fitness
                </Link>{" "}
                — a computer-vision platform that watches a lifter mid-set and
                corrects their form before the rep is over. Over a million reps
                analyzed across pilot installations.
              </p>
              <p>
                Outside of that, I run{" "}
                <span className="text-foreground">ChargerTools LLC</span>,
                where I build native Mac apps —{" "}
                <Link
                  href="/products/meridian"
                  className="text-foreground link-underline"
                >
                  Meridian
                </Link>
                ,{" "}
                <Link
                  href="/products/probe"
                  className="text-foreground link-underline"
                >
                  Probe
                </Link>
                ,{" "}
                <Link
                  href="/products/futz"
                  className="text-foreground link-underline"
                >
                  Futz
                </Link>{" "}
                — and tinker with wearable AR, optics, and RF.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-medium text-foreground link-underline"
              >
                See the work →
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                About me
              </Link>
              <Link
                href="/now"
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Now
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Say hi
              </Link>
            </div>
          </div>

          {/* Sidebar: currently + bench card */}
          <aside
            className="col-span-12 md:col-span-4 md:col-start-9 animate-fade-in-up"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="border-l-2 border-accent pl-5 mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Currently
              </p>
              <ul className="space-y-2.5 text-sm">
                {CURRENTLY.map((c) => (
                  <li key={c.label} className="flex gap-3 items-baseline">
                    <span className="font-mono text-[10px] text-accent uppercase tracking-widest w-16 shrink-0">
                      {c.label}
                    </span>
                    {c.href ? (
                      <Link
                        href={c.href}
                        className="text-foreground link-underline"
                      >
                        {c.body}
                      </Link>
                    ) : (
                      <span className="text-foreground/85">{c.body}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bench / workshop card */}
            <div className="border border-border rounded-md p-5 bg-card/30">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  At the bench
                </p>
                <p className="font-mono text-[10px] text-accent">live</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-foreground/80">
                <div className="flex items-center gap-2 text-accent/80">
                  <ProjectGlyph slug="zenith" size={28} />
                </div>
                <div className="flex items-center gap-2 text-accent/80">
                  <ProjectGlyph slug="ar-glasses" size={28} />
                </div>
                <div className="flex items-center gap-2 text-accent/80">
                  <ProjectGlyph slug="probe" size={28} />
                </div>
                <div className="flex items-center gap-2 text-accent/80">
                  <ProjectGlyph slug="meridian" size={28} />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Lathe, soldering iron, an iPhone 15 Pro Max, a 14&quot; M3
                MacBook Pro, and too many half-built FRC robots.
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom microdata strip */}
        <div className="mt-16 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-[11px] font-mono text-muted-foreground">
          <div>
            <p className="text-muted-foreground/55 mb-1">Located</p>
            <p className="text-foreground/80">Soquel, CA</p>
          </div>
          <div>
            <p className="text-muted-foreground/55 mb-1">Affiliated</p>
            <p className="text-foreground/80">FRC 254 · Bellarmine &apos;27</p>
          </div>
          <div>
            <p className="text-muted-foreground/55 mb-1">Stack</p>
            <p className="text-foreground/80">Swift · Python · CV</p>
          </div>
          <div>
            <p className="text-muted-foreground/55 mb-1">Contact</p>
            <p className="text-foreground/80">kadenmac0077@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
