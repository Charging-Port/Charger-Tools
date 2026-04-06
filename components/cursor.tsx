"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only activate on devices with a fine pointer (mouse/trackpad).
    // Touch devices have the cursor elements hidden via CSS already, but
    // skipping here avoids an unnecessary RAF loop on mobile.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => ring.classList.add("clicking");
    const onMouseUp = () => ring.classList.remove("clicking");

    // Track elements that already have listeners to prevent duplicate
    // registrations each time MutationObserver fires.
    const listenedElements = new WeakSet<Element>();

    const addInteractionListeners = () => {
      const interactable = document.querySelectorAll(
        "a, button, [role='button'], input, label, select, textarea, [data-cursor-hover]"
      );
      interactable.forEach((el) => {
        if (listenedElements.has(el)) return;
        listenedElements.add(el);
        el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
        el.addEventListener("mouseleave", () =>
          ring.classList.remove("hovered")
        );
      });
    };

    const tick = () => {
      // Dot snaps to cursor instantly
      dot.style.transform = `translate(${pos.current.x - 2.5}px, ${pos.current.y - 2.5}px)`;

      if (reducedMotion) {
        // Snap ring directly — no lerp for users who prefer reduced motion
        ring.style.transform = `translate(${pos.current.x - 18}px, ${pos.current.y - 18}px)`;
      } else {
        // Ring lags behind with lerp
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1;
        ring.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    addInteractionListeners();

    const observer = new MutationObserver(addInteractionListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
