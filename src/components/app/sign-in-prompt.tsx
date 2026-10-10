import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export function AppSignInPrompt({ nextPath }: { nextPath: string }) {
  return (
    <div>
      <EmptyState
        title="Sign in to save data"
        body="Use the demo account on the login page when Supabase is not configured, or sign in with email when it is."
      />
      <p className="mt-4">
        <Link href={`/auth/login?next=${encodeURIComponent(nextPath)}`} className="btn btn-primary">
          Go to sign in
        </Link>
      </p>
    </div>
  );
}
