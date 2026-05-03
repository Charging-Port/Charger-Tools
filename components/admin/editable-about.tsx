"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";
import { HeadlineRender, EditableParagraphs } from "./editable-hero";
import type { AboutContent } from "@/lib/content";

/**
 * Full /about page renderer with admin-aware inline editing for every prose
 * block, the timeline, the skills groups, and the music list.
 */
export function EditableAbout({ initial }: { initial: AboutContent }) {
  const { save, authed, editMode } = useAdmin();
  const [about, setAbout] = useState<AboutContent>(initial);
  const editable = authed && editMode;

  const commit = async (next: AboutContent) => {
    setAbout(next);
    const ok = await save("about", next);
    if (!ok) setAbout(initial);
  };

  return (
    <>
      <header className="mb-16">
        <EditableText
          as="p"
          value={about.eyebrow}
          onCommit={(eyebrow) => commit({ ...about, eyebrow })}
          className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4"
          placeholder="Eyebrow"
        />
        {editable ? (
          <EditableText
            as="h1"
            value={about.title}
            onCommit={(title) => commit({ ...about, title })}
            className="font-serif tracking-tightest text-foreground leading-[0.92]"
            placeholder="Page title"
          />
        ) : (
          <h1
            className="font-serif tracking-tightest text-foreground leading-[0.92]"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            <HeadlineRender headline={about.title} />
          </h1>
        )}
      </header>

      <div className="grid grid-cols-12 gap-6 md:gap-12 mb-24 border-t border-border pt-12">
        <div className="col-span-12 md:col-span-8">
          <EditableText
            as="p"
            multiline
            value={about.lead}
            onCommit={(lead) => commit({ ...about, lead })}
            className="text-2xl md:text-3xl font-serif italic text-foreground leading-[1.2] mb-8"
            placeholder="Lead paragraph"
          />
          <EditableParagraphs
            values={about.paragraphs}
            onCommit={(paragraphs) => commit({ ...about, paragraphs })}
            containerClassName="space-y-5 text-foreground/85 leading-[1.75] text-[17px]"
            paragraphClassName=""
            placeholder="Paragraph"
          />
        </div>

        <aside className="col-span-12 md:col-span-4 space-y-8">
          <figure className="border border-border rounded-md bg-card/40 overflow-hidden">
            <div className="aspect-[4/3] grid place-items-center bg-card/40 relative overflow-hidden">
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full text-border/60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="hatch"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="14"
                      stroke="currentColor"
                      strokeWidth="0.6"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hatch)" opacity="0.5" />
              </svg>
              <Camera size={20} className="text-muted-foreground/60 relative z-10" />
            </div>
            <figcaption className="px-4 py-3 border-t border-border text-[11px] font-mono text-muted-foreground flex items-center justify-between">
              <span>At the bench / 2026</span>
              <span className="text-muted-foreground/55">photo</span>
            </figcaption>
          </figure>

          <div className="border-l-2 border-accent pl-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Quick facts
            </p>
            <dl className="space-y-2.5 text-[13px]">
              {about.quickFacts.map((f, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${editable ? "ct-editable-row" : ""}`}
                >
                  <EditableText
                    as="dt"
                    value={f.k}
                    onCommit={(k) => {
                      const quickFacts = about.quickFacts.map((x, j) =>
                        j === i ? { ...x, k } : x
                      );
                      return commit({ ...about, quickFacts });
                    }}
                    className="font-mono text-[11px] text-muted-foreground/70 w-20 shrink-0"
                    placeholder="Key"
                  />
                  <EditableText
                    as="dd"
                    value={f.v}
                    onCommit={(v) => {
                      const quickFacts = about.quickFacts.map((x, j) =>
                        j === i ? { ...x, v } : x
                      );
                      return commit({ ...about, quickFacts });
                    }}
                    className="text-foreground/85 flex-1"
                    placeholder="Value"
                  />
                  {editable && (
                    <button
                      type="button"
                      onClick={() => {
                        const quickFacts = about.quickFacts.filter(
                          (_, j) => j !== i
                        );
                        return commit({ ...about, quickFacts });
                      }}
                      className="ct-row-action shrink-0"
                      aria-label="Remove fact"
                      title="Remove"
                    >
                      <span className="text-[10px]">×</span>
                    </button>
                  )}
                </div>
              ))}
              {editable && (
                <button
                  type="button"
                  onClick={() =>
                    commit({
                      ...about,
                      quickFacts: [
                        ...about.quickFacts,
                        { k: "Key", v: "Value" },
                      ],
                    })
                  }
                  className="ct-row-add"
                >
                  + Add fact
                </button>
              )}
            </dl>
          </div>

          <EditableText
            as="p"
            multiline
            value={about.pullQuote}
            onCommit={(pullQuote) => commit({ ...about, pullQuote })}
            className="text-xs text-muted-foreground italic font-serif leading-relaxed"
            placeholder="Pull quote"
          />
        </aside>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Timeline */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Timeline
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground mb-10">
            The path so far.
          </h2>
          <div className="space-y-10">
            {about.timeline.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-12 gap-4 md:gap-8 ${editable ? "ct-editable-row relative" : ""}`}
              >
                <div className="col-span-12 md:col-span-3">
                  <EditableText
                    as="p"
                    value={item.period}
                    onCommit={(period) => {
                      const timeline = about.timeline.map((x, j) =>
                        j === i ? { ...x, period } : x
                      );
                      return commit({ ...about, timeline });
                    }}
                    className="font-mono text-xs text-muted-foreground"
                    placeholder="Period"
                  />
                </div>
                <div className="col-span-12 md:col-span-9">
                  <EditableText
                    as="h3"
                    value={item.title}
                    onCommit={(title) => {
                      const timeline = about.timeline.map((x, j) =>
                        j === i ? { ...x, title } : x
                      );
                      return commit({ ...about, timeline });
                    }}
                    className="font-serif text-xl text-foreground mb-2"
                    placeholder="Title"
                  />
                  <EditableText
                    as="p"
                    multiline
                    value={item.description}
                    onCommit={(description) => {
                      const timeline = about.timeline.map((x, j) =>
                        j === i ? { ...x, description } : x
                      );
                      return commit({ ...about, timeline });
                    }}
                    className="text-sm text-foreground/75 leading-relaxed"
                    placeholder="Description"
                  />
                </div>
                {editable && (
                  <button
                    type="button"
                    onClick={() => {
                      const timeline = about.timeline.filter(
                        (_, j) => j !== i
                      );
                      return commit({ ...about, timeline });
                    }}
                    className="ct-row-action absolute top-0 right-0"
                    aria-label="Remove timeline entry"
                    title="Remove"
                  >
                    <span className="text-[10px]">×</span>
                  </button>
                )}
              </div>
            ))}
            {editable && (
              <button
                type="button"
                onClick={() =>
                  commit({
                    ...about,
                    timeline: [
                      ...about.timeline,
                      {
                        period: "Period",
                        title: "Title",
                        description: "Description",
                      },
                    ],
                  })
                }
                className="ct-row-add"
              >
                + Add timeline entry
              </button>
            )}
          </div>
        </section>

        {/* Skills */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Skills &amp; tools
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.skills.map((group, i) => (
              <div key={i} className={editable ? "ct-editable-row relative" : ""}>
                <EditableText
                  as="h3"
                  value={group.category}
                  onCommit={(category) => {
                    const skills = about.skills.map((x, j) =>
                      j === i ? { ...x, category } : x
                    );
                    return commit({ ...about, skills });
                  }}
                  className="font-serif text-xl text-foreground mb-3"
                  placeholder="Category"
                />
                <EditableText
                  as="p"
                  multiline
                  value={group.items.join(" · ")}
                  onCommit={(joined) => {
                    const items = joined
                      .split("·")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const skills = about.skills.map((x, j) =>
                      j === i ? { ...x, items } : x
                    );
                    return commit({ ...about, skills });
                  }}
                  className="text-sm text-foreground/75 leading-relaxed"
                  placeholder="Items separated by ·"
                />
                {editable && (
                  <button
                    type="button"
                    onClick={() => {
                      const skills = about.skills.filter((_, j) => j !== i);
                      return commit({ ...about, skills });
                    }}
                    className="ct-row-action absolute top-0 right-0"
                    aria-label="Remove skill group"
                    title="Remove"
                  >
                    <span className="text-[10px]">×</span>
                  </button>
                )}
              </div>
            ))}
            {editable && (
              <button
                type="button"
                onClick={() =>
                  commit({
                    ...about,
                    skills: [
                      ...about.skills,
                      { category: "New category", items: [] },
                    ],
                  })
                }
                className="ct-row-add"
              >
                + Add skill group
              </button>
            )}
          </div>
        </section>

        {/* Music */}
        <section className="py-12 border-t border-border">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Music
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="font-serif text-2xl md:text-3xl text-foreground italic leading-snug mb-8">
            Four instruments, twelve years of practice.
          </p>
          <div>
            {about.music.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-12 gap-4 md:gap-8 items-baseline py-4 border-b border-border last:border-0 ${editable ? "ct-editable-row relative" : ""}`}
              >
                <div className="col-span-6 md:col-span-3">
                  <EditableText
                    as="p"
                    value={item.instrument}
                    onCommit={(instrument) => {
                      const music = about.music.map((x, j) =>
                        j === i ? { ...x, instrument } : x
                      );
                      return commit({ ...about, music });
                    }}
                    className="font-serif text-xl text-foreground"
                    placeholder="Instrument"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <EditableText
                    as="p"
                    value={item.detail}
                    onCommit={(detail) => {
                      const music = about.music.map((x, j) =>
                        j === i ? { ...x, detail } : x
                      );
                      return commit({ ...about, music });
                    }}
                    className="text-sm text-foreground/75"
                    placeholder="Detail"
                  />
                </div>
                <div className="col-span-6 md:col-span-3 md:text-right">
                  <EditableText
                    as="p"
                    value={item.period}
                    onCommit={(period) => {
                      const music = about.music.map((x, j) =>
                        j === i ? { ...x, period } : x
                      );
                      return commit({ ...about, music });
                    }}
                    className="font-mono text-xs text-muted-foreground"
                    placeholder="Period"
                  />
                </div>
                {editable && (
                  <button
                    type="button"
                    onClick={() => {
                      const music = about.music.filter((_, j) => j !== i);
                      return commit({ ...about, music });
                    }}
                    className="ct-row-action absolute top-3 right-0"
                    aria-label="Remove instrument"
                    title="Remove"
                  >
                    <span className="text-[10px]">×</span>
                  </button>
                )}
              </div>
            ))}
            {editable && (
              <button
                type="button"
                onClick={() =>
                  commit({
                    ...about,
                    music: [
                      ...about.music,
                      {
                        instrument: "Instrument",
                        period: "Period",
                        detail: "Detail",
                      },
                    ],
                  })
                }
                className="ct-row-add mt-3"
              >
                + Add instrument
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
