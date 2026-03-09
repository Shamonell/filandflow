# Sanity — configuration pour le site en ligne

Une fois le site déployé sur Vercel, il faut configurer Sanity pour que le site en production puisse accéder aux données.

---

## 1. CORS origins dans Sanity

1. Va sur **https://sanity.io/manage**
2. Sélectionne ton projet **Fil & Flow**
3. Menu **API** → **CORS origins**
4. Clique **Add CORS origin** et ajoute :
   - `https://filandflow.fr` (ton domaine)
   - `https://filandflow.vercel.app` (ou l’URL exacte de ton projet Vercel)
   - `http://localhost:3000` (pour le dev local, souvent déjà présent)

---

## 2. Variables d’environnement sur Vercel

Dans Vercel : **Settings** → **Environment Variables**, vérifie que ces variables existent :

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `xm0whm86` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Ton token Sanity (lecture) |

---

## 3. Déploiements automatiques

Chaque `git push` sur `main` déclenche un nouveau déploiement sur Vercel. Tu n’as rien à faire de plus.

---

## 4. Sanity Studio en ligne

Le Studio est accessible à **https://filandflow.fr/admin** (ou ton domaine). Tu peux y modifier les ateliers, produits, etc. Les changements sont visibles sur le site après rechargement (ou après le prochain build si tu utilises le cache).
