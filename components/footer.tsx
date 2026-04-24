import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-5xl px-6 pt-14 pb-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <p className="font-serif text-2xl text-foreground mb-3">
              Kaden MacLean
            </p>
            <p className="text-sm text-foreground/65 leading-relaxed max-w-sm">
              Building under{" "}
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
              Colophon
            </p>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              Fraunces, Inter &amp; JetBrains Mono.<br />
              Built with Next.js + Tailwind.<br />
              Hosted on Vercel.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground/70">
          <p>© {year} ChargerTools LLC.</p>
          <p className="flex items-center gap-3 flex-wrap">
            <span>
              <span className="font-mono text-muted-foreground/60">⌘K</span>{" "}
              to navigate
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>
              <span className="font-mono text-muted-foreground/60">?</span>{" "}
              for shortcuts
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
