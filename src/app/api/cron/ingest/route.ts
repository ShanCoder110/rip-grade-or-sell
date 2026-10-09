import { NextResponse } from "next/server";
import { env } from "@/env";
import { runFullIngest } from "@/lib/ingest/run";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runFullIngest();
  return NextResponse.json({ ok: true, results });
}
