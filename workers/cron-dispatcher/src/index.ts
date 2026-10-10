/**
 * Cloudflare Cron Trigger worker — calls protected Next.js cron routes on the main app worker.
 * Deploy with: npm run deploy:cron
 */
interface Env {
  /** Service binding to the OpenNext worker (rip-grade-or-sell). */
  APP: Fetcher;
  CRON_SECRET: string;
}

const INGEST_CRON = "0 6 * * *";
const ALERTS_CRON = "0 7 * * *";

const cronDispatcher = {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const path =
      event.cron === INGEST_CRON
        ? "/api/cron/ingest"
        : event.cron === ALERTS_CRON
          ? "/api/cron/alerts"
          : null;
    if (!path) {
      console.warn("Unknown cron schedule", event.cron);
      return;
    }

    const response = await env.APP.fetch(`https://cron.internal${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.CRON_SECRET}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Cron ${path} failed`, response.status, body);
      throw new Error(`Cron ${path} returned ${response.status}`);
    }
  },
};
