import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
}

const COLORS = [
  "hsl(45 90% 60%)",
  "hsl(50 100% 70%)",
  "hsl(270 70% 75%)",
  "hsl(260 80% 80%)",
  "hsl(40 80% 55%)",
  "hsl(280 60% 70%)",
];

let particleId = 0;

export function MysticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const posRef = useRef({ x: -200, y: -200 });
  const ringPosRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const lastEmitRef = useRef(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    document.documentElement.style.cursor = "none";

    function onMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const now = performance.now();
      if (now - lastEmitRef.current > 28) {
        lastEmitRef.current = now;
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          const maxLife = 40 + Math.random() * 35;
          particlesRef.current.push({
            id: particleId++,
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            size: 1.2 + Math.random() * 2.2,
            opacity: 0.85 + Math.random() * 0.15,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 0,
            maxLife,
            vx: (Math.random() - 0.5) * 0.9,
            vy: -0.5 - Math.random() * 1.1,
          });
        }
        if (particlesRef.current.length > 120) {
          particlesRef.current = particlesRef.current.slice(-120);
        }
      }
    }

    function onLeave() {
      setVisible(false);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", () => setVisible(true));

    function loop() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) {
        dot.style.transform = `translate(${posRef.current.x - 4}px, ${posRef.current.y - 4}px)`;
      }

      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.12;

      if (ring) {
        ring.style.transform = `translate(${ringPosRef.current.x - 18}px, ${ringPosRef.current.y - 18}px)`;
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      for (const p of particlesRef.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.97;
        p.vx *= 0.97;
        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);
        const size = p.size * (1 - progress * 0.5);

        ctx.save();
        ctx.globalAlpha = alpha;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 1.8);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
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
          opacity: visible ? 1 : 0,
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
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s",
          willChange: "transform",
        }}
      />
    </>
  );
}
