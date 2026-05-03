"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroCanvas } from "@/components/hero-canvas";
import { StudioClock } from "@/components/studio-clock";
import { useAdmin } from "@/components/admin/admin-context";
import { EditableText } from "@/components/admin/editable-text";
import {
  EditableCurrently,
  EditableHeadline,
  EditableParagraphs,
} from "@/components/admin/editable-hero";
import type { HeroContent } from "@/lib/content";

export function Hero({ initial }: { initial: HeroContent }) {
  const { save } = useAdmin();
  const [hero, setHero] = useState<HeroContent>(initial);

  const commit = async (next: HeroContent) => {
    setHero(next); // optimistic
    const ok = await save("hero", next);
    if (!ok) setHero(initial); // revert on failure
  };

  return (
    <section className="relative pt-36 md:pt-44 pb-12 md:pb-16 overflow-hidden">
      <HeroCanvas />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-8 animate-fade-in">
          <StudioClock />
        </div>

        <EditableHeadline
          value={hero.headline}
          onCommit={(headline) => commit({ ...hero, headline })}
          className="font-serif text-4xl sm:text-5xl md:text-[3.75rem] leading-[1.05] tracking-tightest text-foreground max-w-4xl animate-fade-in-up"
        />

        <div
          className="mt-9 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="md:col-span-8 space-y-4 text-foreground/75 leading-[1.7]">
            <EditableParagraphs
              values={hero.intro}
              onCommit={(intro) => commit({ ...hero, intro })}
              containerClassName="space-y-4"
              paragraphClassName=""
              placeholder="Intro paragraph"
            />
            <NavLinks
              hero={hero}
              onChangeLabel={(idx, label) => {
                const links = hero.links.map((l, i) =>
                  i === idx ? { ...l, label } : l
                );
                return commit({ ...hero, links });
              }}
            />
          </div>

          <EditableCurrently hero={hero} onCommit={commit} />
        </div>
      </div>
    </section>
  );
}

function NavLinks({
  hero,
  onChangeLabel,
}: {
  hero: HeroContent;
  onChangeLabel: (idx: number, label: string) => Promise<void>;
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;

  return (
    <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      {hero.links.map((link, i) => {
        const className =
          i === 0
            ? "font-medium text-foreground link-underline"
            : "text-muted-foreground hover:text-foreground transition-colors link-underline";
        if (editable) {
          return (
            <EditableText
              key={i}
              as="span"
              value={link.label}
              onCommit={(label) => void onChangeLabel(i, label)}
              className={className}
              placeholder="Link label"
            />
          );
        }
        return (
          <Link key={i} href={link.href} className={className}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
