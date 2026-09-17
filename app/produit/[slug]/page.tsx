import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import Button from "@/components/ui/Button";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import ProductGallery, { type GalleryPhoto } from "@/components/products/ProductGallery";
import { contactFormLink, whatsappLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

interface ProductPageProps {
  params: { slug: string };
}

// ISR : régénère la page toutes les 60 secondes pour les nouveaux produits
export const revalidate = 60;

// Génère tous les slugs de produits pour l'export statique
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug.current,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération des paramètres statiques:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Produit non trouvé - Fil & Flow",
    };
  }
  return {
    title: `${product.title} - Fil & Flow`,
    description: `Découvrez ${product.title}, une création artisanale unique.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await getProductBySlug(params.slug);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  // Toutes les photos alimentent la galerie, plus seulement les cinq premières.
  // Les trois tailles sont calculées ici, côté serveur : le composant de galerie
  // est client et ne doit pas embarquer le client Sanity.
  const photos: GalleryPhoto[] = (product.images ?? []).map((image, index) => ({
    src: urlFor(image).width(1000).height(1000).format("webp").url(),
    thumb: urlFor(image).width(240).height(240).format("webp").url(),
    full: urlFor(image).width(1800).format("webp").url(),
    alt: index === 0 ? product.title : `${product.title} — photo ${index + 1}`,
  }));

  const statusColors = {
    disponible: "bg-green-100 text-green-800",
    "en demande": "bg-amber-100 text-amber-800",
    réservé: "bg-yellow-100 text-yellow-800",
    vendu: "bg-gray-100 text-gray-800",
  };

  // Contacts : voir lib/contact.ts. Le lien WhatsApp vaut null tant qu'aucun
  // numéro réel n'est configuré, et le bouton n'est alors pas affiché.
  const enquiry = `Bonjour,\n\nJe suis intéressé(e) par votre création "${product.title}".\n\nPourriez-vous me donner plus d'informations ?\n\nMerci !`;
  const whatsappUrl = whatsappLink(enquiry);
  const contactUrl = contactFormLink(enquiry);

  // Données structurées : permettent à Google d'afficher le prix et la
  // disponibilité directement dans les résultats. La disponibilité reflète
  // le statut réel saisi dans le Studio, jamais une valeur optimiste.
  const availability =
    product.status === "disponible"
      ? "https://schema.org/InStock"
      : product.status === "vendu"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/PreOrder";

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: photos.map((p) => p.src),
    ...(typeof product.description === "string" && product.description
      ? { description: product.description }
      : {}),
    brand: { "@type": "Brand", name: "Fil & Flow" },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Fil & Flow" },
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <ProductGallery photos={photos} title={product.title} />

        {/* Informations */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-4 text-3xl font-light tracking-wide md:text-4xl">
              {product.title}
            </h1>
            <div className="mb-4 flex items-center gap-4">
              <p className="text-3xl font-semibold text-primary-700">
                {product.price.toFixed(2)} €
              </p>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  statusColors[product.status]
                )}
              >
                {product.status}
              </span>
            </div>
          </div>

          {product.description && (
            <div className="prose max-w-none text-gray-700">
              {/* Vous pouvez utiliser @portabletext/react pour afficher le rich text */}
              <p className="whitespace-pre-line">
                {typeof product.description === "string"
                  ? product.description
                  : "Description disponible"}
              </p>
            </div>
          )}

          {/*
            Conteneur en flex : les liens étaient des éléments inline, sur
            lesquels la marge verticale de `space-y-3` n'avait aucun effet.
            Les trois boutons apparaissaient donc collés. En flex, les liens
            sont transformés en blocs et `gap` s'applique réellement.
          */}
          {product.status === "disponible" && (
            <div className="flex flex-col gap-5 pt-6">
              <CheckoutButton
                type="product"
                slug={product.slug.current}
                basePrice={product.price}
                itemLabel={product.title}
                size="lg"
                className="flex w-full items-center justify-center gap-2"
              >
                Acheter — {product.price.toFixed(2)} €
              </CheckoutButton>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 pb-1" aria-hidden>
                  <span className="h-px flex-1 bg-heading/12" />
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-text-secondary">
                    ou une question
                  </span>
                  <span className="h-px flex-1 bg-heading/12" />
                </div>

                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="flex w-full items-center justify-center gap-3">
                      <Image src="/icone whatapp.PNG" alt="" width={20} height={20} className="h-5 w-5 object-contain" aria-hidden />
                      Contacter par WhatsApp
                    </Button>
                  </a>
                )}

                <Link href={contactUrl} className="block">
                  <Button variant="outline" className="flex w-full items-center justify-center gap-3">
                    <Image src="/icone lettre coeur.PNG" alt="" width={20} height={20} className="h-5 w-5 object-contain" aria-hidden />
                    Écrire un message
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {(product.status === "en demande" || product.status === "réservé") && (
            <div className={cn(
              "rounded-lg p-4 text-sm",
              product.status === "en demande" ? "bg-amber-50 text-amber-800" : "bg-yellow-50 text-yellow-800"
            )}>
              {product.status === "en demande"
                ? "Ce produit est en demande. Contactez-nous pour être informé(e) en cas de disponibilité."
                : "Ce produit est actuellement réservé. Contactez-nous pour être informé(e) en cas de disponibilité."}
            </div>
          )}

          {product.status === "vendu" && (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              Ce produit a été vendu. Découvrez nos autres créations dans la
              boutique.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


