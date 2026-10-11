/**
 * Données de la boutique, préparées côté serveur pour le menu de rubriques
 * (components/boutique/ShopBrowser.tsx) : URLs d'images calculées ici, pour
 * que le composant client n'embarque pas le client Sanity.
 */

import { getProducts, getShopCategories, type Product } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import { slugify } from "@/sanity/schemas/slugify";

export type ProductStatus = Product["status"];

export interface ShopItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: ProductStatus;
  imageUrl: string | null;
  /** Date de création ISO, pour le tri « plus récentes » et la pastille « Nouveau ». */
  createdAt: string | null;
  categoryId: string | null;
}

export interface ShopCategory {
  id: string;
  title: string;
  /** Adresse de la rubrique : /boutique/{slug}, déduite du nom. */
  slug: string;
  word: string | null;
  /** Vignette de l'étiquette : photo de la pièce disponible la plus récente. */
  thumbUrl: string | null;
  /** Nombre de pièces non vendues. Une rubrique à 0 n'apparaît pas dans le menu. */
  available: number;
}

export interface ShopData {
  items: ShopItem[];
  categories: ShopCategory[];
}

function toItem(p: Product): ShopItem {
  const image = p.images?.[0];
  return {
    id: p._id,
    title: p.title,
    slug: p.slug.current,
    price: p.price,
    status: p.status,
    imageUrl: image ? urlFor(image).width(400).height(400).format("webp").url() : null,
    createdAt: p._createdAt ?? null,
    categoryId: p.category?._id ?? null,
  };
}

export async function getShopData(): Promise<ShopData> {
  const [products, docs] = await Promise.all([
    getProducts(),
    getShopCategories().catch((error) => {
      // Sans rubriques, la boutique s'affiche comme avant (liste complète).
      console.error("Erreur lors de la récupération des rubriques:", error);
      return [];
    }),
  ]);

  const items = products.map(toItem);
  const seen = new Set<string>();
  const categories: ShopCategory[] = [];

  for (const doc of docs) {
    const slug = slugify(doc.title || "");
    // Deux rubriques au nom identique : seule la première garde l'adresse.
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);

    const availableItems = products.filter(
      (p) => p.category?._id === doc._id && p.status !== "vendu"
    ); // déjà triés du plus récent au plus ancien par la requête
    const newest = availableItems.find((p) => p.images?.[0]);
    categories.push({
      id: doc._id,
      title: doc.title,
      slug,
      word: doc.word?.trim() || null,
      thumbUrl: newest
        ? urlFor(newest.images[0]).width(96).height(96).format("webp").url()
        : null,
      available: availableItems.length,
    });
  }

  return { items, categories };
}
