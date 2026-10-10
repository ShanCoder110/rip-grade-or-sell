import { describe, expect, it } from "vitest";
import { CONSENT_ALL, CONSENT_ESSENTIAL, COOKIE_CONSENT_KEY } from "./consent";

describe("cookie consent constants", () => {
  it("uses a stable storage key", () => {
    expect(COOKIE_CONSENT_KEY).toBe("cookie-consent");
  });

  it("distinguishes all vs essential", () => {
    expect(CONSENT_ALL).not.toBe(CONSENT_ESSENTIAL);
  });
});
