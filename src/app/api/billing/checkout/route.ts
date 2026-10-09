import { NextResponse } from "next/server";
import { z } from "zod";
import { hasSupabaseConfig } from "@/env";
import { isDemoBillingEnabled } from "@/lib/auth/demo-mode";
import { readDemoSession, writeDemoSession } from "@/lib/auth/demo-session";
import { getBillingProvider } from "@/lib/billing";
import { upsertProEntitlement } from "@/lib/billing/entitlements-sync";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  interval: z.enum(["month", "year"]),
});

export async function POST(request: Request) {
  const json = bodySchema.safeParse(await request.json().catch(() => null));
  if (!json.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const demo = await readDemoSession();
  let user: { id: string; email: string } | null = demo
    ? { id: demo.id, email: demo.email }
    : null;

  if (!user) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) user = { id: data.user.id, email: data.user.email };
    } catch {
      user = null;
    }
  }

  if (!user) {
    return NextResponse.json({
      url: "/auth/login?next=/pricing",
      message: "Sign in before starting checkout.",
    });
  }

  if (isDemoBillingEnabled()) {
    if (demo) {
      await writeDemoSession({ ...demo, plan: "pro" });
    }
    if (hasSupabaseConfig() && !demo) {
      const periodEnd = new Date();
      periodEnd.setUTCDate(periodEnd.getUTCDate() + (json.data.interval === "year" ? 366 : 32));
      await upsertProEntitlement(user.id, periodEnd.toISOString());
    }
    return NextResponse.json({
      url: "/pricing?checkout=success",
      demo: true,
      message: "Demo checkout complete. No card was charged.",
    });
  }

  try {
    const session = await getBillingProvider().createCheckout(user.id, user.email, json.data.interval);
    return NextResponse.json(session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe checkout failed";
    return NextResponse.json({ url: null, message }, { status: 502 });
  }
}
