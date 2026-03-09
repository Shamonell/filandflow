/**
 * Supprime les produits et événements de test dans Sanity.
 * À exécuter : npm run delete:test-content
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID et SANITY_API_WRITE_TOKEN requis dans .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function main() {
  console.log("🗑️  Suppression du contenu de test...\n");

  // Produits
  const products = await client.fetch<{ _id: string; title: string }[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{ _id, title }`
  );
  for (const p of products) {
    await client.delete(p._id);
    console.log(`✅ Produit supprimé : ${p.title}`);
  }
  if (products.length === 0) console.log("⏭️  Aucun produit à supprimer.");

  // Événements (ateliers/sessions)
  const events = await client.fetch<{ _id: string; title?: string; "template": { title?: string } | null }[]>(
    `*[_type == "event" && !(_id in path("drafts.**"))]{ _id, title, "template": template->{ title } }`
  );
  for (const e of events) {
    await client.delete(e._id);
    const name = e.template?.title ?? e.title ?? "Atelier";
    console.log(`✅ Événement supprimé : ${name}`);
  }
  if (events.length === 0) console.log("⏭️  Aucun événement à supprimer.");

  console.log("\n✨ Terminé.");
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
