import { notFound } from "next/navigation";
import { getSetBySlug } from "@/lib/data/sets";

export const revalidate = 86400;
export const dynamicParams = true;

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

/** Resolve the set before any child route streams (avoids 200 + soft 404 from loading UI). */
export default async function SetSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) notFound();
  return children;
}
