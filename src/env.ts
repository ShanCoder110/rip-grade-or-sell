import "server-only";
import { z } from "zod";
import {
  isPublicSupabaseConfigured,
  isSupabaseConfigured,
  resolveSupabaseAnonKey,
  resolveSupabaseUrl,
} from "@/lib/supabase/config";

const emptyToUndefined = (val: unknown) =>
  val === "" || val === undefined ? undefined : val;

const adsenseClientId = z
  .string()
  .regex(/^ca-pub-\d+$/, "NEXT_PUBLIC_ADSENSE_CLIENT_ID must look like ca-pub-1234567890123456");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CRON_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  RESEND_FROM_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.preprocess(emptyToUndefined, adsenseClientId.optional()),
  ADSENSE_PUBLISHER_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  POKEMONTCG_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

/** Server-only validated env. Never import in Client Components. */
export const env = parseEnv();

export function hasSupabaseConfig(): boolean {
  return isSupabaseConfigured(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasPublicSupabaseConfig(): boolean {
  return isPublicSupabaseConfigured(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Resolved credentials (undefined when placeholders). For Supabase clients. */
export function getPublicSupabaseCredentials(): {
  url: string;
  anonKey: string;
} | null {
  const url = resolveSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = resolveSupabaseAnonKey(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
