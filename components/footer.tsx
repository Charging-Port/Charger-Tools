import Link from "next/link";

const COLOPHON = [
  { k: "Type", v: "Fraunces · Inter · JetBrains Mono" },
  { k: "Built with", v: "Next.js · Tailwind · Lenis" },
  { k: "Hosting", v: "Vercel" },
  { k: "Source", v: "github.com/chargertools" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-3xl px-6 pt-14 pb-10">
        {/* Top row: signature + nav */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-12">
          <div className="col-span-12 md:col-span-7">
            <p
              aria-hidden="true"
              className="font-serif italic text-5xl text-accent/80 leading-none mb-4 select-none"
            >
              K.
            </p>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-sm">
              Kaden MacLean — building under{" "}
              <span className="text-foreground">ChargerTools LLC</span> in
              Soquel, CA. Usually at a workbench, a lathe, or a lifter&apos;s
              squat rack; occasionally at a piano.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Site
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Work</Link></li>
              <li><Link href="/about" className="text-foreground/75 hover:text-foreground transition-colors link-underline">About</Link></li>
              <li><Link href="/blog" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Writing</Link></li>
              <li><Link href="/contact" className="text-foreground/75 hover:text-foreground transition-colors link-underline">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
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
            <p>© {year} ChargerTools LLC.</p>
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
