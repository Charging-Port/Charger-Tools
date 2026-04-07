/**
 * Custom cursor: a gold dot and a gold ring, positioned via CSS variables
 * (`--mx`, `--my`) that are updated by an inline `<script>` in the public
 * layout. There is NO React state, NO useEffect, NO hydration dependency.
 *
 * If the inline script runs (it always does — it's plain DOM JavaScript),
 * the cursor follows the mouse. The CSS uses `var(--mx, 50vw)` so even
 * before the first mousemove, the cursor sits at viewport center.
 *
 * The visual states (.hovered, .clicking) are toggled by the same inline
 * script via classes on the <html> element.
 */
export function Cursor() {
  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  );
}
