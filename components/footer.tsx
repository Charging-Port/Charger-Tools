import Link from "next/link";
import { ArrowUpRight, Github, Mail, MapPin } from "lucide-react";
import { YearProgress } from "./year-progress";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 bg-background overflow-hidden">
      <div
        className="absolute bottom-0 left-1/3 w-1/2 h-48 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--accent) / 0.08), transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Giant editorial wordmark */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-20 pb-4 overflow-hidden">
        <p
          className="font-editorial italic text-foreground/8 select-none leading-[0.85] tracking-tight whitespace-nowrap"
          style={{ fontSize: "clamp(3.5rem, 14vw, 11rem)" }}
          aria-hidden="true"
        >
          ChargerTools
        </p>
      </div>

      {/* Year progress */}
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <YearProgress />
      </div>

      {/* Content grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-12 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-14">
          {/* Identity — wide col */}
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rounded-md bg-accent/15" />
                <div className="absolute inset-0 grid place-items-center font-display font-bold text-accent text-sm">
                  K
                </div>
              </div>
              <span className="text-sm font-medium text-foreground/85">ChargerTools LLC</span>
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed max-w-xs font-editorial italic">
              Building personal technology at the intersection of hardware,
              software, and human movement.
            </p>
            <div className="flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/8 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-mono text-accent/85">
                Open to collaboration
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Pages */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-accent/80 uppercase tracking-[0.2em] mb-5">
              ◆ pages
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
                  className="text-sm text-foreground/65 hover:text-accent transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-accent/80 uppercase tracking-[0.2em] mb-5">
              ◇ connect
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/chargertools"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/65 hover:text-accent transition-colors inline-flex items-center gap-1.5 group w-fit"
              >
                <Github size={13} />
                GitHub
                <ArrowUpRight
                  size={11}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                href="mailto:kadenmac0077@gmail.com"
                className="text-sm text-foreground/65 hover:text-accent transition-colors inline-flex items-center gap-1.5 w-fit"
              >
                <Mail size={13} />
                Email
              </a>
              <Link
                href="/contact"
                className="text-sm text-foreground/65 hover:text-accent transition-colors w-fit"
              >
                Form
              </Link>
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-accent/80 uppercase tracking-[0.2em] mb-5">
              ▣ location
            </p>
            <p className="text-sm text-foreground/65 inline-flex items-center gap-1.5">
              <MapPin size={13} />
              Soquel, CA
            </p>
            <p className="text-xs font-mono text-muted-foreground/55 mt-1.5">
              UTC −8 / −7
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-border/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-muted-foreground/50">
            &copy; {year} ChargerTools LLC — All rights reserved
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/40">
            Built with Next.js · Try{" "}
            <kbd className="bg-muted/50 border border-border/60 px-1 py-0.5 rounded text-[9px]">⌘</kbd>{" "}
            <kbd className="bg-muted/50 border border-border/60 px-1 py-0.5 rounded text-[9px]">K</kbd>
          </p>
        </div>
      </div>
    </footer>
  );
}
