"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { publicEnv } from "@/env.public";

export function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Supabase is not configured. Use local .env.local from supabase start.");
      return;
    }
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
      if (err) throw err;
      setMessage("Check your email for a magic link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }

  async function google() {
    if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Supabase is not configured.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback` },
    });
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <label className="block text-sm">
        Email
        <input
          type="email"
          required
          className="mt-1 w-full rounded border border-border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground"
      >
        Send magic link
      </button>
      <button
        type="button"
        onClick={google}
        className="mt-2 w-full rounded-md border border-border py-2 text-sm"
      >
        Continue with Google
      </button>
      {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
