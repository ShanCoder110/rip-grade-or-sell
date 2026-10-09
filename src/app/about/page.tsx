import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "What Rip, Grade or Sell is, who it is for, and how we handle data.",
};

export default function AboutPage() {
  return (
    <div className="page-narrow prose-page">
      <h1>About</h1>
      <p>
        Rip, Grade or Sell helps collectors compare three paths for sealed product and singles:
        opening packs, submitting for grading, or selling on a marketplace. The math stays in
        integer cents, every input cites a source, and the formulas are published on the{" "}
        <a href="/methodology">methodology</a> page.
      </p>
      <p>
        Launch coverage starts with the Pokémon TCG. Magic: The Gathering, Disney Lorcana, and One
        Piece are planned next. Card images and identifiers come from partner feeds where they are
        available. Prices are snapshots, not investment advice.
      </p>
      <p>
        Questions or corrections can go to the project repository until a public contact address is
        live.
      </p>
    </div>
  );
}
