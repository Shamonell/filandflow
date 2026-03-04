# Sanity Studio - Fil & Flow

Ce dossier contient la configuration du CMS Sanity.io pour le site Fil & Flow.

## Configuration

1. Créez un projet sur [sanity.io](https://www.sanity.io)
2. Copiez votre `projectId` et `dataset` dans le fichier `.env.local` à la racine du projet
3. Installez les dépendances : `npm install` (dans ce dossier)
4. Lancez le studio : `npm run dev`

## Schémas

### Product (Produit)
- Titre
- Slug (généré automatiquement)
- Prix
- Images (multiple)
- Description
- Statut (disponible / réservé / vendu)

### Event (Atelier/Événement)
- Titre
- Slug (généré automatiquement)
- Date et heure de début
- Durée
- Lieu
- Prix (optionnel)
- Capacité (optionnel)
- Description
- Statut (ouvert / complet / passé)

## Déploiement

Pour déployer le studio Sanity en production :

```bash
npm run deploy
```

Le studio sera accessible via `/admin` sur votre site.

