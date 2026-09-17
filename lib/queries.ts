import { groq } from "next-sanity";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client, urlFor } from "./sanity";
import { giftCardsFallbackAsOffers, type GiftCardOffer } from "./gift-cards";
import { HOME_WORKSHOPS_FALLBACK, type HomeWorkshop } from "./home-workshops";

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

// --- Annonces (affiches) -----------------------------------------------------

export interface Announcement {
  id: string;
  title: string;
  summary?: string;
  dateStart: string;
  dateEnd?: string;
  /** Affiche en pleine résolution, non recadrée. */
  imageUrl: string;
  /** Largeur et hauteur réelles, pour réserver la place et éviter tout décalage. */
  width: number;
  height: number;
}

export const announcementsQuery = groq`
  *[_type == "announcement" && !(_id in path("drafts.**")) && isActive != false
    && (!defined(dateEnd) || dateEnd >= $today)
  ] | order(dateStart asc) {
    _id,
    title,
    summary,
    dateStart,
    dateEnd,
    image,
    "dimensions": image.asset->metadata.dimensions
  }
`;

/**
 * Annonces à venir ou en cours. Une annonce dont la date de fin est passée
 * disparaît d'elle-même : Elisabeth n'a rien à dépublier.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const rows = await client.fetch<
      Array<{
        _id: string;
        title: string;
        summary?: string | null;
        dateStart: string;
        dateEnd?: string | null;
        image?: SanityImageSource | null;
        dimensions?: { width?: number; height?: number } | null;
      }>
    >(announcementsQuery, { today });

    return (rows ?? [])
      .filter((row) => row.image)
      .map((row) => ({
        id: row._id,
        title: row.title,
        summary: row.summary || undefined,
        dateStart: row.dateStart,
        dateEnd: row.dateEnd || undefined,
        imageUrl: urlFor(row.image!).width(1400).format("webp").url(),
        // 1080x1350 est le format des visuels Facebook/Instagram d'Elisabeth.
        width: row.dimensions?.width ?? 1080,
        height: row.dimensions?.height ?? 1350,
      }));
  } catch {
    return [];
  }
}

// --- Exemples d'ateliers de /ateliers-chez-vous ------------------------------

export const homeWorkshopsQuery = groq`
  *[_type == "homeWorkshop" && !(_id in path("drafts.**")) && isActive != false]
    | order(sortOrder asc, title asc) {
    _id,
    title,
    description,
    slug,
    duration,
    price,
    image,
    legacyImagePath
  }
`;

/**
 * Exemples d'ateliers affichés sur /ateliers-chez-vous.
 * Repli sur la liste codée en dur tant qu'aucun document n'est publié : la page
 * ne doit jamais se retrouver vide pendant la bascule vers le Studio.
 */
export async function getHomeWorkshops(): Promise<HomeWorkshop[]> {
  try {
    const rows = await client.fetch<
      Array<{
        _id: string;
        title: string;
        description?: string | null;
        slug?: { current?: string } | null;
        duration?: string | null;
        price?: number | null;
        image?: SanityImageSource | null;
        legacyImagePath?: string | null;
      }>
    >(homeWorkshopsQuery);

    if (!rows?.length) return HOME_WORKSHOPS_FALLBACK;

    return rows.map((row) => {
      let imagePath = "";
      if (row.image) {
        imagePath = urlFor(row.image).width(900).format("webp").url();
      } else if (row.legacyImagePath?.trim()) {
        imagePath = row.legacyImagePath.trim();
      }

      return {
        id: row.slug?.current || row._id,
        title: row.title,
        description: row.description || undefined,
        duration: row.duration || undefined,
        price: row.price != null ? `${row.price}€` : undefined,
        imagePath,
        imageAlt: row.title,
      };
    });
  } catch {
    return HOME_WORKSHOPS_FALLBACK;
  }
}
