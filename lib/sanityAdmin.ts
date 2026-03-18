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

/** Met à jour le statut d'un produit dans Sanity */
export async function setProductStatus(
  productId: string,
  status: "disponible" | "réservé" | "vendu" | "en demande"
): Promise<void> {
  const client = getSanityAdminClient();
  await client.patch(productId).set({ status }).commit();
}
