import { ProGate } from "@/components/pro-gate";
import { requirePro } from "@/lib/auth/entitlements";

export default async function AlertsPage() {
  const gate = await requirePro();
  if (!gate.ok) {
    return (
      <div>
        <h1 className="h1">Alerts</h1>
        <ProGate feature="Price and EV email alerts" />
      </div>
    );
  }
  return (
    <div>
      <h1 className="h1">Alerts</h1>
      <p className="lede">
        A secured daily job checks your thresholds and sends mail through Resend when that key is
        set.
      </p>
    </div>
  );
}
