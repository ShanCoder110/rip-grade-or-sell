import { EmptyState } from "@/components/empty-state";
import { AppSignInPrompt } from "@/components/app/sign-in-prompt";
import { WatchlistDemo } from "@/components/app/watchlist-demo";
import { getAppDataMode } from "@/lib/app-data-mode";
import { readDemoSession } from "@/lib/auth/demo-session";
import { createClient } from "@/lib/supabase/server";

export default async function WatchlistPage() {
  const mode = await getAppDataMode();
  const demo = await readDemoSession();

  if (mode === "none") {
    return (
      <div>
        <h1 className="h1">Watchlist</h1>
        <AppSignInPrompt nextPath="/app/watchlist" />
      </div>
    );
  }

  if (mode === "demo" && demo) {
    return (
      <div>
        <h1 className="h1">Watchlist</h1>
        <WatchlistDemo demoId={demo.id} />
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
