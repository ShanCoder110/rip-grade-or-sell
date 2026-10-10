"use client";

import { useEffect, useState } from "react";

export type ClientSession = {
  signedIn: boolean;
  demo: boolean;
  email: string | null;
};

export function useClientSession(): ClientSession | null {
  const [session, setSession] = useState<ClientSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data: ClientSession) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {
        if (!cancelled) setSession({ signedIn: false, demo: false, email: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return session;
}

export async function signOutDemoSession(): Promise<void> {
  await fetch("/api/auth/demo", { method: "DELETE" });
  window.location.href = "/";
}
