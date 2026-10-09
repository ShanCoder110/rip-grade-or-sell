import { NextResponse } from "next/server";
import { readDemoSession } from "@/lib/auth/demo-session";
import { getUserPlan } from "@/lib/auth/entitlements";
import { hasPublicSupabaseConfig } from "@/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const demo = await readDemoSession();
  if (demo) {
    const plan = await getUserPlan();
    return NextResponse.json({
      signedIn: true,
      demo: true,
      email: demo.email,
      plan,
    });
  }

  if (!hasPublicSupabaseConfig()) {
    return NextResponse.json({ signedIn: false, demo: false, email: null, plan: "free" });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const plan = await getUserPlan();
    return NextResponse.json({
      signedIn: Boolean(user),
      demo: false,
      email: user?.email ?? null,
      plan,
    });
  } catch {
    return NextResponse.json({ signedIn: false, demo: false, email: null, plan: "free" });
  }
}
