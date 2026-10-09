-- Rip, Grade or Sell — initial schema (integer cents, RLS on all tables)

create extension if not exists "pgcrypto";
create extension if not exists pg_trgm;

-- Games
create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

-- Sets
create table public.sets (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  slug text not null unique,
  name text not null,
  release_date date,
  is_prerelease boolean not null default false,
  created_at timestamptz not null default now()
);

create index sets_game_id_idx on public.sets (game_id);
create index sets_release_date_idx on public.sets (release_date desc);

-- Cards
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.sets (id) on delete cascade,
  number text not null,
  name text not null,
  rarity text not null,
  image_url text,
  external_ids jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (set_id, number)
);

create index cards_set_id_idx on public.cards (set_id);
create index cards_name_trgm_idx on public.cards using gin (name gin_trgm_ops);

-- Products (sealed)
create type public.product_kind as enum ('box', 'etb', 'bundle', 'pack');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.sets (id) on delete cascade,
  slug text not null,
  kind public.product_kind not null,
  name text not null,
  msrp_cents integer not null check (msrp_cents >= 0),
  pack_count integer not null check (pack_count > 0),
  created_at timestamptz not null default now(),
  unique (set_id, slug)
);

create index products_set_id_idx on public.products (set_id);

-- Price snapshots (card or product)
create table public.price_snapshots (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references public.cards (id) on delete cascade,
  product_id uuid references public.products (id) on delete cascade,
  source text not null,
  price_cents integer not null check (price_cents >= 0),
  captured_on date not null default (timezone('utc', now())::date),
  created_at timestamptz not null default now(),
  check (
    (card_id is not null and product_id is null)
    or (card_id is null and product_id is not null)
  ),
  unique nulls not distinct (card_id, product_id, source, captured_on)
);

create index price_snapshots_card_captured_idx on public.price_snapshots (card_id, captured_on desc);
create index price_snapshots_product_captured_idx on public.price_snapshots (product_id, captured_on desc);
create index price_snapshots_source_captured_idx on public.price_snapshots (source, captured_on desc);

-- Pull rates (sample / published odds)
create table public.pull_rates (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.sets (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  rarity text not null,
  odds numeric not null check (odds > 0),
  source_url text not null,
  source_date date not null,
  confidence text not null default 'sample',
  created_at timestamptz not null default now()
);

create index pull_rates_set_id_idx on public.pull_rates (set_id);

-- Grading fees
create table public.grading_fees (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  tier text not null,
  fee_cents integer not null check (fee_cents >= 0),
  effective_date date not null,
  created_at timestamptz not null default now(),
  unique (service, tier, effective_date)
);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subscriptions (written by service role / webhooks only)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null,
  provider_subscription_id text not null,
  status text not null,
  plan_interval text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

-- Entitlements
create type public.entitlement_plan as enum ('free', 'pro');
create type public.entitlement_status as enum ('active', 'canceled', 'past_due', 'trialing');

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  plan public.entitlement_plan not null default 'free',
  status public.entitlement_status not null default 'active',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- Watchlist
create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, card_id)
);

create index watchlist_user_id_idx on public.watchlist_items (user_id);

-- Alerts (Pro)
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid references public.cards (id) on delete cascade,
  set_id uuid references public.sets (id) on delete cascade,
  threshold_cents integer not null,
  direction text not null check (direction in ('above', 'below')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index alerts_user_id_idx on public.alerts (user_id);

-- Portfolio
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  cost_basis_cents integer,
  notes text,
  created_at timestamptz not null default now()
);

create index portfolio_user_id_idx on public.portfolio_items (user_id);

-- Email capture
create table public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'set_page',
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Ingest runs
create table public.ingest_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records_upserted integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create index ingest_runs_source_started_idx on public.ingest_runs (source, started_at desc);

-- RLS
alter table public.games enable row level security;
alter table public.sets enable row level security;
alter table public.cards enable row level security;
alter table public.products enable row level security;
alter table public.price_snapshots enable row level security;
alter table public.pull_rates enable row level security;
alter table public.grading_fees enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.alerts enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.email_subscribers enable row level security;
alter table public.ingest_runs enable row level security;

-- Public read for market data
create policy "games_public_read" on public.games for select to anon, authenticated using (true);
create policy "sets_public_read" on public.sets for select to anon, authenticated using (true);
create policy "cards_public_read" on public.cards for select to anon, authenticated using (true);
create policy "products_public_read" on public.products for select to anon, authenticated using (true);
create policy "price_snapshots_public_read" on public.price_snapshots for select to anon, authenticated using (true);
create policy "pull_rates_public_read" on public.pull_rates for select to anon, authenticated using (true);
create policy "grading_fees_public_read" on public.grading_fees for select to anon, authenticated using (true);

-- Profiles: owner read/write
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

-- Subscriptions: owner read only, no client writes
create policy "subscriptions_select_own" on public.subscriptions for select to authenticated using (auth.uid() = user_id);

-- Entitlements: owner read only, no client writes
create policy "entitlements_select_own" on public.entitlements for select to authenticated using (auth.uid() = user_id);

-- Watchlist owner CRUD
create policy "watchlist_select_own" on public.watchlist_items for select to authenticated using (auth.uid() = user_id);
create policy "watchlist_insert_own" on public.watchlist_items for insert to authenticated with check (auth.uid() = user_id);
create policy "watchlist_delete_own" on public.watchlist_items for delete to authenticated using (auth.uid() = user_id);

-- Alerts owner CRUD (Pro enforced in app layer)
create policy "alerts_select_own" on public.alerts for select to authenticated using (auth.uid() = user_id);
create policy "alerts_insert_own" on public.alerts for insert to authenticated with check (auth.uid() = user_id);
create policy "alerts_update_own" on public.alerts for update to authenticated using (auth.uid() = user_id);
create policy "alerts_delete_own" on public.alerts for delete to authenticated using (auth.uid() = user_id);

-- Portfolio owner CRUD
create policy "portfolio_select_own" on public.portfolio_items for select to authenticated using (auth.uid() = user_id);
create policy "portfolio_insert_own" on public.portfolio_items for insert to authenticated with check (auth.uid() = user_id);
create policy "portfolio_update_own" on public.portfolio_items for update to authenticated using (auth.uid() = user_id);
create policy "portfolio_delete_own" on public.portfolio_items for delete to authenticated using (auth.uid() = user_id);

-- Email subscribers: anon can insert (capture), no public read
create policy "email_subscribers_insert_anon" on public.email_subscribers for insert to anon, authenticated with check (true);

-- Ingest runs: no public access (service role bypasses RLS)
-- (no policies)

-- Auth trigger for profiles + default entitlement
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  insert into public.entitlements (user_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
