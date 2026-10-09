import { NextResponse } from "next/server";
import { requirePro } from "@/lib/auth/entitlements";
import { rateLimit } from "@/lib/server/rate-limit";

const MAX_BYTES = 256_000;

export async function POST(request: Request) {
  const limited = rateLimit(request, "grade-triage", 5);
  if (!limited.ok) return NextResponse.json({ error: "Rate limited" }, { status: 429 });

  const gate = await requirePro();
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: 403 });

  const csv = await request.text();
  if (csv.length > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }
  const lines = csv.trim().split(/\r?\n/).slice(1);
  return NextResponse.json({
    ok: true,
    rows: lines.length,
    message: "Validated — run gradeOrSellAnalysis per row in worker (TODO).",
  });
}
