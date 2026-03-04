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

// Query pour récupérer tous les événements/ateliers (uniquement les documents publiés)
export const eventsQuery = groq`
  *[_type == "event" && !(_id in path("drafts.**"))] | order(dateStart asc) {
    _id,
    title,
    slug,
    dateStart,
    duration,
    location,
    price,
    capacity,
    bookedPlaces,
    description,
    status
  }
`;

// Query pour récupérer un événement par slug (uniquement les documents publiés)
export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    dateStart,
    duration,
    location,
    price,
    capacity,
    bookedPlaces,
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

export interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  dateStart: string;
  duration: string;
  location: string;
  price?: number;
  capacity?: number;
  bookedPlaces?: number;
  description: any;
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


