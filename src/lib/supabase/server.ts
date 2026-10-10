import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseCredentials } from "@/env";

export async function createClient() {
  const creds = getPublicSupabaseCredentials();
  if (!creds) {
    throw new Error("Supabase is not configured");
  }
  const cookieStore = await cookies();

  return createServerClient(creds.url, creds.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — ignore if middleware refreshes session.
        }
      },
    },
  });
}
