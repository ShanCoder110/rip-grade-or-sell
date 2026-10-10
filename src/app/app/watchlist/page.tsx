import { EmptyState } from "@/components/empty-state";
import { createClient } from "@/lib/supabase/server";
import { hasPublicSupabaseConfig } from "@/env";

export default async function WatchlistPage() {
  if (!hasPublicSupabaseConfig()) {
    return (
      <div>
        <h1 className="h1">Watchlist</h1>
        <EmptyState
          title="Watchlist needs Supabase"
          body="Connect Supabase to save cards to your account, or use the demo sign-in in local dev when Supabase is not configured."
        />
      </div>
    );
  }
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("watchlist_items")
    .select("id, card_id, cards(name, number)")
    .limit(200);

  return (
    <div>
      <h1 className="h1">Watchlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">Save cards you are tracking. No item limit.</p>
      {!items?.length ? (
        <div className="mt-6">
          <EmptyState title="Nothing saved" body="Cards you watch will list here." />
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
    </div>
  );
}
