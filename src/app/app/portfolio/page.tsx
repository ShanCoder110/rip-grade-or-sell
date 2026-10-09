import { ProGate } from "@/components/pro-gate";
import { requirePro } from "@/lib/auth/entitlements";
import { PortfolioCsvImport } from "@/components/portfolio-csv-import";

export default async function PortfolioPage() {
  const gate = await requirePro();
  if (!gate.ok) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <ProGate feature="Portfolio EV tracking" />
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Portfolio</h1>
      <p className="text-sm text-muted-foreground">Import holdings via CSV (max 500 rows).</p>
      <PortfolioCsvImport className="mt-4" />
    </div>
  );
}
