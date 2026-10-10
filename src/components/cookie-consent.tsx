"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_ALL,
  CONSENT_ESSENTIAL,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/ads/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readCookieConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-sm leading-relaxed">
        We use essential cookies to keep you signed in. With your permission we also load Google
        AdSense, which may set advertising cookies (including in the UK/EEA under consent rules).
        See our{" "}
        <a href="/privacy" className="link">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            writeCookieConsent(CONSENT_ALL);
            setVisible(false);
          }}
        >
          Accept all
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            writeCookieConsent(CONSENT_ESSENTIAL);
            setVisible(false);
          }}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
