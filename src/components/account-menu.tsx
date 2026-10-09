"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Session = {
  signedIn: boolean;
  demo: boolean;
  email: string | null;
  plan: "free" | "pro";
};

export function AccountMenu() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data: Session) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {
        if (!cancelled) setSession({ signedIn: false, demo: false, email: null, plan: "free" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/auth/demo", { method: "DELETE" });
    window.location.href = "/";
  }

  if (!session?.signedIn) {
    return (
      <Link href="/auth/login?next=/pricing" className="btn btn-secondary">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {session.plan === "pro" ? (
        <Link href="/app/portfolio" className="btn btn-secondary">
          Pro
        </Link>
      ) : null}
      <button type="button" className="btn btn-secondary" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
