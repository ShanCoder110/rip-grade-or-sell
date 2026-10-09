import { describe, expect, it } from "vitest";
import {
  isWebhookEventProcessed,
  markWebhookEventProcessed,
} from "./webhook-idempotency";

describe("webhook idempotency", () => {
  it("tracks processed event ids", () => {
    const id = "evt_test_123";
    expect(isWebhookEventProcessed(id)).toBe(false);
    markWebhookEventProcessed(id);
    expect(isWebhookEventProcessed(id)).toBe(true);
  });
});
