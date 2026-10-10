"use client";

import Link from "next/link";
import { signOutDemoSession, useClientSession } from "@/lib/hooks/use-client-session";

export function AccountMenu() {
  const session = useClientSession();

  if (!session?.signedIn) {
    return (
      <Link href="/auth/login?next=/app/watchlist" className="btn btn-secondary hidden shrink-0 sm:inline-flex">
        Sign in
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link href="/app/watchlist" className="btn btn-secondary shrink-0">
        My lists
      </Link>
      <button type="button" className="btn btn-secondary shrink-0" onClick={() => void signOutDemoSession()}>
        Sign out
      </button>
    </div>
  );
}
