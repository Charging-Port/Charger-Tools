"use client";

import { Plus, Trash2 } from "lucide-react";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";

interface EditableListProps {
  items: string[];
  onCommit: (next: string[]) => void | Promise<void>;
  /** Class for the <ul>. */
  listClassName?: string;
  /** Class for each <li>. */
  itemClassName?: string;
  /** Optional render function for the visitor mode (e.g. with bullets/icons). */
  renderItem?: (text: string, index: number) => React.ReactNode;
  /** Placeholder for new items in admin mode. */
  placeholder?: string;
  /** Maximum number of items the admin may add. */
  max?: number;
}

/**
 * Edits a list of single-line strings (tech stack, features, link list,
 * quick facts). Visitor mode renders a plain <ul>. Admin edit mode adds:
 *   - inline editing of each item
 *   - per-item delete button on hover
 *   - an "+ add item" button at the end
 */
export function EditableList({
  items,
  onCommit,
  listClassName,
  itemClassName,
  renderItem,
  placeholder = "New item",
  max = 50,
}: EditableListProps) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;

  const updateAt = (index: number, next: string) => {
    const copy = [...items];
    if (next.trim()) {
      copy[index] = next;
    } else {
      copy.splice(index, 1);
    }
    void onCommit(copy);
  };

  const addItem = () => {
    if (items.length >= max) return;
    void onCommit([...items, "New item"]);
  };

  const removeAt = (index: number) => {
    const copy = items.slice();
    copy.splice(index, 1);
    void onCommit(copy);
  };

  if (!editable) {
    return (
      <ul className={listClassName}>
        {items.map((item, i) => (
          <li key={`${i}-${item}`} className={itemClassName}>
            {renderItem ? renderItem(item, i) : item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={listClassName}>
      {items.map((item, i) => (
        <li
          key={`${i}-${item}`}
          className={[itemClassName ?? "", "ct-editable-row"].filter(Boolean).join(" ")}
        >
          {renderItem ? (
            <span className="flex-1 min-w-0">
              {renderItem(item, i)}
              <span className="hidden">{item}</span>
            </span>
          ) : (
            <EditableText
              as="span"
              value={item}
              onCommit={(next) => updateAt(i, next)}
              placeholder={placeholder}
              className="flex-1 min-w-0"
            />
          )}
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="ct-row-action shrink-0"
            aria-label={`Remove item ${i + 1}`}
            title="Remove"
          >
            <Trash2 size={11} />
          </button>
        </li>
      ))}
      {items.length < max && (
        <li className={[itemClassName ?? "", "ct-editable-row"].filter(Boolean).join(" ")}>
          <button
            type="button"
            onClick={addItem}
            className="ct-row-add"
          >
            <Plus size={11} />
            Add item
          </button>
        </li>
      )}
    </ul>
  );
}
