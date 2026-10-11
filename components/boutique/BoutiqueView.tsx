import ShopBrowser from "@/components/boutique/ShopBrowser";
import type { ShopData } from "@/lib/shop";

/** Mise en page commune de /boutique et /boutique/[rubrique]. */
export default function BoutiqueView({
  data,
  initialSlug,
}: {
  data: ShopData;
  initialSlug: string | null;
}) {
  return (
    <div className="bg-[#FBF8F3]">
      <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="mb-10 text-center">
            <h1 className="mb-6 text-4xl font-light tracking-wide text-[#5C3A21] md:text-5xl lg:text-6xl">
              Boutique
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5F6C72] md:text-xl">
              Chaque création est unique, réalisée à la main avec soin et attention
              aux détails.
            </p>
          </div>

          {data.items.length === 0 ? (
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
            <ShopBrowser
              items={data.items}
              categories={data.categories}
              initialSlug={initialSlug}
              now={Date.now()}
            />
          )}
        </div>
      </div>
    </div>
  );
}
