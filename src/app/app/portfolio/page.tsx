import { AppSignInPrompt } from "@/components/app/sign-in-prompt";
import { PortfolioDemo } from "@/components/app/portfolio-demo";
import { getAppDataMode } from "@/lib/app-data-mode";
import { readDemoSession } from "@/lib/auth/demo-session";
import { PortfolioCsvImport } from "@/components/portfolio-csv-import";

export default async function PortfolioPage() {
  const mode = await getAppDataMode();
  const demo = await readDemoSession();

  if (mode === "none") {
    return (
      <div>
        <h1 className="h1">Portfolio</h1>
        <AppSignInPrompt nextPath="/app/portfolio" />
      </div>
    );
  }

  if (mode === "demo" && demo) {
    return (
      <div>
        <h1 className="h1">Portfolio</h1>
        <p className="lede">Import holdings from a CSV. Files are limited to 500 rows and 256 KB.</p>
        <PortfolioDemo demoId={demo.id} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1">Portfolio</h1>
      <p className="lede">Import holdings from a CSV. Files are limited to 500 rows and 256 KB.</p>
      <PortfolioCsvImport className="mt-6" />
    </div>
  );
}
