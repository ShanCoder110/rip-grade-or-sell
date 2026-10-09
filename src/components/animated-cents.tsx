"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatCents } from "@/lib/utils";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedCents({ cents, className }: { cents: number; className?: string }) {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [shown, setShown] = useState(cents);
  const from = useRef(cents);

  useEffect(() => {
    if (reduced) {
      from.current = cents;
      setShown(cents);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 480);
      const eased = 1 - (1 - p) ** 3;
      setShown(Math.round(start + (cents - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = cents;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cents, reduced]);

  return <span className={`tabular-nums ${className ?? ""}`}>{formatCents(shown)}</span>;
}
