import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";
import { rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({
  email: z.string().email(),
  source: z.string().default("set_page"),
});

export async function POST(request: Request) {
  const limited = rateLimit(request, "email-subscribe", 20);
  if (!limited.ok) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!hasPublicSupabaseConfig()) {
    return NextResponse.json({ ok: true, message: "Subscribed (local log only)." });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("email_subscribers").insert({
    email: body.data.email,
    source: body.data.source,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
