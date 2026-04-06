import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-background overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-32 bg-accent/2 blur-[80px] pointer-events-none" aria-hidden="true" />

      {/* Giant editorial wordmark */}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-2 overflow-hidden">
        <p
          className="font-display font-bold text-border/10 select-none leading-[0.85] tracking-tighter whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 11vw, 8.5rem)" }}
          aria-hidden="true"
        >
          ChargerTools
        </p>
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-14">
          {/* Identity — wide col */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="font-display font-bold text-accent text-base">K</span>
              <span className="text-muted-foreground/25 font-light">/</span>
              <span className="text-sm font-medium text-foreground/80">ChargerTools LLC</span>
            </div>
            <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-xs">
              Building personal technology at the intersection of hardware and
              software. Wearable systems, native apps, AI tools.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-mono text-emerald-400/60">
                Open to collaboration
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Pages */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">
              Pages
            </p>
            <div className="flex flex-col gap-3">
              {[
                { href: "/products", label: "Work" },
                { href: "/about", label: "About" },
                { href: "/blog", label: "Writing" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-muted-foreground/55 hover:text-foreground transition-colors link-underline w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">
              Connect
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/chargertools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground/55 hover:text-foreground transition-colors inline-flex items-center gap-1 group w-fit"
              >
                GitHub
                <ArrowUpRight
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground/55 hover:text-foreground transition-colors w-fit link-underline"
              >
                Email
              </Link>
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] mb-5">
              Location
            </p>
            <p className="text-sm text-muted-foreground/55">San Jose, CA</p>
            <p className="text-xs font-mono text-muted-foreground/35 mt-1.5">
              UTC −8 / −7
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-muted-foreground/35">
            &copy; {year} ChargerTools LLC — All rights reserved
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/20">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
