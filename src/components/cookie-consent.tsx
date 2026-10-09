"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 text-sm shadow-lg"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p>
        We use essential cookies for auth and optional analytics when configured. See{" "}
        <a href="/privacy" className="underline">Privacy</a>.
      </p>
      <button
        type="button"
        className="mt-2 rounded-md bg-primary px-3 py-1 text-primary-foreground"
        onClick={() => {
          localStorage.setItem("cookie-consent", "1");
          setVisible(false);
        }}
      >
        Accept
      </button>
    </div>
  );
}
