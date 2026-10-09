"use client";

import { useState } from "react";

export function PricingActions({ className }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null);

  async function checkout(interval: "month" | "year") {
    setMessage(null);
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
    setMessage(data.message ?? "Checkout unavailable — sign in and configure billing keys.");
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => checkout("month")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Subscribe monthly
        </button>
        <button
          type="button"
          onClick={() => checkout("year")}
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Subscribe yearly
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
