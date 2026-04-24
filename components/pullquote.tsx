export function Pullquote() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-1">
            <span
              aria-hidden="true"
              className="font-serif italic text-accent leading-none block"
              style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}
            >
              &ldquo;
            </span>
          </div>
          <blockquote className="col-span-12 md:col-span-11 md:pl-2">
            <p className="font-serif text-foreground tracking-tight leading-[1.15]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}>
              The trick isn&apos;t making things people pay attention to —
              it&apos;s making things people <em className="text-accent">use</em>.
              Real tools, on the device they already own, built so they get
              out of the way of the work.
            </p>
            <footer className="mt-8 flex items-center gap-3 text-sm">
              <span className="h-px w-8 bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Kaden, on what ChargerTools is for
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
