import { env } from "@/env";

export function GET() {
  const publisher = env.ADSENSE_PUBLISHER_ID?.trim();
  if (!publisher) {
    return new Response("Not configured\n", { status: 404 });
  }
  const id = publisher.startsWith("pub-") ? publisher : `pub-${publisher}`;
  const body = `google.com, ${id}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
