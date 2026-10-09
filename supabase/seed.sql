-- SAMPLE DATA ONLY — not real market prices or pull rates. Replace via ingestion.

insert into public.games (id, slug, name)
values
  ('11111111-1111-4111-8111-111111111111', 'pokemon', 'Pokémon TCG'),
  ('22222222-2222-4222-8222-222222222222', 'mtg', 'Magic: The Gathering');

insert into public.sets (id, game_id, slug, name, release_date, is_prerelease)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'sample-stellar-crown',
    'Sample Set — Stellar Crown (demo)',
    '2024-09-13',
    false
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '11111111-1111-4111-8111-111111111111',
    'delta-reign',
    'Delta Reign (pre-release template)',
    '2026-06-01',
    true
  );

insert into public.products (id, set_id, slug, kind, name, msrp_cents, pack_count)
values
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'booster-box',
    'box',
    'Sample Booster Box (36 packs)',
    14364,
    36
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'etb',
    'etb',
    'Sample Elite Trainer Box',
    4999,
    9
  );

insert into public.cards (id, set_id, number, name, rarity, image_url, external_ids)
values
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '001',
    'Sample Rare Holo',
    'Rare Holo',
    null,
    '{"pokemontcg": "sample-001"}'::jsonb
  ),
  (
    'ffffffff-ffff-4fff-8fff-ffffffffffff',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '002',
    'Sample Illustration Rare',
    'Illustration Rare',
    null,
    '{"pokemontcg": "sample-002"}'::jsonb
  );

-- Pull rates: clearly labeled sample odds (1 in X packs)
insert into public.pull_rates (set_id, product_id, rarity, odds, source_url, source_date, confidence)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'Rare Holo',
    6,
    'https://example.com/sample-pull-rate-source',
    '2024-01-01',
    'sample'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    'Illustration Rare',
    12,
    'https://example.com/sample-pull-rate-source',
    '2024-01-01',
    'sample'
  );

insert into public.price_snapshots (card_id, source, price_cents, captured_on)
values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'seed_sample', 350, current_date - 5),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'seed_sample', 375, current_date),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'seed_sample', 1200, current_date);

insert into public.price_snapshots (product_id, source, price_cents, captured_on)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'seed_sample', 12999, current_date),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'seed_sample', 4499, current_date);

insert into public.grading_fees (service, tier, fee_cents, effective_date)
values
  ('PSA', 'Economy', 2500, '2024-01-01'),
  ('PSA', 'Regular', 3500, '2024-01-01');
