import { ProGate } from "@/components/pro-gate";
import { requirePro } from "@/lib/auth/entitlements";

export default async function AlertsPage() {
  const gate = await requirePro();
  if (!gate.ok) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <ProGate feature="Price &amp; EV email alerts" />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Alerts</h1>
      <p className="text-sm text-muted-foreground">
        Daily cron checks thresholds and sends email via Resend when configured.
      </p>
    </div>
  );
}
