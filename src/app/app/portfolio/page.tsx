import { PortfolioCsvImport } from "@/components/portfolio-csv-import";

export default function PortfolioPage() {
  return (
    <div>
      <h1 className="h1">Portfolio</h1>
      <p className="lede">Import holdings from a CSV. Files are limited to 500 rows and 256 KB.</p>
      <PortfolioCsvImport className="mt-6" />
    </div>
  );
}
