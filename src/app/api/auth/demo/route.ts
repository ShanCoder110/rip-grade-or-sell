import { NextResponse } from "next/server";
import { z } from "zod";
import { isDemoAuthEnabled } from "@/lib/auth/demo-mode";
import { clearDemoSession, writeDemoSession } from "@/lib/auth/demo-session";

const bodySchema = z.object({
  next: z.string().optional(),
});

function safeNext(value: string | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/pricing";
}

export async function POST(request: Request) {
  if (!isDemoAuthEnabled()) {
    return NextResponse.json({ error: "Demo sign-in is only available without Supabase in local dev." }, { status: 403 });
  }
  const json = bodySchema.safeParse(await request.json().catch(() => ({})));
  const next = safeNext(json.success ? json.data.next : undefined);
  await writeDemoSession({
    id: crypto.randomUUID(),
    email: "demo@local.test",
    plan: "free",
  });
  return NextResponse.json({ ok: true, redirect: next });
}

export async function DELETE() {
  await clearDemoSession();
  return NextResponse.json({ ok: true });
}
