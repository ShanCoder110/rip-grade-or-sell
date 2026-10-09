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
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-sm leading-relaxed">
        Essential cookies keep you signed in. Optional analytics stay off until you accept. See the{" "}
        <a href="/privacy" className="link">
          privacy policy
        </a>
        .
      </p>
      <button
        type="button"
        className="btn btn-primary mt-3"
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
