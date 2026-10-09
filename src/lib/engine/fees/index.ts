import ebay from "../../../../data/fees/ebay.json";
import mercari from "../../../../data/fees/mercari.json";
import paypal from "../../../../data/fees/paypal.json";
import tcgplayer from "../../../../data/fees/tcgplayer.json";
import whatnot from "../../../../data/fees/whatnot.json";
import { z } from "zod";

const scheduleSchema = z.object({
  platform: z.string(),
  currency: z.string(),
  effectiveFrom: z.string(),
  sourceUrl: z.string().url(),
  notes: z.string().optional(),
  rules: z.record(z.string(), z.unknown()),
});

export type Platform = "ebay" | "tcgplayer" | "whatnot" | "mercari" | "paypal";

const SCHEDULES: Record<Platform, z.infer<typeof scheduleSchema>> = {
  ebay: scheduleSchema.parse(ebay),
  tcgplayer: scheduleSchema.parse(tcgplayer),
  whatnot: scheduleSchema.parse(whatnot),
  mercari: scheduleSchema.parse(mercari),
  paypal: scheduleSchema.parse(paypal),
};

export type NetPayoutInput = {
  platform: Platform;
  priceCents: number;
  shippingCents: number;
  category?: string;
  country?: string;
  date?: string;
};

export type FeeLine = { label: string; amountCents: number };

export type NetPayoutResult = {
  platform: Platform;
  effectiveFrom: string;
  sourceUrl: string;
  lines: FeeLine[];
  netCents: number;
};

function pickSchedule(platform: Platform, date?: string) {
  const schedule = SCHEDULES[platform];
  if (!date || date >= schedule.effectiveFrom) return schedule;
  return schedule;
}

function bps(amountCents: number, bpsRate: number): number {
  return Math.round(amountCents * (bpsRate / 10_000));
}

export function netPayout(input: NetPayoutInput): NetPayoutResult {
  const schedule = pickSchedule(input.platform, input.date);
  const gross = input.priceCents + input.shippingCents;
  const lines: FeeLine[] = [];

  switch (input.platform) {
    case "ebay": {
      const rules = schedule.rules as {
        finalValueFeeBps: number;
        fixedFeeCents: number;
        categoryOverrides?: Record<string, { finalValueFeeBps: number }>;
      };
      const cat = input.category ?? "tcg";
      const bpsRate =
        rules.categoryOverrides?.[cat]?.finalValueFeeBps ?? rules.finalValueFeeBps;
      const fvf = bps(gross, bpsRate);
      lines.push({ label: "Final value fee", amountCents: fvf });
      lines.push({ label: "Per-order fee", amountCents: rules.fixedFeeCents });
      break;
    }
    case "tcgplayer": {
      const rules = schedule.rules as {
        commissionBps: number;
        paymentProcessingBps: number;
        paymentProcessingFixedCents: number;
      };
      lines.push({ label: "Commission", amountCents: bps(input.priceCents, rules.commissionBps) });
      lines.push({
        label: "Payment processing",
        amountCents:
          bps(input.priceCents, rules.paymentProcessingBps) + rules.paymentProcessingFixedCents,
      });
      break;
    }
    case "whatnot":
    case "mercari": {
      const rules = schedule.rules as {
        sellerFeeBps?: number;
        sellingFeeBps?: number;
        paymentProcessingBps: number;
        paymentProcessingFixedCents: number;
      };
      const sellerBps = rules.sellerFeeBps ?? rules.sellingFeeBps ?? 0;
      lines.push({ label: "Seller fee", amountCents: bps(input.priceCents, sellerBps) });
      lines.push({
        label: "Payment processing",
        amountCents:
          bps(input.priceCents, rules.paymentProcessingBps) + rules.paymentProcessingFixedCents,
      });
      break;
    }
    case "paypal": {
      const rules = schedule.rules as { gnsFeeBps: number; fixedFeeCents: number };
      lines.push({ label: "Goods & services", amountCents: bps(gross, rules.gnsFeeBps) });
      lines.push({ label: "Fixed fee", amountCents: rules.fixedFeeCents });
      break;
    }
    default:
      break;
  }

  const totalFees = lines.reduce((s, l) => s + l.amountCents, 0);
  return {
    platform: input.platform,
    effectiveFrom: schedule.effectiveFrom,
    sourceUrl: schedule.sourceUrl,
    lines,
    netCents: Math.max(0, gross - totalFees),
  };
}

export function rankPlatforms(input: Omit<NetPayoutInput, "platform">): NetPayoutResult[] {
  const platforms: Platform[] = ["tcgplayer", "ebay", "whatnot", "mercari", "paypal"];
  return platforms
    .map((platform) => netPayout({ ...input, platform }))
    .sort((a, b) => b.netCents - a.netCents);
}
