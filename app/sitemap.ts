import { MetadataRoute } from "next";
import { getEvents, getProducts } from "@/lib/queries";

/** Pages de présentation d'un type d'atelier, définies en dur dans app/atelier/. */
const WORKSHOP_TYPES = [
  "couture",
  "broderie",
  "macrame",
  "tissage",
  "argile",
  "customisation-meuble",
  "reparation-upcycling",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filandflow.fr";

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ateliers`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      // La boutique manquait au sitemap : ni elle ni les fiches produit
      // n'étaient déclarées à Google.
      url: `${baseUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ateliers-chez-vous`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bons-cadeaux`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Pages de présentation par type d'atelier
  const typePages: MetadataRoute.Sitemap = WORKSHOP_TYPES.map((type) => ({
    url: `${baseUrl}/atelier/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Pages dynamiques des ateliers
  let eventPages: MetadataRoute.Sitemap = [];
  try {
    const events = await getEvents();
    eventPages = events.map((event) => ({
      url: `${baseUrl}/atelier/${event.slug.current}`,
      lastModified: new Date(event.dateStart),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap (ateliers):", error);
  }

  // Fiches produit
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productPages = products.map((product) => ({
      url: `${baseUrl}/produit/${product.slug.current}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap (produits):", error);
  }

  return [...staticPages, ...typePages, ...eventPages, ...productPages];
}
