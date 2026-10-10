import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  alternates: { canonical: "/auth/login" },
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/app/watchlist";
  return (
    <div className="page-narrow">
      <h1 className="h1">Sign in</h1>
      <p className="lede">
        Optional sign-in saves your watchlist, alerts, and portfolio. Magic link and Google need
        Supabase. Without it, use the demo account in local dev.
      </p>
      <div className="card mt-8 p-5 sm:p-6">
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
