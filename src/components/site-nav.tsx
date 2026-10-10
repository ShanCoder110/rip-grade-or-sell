"use client";

import Link from "next/link";
import { useState } from "react";
import { signOutDemoSession, useClientSession } from "@/lib/hooks/use-client-session";

const links = [
  { href: "/sets", label: "Sets" },
  { href: "/tools/grade-or-sell", label: "Grade or sell" },
  { href: "/tools/fee-calculator", label: "Fees" },
  { href: "/tools/pack-simulator", label: "Packs" },
  { href: "/methodology", label: "Methodology" },
];

export function DesktopNav() {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const session = useClientSession();
  const signedIn = session?.signedIn === true;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="btn btn-secondary shrink-0 !px-3"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full z-40 border-b border-border bg-card px-4 py-3 shadow-lg"
        >
          <ul className="grid gap-1">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="block rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                About
              </Link>
            </li>
            {signedIn ? (
              <>
                <li className="mt-2 border-t border-border pt-2">
                  <Link
                    href="/app/watchlist"
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    My lists
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      setOpen(false);
                      void signOutDemoSession();
                    }}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-2 border-t border-border pt-2 sm:hidden">
                <Link
                  href="/auth/login?next=/app/watchlist"
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
