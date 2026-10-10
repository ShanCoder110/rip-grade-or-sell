export const COOKIE_CONSENT_KEY = "cookie-consent";

/** User accepted optional cookies (analytics / personalized ads). */
export const CONSENT_ALL = "all";

/** Essential cookies only — no AdSense or optional analytics. */
export const CONSENT_ESSENTIAL = "essential";

export type CookieConsentValue = typeof CONSENT_ALL | typeof CONSENT_ESSENTIAL;

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === CONSENT_ALL || value === CONSENT_ESSENTIAL) return value;
  return null;
}

export function hasAdConsent(): boolean {
  return readCookieConsent() === CONSENT_ALL;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}
