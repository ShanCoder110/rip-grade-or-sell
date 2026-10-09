import { describe, expect, it } from "vitest";
import { formatCents } from "./utils";

describe("formatCents", () => {
  it("formats USD from integer cents", () => {
    expect(formatCents(199)).toBe("$1.99");
  });
});
