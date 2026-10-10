import { describe, expect, it } from "vitest";
import {
  centsParamToInitialInput,
  dollarInputToCents,
  sanitizeDollarInput,
} from "./money-input";

describe("sanitizeDollarInput", () => {
  it("allows empty", () => {
    expect(sanitizeDollarInput("")).toBe("");
  });

  it("strips leading zeros", () => {
    expect(sanitizeDollarInput("05")).toBe("5");
    expect(sanitizeDollarInput("007")).toBe("7");
  });

  it("keeps decimal entry", () => {
    expect(sanitizeDollarInput("0.")).toBe("0.");
    expect(sanitizeDollarInput("12.5")).toBe("12.5");
    expect(sanitizeDollarInput("12.567")).toBe("12.56");
  });
});

describe("dollarInputToCents", () => {
  it("uses fallback when empty", () => {
    expect(dollarInputToCents("", 2000)).toBe(2000);
    expect(dollarInputToCents(".", 2000)).toBe(2000);
  });

  it("parses dollars and rounds to cents", () => {
    expect(dollarInputToCents("20", 0)).toBe(2000);
    expect(dollarInputToCents("19.99", 0)).toBe(1999);
    expect(dollarInputToCents("0.5", 0)).toBe(50);
  });
});

describe("centsParamToInitialInput", () => {
  it("hydrates share links as dollar strings", () => {
    expect(centsParamToInitialInput("2000")).toBe("20");
    expect(centsParamToInitialInput(null)).toBe("");
  });
});
