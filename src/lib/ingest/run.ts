import { env, hasSupabaseConfig } from "@/env";
import {
  extractPriceCents,
  fetchPokemonCardsForSet,
  fetchPokemonSets,
} from "@/lib/sources/pokemontcg";
import { createServiceClient } from "@/lib/supabase/service";

export type IngestResult = {
  source: string;
  status: "success" | "skipped" | "error";
  records_upserted: number;
  error_message?: string;
};

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function ingestPokemonTcg(limitSets = 2): Promise<IngestResult> {
  const source = "pokemontcg.io";
  if (!hasSupabaseConfig()) {
    return { source, status: "skipped", records_upserted: 0, error_message: "No Supabase" };
  }
  if (!env.POKEMONTCG_API_KEY) {
    return {
      source,
      status: "skipped",
      records_upserted: 0,
      error_message: "POKEMONTCG_API_KEY not set — using seed data locally",
    };
  }

  const supabase = createServiceClient();
  const runId = crypto.randomUUID();
  await supabase.from("ingest_runs").insert({
    id: runId,
    source,
    status: "running",
    metadata: { limitSets },
  });

  let upserted = 0;
  try {
    const { data: game } = await supabase
      .from("games")
      .select("id")
      .eq("slug", "pokemon")
      .single();

    const gameId = game?.id;
    if (!gameId) throw new Error("pokemon game row missing — run seed");

    const sets = (await fetchPokemonSets(1, limitSets)).slice(0, limitSets);
    for (const set of sets) {
      const slug = set.id.toLowerCase();
      const { data: setRow } = await supabase
        .from("sets")
        .upsert(
          {
            game_id: gameId,
            slug,
            name: set.name,
            release_date: set.releaseDate ?? null,
          },
          { onConflict: "slug" },
        )
        .select("id")
        .single();

      if (!setRow) continue;
      const cards = await fetchPokemonCardsForSet(set.id, 1, 50);
      for (const card of cards) {
        const { data: cardRow } = await supabase
          .from("cards")
          .upsert(
            {
              set_id: setRow.id,
              number: card.number,
              name: card.name,
              rarity: card.rarity ?? "Unknown",
              image_url: card.images?.small ?? null,
              external_ids: { pokemontcg: card.id },
            },
            { onConflict: "set_id,number" },
          )
          .select("id")
          .single();

        const cents = extractPriceCents(card);
        if (cardRow && cents != null) {
          const { error } = await supabase.from("price_snapshots").upsert(
            {
              card_id: cardRow.id,
              source,
              price_cents: cents,
              captured_on: todayUtc(),
            },
            { onConflict: "card_id,product_id,source,captured_on" },
          );
          if (!error) upserted += 1;
        }
      }
    }

    await supabase
      .from("ingest_runs")
      .update({ status: "success", finished_at: new Date().toISOString(), records_upserted: upserted })
      .eq("id", runId);

    return { source, status: "success", records_upserted: upserted };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    await supabase
      .from("ingest_runs")
      .update({
        status: "error",
        finished_at: new Date().toISOString(),
        records_upserted: upserted,
        error_message: message,
      })
      .eq("id", runId);
    return { source, status: "error", records_upserted: upserted, error_message: message };
  }
}

export async function runFullIngest(): Promise<IngestResult[]> {
  return [await ingestPokemonTcg(2)];
}
