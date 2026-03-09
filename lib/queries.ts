import { groq } from "next-sanity";
import { client } from "./sanity";

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

// Types
export interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  images: any[];
  description: any;
  status: "disponible" | "réservé" | "vendu";
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


