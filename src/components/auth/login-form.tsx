"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { publicEnv } from "@/env.public";

export function LoginForm({ className, nextPath = "/app/watchlist" }: { className?: string; nextPath?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [demoPending, setDemoPending] = useState(false);
  const demoAvailable = !publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function demoSignIn() {
    setError(null);
    setMessage(null);
    setDemoPending(true);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next: nextPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Demo sign-in failed");
      window.location.href = data.redirect ?? nextPath;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo sign-in failed");
      setDemoPending(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Supabase is not configured. Copy keys from supabase start into .env.local.");
      return;
    }
    setPending(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
      if (err) throw err;
      setMessage("Check your email for a magic link. It expires after a short window.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  async function google() {
    setError(null);
    if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Supabase is not configured, so Google sign-in is unavailable.");
      return;
    }
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
    if (err) setError(err.message);
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <label className="field">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button type="submit" className="btn btn-primary mt-4 w-full" disabled={pending}>
        {pending ? "Sending…" : "Send magic link"}
      </button>
      <button type="button" onClick={google} className="btn btn-secondary mt-2 w-full">
        Continue with Google
      </button>
      {demoAvailable ? (
        <button type="button" onClick={demoSignIn} className="btn btn-primary mt-4 w-full" disabled={demoPending}>
          {demoPending ? "Signing in…" : "Continue with demo account"}
        </button>
      ) : null}
      {demoAvailable ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Demo account stores watchlist, portfolio, and alerts in this browser (localStorage). Nothing
          is sent to a server until you configure Supabase.
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 text-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
