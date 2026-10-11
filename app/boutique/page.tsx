import { Metadata } from "next";
import BoutiqueView from "@/components/boutique/BoutiqueView";
import { getShopData, type ShopData } from "@/lib/shop";

// ISR : régénère la page toutes les 60 secondes pour afficher les nouveaux produits
// Cela permet d'afficher automatiquement les produits créés dans Sanity sans rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique - Fil & Flow",
  description: "Découvrez nos créations artisanales uniques, faites main avec passion",
};

export default async function BoutiquePage() {
  let data: ShopData = { items: [], categories: [] };
  try {
    data = await getShopData();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
  }

  return <BoutiqueView data={data} initialSlug={null} />;
}
