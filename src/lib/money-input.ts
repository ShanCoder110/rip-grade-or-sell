/** User-facing dollar amount string → integer cents for engine calls. */
export function dollarInputToCents(input: string, fallbackCents: number): number {
  const trimmed = input.trim();
  if (trimmed === "" || trimmed === ".") return fallbackCents;
  const normalized = trimmed.replace(/,/g, "");
  const dollars = Number(normalized);
  if (!Number.isFinite(dollars) || dollars < 0) return fallbackCents;
  return Math.round(dollars * 100);
}

/** Format cents for share URLs (still integer cents for backward compatibility). */
export function centsToShareParam(cents: number): string {
  return String(cents);
}

/** Parse legacy share URL cents param into an initial empty input (placeholder shows default). */
export function centsParamToInitialInput(param: string | null): string {
  if (param == null || param === "") return "";
  const cents = Number(param);
  if (!Number.isFinite(cents) || cents < 0) return "";
  return centsToEditableDollars(cents);
}

export function centsToEditableDollars(cents: number): string {
  const dollars = cents / 100;
  if (Number.isInteger(dollars)) return String(dollars);
  return dollars.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatDollarsHint(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

/**
 * Sanitize free-form dollar input while typing: digits + one decimal, max 2 fractional digits, no leading zeros.
 */
export function sanitizeDollarInput(raw: string): string {
  let s = raw.replace(/[^\d.]/g, "");
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
  }

  if (s === "" || s === ".") return s;

  let whole: string;
  let frac = "";
  if (firstDot !== -1) {
    const parts = s.split(".");
    whole = parts[0] ?? "";
    frac = (parts[1] ?? "").slice(0, 2);
  } else {
    whole = s;
  }

  if (whole.length > 1) {
    whole = whole.replace(/^0+/, "") || "0";
  }

  if (firstDot !== -1) {
    return frac.length > 0 || s.endsWith(".") ? `${whole}.${frac}` : whole;
  }
  return whole;
}
