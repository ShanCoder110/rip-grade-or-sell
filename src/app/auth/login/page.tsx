import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  alternates: { canonical: "/auth/login" },
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/pricing";
  return (
    <div className="page-narrow">
      <h1 className="h1">Sign in</h1>
      <p className="lede">
        Sign in to subscribe to Pro. Magic link and Google need Supabase. Without it, use the demo
        account to walk through checkout on this machine.
      </p>
      <div className="card mt-8 p-5 sm:p-6">
        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
