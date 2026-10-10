import { afterEach, describe, expect, it } from "vitest";
import { filterSlugsForStaticGeneration } from "./static-params-filter";

describe("filterSlugsForStaticGeneration", () => {
  afterEach(() => {
    delete process.env.E2E_OMIT_STATIC_SET_SLUG;
  });

  it("returns all slugs when omit env is unset", () => {
    expect(filterSlugsForStaticGeneration(["a", "b"])).toEqual(["a", "b"]);
  });

  it("omits one slug for on-demand ISR e2e builds", () => {
    process.env.E2E_OMIT_STATIC_SET_SLUG = "delta-reign";
    expect(filterSlugsForStaticGeneration(["sample-stellar-crown", "delta-reign"])).toEqual([
      "sample-stellar-crown",
    ]);
  });
});
