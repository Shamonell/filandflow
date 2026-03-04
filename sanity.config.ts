/**
 * Configuration Sanity pour utilisation externe (si nécessaire)
 * 
 * NOTE: Pour l'admin intégré dans Next.js (/admin), la configuration
 * est créée directement dans app/admin/[[...index]]/page.tsx
 * 
 * Ce fichier peut être utilisé pour le studio standalone ou d'autres usages.
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Validation du projectId avec message d'erreur clair
if (!projectId || projectId === 'VOTRE_PROJECT_ID') {
  throw new Error(
    "❌ NEXT_PUBLIC_SANITY_PROJECT_ID manquant dans .env.local\n" +
    "Pour trouver votre projectId :\n" +
    "1. Allez sur https://sanity.io/manage\n" +
    "2. Sélectionnez votre projet\n" +
    "3. Le projectId est visible dans l'URL ou dans les paramètres du projet\n" +
    "4. Ajoutez-le dans .env.local : NEXT_PUBLIC_SANITY_PROJECT_ID=votre_project_id"
  )
}

export default defineConfig({
  name: 'default',
  title: 'Fil & Flow',

  projectId,
  dataset,

  basePath: '/admin',

  plugins: [
    structureTool(),
  ],

  schema: {
    types: schemaTypes as any, // Type assertion pour éviter les conflits de types
  },
})

