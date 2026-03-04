import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import Button from "@/components/ui/Button";
import CheckoutButton from "@/components/checkout/CheckoutButton";
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

  const mainImage = product.images?.[0];
  const imageUrl = mainImage
    ? urlFor(mainImage).width(800).height(800).url()
    : null;

  const statusColors = {
    disponible: "bg-green-100 text-green-800",
    réservé: "bg-yellow-100 text-yellow-800",
    vendu: "bg-gray-100 text-gray-800",
  };

  // Configuration des contacts via variables d'environnement
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000";
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par "${product.title}". Pourriez-vous me donner plus d'informations ?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@fil-et-flow.fr";
  const emailSubject = encodeURIComponent(`Demande d'information - ${product.title}`);
  const emailBody = encodeURIComponent(
    `Bonjour,\n\nJe suis intéressé(e) par votre création "${product.title}".\n\nPourriez-vous me donner plus d'informations ?\n\nMerci !`
  );
  const emailUrl = `mailto:${contactEmail}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {imageUrl ? (
            <div className="relative aspect-square overflow-hidden rounded-lg bg-primary-50">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg bg-primary-50 text-gray-400">
              Aucune image disponible
            </div>
          )}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => {
                const thumbUrl = urlFor(image).width(200).height(200).url();
                return (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-primary-50"
                  >
                    <Image
                      src={thumbUrl}
                      alt={`${product.title} - Vue ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

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

          {product.status === "disponible" && (
            <div className="space-y-3 pt-4">
              <CheckoutButton
                type="product"
                slug={product.slug.current}
                size="lg"
                className="flex w-full items-center justify-center gap-2"
              >
                Acheter — {product.price.toFixed(2)} €
              </CheckoutButton>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="flex w-full items-center justify-center gap-3">
                  <img
                    src="/icone whatapp.PNG"
                    alt=""
                    className="h-5 w-5 object-contain"
                    aria-hidden="true"
                  />
                  Contacter par WhatsApp
                </Button>
              </a>
              <a href={emailUrl}>
                <Button variant="outline" className="flex w-full items-center justify-center gap-3">
                  <img
                    src="/icone lettre coeur.PNG"
                    alt=""
                    className="h-5 w-5 object-contain"
                    aria-hidden="true"
                  />
                  Envoyer un e-mail
                </Button>
              </a>
            </div>
          )}

          {product.status === "réservé" && (
            <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
              Ce produit est actuellement réservé. Contactez-nous pour être
              informé(e) en cas de disponibilité.
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


