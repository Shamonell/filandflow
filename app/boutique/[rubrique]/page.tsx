import { Metadata } from "next";
import { notFound } from "next/navigation";
import BoutiqueView from "@/components/boutique/BoutiqueView";
import { getShopData } from "@/lib/shop";

interface RubriquePageProps {
  params: { rubrique: string };
}

// Même rythme que /boutique : une rubrique créée dans /admin apparaît en moins d'une minute.
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { categories } = await getShopData();
    return categories.map((c) => ({ rubrique: c.slug }));
  } catch (error) {
    console.error("Erreur lors de la génération des rubriques:", error);
    return [];
  }
}

export async function generateMetadata({ params }: RubriquePageProps): Promise<Metadata> {
  try {
    const { categories } = await getShopData();
    const category = categories.find((c) => c.slug === params.rubrique);
    if (category) {
      return {
        title: `${category.title} - Boutique - Fil & Flow`,
        description:
          category.word ??
          `${category.title} : créations artisanales uniques, faites main à Chabeuil.`,
      };
    }
  } catch {
    /* repli ci-dessous */
  }
  return { title: "Boutique - Fil & Flow" };
}

export default async function RubriquePage({ params }: RubriquePageProps) {
  const data = await getShopData();
  if (!data.categories.some((c) => c.slug === params.rubrique)) {
    notFound();
  }
  return <BoutiqueView data={data} initialSlug={params.rubrique} />;
}
