import { useEffect, useRef } from "react";

export function MysticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -300, y: -300 });
  const ringPosRef = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.style.cursor = "none";

    function setVisible(v: boolean) {
      if (visibleRef.current === v) return;
      visibleRef.current = v;
      dot!.style.opacity = v ? "1" : "0";
      ring!.style.opacity = v ? "1" : "0";
    }

    function onMove(e: MouseEvent) {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      // Update dot position immediately — zero frame lag
      dot!.style.transform = `translate3d(${e.clientX - 4}px,${e.clientY - 4}px,0)`;
      setVisible(true);
    }

    function onLeave() { setVisible(false); }
    function onEnter() { setVisible(true); }

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("mouseenter", onEnter, { passive: true });

    // Ring trails the cursor with lerp — runs in RAF
    function loop() {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.22;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.22;
      ring!.style.transform = `translate3d(${ringPosRef.current.x - 18}px,${ringPosRef.current.y - 18}px,0)`;
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot — updates directly in mousemove, no lag */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] no-print"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, hsl(45 100% 80%) 0%, hsl(45 90% 55%) 60%, transparent 100%)",
          boxShadow:
            "0 0 6px 2px hsl(45 90% 65% / 0.9), 0 0 16px 4px hsl(270 70% 65% / 0.45)",
          opacity: 0,
          willChange: "transform",
        }}
      />
      {/* Ring — trails with lerp via RAF */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] no-print"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid hsl(45 80% 60% / 0.5)",
          boxShadow: "0 0 10px 1px hsl(270 60% 65% / 0.25)",
          opacity: 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
