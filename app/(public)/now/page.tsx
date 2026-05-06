import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteText } from "@/lib/site-text";

export const metadata: Metadata = {
  title: "Now",
  description: "What Kaden MacLean is currently working on, reading, and thinking about.",
};

export default function NowPage() {
  const text = getSiteText();
  const now = text.now;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Home
        </Link>

        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4">
            {now.updatedLabel}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tightest text-foreground leading-[1.0]">
            What I&apos;m doing,{" "}
            <em className="text-accent">right now</em>.
          </h1>
          <p className="mt-6 text-foreground/75 leading-relaxed max-w-xl">
            {now.intro}
          </p>
        </header>

        <div className="space-y-16">
          {now.sections.map((section) => (
            <section key={section.label}>
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  {section.label}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[11px] text-muted-foreground/70">
                  {section.items.length}
                </span>
              </div>
              <ul className="space-y-7">
                {section.items.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-12 gap-4 md:gap-6"
                  >
                    <div className="col-span-12 md:col-span-4">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="font-serif text-xl md:text-2xl text-foreground hover:text-accent transition-colors leading-tight"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="font-serif text-xl md:text-2xl text-foreground leading-tight">
                          {item.title}
                        </span>
                      )}
                    </div>
                    <p className="col-span-12 md:col-span-8 text-foreground/75 leading-relaxed text-[15px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
