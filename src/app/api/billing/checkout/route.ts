import { NextResponse } from "next/server";
import { z } from "zod";
import { getBillingProvider } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  interval: z.enum(["month", "year"]),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = bodySchema.safeParse(await request.json());
  if (!json.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const session = await getBillingProvider().createCheckout(
    user.id,
    user.email,
    json.data.interval,
  );
  return NextResponse.json(session);
}
