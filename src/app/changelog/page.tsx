import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Changelog</h1>
      <ul className="mt-6 space-y-4 text-sm">
        <li>
          <time className="font-mono text-muted-foreground">2026-03-26</time>
          <p className="font-medium">Initial public preview</p>
          <p className="text-muted-foreground">
            Set EV pages, grade-or-sell and fee calculators, pack simulator, Pro billing scaffold.
          </p>
        </li>
      </ul>
    </div>
  );
}
