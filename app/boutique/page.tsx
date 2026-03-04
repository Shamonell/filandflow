import { Metadata } from "next";
import { getProducts, Product } from "@/lib/queries";
import ProductCard from "@/components/products/ProductCard";

// ISR : régénère la page toutes les 60 secondes pour afficher les nouveaux produits
// Cela permet d'afficher automatiquement les produits créés dans Sanity sans rebuild
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Boutique - Fil & Flow",
  description: "Découvrez nos créations artisanales uniques, faites main avec passion",
};

export default async function BoutiquePage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    products = [];
  }

  return (
    <div className="bg-[#FBF8F3]">
      <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-light tracking-wide text-[#5C3A21] md:text-5xl lg:text-6xl">
              Boutique
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5F6C72] md:text-xl">
              Chaque création est unique, réalisée à la main avec soin et attention
              aux détails.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-[#EEF4EE] p-12 text-center">
              <p className="text-lg text-[#5F6C72]">
                Aucun produit disponible pour le moment.
              </p>
              <p className="mt-4 text-[#5F6C72]">
                N&apos;hésitez pas à me contacter pour découvrir les prochaines
                créations.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


