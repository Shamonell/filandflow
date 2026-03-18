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

Le Studio est accessible à **https://filandflow.fr/admin** (ou ton domaine). Tu peux y modifier les ateliers, produits, etc.

## 5. Quand tu supprimes dans Sanity

Le site met en cache les pages pendant **30 secondes**. Donc :
- **Tu supprimes un atelier** → il peut encore apparaître dans le planning pendant 30 secondes max
- **Tu cliques dessus** → la page détail affiche « non trouvé » (car l’événement n’existe plus)
- **Après 30 secondes** → le planning se met à jour et l’atelier disparaît

C’est normal : le cache permet au site d’être rapide. Pour voir les changements tout de suite, attends 30 secondes et rafraîchis la page.
