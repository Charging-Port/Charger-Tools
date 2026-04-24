import Link from "next/link";

const COLOPHON = [
  { k: "Type", v: "Fraunces · Inter · JetBrains Mono" },
  { k: "Built with", v: "Next.js · Tailwind · Lenis" },
  { k: "Hosting", v: "Vercel" },
  { k: "Source", v: "github.com/chargertools" },
];

function Signature() {
  // Hand-drawn-style "Kaden" signature in SVG. Stroked path so it renders
  // crisply on any background and inherits currentColor.
  return (
    <svg
      viewBox="0 0 200 60"
      className="w-32 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Kaden's signature"
    >
      <path d="M10 45 C 14 22, 16 18, 22 18 L 22 48 M 22 32 C 28 22, 36 24, 36 32 C 36 40, 28 46, 22 38" />
      <path d="M44 28 C 44 18, 56 18, 58 26 L 58 46 M 58 30 C 50 30, 44 36, 50 44 C 56 50, 60 42, 58 38" />
      <path d="M70 50 L 70 14 M 70 32 C 76 22, 86 22, 92 30 C 96 36, 90 48, 84 48" />
      <path d="M104 30 C 100 30, 96 38, 102 44 C 110 48, 116 36, 112 28 C 108 22, 100 24, 100 32 M 116 30 L 116 50" />
      <path d="M126 50 C 126 30, 138 22, 144 30 L 144 48 M 144 32 C 152 22, 162 28, 162 36 L 162 50" />
      <path d="M170 48 C 188 50, 196 38, 184 32" stroke="currentColor" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        {/* Big editorial signoff */}
        <div className="mb-14 pb-12 border-b border-border">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6">
            Until next time
          </p>
          <p
            className="font-serif tracking-tightest text-foreground/85 leading-[0.92] mb-8"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            Thanks for <em className="text-accent italic">scrolling</em>.
          </p>
          <Signature />
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-12">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Find me
            </p>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-sm">
              Kaden MacLean — building under{" "}
              <span className="text-foreground">ChargerTools LLC</span> in
              Soquel, CA. Usually at a workbench, a lathe, or a lifter&apos;s
              squat rack; occasionally at a piano.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Site
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Work</Link></li>
              <li><Link href="/about" className="text-foreground/75 hover:text-foreground transition-colors link-underline">About</Link></li>
              <li><Link href="/now" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Now</Link></li>
              <li><Link href="/blog" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Writing</Link></li>
              <li><Link href="/contact" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Elsewhere
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:kadenmac0077@gmail.com"
                  className="text-foreground/75 hover:text-foreground transition-colors link-underline"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/chargertools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/75 hover:text-foreground transition-colors link-underline"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://hyperformfit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/75 hover:text-foreground transition-colors link-underline"
                >
                  Hyperform
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Newsletter
            </p>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Occasional notes when I ship something new — head to{" "}
              <Link href="/" className="text-foreground link-underline">
                the homepage
              </Link>{" "}
              to subscribe.
            </p>
          </div>
        </div>

        {/* Colophon */}
        <div className="border-t border-border pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-muted-foreground mb-6">
            {COLOPHON.map((row) => (
              <div key={row.k} className="flex gap-3">
                <dt className="text-muted-foreground/60 w-20 shrink-0">{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground/70">
            <p>© {year} ChargerTools LLC. All rights reserved.</p>
            <p>
              <span className="font-mono text-muted-foreground/60">⌘K</span>{" "}
              to navigate anywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
