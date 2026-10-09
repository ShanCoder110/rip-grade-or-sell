"use client";

import { useState } from "react";

export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/email/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const data = await res.json();
    setMsg(data.ok ? "Subscribed to new set EV alerts." : data.error ?? "Failed");
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-lg border border-border p-4">
      <p className="text-sm font-medium">Email me when new set EV is published</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-[200px] flex-1 rounded border border-border px-2 py-1 text-sm"
          placeholder="you@example.com"
        />
        <button type="submit" className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
          Subscribe
        </button>
      </div>
      {msg ? <p className="mt-2 text-xs text-muted-foreground">{msg}</p> : null}
    </form>
  );
}
