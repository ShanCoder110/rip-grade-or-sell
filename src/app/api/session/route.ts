import { NextResponse } from "next/server";
import { readDemoSession } from "@/lib/auth/demo-session";
import { hasPublicSupabaseConfig } from "@/env";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const demo = await readDemoSession();
  if (demo) {
    return NextResponse.json({
      signedIn: true,
      demo: true,
      email: demo.email,
    });
  }

  if (!hasPublicSupabaseConfig()) {
    return NextResponse.json({ signedIn: false, demo: false, email: null });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return NextResponse.json({
      signedIn: Boolean(user),
      demo: false,
      email: user?.email ?? null,
    });
  } catch {
    return NextResponse.json({ signedIn: false, demo: false, email: null });
  }
}
