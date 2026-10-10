import { AlertsDemo } from "@/components/app/alerts-demo";
import { AppSignInPrompt } from "@/components/app/sign-in-prompt";
import { getAppDataMode } from "@/lib/app-data-mode";
import { readDemoSession } from "@/lib/auth/demo-session";

export default async function AlertsPage() {
  const mode = await getAppDataMode();
  const demo = await readDemoSession();

  if (mode === "none") {
    return (
      <div>
        <h1 className="h1">Alerts</h1>
        <AppSignInPrompt nextPath="/app/alerts" />
      </div>
    );
  }

  if (mode === "demo" && demo) {
    return (
      <div>
        <h1 className="h1">Alerts</h1>
        <AlertsDemo demoId={demo.id} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1">Alerts</h1>
      <p className="lede">
        A secured daily job checks your thresholds and sends mail through Resend when that key is
        set. Sign in to save alert rules to your account.
      </p>
    </div>
  );
}
