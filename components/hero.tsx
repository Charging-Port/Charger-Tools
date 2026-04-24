import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-36 md:pt-44 pb-12 md:pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-mono text-xs text-muted-foreground mb-8 flex items-center gap-2 animate-fade-in">
          <span className="inline-block w-6 h-px bg-accent" />
          Kaden MacLean — Soquel, CA
        </p>

        <h1
          className="font-serif text-4xl sm:text-5xl md:text-[3.75rem] leading-[1.05] tracking-tightest text-foreground max-w-4xl animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          I build <em className="text-accent not-italic">native macOS apps</em>,{" "}
          <em className="text-accent not-italic">computer-vision systems</em>,
          and the occasional{" "}
          <em className="text-accent italic">pair of AR glasses</em>.
        </h1>

        <div
          className="mt-9 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="md:col-span-8 space-y-4 text-foreground/75 leading-[1.7]">
            <p>
              Junior at Bellarmine College Prep. Co-founder and engineering
              lead of{" "}
              <Link
                href="/products/hyperform-fitness"
                className="text-foreground link-underline"
              >
                Hyperform Fitness
              </Link>
              , a CV platform that watches a lifter mid-set and corrects their
              form before the rep is over — over a million reps analyzed
              across pilot installations.
            </p>
            <p>
              Under <span className="text-foreground">ChargerTools LLC</span> I
              ship native Mac apps —{" "}
              <Link href="/products/meridian" className="text-foreground link-underline">
                Meridian
              </Link>
              ,{" "}
              <Link href="/products/probe" className="text-foreground link-underline">
                Probe
              </Link>
              ,{" "}
              <Link href="/products/zenith" className="text-foreground link-underline">
                Zenith
              </Link>
              ,{" "}
              <Link href="/products/futz" className="text-foreground link-underline">
                Futz
              </Link>
              {" "}— and tinker with wearable AR, optics, and RF on the side.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link
                href="/products"
                className="font-medium text-foreground link-underline"
              >
                See the work →
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                About
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

          {/* Currently sidebar — quietly pinned */}
          <aside className="md:col-span-4 md:border-l md:border-border md:pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Currently
            </p>
            <ul className="space-y-2 text-[13px]">
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest w-14 shrink-0 pt-0.5">
                  Building
                </span>
                <Link href="/products/meridian" className="text-foreground link-underline">
                  Meridian
                </Link>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest w-14 shrink-0 pt-0.5">
                  Shipping
                </span>
                <Link href="/products/probe" className="text-foreground link-underline">
                  Probe
                </Link>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest w-14 shrink-0 pt-0.5">
                  Reading
                </span>
                <span className="text-foreground/85">Antenna theory</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
