import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  colorIdx: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

const COLORS = [
  "hsl(45,90%,62%)",
  "hsl(50,100%,70%)",
  "hsl(270,70%,76%)",
  "hsl(260,80%,80%)",
  "hsl(40,80%,56%)",
  "hsl(280,60%,72%)",
];

export function MysticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const posRef = useRef({ x: -300, y: -300 });
  const ringPosRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    document.documentElement.style.cursor = "none";

    function setDotVisible(v: boolean) {
      if (visibleRef.current === v) return;
      visibleRef.current = v;
      if (dot) dot.style.opacity = v ? "1" : "0";
      if (ring) ring.style.opacity = v ? "1" : "0";
    }

    function onMove(e: MouseEvent) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      setDotVisible(true);

      const now = performance.now();
      if (now - lastEmitRef.current > 32) {
        lastEmitRef.current = now;
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const maxLife = 38 + Math.random() * 28;
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            size: 1.0 + Math.random() * 2.0,
            opacity: 0.8 + Math.random() * 0.2,
            colorIdx: Math.floor(Math.random() * COLORS.length),
            life: 0,
            maxLife,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.4 - Math.random() * 1.0,
          });
        }
        if (particlesRef.current.length > 80) {
          particlesRef.current.splice(0, particlesRef.current.length - 80);
        }
      }
    }

    function onLeave() { setDotVisible(false); }
    function onEnter() { setDotVisible(true); }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true });

    function loop() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (dot) {
        dot.style.transform = `translate(${posRef.current.x - 4}px,${posRef.current.y - 4}px)`;
      }

      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18;

      if (ring) {
        ring.style.transform = `translate(${ringPosRef.current.x - 18}px,${ringPosRef.current.y - 18}px)`;
      }

      const particles = particlesRef.current;
      let writeIdx = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.97;
        p.vx *= 0.97;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);
        const size = p.size * (1 - progress * 0.5);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLORS[p.colorIdx];
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        particles[writeIdx++] = p;
      }
      particles.length = writeIdx;
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] no-print"
        style={{ mixBlendMode: "screen" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] no-print"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(45 100% 75%) 0%, hsl(45 90% 55%) 60%, transparent 100%)",
          boxShadow: "0 0 6px 2px hsl(45 90% 60% / 0.8), 0 0 14px 4px hsl(270 70% 65% / 0.4)",
          opacity: 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] no-print"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid hsl(45 80% 60% / 0.45)",
          boxShadow: "0 0 10px 1px hsl(270 60% 65% / 0.2)",
          opacity: 0,
          transition: "opacity 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
