"use client";

import { useState } from "react";

export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMsg(null);
    try {
      const res = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      setOk(Boolean(data.ok));
      setMsg(data.ok ? "You are on the list for new set EV alerts." : data.error ?? "Could not subscribe.");
    } catch {
      setOk(false);
      setMsg("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mt-8 p-4 sm:p-5">
      <p className="font-medium">Email me when a new set EV is published</p>
      <p className="mt-1 text-sm text-muted-foreground">One list. Unsubscribe any time from the email.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="field min-w-0 flex-1">
          <span className="sr-only">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Subscribe"}
        </button>
      </div>
      {msg ? (
        <p className={`mt-2 text-sm ${ok ? "text-success" : "text-destructive"}`} role="status">
          {msg}
        </p>
      ) : null}
    </form>
  );
}
