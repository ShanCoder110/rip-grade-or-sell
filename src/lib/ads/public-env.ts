import { z } from "zod";

const clientIdSchema = z
  .string()
  .regex(/^ca-pub-\d+$/, "NEXT_PUBLIC_ADSENSE_CLIENT_ID must look like ca-pub-1234567890123456")
  .optional();

const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || undefined;

const parsed = clientIdSchema.safeParse(raw);
if (!parsed.success && raw) {
  console.warn("Invalid NEXT_PUBLIC_ADSENSE_CLIENT_ID — ads will be disabled.", parsed.error.message);
}

/** Validated AdSense publisher client id, or undefined when unset/invalid. */
export const adsenseClientId = parsed.success ? parsed.data : undefined;
