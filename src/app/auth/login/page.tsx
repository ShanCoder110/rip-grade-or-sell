import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  alternates: { canonical: "/auth/login" },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Magic link email or Google (when OAuth is configured in Supabase).
      </p>
      <LoginForm className="mt-6" />
    </div>
  );
}
