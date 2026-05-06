import Link from "next/link";
import { HeroCanvas } from "@/components/hero-canvas";
import { StudioClock } from "@/components/studio-clock";
import { getSiteText } from "@/lib/site-text";
import type { ReactNode } from "react";

/**
 * Render a small inline-markup string. Supports:
 *   {accent:text}    → emphasized accent run (italic-friendly headline word)
 *   {italic:text}    → italic text in accent
 *   {strong:text}    → bold foreground text
 *   {link:/path:label} → internal Next.js link
 */
function renderInline(input: string): ReactNode[] {
  const out: ReactNode[] = [];
  const regex = /\{(accent|italic|strong|link):([^}]+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) out.push(input.slice(lastIndex, match.index));
    const [, kind, payload] = match;
    if (kind === "accent") {
      out.push(
        <em key={key++} className="text-accent not-italic">
          {payload}
        </em>
      );
    } else if (kind === "italic") {
      out.push(
        <em key={key++} className="text-accent italic">
          {payload}
        </em>
      );
    } else if (kind === "strong") {
      out.push(
        <span key={key++} className="text-foreground">
          {payload}
        </span>
      );
    } else if (kind === "link") {
      const split = payload.indexOf(":");
      if (split !== -1) {
        const href = payload.slice(0, split);
        const label = payload.slice(split + 1);
        out.push(
          <Link key={key++} href={href} className="text-foreground link-underline">
            {label}
          </Link>
        );
      } else {
        out.push(payload);
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) out.push(input.slice(lastIndex));
  return out;
}

export function Hero() {
  const text = getSiteText();
  const hero = text.hero;

  return (
    <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 overflow-hidden">
      <HeroCanvas />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-8 animate-fade-in">
          <StudioClock />
        </div>

        <h1
          className="font-serif text-4xl sm:text-5xl md:text-[3.75rem] leading-[1.05] tracking-tightest text-foreground max-w-4xl animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          {renderInline(hero.headline)}
        </h1>

        <div
          className="mt-9 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="md:col-span-8 space-y-4 text-foreground/75 leading-[1.7]">
            <p>{renderInline(hero.intro1)}</p>
            <p>{renderInline(hero.intro2)}</p>
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

          <aside className="md:col-span-4 md:border-l md:border-border md:pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Currently
            </p>
            <ul className="space-y-2 text-[13px]">
              {hero.currently.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest w-14 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-foreground link-underline"
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <span className="text-foreground/85">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
