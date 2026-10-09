import { ProGate } from "@/components/pro-gate";
import { getUserPlan } from "@/lib/auth/entitlements";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";
import { FREE_WATCHLIST_CAP } from "@/lib/pro/limits";

export default async function WatchlistPage() {
  const plan = await getUserPlan();
  if (!hasPublicSupabaseConfig()) {
    return <p className="text-sm">Configure Supabase to use watchlist.</p>;
  }
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("watchlist_items")
    .select("id, card_id, cards(name, number)")
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold">Watchlist</h1>
      {plan === "free" ? (
        <p className="text-sm text-muted-foreground">Free cap: {FREE_WATCHLIST_CAP} cards.</p>
      ) : null}
      <ul className="mt-4 space-y-2 text-sm">
        {(items ?? []).map((item) => (
          <li key={item.id} className="rounded border border-border px-3 py-2">
            {(item.cards as { name?: string; number?: string } | null)?.name ?? item.card_id}
          </li>
        ))}
        {!items?.length ? <li className="text-muted-foreground">No items yet.</li> : null}
      </ul>
      {plan === "free" && (items?.length ?? 0) >= FREE_WATCHLIST_CAP ? (
        <ProGate feature="Unlimited watchlist" />
      ) : null}
    </div>
  );
}
