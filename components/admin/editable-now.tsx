"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";
import { HeadlineRender } from "./editable-hero";
import type { NowContent, NowSection } from "@/lib/content";

/**
 * Full /now page renderer that becomes editable when an admin enters edit
 * mode. Visitors get an identical DOM structure.
 */
export function EditableNow({ initial }: { initial: NowContent }) {
  const { save, authed, editMode } = useAdmin();
  const [now, setNow] = useState<NowContent>(initial);
  const editable = authed && editMode;

  const commit = async (next: NowContent) => {
    setNow(next);
    const ok = await save("now", next);
    if (!ok) setNow(initial);
  };

  const updateSection = (idx: number, patch: Partial<NowSection>) => {
    const sections = now.sections.map((s, i) =>
      i === idx ? { ...s, ...patch } : s
    );
    return commit({ ...now, sections });
  };

  const removeSection = (idx: number) => {
    const sections = now.sections.filter((_, i) => i !== idx);
    return commit({ ...now, sections });
  };

  const addSection = () => {
    return commit({
      ...now,
      sections: [...now.sections, { label: "New section", items: [] }],
    });
  };

  return (
    <>
      <header className="mb-16">
        <EditableText
          as="p"
          value={now.eyebrow}
          onCommit={(eyebrow) => commit({ ...now, eyebrow })}
          className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4"
          placeholder="Eyebrow"
        />
        {editable ? (
          <EditableText
            as="h1"
            value={now.title}
            onCommit={(title) => commit({ ...now, title })}
            className="font-serif text-5xl md:text-6xl tracking-tightest text-foreground leading-[1.0]"
            placeholder="Page title"
          />
        ) : (
          <h1 className="font-serif text-5xl md:text-6xl tracking-tightest text-foreground leading-[1.0]">
            <HeadlineRender headline={now.title} />
          </h1>
        )}
        <EditableText
          as="p"
          multiline
          value={now.intro}
          onCommit={(intro) => commit({ ...now, intro })}
          className="mt-6 text-foreground/75 leading-relaxed max-w-xl"
          placeholder="Intro paragraph"
        />
      </header>

      <div className="space-y-16">
        {now.sections.map((section, sIdx) => (
          <NowSectionBlock
            key={sIdx}
            section={section}
            onChange={(patch) => updateSection(sIdx, patch)}
            onRemove={editable ? () => void removeSection(sIdx) : undefined}
          />
        ))}
        {editable && (
          <button
            type="button"
            onClick={() => void addSection()}
            className="ct-row-add"
          >
            + Add section
          </button>
        )}
      </div>
    </>
  );
}

function NowSectionBlock({
  section,
  onChange,
  onRemove,
}: {
  section: NowSection;
  onChange: (patch: Partial<NowSection>) => void | Promise<void>;
  onRemove?: () => void;
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;

  const updateItem = (idx: number, patch: Partial<NowSection["items"][number]>) => {
    const items = section.items.map((it, i) =>
      i === idx ? { ...it, ...patch } : it
    );
    return onChange({ items });
  };
  const removeItem = (idx: number) => {
    const items = section.items.filter((_, i) => i !== idx);
    return onChange({ items });
  };
  const addItem = () => {
    const items = [...section.items, { title: "New item", body: "" }];
    return onChange({ items });
  };

  return (
    <section>
      <div className="flex items-baseline gap-3 mb-8">
        <EditableText
          as="span"
          value={section.label}
          onCommit={(label) => onChange({ label })}
          className="font-mono text-xs uppercase tracking-[0.22em] text-accent"
          placeholder="Section label"
        />
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] text-muted-foreground/70">
          {section.items.length}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ct-row-action"
            aria-label="Remove section"
            title="Remove section"
          >
            <span className="text-[10px]">×</span>
          </button>
        )}
      </div>
      <ul className="space-y-7">
        {section.items.map((item, iIdx) => {
          const titleClass =
            "font-serif text-xl md:text-2xl text-foreground hover:text-accent transition-colors leading-tight";
          const titleEl =
            !editable && item.href ? (
              <Link href={item.href} className={titleClass}>
                {item.title}
              </Link>
            ) : (
              <EditableText
                as="span"
                value={item.title}
                onCommit={(title) => updateItem(iIdx, { title })}
                className={
                  item.href
                    ? titleClass
                    : "font-serif text-xl md:text-2xl text-foreground leading-tight"
                }
                placeholder="Item title"
              />
            );
          return (
            <li
              key={iIdx}
              className={`grid grid-cols-12 gap-4 md:gap-6 ${editable ? "ct-editable-row" : ""} relative`}
            >
              <div className="col-span-12 md:col-span-4">{titleEl}</div>
              <EditableText
                as="p"
                multiline
                value={item.body}
                onCommit={(body) => updateItem(iIdx, { body })}
                className="col-span-12 md:col-span-8 text-foreground/75 leading-relaxed text-[15px]"
                placeholder="Item body"
              />
              {editable && (
                <button
                  type="button"
                  onClick={() => void removeItem(iIdx)}
                  className="ct-row-action absolute top-0 right-0"
                  aria-label={`Remove item ${iIdx + 1}`}
                  title="Remove item"
                >
                  <span className="text-[10px]">×</span>
                </button>
              )}
            </li>
          );
        })}
        {editable && (
          <li>
            <button
              type="button"
              onClick={() => void addItem()}
              className="ct-row-add"
            >
              + Add item
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
