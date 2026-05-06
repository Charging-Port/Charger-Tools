"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Globe,
  Eye,
  Loader2,
} from "lucide-react";
import type { SiteText, SkillGroup, Skill, NowSection, NowItem } from "@/types/site-text";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "saving" }
  | { kind: "saved"; at: number }
  | { kind: "error"; message: string };

const FORMAT_HINT = (
  <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
    Inline formatting:{" "}
    <code className="font-mono bg-muted/40 px-1 py-0.5 rounded">
      {`{accent:text}`}
    </code>{" "}
    for green emphasis,{" "}
    <code className="font-mono bg-muted/40 px-1 py-0.5 rounded">
      {`{italic:text}`}
    </code>{" "}
    for italic accent,{" "}
    <code className="font-mono bg-muted/40 px-1 py-0.5 rounded">
      {`{strong:text}`}
    </code>{" "}
    for bold,{" "}
    <code className="font-mono bg-muted/40 px-1 py-0.5 rounded">
      {`{link:/path:label}`}
    </code>{" "}
    for internal links. (Hero / homepage closer only.)
  </p>
);

export function ContentAdmin() {
  const [data, setData] = useState<SiteText | null>(null);
  const [original, setOriginal] = useState<SiteText | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [openSection, setOpenSection] = useState<string>("hero");

  /* ── Load on mount ───────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/content");
        if (!res.ok) throw new Error("Failed to load content");
        const json = (await res.json()) as SiteText;
        if (cancelled) return;
        setData(json);
        setOriginal(JSON.parse(JSON.stringify(json)) as SiteText);
        setStatus({ kind: "idle" });
      } catch (err) {
        if (cancelled) return;
        setStatus({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Failed to load content",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(data) !== JSON.stringify(original),
    [data, original]
  );

  /* ── Warn before navigating away with unsaved changes ────── */
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  /* ── Save / revert ───────────────────────────────────────── */
  const save = useCallback(async () => {
    if (!data) return;
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Save failed");
      }
      setOriginal(JSON.parse(JSON.stringify(data)) as SiteText);
      setStatus({ kind: "saved", at: Date.now() });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Save failed",
      });
    }
  }, [data]);

  const revert = useCallback(() => {
    if (!original) return;
    if (!confirm("Discard all unsaved changes?")) return;
    setData(JSON.parse(JSON.stringify(original)) as SiteText);
    setStatus({ kind: "idle" });
  }, [original]);

  /* ── ⌘S to save ──────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty && status.kind !== "saving") void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDirty, status, save]);

  if (status.kind === "loading" || !data) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <p className="font-mono text-sm text-muted-foreground/60 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Loading content…
        </p>
      </div>
    );
  }

  /* Convenient setter that produces an updated copy. */
  const update = (mutator: (draft: SiteText) => void) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as SiteText;
      mutator(next);
      return next;
    });
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/60 hover:text-foreground transition-colors uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={12} />
          Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
              Content
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Site text
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/70 max-w-prose">
              Edit any text rendered on the public site. Saves to{" "}
              <code className="font-mono">content/site-text.json</code>. Commit
              the file to deploy changes to production.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={revert}
              disabled={!isDirty || status.kind === "saving"}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
              title="Discard unsaved changes"
            >
              <RotateCcw size={13} />
              Revert
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg"
              title="Preview the live site in a new tab"
            >
              <Eye size={13} />
              Preview
            </Link>
            <button
              onClick={save}
              disabled={!isDirty || status.kind === "saving"}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.kind === "saving" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className="mb-8 min-h-[2rem]">
          {status.kind === "error" && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2.5 text-sm flex items-center gap-2 text-red-500">
              <AlertCircle size={14} />
              {status.message}
            </div>
          )}
          {status.kind === "saved" && !isDirty && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-sm flex items-center gap-2 text-accent">
              <CheckCircle size={14} />
              Saved.
            </div>
          )}
          {isDirty && status.kind !== "saving" && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle size={14} />
              Unsaved changes — press ⌘S or click Save.
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-3">
          <Section
            id="hero"
            title="Hero (homepage top)"
            open={openSection === "hero"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Headline" hint="Top-of-page bold statement">
              <Textarea
                value={data.hero.headline}
                onChange={(v) => update((d) => (d.hero.headline = v))}
                rows={3}
              />
              {FORMAT_HINT}
            </Field>
            <Field label="Intro paragraph 1">
              <Textarea
                value={data.hero.intro1}
                onChange={(v) => update((d) => (d.hero.intro1 = v))}
                rows={3}
              />
            </Field>
            <Field label="Intro paragraph 2">
              <Textarea
                value={data.hero.intro2}
                onChange={(v) => update((d) => (d.hero.intro2 = v))}
                rows={3}
              />
            </Field>
            <Field label="Currently sidebar">
              <ListEditor
                items={data.hero.currently}
                onChange={(items) =>
                  update((d) => (d.hero.currently = items))
                }
                empty={{ label: "", text: "", href: "" }}
                renderItem={(item, set) => (
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      className="col-span-3"
                      placeholder="Label (e.g. Building)"
                      value={item.label}
                      onChange={(v) => set({ ...item, label: v })}
                    />
                    <Input
                      className="col-span-5"
                      placeholder="Text"
                      value={item.text}
                      onChange={(v) => set({ ...item, text: v })}
                    />
                    <Input
                      className="col-span-4"
                      placeholder="Href (optional, e.g. /products/meridian)"
                      value={item.href ?? ""}
                      onChange={(v) =>
                        set({ ...item, href: v === "" ? undefined : v })
                      }
                    />
                  </div>
                )}
              />
            </Field>
          </Section>

          <Section
            id="homepage"
            title="Homepage closer + newsletter"
            open={openSection === "homepage"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Closer headline">
              <Textarea
                value={data.homepage.closerHeadline}
                onChange={(v) =>
                  update((d) => (d.homepage.closerHeadline = v))
                }
                rows={2}
              />
              {FORMAT_HINT}
            </Field>
            <Field label="Closer body">
              <Textarea
                value={data.homepage.closerBody}
                onChange={(v) => update((d) => (d.homepage.closerBody = v))}
                rows={3}
              />
            </Field>
            <Field label="Newsletter body">
              <Textarea
                value={data.homepage.newsletterBody}
                onChange={(v) =>
                  update((d) => (d.homepage.newsletterBody = v))
                }
                rows={2}
              />
            </Field>
          </Section>

          <Section
            id="about"
            title="About page"
            open={openSection === "about"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Lead quote (italic, large)">
              <Textarea
                value={data.about.quote}
                onChange={(v) => update((d) => (d.about.quote = v))}
                rows={3}
              />
            </Field>
            <Field
              label="Bio paragraphs"
              hint="The first paragraph's first letter becomes the dropcap automatically."
            >
              <ListEditor
                items={data.about.bio}
                onChange={(items) => update((d) => (d.about.bio = items))}
                empty=""
                renderItem={(p, set) => (
                  <Textarea
                    value={p}
                    onChange={set}
                    rows={4}
                    placeholder="Paragraph"
                  />
                )}
              />
            </Field>
            <Field label="Quick facts (sidebar)">
              <ListEditor
                items={data.about.quickFacts}
                onChange={(items) =>
                  update((d) => (d.about.quickFacts = items))
                }
                empty={{ k: "", v: "" }}
                renderItem={(item, set) => (
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      className="col-span-4"
                      placeholder="Label"
                      value={item.k}
                      onChange={(v) => set({ ...item, k: v })}
                    />
                    <Input
                      className="col-span-8"
                      placeholder="Value"
                      value={item.v}
                      onChange={(v) => set({ ...item, v })}
                    />
                  </div>
                )}
              />
            </Field>
            <Field label="Pull-quote (sidebar italic)">
              <Textarea
                value={data.about.pullQuote}
                onChange={(v) => update((d) => (d.about.pullQuote = v))}
                rows={3}
              />
            </Field>
            <Field label="Closing CTA paragraph">
              <Textarea
                value={data.about.cta}
                onChange={(v) => update((d) => (d.about.cta = v))}
                rows={3}
              />
            </Field>

            <SkillsEditor
              groups={data.about.skills}
              onChange={(groups) => update((d) => (d.about.skills = groups))}
            />
          </Section>

          <Section
            id="now"
            title="Now page"
            open={openSection === "now"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Updated label">
              <Input
                value={data.now.updatedLabel}
                onChange={(v) => update((d) => (d.now.updatedLabel = v))}
                placeholder="Now · Updated April 23, 2026"
              />
            </Field>
            <Field label="Intro">
              <Textarea
                value={data.now.intro}
                onChange={(v) => update((d) => (d.now.intro = v))}
                rows={3}
              />
            </Field>
            <NowSectionsEditor
              sections={data.now.sections}
              onChange={(sections) => update((d) => (d.now.sections = sections))}
            />
          </Section>

          <Section
            id="contact"
            title="Contact page"
            open={openSection === "contact"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Intro">
              <Textarea
                value={data.contact.intro}
                onChange={(v) => update((d) => (d.contact.intro = v))}
                rows={3}
              />
            </Field>
            <Field label="Open to (sidebar list)">
              <ListEditor
                items={data.contact.openTo}
                onChange={(items) =>
                  update((d) => (d.contact.openTo = items))
                }
                empty=""
                renderItem={(p, set) => (
                  <Input
                    value={p}
                    onChange={set}
                    placeholder="e.g. Hardware / software collaborations"
                  />
                )}
              />
            </Field>
          </Section>

          <Section
            id="footer"
            title="Footer"
            open={openSection === "footer"}
            onToggle={(id) => setOpenSection(openSection === id ? "" : id)}
          >
            <Field label="Tagline">
              <Textarea
                value={data.footer.tagline}
                onChange={(v) => update((d) => (d.footer.tagline = v))}
                rows={3}
              />
            </Field>
          </Section>
        </div>

        {/* Save bar (sticky at bottom for long pages) */}
        {isDirty && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(640px,calc(100%-2rem))]">
            <div className="rounded-2xl border border-border bg-card/95 backdrop-blur shadow-xl px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-muted-foreground">
                Unsaved changes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={revert}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg"
                >
                  Discard
                </button>
                <button
                  onClick={save}
                  disabled={status.kind === "saving"}
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {status.kind === "saving" ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Save size={12} />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-6 border-t border-border/40">
          <p className="text-[11px] font-mono text-muted-foreground/50 leading-relaxed flex items-start gap-2">
            <Globe size={12} className="mt-[3px] shrink-0" />
            <span>
              Saves to <code>content/site-text.json</code>. On Vercel,
              filesystem writes are ephemeral — to deploy your edits, commit the
              updated file and push to your remote.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable building blocks ──────────────────────────────── */

function Section({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/70 transition-colors"
      >
        <span className="font-display font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronDown size={16} className="text-muted-foreground" />
        ) : (
          <ChevronRight size={16} className="text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-6 border-t border-border/40 pt-5">{children}</div>}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.18em]">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-muted-foreground/50">{hint}</span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/40 transition-colors ${className ?? ""}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border/50 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/40 leading-relaxed resize-y transition-colors"
    />
  );
}

/** Generic list editor — works for both string lists and object lists. */
function ListEditor<T>({
  items,
  onChange,
  empty,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  empty: T;
  renderItem: (item: T, setItem: (next: T) => void) => React.ReactNode;
}) {
  const set = (i: number, next: T) => {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  };
  const add = () => onChange([...items, JSON.parse(JSON.stringify(empty)) as T]);
  const remove = (i: number) => {
    const copy = [...items];
    copy.splice(i, 1);
    onChange(copy);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">{renderItem(item, (next) => set(i, next))}</div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 mt-0.5 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5"
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg border border-dashed border-border hover:border-accent/40"
      >
        <Plus size={12} />
        Add
      </button>
    </div>
  );
}

/* ── Skills editor (nested) ────────────────────────────────── */

function SkillsEditor({
  groups,
  onChange,
}: {
  groups: SkillGroup[];
  onChange: (groups: SkillGroup[]) => void;
}) {
  const setGroup = (i: number, next: SkillGroup) => {
    const copy = [...groups];
    copy[i] = next;
    onChange(copy);
  };
  const addGroup = () =>
    onChange([...groups, { category: "New category", items: [] }]);
  const removeGroup = (i: number) => {
    if (!confirm("Remove this skill group?")) return;
    const copy = [...groups];
    copy.splice(i, 1);
    onChange(copy);
  };
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.18em]">
          Skills
        </label>
      </div>
      <div className="space-y-4">
        {groups.map((group, gi) => (
          <div
            key={gi}
            className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Input
                value={group.category}
                onChange={(v) => setGroup(gi, { ...group, category: v })}
                placeholder="Category name"
                className="font-medium"
              />
              <button
                type="button"
                onClick={() => removeGroup(gi)}
                className="p-2 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 shrink-0"
                title="Remove group"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <SkillItemsEditor
              items={group.items}
              onChange={(items) => setGroup(gi, { ...group, items })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg border border-dashed border-border hover:border-accent/40"
        >
          <Plus size={12} />
          Add group
        </button>
      </div>
    </div>
  );
}

function SkillItemsEditor({
  items,
  onChange,
}: {
  items: Skill[];
  onChange: (items: Skill[]) => void;
}) {
  const set = (i: number, next: Skill) => {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  };
  const add = () =>
    onChange([...items, { name: "", description: "", whereLearned: "" }]);
  const remove = (i: number) => {
    const copy = [...items];
    copy.splice(i, 1);
    onChange(copy);
  };
  return (
    <div className="space-y-2 pl-2 border-l-2 border-border/40">
      {items.map((skill, si) => (
        <div
          key={si}
          className="rounded-lg border border-border/40 bg-card/40 p-3 space-y-2"
        >
          <div className="flex items-start gap-2">
            <Input
              value={skill.name}
              onChange={(v) => set(si, { ...skill, name: v })}
              placeholder="Skill name (e.g. Swift)"
              className="font-medium"
            />
            <button
              type="button"
              onClick={() => remove(si)}
              className="p-2 mt-0.5 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 shrink-0"
              title="Remove skill"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <Textarea
            value={skill.description}
            onChange={(v) => set(si, { ...skill, description: v })}
            placeholder="What it is"
            rows={2}
          />
          <Textarea
            value={skill.whereLearned}
            onChange={(v) => set(si, { ...skill, whereLearned: v })}
            placeholder="Where I learned it"
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg border border-dashed border-border hover:border-accent/40"
      >
        <Plus size={12} />
        Add skill
      </button>
    </div>
  );
}

/* ── Now sections editor (nested) ──────────────────────────── */

function NowSectionsEditor({
  sections,
  onChange,
}: {
  sections: NowSection[];
  onChange: (sections: NowSection[]) => void;
}) {
  const setSection = (i: number, next: NowSection) => {
    const copy = [...sections];
    copy[i] = next;
    onChange(copy);
  };
  const addSection = () =>
    onChange([...sections, { label: "New section", items: [] }]);
  const removeSection = (i: number) => {
    if (!confirm("Remove this section?")) return;
    const copy = [...sections];
    copy.splice(i, 1);
    onChange(copy);
  };
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-[0.18em]">
          Sections
        </label>
      </div>
      <div className="space-y-4">
        {sections.map((sec, si) => (
          <div
            key={si}
            className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Input
                value={sec.label}
                onChange={(v) => setSection(si, { ...sec, label: v })}
                placeholder="Section label (e.g. Building)"
                className="font-medium"
              />
              <button
                type="button"
                onClick={() => removeSection(si)}
                className="p-2 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 shrink-0"
                title="Remove section"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <NowItemsEditor
              items={sec.items}
              onChange={(items) => setSection(si, { ...sec, items })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg border border-dashed border-border hover:border-accent/40"
        >
          <Plus size={12} />
          Add section
        </button>
      </div>
    </div>
  );
}

function NowItemsEditor({
  items,
  onChange,
}: {
  items: NowItem[];
  onChange: (items: NowItem[]) => void;
}) {
  const set = (i: number, next: NowItem) => {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  };
  const add = () => onChange([...items, { title: "", body: "", href: "" }]);
  const remove = (i: number) => {
    const copy = [...items];
    copy.splice(i, 1);
    onChange(copy);
  };
  return (
    <div className="space-y-2 pl-2 border-l-2 border-border/40">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border/40 bg-card/40 p-3 space-y-2"
        >
          <div className="flex items-start gap-2">
            <Input
              value={item.title}
              onChange={(v) => set(i, { ...item, title: v })}
              placeholder="Title"
              className="font-medium"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 mt-0.5 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/5 shrink-0"
              title="Remove item"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <Textarea
            value={item.body}
            onChange={(v) => set(i, { ...item, body: v })}
            placeholder="Body"
            rows={3}
          />
          <Input
            value={item.href ?? ""}
            onChange={(v) =>
              set(i, { ...item, href: v === "" ? undefined : v })
            }
            placeholder="Link (optional, e.g. /products/meridian)"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg border border-dashed border-border hover:border-accent/40"
      >
        <Plus size={12} />
        Add item
      </button>
    </div>
  );
}
