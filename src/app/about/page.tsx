import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: "What Rip, Grade or Sell is, who it is for, and how we handle data.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate dark:prose-invert">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="mt-4 text-muted-foreground">
        Rip, Grade or Sell helps collectors compare three paths for sealed product and singles:
        opening packs, submitting for grading, or selling on a marketplace. We focus on transparent
        math—integer-cent money, cited sources, and formulas you can audit on our{" "}
        <a href="/methodology" className="text-primary underline">
          methodology
        </a>{" "}
        page.
      </p>
      <p className="mt-4 text-muted-foreground">
        Launch coverage starts with the Pokémon TCG, with Magic: The Gathering, Disney Lorcana, and
        One Piece planned next. Card images and identifiers come from licensed APIs and partner
        feeds where available; prices are snapshots, not investment advice.
      </p>
      <p className="mt-4 text-muted-foreground">
        Questions or corrections? Use the contact link in the footer once billing is live, or open
        an issue in the project repository.
      </p>
    </div>
  );
}
