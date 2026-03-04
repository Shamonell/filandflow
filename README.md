# Fil & Flow - Site Artisanal

Site web professionnel pour une artisane, construit avec Next.js 14, TypeScript, Tailwind CSS et Sanity.io.

## 🚀 Démarrage

### Installation des dépendances

```bash
npm install
```

### Configuration Sanity

1. Créez un projet sur [sanity.io](https://www.sanity.io)
2. Copiez les variables d'environnement dans `.env.local` :
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=votre_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=votre_token
   ```

### Lancer le projet

```bash
# Démarrer le serveur de développement Next.js
npm run dev

# Dans un autre terminal, démarrer Sanity Studio
npm run sanity
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)
Le Studio Sanity sera accessible sur [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Structure du projet

```
├── app/              # Pages Next.js (App Router)
├── components/       # Composants React réutilisables
├── lib/             # Utilitaires et configuration
├── sanity/          # Configuration Sanity.io
└── public/          # Assets statiques
```

## 🎨 Personnalisation

Les couleurs peuvent être modifiées dans `tailwind.config.ts`.


