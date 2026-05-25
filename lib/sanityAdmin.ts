/**
 * Client Sanity avec droits d'écriture (pour webhooks, mutations).
 * Utilise SANITY_API_WRITE_TOKEN.
 */

import { createClient } from "@sanity/client";

let _adminClient: ReturnType<typeof createClient> | null = null;

export function getSanityAdminClient() {
  if (!_adminClient) {
    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      throw new Error("SANITY_API_WRITE_TOKEN manquant pour les mutations.");
    }
    _adminClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      token,
      useCdn: false,
    });
  }
  return _adminClient;
}

/** Met à jour le statut d'un produit dans Sanity (par ID).
 *  Préférer setProductStatusBySlug qui gère le cas draft + published. */
export async function setProductStatus(
  productId: string,
  status: "disponible" | "réservé" | "vendu" | "en demande"
): Promise<void> {
  const client = getSanityAdminClient();
  await client.patch(productId).set({ status }).commit();
}

/** Met à jour le statut d'un produit en se basant sur son slug.
 *  Patche à la fois la version publiée ET le draft éventuel,
 *  pour garantir la cohérence même si Elisabeth est en train d'éditer. */
export async function setProductStatusBySlug(
  slug: string,
  status: "disponible" | "réservé" | "vendu" | "en demande"
): Promise<{ patched: number; ids: string[] }> {
  const client = getSanityAdminClient();
  const docs = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "product" && slug.current == $slug]{ _id }`,
    { slug }
  );
  if (!docs.length) {
    throw new Error(`Aucun produit trouvé pour le slug "${slug}"`);
  }
  for (const doc of docs) {
    await client.patch(doc._id).set({ status }).commit();
  }
  return { patched: docs.length, ids: docs.map((d) => d._id) };
}
