import { z } from "zod";
import {
  resolveSupabaseAnonKey,
  resolveSupabaseUrl,
} from "@/lib/supabase/config";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || undefined;
const rawAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined;

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: resolveSupabaseUrl(rawUrl),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: resolveSupabaseAnonKey(rawAnon),
});
