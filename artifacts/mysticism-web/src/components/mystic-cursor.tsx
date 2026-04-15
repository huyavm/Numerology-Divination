import { useEffect } from "react";

const STAR_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpolygon points='16,2 19.5,12.5 30.5,12.5 21.5,19 24.9,29.5 16,23 7.1,29.5 10.5,19 1.5,12.5 12.5,12.5' fill='%23f5c842' stroke='%23a07c10' stroke-width='1.2'/%3E%3C/svg%3E") 16 16, auto`;

export function MysticCursor() {
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;
    document.documentElement.style.cursor = STAR_CURSOR;
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, []);

  return null;
}
