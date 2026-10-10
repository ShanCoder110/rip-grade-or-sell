"use client";

import { useEffect, useRef, useState } from "react";
import { hasAdConsent } from "@/lib/ads/consent";
import { adsenseClientId } from "@/lib/ads/public-env";

type AdFormat = "horizontal" | "rectangle";

const RESERVED: Record<AdFormat, { minHeight: number; maxWidth?: number }> = {
  horizontal: { minHeight: 90, maxWidth: 728 },
  rectangle: { minHeight: 250, maxWidth: 336 },
};

type Props = {
  slot: string;
  format?: AdFormat;
  className?: string;
  label?: string;
};

export function AdSlot({ slot, format = "horizontal", className, label = "Advertisement" }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sync = () => {
      setShow(Boolean(adsenseClientId && slot.trim()) && hasAdConsent());
    };
    sync();
    window.addEventListener("cookie-consent-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cookie-consent-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slot]);

  useEffect(() => {
    if (!show || !insRef.current || !adsenseClientId) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // Ad blockers or CSP in dev — ignore
    }
  }, [show]);

  if (!show) return null;

  const reserved = RESERVED[format];

  return (
    <aside
      className={className}
      aria-label={label}
      style={{
        minHeight: reserved.minHeight,
        maxWidth: reserved.maxWidth ?? "100%",
        width: "100%",
        marginInline: "auto",
      }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: reserved.minHeight }}
        data-ad-client={adsenseClientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
