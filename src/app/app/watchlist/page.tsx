import { EmptyState } from "@/components/empty-state";
import { ProGate } from "@/components/pro-gate";
import { getUserPlan } from "@/lib/auth/entitlements";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";
import { FREE_WATCHLIST_CAP } from "@/lib/pro/limits";

export default async function WatchlistPage() {
  const plan = await getUserPlan();
  if (!hasPublicSupabaseConfig()) {
    return (
      <div>
        <h1 className="h1">Watchlist</h1>
        <EmptyState
          title={plan === "pro" ? "Pro is unlocked" : "Watchlist needs Supabase"}
          body={
            plan === "pro"
              ? "This demo session has Pro. Connect Supabase to store cards. The free cap does not apply."
              : `Free plan holds ${FREE_WATCHLIST_CAP} cards once Supabase is connected.`
          }
        />
      </div>
    );
  }
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("watchlist_items")
    .select("id, card_id, cards(name, number)")
    .limit(50);

  return (
    <div>
      <h1 className="h1">Watchlist</h1>
      {plan === "free" ? (
        <p className="mt-2 text-sm text-muted-foreground">Free plan holds {FREE_WATCHLIST_CAP} cards.</p>
      ) : null}
      {!items?.length ? (
        <div className="mt-6">
          <EmptyState title="Nothing saved" body="Cards you watch will list here, up to the free cap." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3 text-sm">
              {(item.cards as { name?: string; number?: string } | null)?.name ?? item.card_id}
            </li>
          ))}
        </ul>
      )}
      {plan === "free" && (items?.length ?? 0) >= FREE_WATCHLIST_CAP ? (
        <ProGate feature="Unlimited watchlist" />
      ) : null}
    </div>
  );
}
