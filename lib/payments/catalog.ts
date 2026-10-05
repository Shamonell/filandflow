/**
 * Lecture du catalogue (prix, disponibilité) pour la création des paiements.
 *
 * Volontairement séparé de lib/queries.ts : celui-ci dépend de next-sanity,
 * qui ne tourne pas dans le worker Cloudflare. Ici, seulement @sanity/client,
 * sans CDN, pour toujours lire le prix et le statut à jour.
 */

import { createClient } from "@sanity/client";
import { giftCardsFallbackAsOffers } from "@/lib/gift-cards";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      useCdn: false,
    });
  }
  return _client;
}

export interface CheckoutProduct {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  description?: unknown;
  status: string;
}

export interface CheckoutGift {
  id: string;
  title: string;
  price: number;
}

export async function getProductForCheckout(
  slug: string
): Promise<CheckoutProduct | null> {
  return await getClient().fetch(
    `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, price, description, status
    }`,
    { slug }
  );
}

/** Un bon cadeau par slug. Repli sur la config locale (lib/gift-cards.ts). */
export async function getGiftForCheckout(
  id: string
): Promise<CheckoutGift | null> {
  try {
    const row = await getClient().fetch<{
      slug: { current: string };
      title: string;
      price: number;
    } | null>(
      `*[_type == "giftCard" && slug.current == $id && !(_id in path("drafts.**"))][0] {
        title, slug, price
      }`,
      { id }
    );
    if (row) return { id: row.slug.current, title: row.title, price: row.price };
  } catch {
    /* repli ci-dessous */
  }
  const fallback = giftCardsFallbackAsOffers().find((c) => c.id === id);
  return fallback
    ? { id: fallback.id, title: fallback.title, price: fallback.price }
    : null;
}
