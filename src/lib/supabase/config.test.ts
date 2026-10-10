import { describe, expect, it } from "vitest";
import {
  isPlaceholderEnvValue,
  isPublicSupabaseConfigured,
  isSupabaseConfigured,
} from "./config";

describe("isPlaceholderEnvValue", () => {
  it("treats .env.example tokens as placeholders", () => {
    expect(isPlaceholderEnvValue("your-anon-key")).toBe(true);
    expect(isPlaceholderEnvValue("your-service-role-key")).toBe(true);
    expect(isPlaceholderEnvValue("")).toBe(true);
    expect(isPlaceholderEnvValue(undefined)).toBe(true);
  });

  it("accepts real-looking keys", () => {
    expect(isPlaceholderEnvValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")).toBe(false);
  });
});

describe("isPublicSupabaseConfigured", () => {
  it("is false for default .env.example copy", () => {
    expect(
      isPublicSupabaseConfigured("http://127.0.0.1:54321", "your-anon-key"),
    ).toBe(false);
  });

  it("is true when both url and anon key are real", () => {
    expect(
      isPublicSupabaseConfigured("http://127.0.0.1:54321", "eyJreal.anon.key"),
    ).toBe(true);
  });
});

describe("isSupabaseConfigured", () => {
  it("requires non-placeholder service role", () => {
    expect(
      isSupabaseConfigured(
        "http://127.0.0.1:54321",
        "eyJreal.anon.key",
        "your-service-role-key",
      ),
    ).toBe(false);
  });
});
