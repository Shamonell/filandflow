import { groq } from "next-sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client, urlFor } from "./sanity";
import { giftCardsFallbackAsOffers, type GiftCardOffer } from "./gift-cards";

// Query pour récupérer tous les produits (uniquement les documents publiés, pas les drafts)
export const productsQuery = groq`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    slug,
    price,
    images,
    description,
    status
  }
`;

// Query pour récupérer un produit par slug (uniquement les documents publiés)
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    price,
    images,
    description,
    status
  }
`;

// Query pour récupérer tous les événements/ateliers (avec type d'atelier développé)
export const eventsQuery = groq`
  *[_type == "event" && !(_id in path("drafts.**"))] | order(dateStart asc) {
    _id,
    "template": template->{
      _id,
      title,
      slug,
      description,
      images,
      defaultDuration,
      defaultLocation
    },
    title,
    slug,
    dateStart,
    duration,
    location,
    price,
    capacity,
    bookedPlaces,
    sessionDescription,
    description,
    status
  }
`;

// Query pour récupérer un type d'atelier par slug
export const templateBySlugQuery = groq`
  *[_type == "workshopTemplate" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    images,
    defaultDuration,
    defaultLocation
  }
`;

// Query pour récupérer les événements d'un type d'atelier donné (par slug du template)
export const eventsByTemplateSlugQuery = groq`
  *[_type == "event" && template->slug.current == $templateSlug && !(_id in path("drafts.**"))] | order(dateStart asc) {
    _id,
    "template": template->{
      _id,
      title,
      slug,
      description,
      images,
      defaultDuration,
      defaultLocation
    },
    title,
    slug,
    dateStart,
    duration,
    location,
    price,
    capacity,
    bookedPlaces,
    sessionDescription,
    description,
    status
  }
`;

// Query pour récupérer un événement par slug (avec type d'atelier développé)
export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "template": template->{
      _id,
      title,
      slug,
      description,
      images,
      defaultDuration,
      defaultLocation
    },
    title,
    slug,
    dateStart,
    duration,
    location,
    price,
    capacity,
    bookedPlaces,
    sessionDescription,
    description,
    status
  }
`;

export const giftCardsQuery = groq`
  *[_type == "giftCard" && !(_id in path("drafts.**"))] | order(sortOrder asc, title asc) {
    _id,
    title,
    slug,
    price,
    image,
    legacyImagePath
  }
`;

export const giftCardBySlugQuery = groq`
  *[_type == "giftCard" && slug.current == $id && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    price,
    image,
    legacyImagePath
  }
`;

// Types
export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  images: any[];
  description: any;
  status: "disponible" | "en demande" | "réservé" | "vendu";
}

export interface WorkshopTemplate {
  _id: string;
  title: string;
  slug: { current: string };
  description: string | null;
  images?: Array<{ _key?: string; asset?: { _ref?: string }; [key: string]: unknown }>;
  defaultDuration?: string | null;
  defaultLocation?: string | null;
}

export interface Event {
  _id: string;
  template?: WorkshopTemplate | null;
  title?: string | null;
  description?: string | null;
  slug: { current: string };
  dateStart: string;
  duration?: string | null;
  location?: string | null;
  price?: number | null;
  capacity?: number | null;
  bookedPlaces?: number | null;
  sessionDescription?: string | null;
  status: "ouvert" | "complet" | "passé";
}

// Fonctions pour récupérer les données
export async function getProducts(): Promise<Product[]> {
  return await client.fetch(productsQuery);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return await client.fetch(productBySlugQuery, { slug });
}

export async function getEvents(): Promise<Event[]> {
  return await client.fetch(eventsQuery);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return await client.fetch(eventBySlugQuery, { slug });
}

export async function getTemplateBySlug(
  slug: string
): Promise<WorkshopTemplate | null> {
  return await client.fetch(templateBySlugQuery, { slug });
}

export async function getEventsByTemplateSlug(
  templateSlug: string
): Promise<Event[]> {
  return await client.fetch(eventsByTemplateSlugQuery, { templateSlug });
}

function mapSanityGiftRow(row: {
  slug: { current: string };
  title: string;
  price: number;
  image?: SanityImageSource | null;
  legacyImagePath?: string | null;
}): GiftCardOffer {
  let imageUrl = "";
  if (row.image) {
    imageUrl = urlFor(row.image).width(900).format("webp").url();
  } else if (row.legacyImagePath?.trim()) {
    imageUrl = row.legacyImagePath.trim();
  }
  return {
    id: row.slug.current,
    title: row.title,
    price: row.price,
    imageUrl,
  };
}

/** Liste des bons cadeaux pour la page et le paiement. Repli sur les valeurs locales si Sanity est vide. */
export async function getGiftCards(): Promise<GiftCardOffer[]> {
  try {
    const rows = await client.fetch<
      Array<{
        slug: { current: string };
        title: string;
        price: number;
        image?: SanityImageSource | null;
        legacyImagePath?: string | null;
      }>
    >(giftCardsQuery);
    if (!rows?.length) return giftCardsFallbackAsOffers();
    return rows.map(mapSanityGiftRow);
  } catch {
    return giftCardsFallbackAsOffers();
  }
}

/** Une offre par slug (Stripe / checkout). Repli sur la config locale. */
export async function getGiftCardByShopId(
  id: string
): Promise<GiftCardOffer | null> {
  try {
    const row = await client.fetch<{
      slug: { current: string };
      title: string;
      price: number;
      image?: SanityImageSource | null;
      legacyImagePath?: string | null;
    } | null>(giftCardBySlugQuery, { id });
    if (row) return mapSanityGiftRow(row);
  } catch {
    /* repli ci-dessous */
  }
  return giftCardsFallbackAsOffers().find((c) => c.id === id) ?? null;
}

export type { GiftCardOffer };
