import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { Product } from "@/lib/queries";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0];
  const imageUrl = mainImage 
    ? urlFor(mainImage).width(400).height(400).format("webp").url() 
    : null;

  const statusColors = {
    disponible: "bg-green-100 text-green-800",
    "en demande": "bg-amber-100 text-amber-800",
    réservé: "bg-yellow-100 text-yellow-800",
    vendu: "bg-gray-100 text-gray-800",
  };

  return (
    <Link href={`/produit/${product.slug.current}`}>
      <div className="group overflow-hidden rounded-2xl border border-beige-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-[#EEF4EE]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#5F6C72]">
              Aucune image
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-lg font-medium text-[#5C3A21] line-clamp-2">
              {product.title}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-1 text-xs font-medium",
                statusColors[product.status]
              )}
            >
              {product.status}
            </span>
          </div>
          <p className="text-xl font-semibold text-[#6F8F72]">
            {product.price.toFixed(2)} €
          </p>
        </div>
      </div>
    </Link>
  );
}


