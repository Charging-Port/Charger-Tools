import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-40 md:pt-48 pb-20 md:pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-sm font-mono text-muted-foreground mb-6 animate-fade-in">
          Kaden MacLean
        </p>

        <h1
          className="font-serif text-[2.75rem] sm:text-5xl md:text-[3.75rem] leading-[1.05] tracking-tightest text-foreground animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          Building things at the intersection of{" "}
          <span className="italic text-accent">hardware</span>,{" "}
          <span className="italic text-accent">software</span>, and{" "}
          <span className="italic text-accent">human movement</span>.
        </h1>

        <div
          className="mt-10 space-y-4 text-foreground/75 leading-relaxed animate-fade-in-up max-w-2xl"
          style={{ animationDelay: "0.15s" }}
        >
          <p>
            I&apos;m a junior at Bellarmine College Prep. I co-founded{" "}
            <Link
              href="/products/hyperform-fitness"
              className="text-foreground link-underline"
            >
              Hyperform Fitness
            </Link>{" "}
            — a computer-vision platform that gives athletes corrective
            feedback in real time, with over 1M reps analyzed across pilot
            installations.
          </p>
          <p>
            Under{" "}
            <span className="text-foreground">ChargerTools LLC</span>, I build
            wearable AR systems, native macOS tools, and on-device AI. Outside
            engineering: FRC Team 254, classical piano since age four, and the
            principal bassist of BCP Chamber Orchestra.
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
            See the work
            <ArrowRight size={14} />
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
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
