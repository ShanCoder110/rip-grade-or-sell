import { NextResponse } from "next/server";
import { env } from "@/env";
import { sendDailyAlertDigests } from "@/lib/email/alerts";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await sendDailyAlertDigests();
  return NextResponse.json({ ok: true, ...result });
}
