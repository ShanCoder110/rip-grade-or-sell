"use client";

import { useState } from "react";

export function PricingActions({
  className,
  signedIn,
  demoMode,
}: {
  className?: string;
  signedIn: boolean;
  demoMode: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<"month" | "year" | null>(null);

  if (!signedIn) {
    return (
      <div className={className}>
        <a href="/auth/login?next=/pricing" className="btn btn-primary">
          Sign in to subscribe
        </a>
        <p className="mt-3 text-sm text-muted-foreground">
          {demoMode
            ? "Use the demo account on the sign-in page, then come back and pick monthly or yearly."
            : "Sign in, then pick monthly or yearly. Stripe Checkout opens in test mode when keys are set."}
        </p>
      </div>
    );
  }

  async function checkout(interval: "month" | "year") {
    setMessage(null);
    setPending(interval);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.message ?? data.error ?? "Checkout could not start.");
    } catch {
      setMessage("Checkout could not be reached. Try again in a moment.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className={className}>
      {demoMode ? (
        <p className="mb-3 text-sm text-muted-foreground">
          Demo checkout — confirms Pro locally without Stripe.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled={pending !== null} onClick={() => checkout("month")}>
          {pending === "month" ? "Starting…" : "Subscribe monthly"}
        </button>
        <button type="button" className="btn btn-secondary" disabled={pending !== null} onClick={() => checkout("year")}>
          {pending === "year" ? "Starting…" : "Subscribe yearly"}
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
