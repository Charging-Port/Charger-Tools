"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useAdmin } from "./admin-context";

interface EditableMarkdownProps {
  value: string;
  onCommit: (next: string) => void | Promise<void>;
  /** Optional className applied to the visitor render container. */
  className?: string;
  /** Render visitor markup: e.g. blog body HTML. */
  renderRead: (value: string) => React.ReactNode;
  /** Hint shown when empty in edit mode. */
  placeholder?: string;
  /** Min rows for the editable textarea. */
  rows?: number;
}

/**
 * For larger blocks of body text (blog body, product description, /about
 * paragraphs). Visitors see the rendered output via `renderRead`. Admins in
 * edit mode see a textarea overlay sized to the rendered content; blur
 * commits the change.
 *
 * We deliberately swap to a real <textarea> rather than contentEditable for
 * markdown-heavy content — it avoids paragraph-element gymnastics and gives
 * native support for line breaks, undo, paste, and IME composition.
 */
export function EditableMarkdown({
  value,
  onCommit,
  className,
  renderRead,
  placeholder = "Click to edit",
  rows = 6,
}: EditableMarkdownProps) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;
  const [draft, setDraft] = useState(value);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleBlur = useCallback(() => {
    const next = draft.trim();
    if (next !== value.trim()) {
      void onCommit(next);
    }
  }, [draft, onCommit, value]);

  // Auto-grow the textarea so the editor is the same shape as the render.
  const autosize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (editable) autosize();
  }, [editable, draft, autosize]);

  if (!editable) {
    return <div className={className}>{renderRead(value)}</div>;
  }

  return (
    <div className={["ct-editable-block", className ?? ""].filter(Boolean).join(" ")}>
      <textarea
        ref={taRef}
        className="ct-editable-textarea"
        value={draft}
        rows={rows}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setDraft(e.target.value);
        }}
        onBlur={handleBlur}
        spellCheck
      />
    </div>
  );
}
