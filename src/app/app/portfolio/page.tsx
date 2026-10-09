import { ProGate } from "@/components/pro-gate";
import { PortfolioCsvImport } from "@/components/portfolio-csv-import";
import { requirePro } from "@/lib/auth/entitlements";

export default async function PortfolioPage() {
  const gate = await requirePro();
  if (!gate.ok) {
    return (
      <div>
        <h1 className="h1">Portfolio</h1>
        <ProGate feature="Portfolio EV tracking" />
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
