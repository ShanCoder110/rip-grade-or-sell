/**
 * Generated from supabase/migrations — run `npm run db:types` after `supabase start`
 * to refresh from a live local instance.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>;
      };
      sets: {
        Row: {
          id: string;
          game_id: string;
          slug: string;
          name: string;
          release_date: string | null;
          is_prerelease: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          slug: string;
          name: string;
          release_date?: string | null;
          is_prerelease?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sets"]["Insert"]>;
      };
      cards: {
        Row: {
          id: string;
          set_id: string;
          number: string;
          name: string;
          rarity: string;
          image_url: string | null;
          external_ids: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          number: string;
          name: string;
          rarity: string;
          image_url?: string | null;
          external_ids?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cards"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          set_id: string;
          slug: string;
          kind: "box" | "etb" | "bundle" | "pack";
          name: string;
          msrp_cents: number;
          pack_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          slug: string;
          kind: "box" | "etb" | "bundle" | "pack";
          name: string;
          msrp_cents: number;
          pack_count: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      price_snapshots: {
        Row: {
          id: string;
          card_id: string | null;
          product_id: string | null;
          source: string;
          price_cents: number;
          captured_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id?: string | null;
          product_id?: string | null;
          source: string;
          price_cents: number;
          captured_on?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["price_snapshots"]["Insert"]>;
      };
      pull_rates: {
        Row: {
          id: string;
          set_id: string;
          product_id: string | null;
          rarity: string;
          odds: number;
          source_url: string;
          source_date: string;
          confidence: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          set_id: string;
          product_id?: string | null;
          rarity: string;
          odds: number;
          source_url: string;
          source_date: string;
          confidence?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pull_rates"]["Insert"]>;
      };
      grading_fees: {
        Row: {
          id: string;
          service: string;
          tier: string;
          fee_cents: number;
          effective_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          service: string;
          tier: string;
          fee_cents: number;
          effective_date: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["grading_fees"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_subscription_id: string;
          status: string;
          plan_interval: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          provider_subscription_id: string;
          status: string;
          plan_interval: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      entitlements: {
        Row: {
          id: string;
          user_id: string;
          plan: "free" | "pro";
          status: "active" | "canceled" | "past_due" | "trialing";
          current_period_end: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: "free" | "pro";
          status?: "active" | "canceled" | "past_due" | "trialing";
          current_period_end?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["entitlements"]["Insert"]>;
      };
      watchlist_items: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["watchlist_items"]["Insert"]>;
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          card_id: string | null;
          set_id: string | null;
          threshold_cents: number;
          direction: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id?: string | null;
          set_id?: string | null;
          threshold_cents: number;
          direction: string;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
      portfolio_items: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          quantity: number;
          cost_basis_cents: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          quantity?: number;
          cost_basis_cents?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>;
      };
      email_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string;
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          unsubscribed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["email_subscribers"]["Insert"]>;
      };
      ingest_runs: {
        Row: {
          id: string;
          source: string;
          status: string;
          started_at: string;
          finished_at: string | null;
          records_upserted: number;
          error_message: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          source: string;
          status: string;
          started_at?: string;
          finished_at?: string | null;
          records_upserted?: number;
          error_message?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["ingest_runs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_kind: "box" | "etb" | "bundle" | "pack";
      entitlement_plan: "free" | "pro";
      entitlement_status: "active" | "canceled" | "past_due" | "trialing";
    };
  };
};
