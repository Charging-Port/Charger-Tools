import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CommandPalette } from "@/components/command-palette";
import { ScanLine } from "@/components/scan-line";
import { TerminalKonami } from "@/components/terminal-konami";
import { PageTransition } from "@/components/page-transition";

/**
 * Public layout — wraps everything with custom cursor, smooth scroll,
 * command palette (cmd+k), navbar, footer, and the easter egg console.
 *
 * Admin routes (app/admin/*) sit outside this layout and stay bare.
 */

const CURSOR_INIT_SCRIPT = `
(function() {
  if (typeof window === 'undefined') return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var doc = document.documentElement;
  doc.classList.add('has-fine-pointer');

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

  var INTERACTIVE = "a, button, [role='button'], select, label, [data-cursor-hover]";
  var MAGNET = "[data-cursor-magnet]";
  var TEXT = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(MAGNET)) {
      doc.classList.add('cursor-magnet');
    } else if (t.closest(TEXT)) {
      doc.classList.add('cursor-text');
    } else if (t.closest(INTERACTIVE)) {
      doc.classList.add('cursor-hovered');
    }
  }, { passive: true });

  document.addEventListener('mouseout', function(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(MAGNET)) doc.classList.remove('cursor-magnet');
    if (t.closest(TEXT)) doc.classList.remove('cursor-text');
    if (t.closest(INTERACTIVE)) doc.classList.remove('cursor-hovered');
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
      <script dangerouslySetInnerHTML={{ __html: CURSOR_INIT_SCRIPT }} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <ScanLine />
      <Navbar />
      <CommandPalette />
      <TerminalKonami />
      <main id="main-content" className="relative min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
