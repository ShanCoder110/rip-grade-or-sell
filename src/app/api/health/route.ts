import { NextResponse } from "next/server";
import { hasPublicSupabaseConfig } from "@/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    supabase: hasPublicSupabaseConfig() ? "configured" : "fallback",
    time: new Date().toISOString(),
  });
}
