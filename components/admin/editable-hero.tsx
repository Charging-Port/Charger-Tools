"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";
import type { HeroContent, HeroCurrentlyItem } from "@/lib/content";

/**
 * Renders the homepage Currently sidebar with admin-aware editing.
 *
 * Visitors see the same DOM they always did. Admins can:
 *   - edit the title
 *   - edit each row's label and text
 *   - delete a row (hover → trash)
 *   - add a row at the end
 */
export function EditableCurrently({
  hero,
  onCommit,
}: {
  hero: HeroContent;
  onCommit: (next: HeroContent) => void | Promise<void>;
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;
  const sb = hero.currentlySidebar;

  const updateItem = (idx: number, next: Partial<HeroCurrentlyItem>) => {
    const items = sb.items.map((it, i) =>
      i === idx ? { ...it, ...next } : it
    );
    return onCommit({ ...hero, currentlySidebar: { ...sb, items } });
  };

  const removeItem = (idx: number) => {
    const items = sb.items.filter((_, i) => i !== idx);
    return onCommit({ ...hero, currentlySidebar: { ...sb, items } });
  };

  const addItem = () => {
    const items = [
      ...sb.items,
      { label: "Doing", text: "Something new" } as HeroCurrentlyItem,
    ];
    return onCommit({ ...hero, currentlySidebar: { ...sb, items } });
  };

  return (
    <aside className="md:col-span-4 md:border-l md:border-border md:pl-6">
      <EditableText
        as="p"
        value={sb.title}
        onCommit={(title) =>
          onCommit({ ...hero, currentlySidebar: { ...sb, title } })
        }
        className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3"
        placeholder="Section title"
      />
      <ul className="space-y-2 text-[13px]">
        {sb.items.map((item, i) => (
          <li
            key={i}
            className={`flex gap-3 ${editable ? "ct-editable-row" : ""}`}
          >
            <EditableText
              as="span"
              value={item.label}
              onCommit={(label) => updateItem(i, { label })}
              className="font-mono text-[10px] text-accent uppercase tracking-widest w-14 shrink-0 pt-0.5"
              placeholder="Label"
            />
            {item.href && !editable ? (
              <Link
                href={item.href}
                className="text-foreground link-underline"
              >
                {item.text}
              </Link>
            ) : (
              <EditableText
                as="span"
                value={item.text}
                onCommit={(text) => updateItem(i, { text })}
                className={
                  item.href
                    ? "text-foreground link-underline"
                    : "text-foreground/85"
                }
                placeholder="Text"
              />
            )}
            {editable && (
              <button
                type="button"
                onClick={() => void removeItem(i)}
                className="ct-row-action shrink-0 ml-auto"
                aria-label={`Remove row ${i + 1}`}
                title="Remove"
              >
                <span className="text-[10px]">×</span>
              </button>
            )}
          </li>
        ))}
        {editable && (
          <li>
            <button
              type="button"
              onClick={() => void addItem()}
              className="ct-row-add"
            >
              + Add row
            </button>
          </li>
        )}
      </ul>
    </aside>
  );
}

/**
 * Render a headline that supports italic-emphasis on `*phrases*` so the
 * admin can edit the raw text but visitors see properly styled accents.
 */
export function HeadlineRender({ headline }: { headline: string }) {
  // Split on *...*, alternating plain text and accent-styled italic spans.
  const parts = headline.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("*") && p.endsWith("*") && p.length >= 2) {
          return (
            <em key={i} className="text-accent not-italic">
              {p.slice(1, -1)}
            </em>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/**
 * Editable hero headline that visually preserves the *accent* segments.
 * In edit mode it's a single editable string; in view mode it renders as
 * plain text with styled accent spans.
 */
export function EditableHeadline({
  value,
  onCommit,
  className,
}: {
  value: string;
  onCommit: (next: string) => void | Promise<void>;
  className?: string;
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;

  if (editable) {
    return (
      <EditableText
        as="h1"
        value={value}
        onCommit={onCommit}
        className={className}
        placeholder="Headline (use *italic* for accent)"
      />
    );
  }
  return (
    <h1 className={className}>
      <HeadlineRender headline={value} />
    </h1>
  );
}

/**
 * For narrative paragraphs in /about and the hero intro. Each paragraph is
 * its own editable element, plus an "add paragraph" button at the end in
 * edit mode.
 */
export function EditableParagraphs({
  values,
  onCommit,
  paragraphClassName,
  containerClassName,
  placeholder = "Paragraph",
}: {
  values: string[];
  onCommit: (next: string[]) => void | Promise<void>;
  paragraphClassName?: string;
  containerClassName?: string;
  placeholder?: string;
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;
  const [busy, setBusy] = useState(false);

  const updateAt = async (i: number, text: string) => {
    setBusy(true);
    try {
      const next = [...values];
      if (text.trim()) {
        next[i] = text;
      } else {
        next.splice(i, 1);
      }
      await onCommit(next);
    } finally {
      setBusy(false);
    }
  };

  const addParagraph = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onCommit([...values, ""]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={containerClassName}>
      {values.map((p, i) => (
        <EditableText
          key={i}
          as="p"
          multiline
          value={p}
          onCommit={(t) => updateAt(i, t)}
          className={paragraphClassName}
          placeholder={placeholder}
        />
      ))}
      {editable && (
        <button
          type="button"
          onClick={() => void addParagraph()}
          className="ct-row-add"
        >
          + Add paragraph
        </button>
      )}
    </div>
  );
}
