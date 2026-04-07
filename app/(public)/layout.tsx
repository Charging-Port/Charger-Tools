import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/**
 * Layout for the public site.
 *
 * Lives inside a route group so it ONLY wraps non-admin pages without
 * affecting URLs (the (public) segment is invisible in the URL). Admin
 * routes (app/admin/*) sit outside this group and never see the navbar,
 * footer, or custom cursor — keeping the React tree shape stable for both
 * sections so client-side hydration works reliably.
 */

// Inline script that drives the custom cursor. Runs as soon as the browser
// parses it — no React, no hydration, no waiting for chunks. Sets CSS
// variables --mx/--my from mousemove and toggles classes on <html> for
// hover/click states. CSS in globals.css uses these variables to position
// the cursor elements with `transform: translate3d(calc(...))`.
const CURSOR_INIT_SCRIPT = `
(function() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var doc = document.documentElement;
  doc.classList.add('has-fine-pointer');

  // Seed at viewport center so the cursor is visible BEFORE the first move
  doc.style.setProperty('--mx', (window.innerWidth / 2) + 'px');
  doc.style.setProperty('--my', (window.innerHeight / 2) + 'px');

  document.addEventListener('mousemove', function(e) {
    doc.style.setProperty('--mx', e.clientX + 'px');
    doc.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  document.addEventListener('mousedown', function() {
    doc.classList.add('cursor-clicking');
  });
  document.addEventListener('mouseup', function() {
    doc.classList.remove('cursor-clicking');
  });

  var INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-cursor-hover]";
  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    if (t && t.closest && t.closest(INTERACTIVE)) {
      doc.classList.add('cursor-hovered');
    }
  }, { passive: true });
  document.addEventListener('mouseout', function(e) {
    var t = e.target;
    if (t && t.closest && t.closest(INTERACTIVE)) {
      doc.classList.remove('cursor-hovered');
    }
  }, { passive: true });
})();
`;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Cursor init script — runs before React hydrates */}
      <script
        dangerouslySetInnerHTML={{ __html: CURSOR_INIT_SCRIPT }}
      />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Cursor />
      <Navbar />
      <main id="main-content" className="min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
