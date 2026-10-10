"use client";

import { useEffect, useState } from "react";
import { hasAdConsent } from "@/lib/ads/consent";
import { adsenseClientId } from "@/lib/ads/public-env";

export function AdSenseScript() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const sync = () => {
      setLoad(Boolean(adsenseClientId) && hasAdConsent());
    };
    sync();
    window.addEventListener("cookie-consent-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cookie-consent-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!load || !adsenseClientId) return;
    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClientId)}`;
    if (document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [load]);

  return null;
}
