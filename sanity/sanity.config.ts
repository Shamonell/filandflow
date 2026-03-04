/**
 * Configuration Sanity pour le studio standalone
 * 
 * NOTE: Cette config est utilisée uniquement pour le studio standalone
 * (lancé via `npm run sanity` dans le dossier /sanity).
 * 
 * Pour l'admin intégré dans Next.js (/admin), la configuration utilisée
 * est celle à la racine : `../sanity.config.ts`
 * 
 * Les deux configs partagent les mêmes schémas mais peuvent avoir des
 * paramètres différents (basePath, etc.).
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || projectId === "VOTRE_PROJECT_ID") {
  throw new Error(
    "❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env.local\n" +
    "Pour trouver votre projectId :\n" +
    "1. Allez sur https://sanity.io/manage\n" +
    "2. Sélectionnez votre projet\n" +
    "3. Le projectId est visible dans l'URL ou dans les paramètres du projet\n" +
    "4. Ajoutez-le dans .env.local : NEXT_PUBLIC_SANITY_PROJECT_ID=votre_project_id"
  );
}

export default defineConfig({
  name: "default",
  title: "Fil & Flow - Studio Standalone",

  projectId,
  dataset,

  // Pas de basePath pour le studio standalone (accessible sur localhost:3333)
  basePath: undefined,

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});

