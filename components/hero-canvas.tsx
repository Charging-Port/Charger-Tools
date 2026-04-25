"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  baseA: number;
  phase: number;
};

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let start = performance.now();

    const accent = () => {
      const styles = getComputedStyle(document.documentElement);
      return styles.getPropertyValue("--accent").trim() || "18 78% 52%";
    };
    let accentHsl = accent();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      particles.length = 0;
      const density = Math.min(90, Math.floor((w * h) / 11000));
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.2 + 0.4,
          baseA: Math.random() * 0.4 + 0.18,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = (t: number) => {
      const dt = (t - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      const linkDist = 120;
      const mouseDist = 180;

      // Update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;

          // Gentle attraction toward cursor
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < mouseDist * mouseDist) {
              const d = Math.sqrt(d2) || 1;
              const pull = (1 - d / mouseDist) * 0.08;
              p.vx += (dx / d) * pull;
              p.vy += (dy / d) * pull;
            }
          }

          // Damping
          p.vx *= 0.985;
          p.vy *= 0.985;

          // Gentle drift baseline
          p.vx += (Math.random() - 0.5) * 0.008;
          p.vy += (Math.random() - 0.5) * 0.008;

          // Wrap
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        const twinkle = reduced ? 1 : 0.7 + 0.3 * Math.sin(dt * 1.2 + p.phase);
        const alpha = p.baseA * twinkle;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${accentHsl} / ${alpha})`;
        ctx.fill();
      }

      // Draw links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const d = Math.sqrt(d2);
            let alpha = (1 - d / linkDist) * 0.18;

            // Boost near cursor
            if (mouse.active) {
              const mx = (a.x + b.x) / 2 - mouse.x;
              const my = (a.y + b.y) / 2 - mouse.y;
              const md = Math.sqrt(mx * mx + my * my);
              if (md < mouseDist) {
                alpha += (1 - md / mouseDist) * 0.35;
              }
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsl(${accentHsl} / ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Cursor halo — a soft orb that follows the mouse
      if (mouse.active) {
        const halo = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseDist
        );
        halo.addColorStop(0, `hsl(${accentHsl} / 0.10)`);
        halo.addColorStop(1, `hsl(${accentHsl} / 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouseDist, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onTheme = () => {
      accentHsl = accent();
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    const obs = new MutationObserver(onTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      obs.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
