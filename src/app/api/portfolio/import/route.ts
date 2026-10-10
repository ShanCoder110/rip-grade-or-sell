import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(request, "portfolio-import", 10);
  if (!limited.ok) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const csv = await request.text();
  const lines = csv.trim().split(/\r?\n/).slice(1);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let imported = 0;
  for (const line of lines) {
    const [card_id, quantity] = line.split(",");
    if (!card_id || !quantity) continue;
    const { error } = await supabase.from("portfolio_items").insert({
      user_id: user.id,
      card_id: card_id.trim(),
      quantity: Number(quantity),
    });
    if (!error) imported += 1;
  }

  return NextResponse.json({ message: `Imported ${imported} rows.` });
}
