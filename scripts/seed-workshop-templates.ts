/**
 * Script pour créer les 7 types d'atelier dans Sanity.
 * À exécuter : npm run seed:templates
 *
 * Prérequis : .env.local avec NEXT_PUBLIC_SANITY_PROJECT_ID et SANITY_API_WRITE_TOKEN
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "❌ SANITY_API_WRITE_TOKEN manquant. Créez un token avec droits d'écriture sur sanity.io/manage → API → Tokens"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const TEMPLATES = [
  {
    _type: "workshopTemplate",
    title: "Couture",
    slug: { _type: "slug", current: "couture" },
    description:
      "Découvrez la couture dans une ambiance bienveillante. Initiation ou perfectionnement, réalisez vos projets textiles à votre rythme.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Broderie",
    slug: { _type: "slug", current: "broderie" },
    description:
      "Apprenez les techniques de broderie traditionnelle et contemporaine. Créez des pièces uniques à la main.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Atelier réparation & upcycling",
    slug: { _type: "slug", current: "reparation-upcycling" },
    description:
      "Donnez une seconde vie à vos vêtements et objets. Réparation, customisation et transformation créative.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Argile (autodurcissante)",
    slug: { _type: "slug", current: "argile-autodurcissante" },
    description:
      "Modelage et création en argile autodurcissante. Pas de cuisson nécessaire, laissez libre cours à votre créativité.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Macramé",
    slug: { _type: "slug", current: "macrame" },
    description:
      "Initiation au macramé : nœuds, suspensions, bijoux ou déco. Une technique ancestrale accessible à tous.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Customisation de meuble",
    slug: { _type: "slug", current: "customisation-meuble" },
    description:
      "Transformez un meuble d'occasion ou oublié. Peinture, patine, tissu : personnalisez selon vos envies.",
    defaultDuration: "3h à 1 journée",
    defaultLocation: "Chabeuil, Drôme",
  },
  {
    _type: "workshopTemplate",
    title: "Tissage",
    slug: { _type: "slug", current: "tissage" },
    description:
      "Découvrez le tissage sur métier à tisser. Créez des écharpes, tapis ou pièces décoratives uniques.",
    defaultDuration: "2h à 3h",
    defaultLocation: "Chabeuil, Drôme",
  },
];

async function main() {
  console.log("🌱 Création des 7 types d'atelier dans Sanity...\n");

  for (const template of TEMPLATES) {
    const slug = (template.slug as { current: string }).current;
    const existing = await client.fetch(
      `*[_type == "workshopTemplate" && slug.current == $slug][0]._id`,
      { slug }
    );

    if (existing) {
      console.log(`⏭️  ${template.title} existe déjà, ignoré.`);
      continue;
    }

    await client.create(template);
    console.log(`✅ ${template.title} créé.`);
  }

  console.log("\n✨ Terminé. Les types d'atelier sont disponibles dans Sanity Studio.");
}

main().catch((err) => {
  console.error("Erreur:", err);
  process.exit(1);
});
