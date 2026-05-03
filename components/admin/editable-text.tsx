"use client";

import {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
} from "react";
import { useAdmin } from "./admin-context";

type EditableTextProps = {
  /** Current value (renders as the element's text). */
  value: string;
  /** Called with the trimmed new value when the user finishes editing. */
  onCommit: (next: string) => void | Promise<void>;
  /** HTML element to render. Defaults to <span>. */
  as?: ElementType;
  /** Tailwind classes for the rendered element (admin and visitor states share these). */
  className?: string;
  /** Show as a single-line input (Enter commits) — default. Set to false for multi-line. */
  multiline?: boolean;
  /** Hint shown to the admin when the value is empty. */
  placeholder?: string;
  /** Optional aria-label for accessibility. */
  ariaLabel?: string;
  /** Optional content rendered inside the visible element (e.g. when value should be styled into a fragment). */
  children?: ReactNode;
};

/**
 * In-place editable text. When the user is not an admin (or admin edit mode
 * is off), this renders as a plain element with the value — no overhead, no
 * extra DOM attributes for the public visitor.
 *
 * When admin edit mode is on, hovering the element shows a hairline outline,
 * clicking flips it to contentEditable, and blur (or Enter for single-line)
 * commits the value to the parent. Escape cancels.
 *
 * The component is "uncontrolled while editing" — we let the browser own the
 * caret/selection during a focus session, then read the resulting innerText
 * on commit. This avoids the cursor-jumping issues a controlled
 * contentEditable would cause.
 */
export function EditableText({
  value,
  onCommit,
  as,
  className,
  multiline = false,
  placeholder,
  ariaLabel,
  children,
}: EditableTextProps) {
  const { authed, editMode } = useAdmin();
  const Tag = (as ?? (multiline ? "div" : "span")) as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);
  const idAttr = useId();

  const editable = authed && editMode;

  const commit = useCallback(() => {
    if (!ref.current) return;
    const next = ref.current.innerText.trim();
    setEditing(false);
    if (next !== value) {
      void onCommit(next);
    }
  }, [onCommit, value]);

  const cancel = useCallback(() => {
    if (!ref.current) return;
    ref.current.innerText = value;
    setEditing(false);
  }, [value]);

  // Keep the rendered text in sync with `value` when not editing. We avoid
  // touching innerText while the user is mid-edit so we don't clobber the
  // caret.
  useEffect(() => {
    if (!editing && ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value, editing]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
        ref.current?.blur();
      } else if (e.key === "Enter" && !multiline && !e.shiftKey) {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [cancel, multiline]
  );

  if (!editable) {
    // Visitor render path — no extra attributes, identical to plain text.
    return <Tag className={className}>{children ?? value}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      id={idAttr}
      className={[
        className ?? "",
        "ct-editable",
        editing ? "ct-editing" : "",
        !value ? "ct-empty" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel ?? placeholder ?? "Editable text"}
      aria-multiline={multiline ? "true" : "false"}
      data-placeholder={placeholder ?? "Click to edit"}
      onFocus={() => setEditing(true)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      spellCheck
    >
      {value || ""}
    </Tag>
  );
}
