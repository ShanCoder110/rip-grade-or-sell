import "server-only";
import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  val === "" || val === undefined ? undefined : val;

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
  BILLING_PROVIDER: z
    .preprocess(
      emptyToUndefined,
      z.enum(["stripe", "lemon_squeezy", "paddle"]).optional(),
    )
    .optional(),
  BILLING_WEBHOOK_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  STRIPE_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  STRIPE_PRICE_MONTHLY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  STRIPE_PRICE_YEARLY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
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
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasPublicSupabaseConfig(): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
