import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CommandPalette } from "@/components/command-palette";

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

  var INTERACTIVE = "a, button, [role='button'], select, label, [data-cursor-hover]";
  var TEXT = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest(TEXT)) doc.classList.add('cursor-text');
    else if (t.closest(INTERACTIVE)) doc.classList.add('cursor-hovered');
  }, { passive: true });

  document.addEventListener('mouseout', function(e) {
    var t = e.target;
    if (!t || !t.closest) return;
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
      <Navbar />
      <CommandPalette />
      <main id="main-content" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
