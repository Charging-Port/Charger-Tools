import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-36 md:pt-44 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Tiny intro line — like a printed greeting */}
        <p className="font-mono text-xs text-muted-foreground mb-8 flex items-center gap-2 animate-fade-in">
          <span className="inline-block w-6 h-px bg-accent" />
          Hello, I&apos;m Kaden — based in Soquel, CA.
        </p>

        <h1
          className="font-serif text-[2.5rem] sm:text-5xl md:text-[3.5rem] leading-[1.05] tracking-tightest text-foreground animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          I build things that sit at the intersection of{" "}
          <em className="text-accent not-italic">hardware</em>,{" "}
          <em className="text-accent not-italic">software</em>, and{" "}
          <em className="text-accent italic">human movement</em>
          <span className="text-accent">.</span>
        </h1>

        <div
          className="mt-10 space-y-5 text-foreground/80 leading-[1.7] animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <p>
            I&apos;m a junior at Bellarmine College Prep and the co-founder
            and engineering lead of{" "}
            <Link
              href="/products/hyperform-fitness"
              className="text-foreground link-underline"
            >
              Hyperform Fitness
            </Link>
            , a computer-vision platform that watches a lifter mid-set and
            corrects their form before the rep is over. We&apos;ve analyzed
            over a million reps across pilot installations in commercial gyms,
            rehab centers, and sports medicine programs.
          </p>
          <p>
            Outside of that, I run{" "}
            <span className="text-foreground">ChargerTools LLC</span> — where
            I build{" "}
            <Link href="/products/meridian" className="text-foreground link-underline">
              Meridian
            </Link>{" "}
            (a calm, keyboard-first life-OS for macOS),{" "}
            <Link href="/products/probe" className="text-foreground link-underline">
              Probe
            </Link>{" "}
            (a notch-anchored class copilot that runs entirely on-device), and
            a small library of native Mac apps and physics simulators.
          </p>
          <p>
            I&apos;m also on{" "}
            <span className="text-foreground">FRC Team 254</span>, the
            principal bassist of BCP Chamber Orchestra, and a classical pianist
            since I was four. There&apos;s a thread between practicing a Chopin
            etude and debugging a pose-estimation pipeline that I find hard
            to articulate but easy to feel.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-medium text-foreground link-underline"
          >
            See the work →
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            About me
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            Say hi
          </Link>
        </div>
      </div>
    </section>
  );
}
