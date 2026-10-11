# Guide : mettre la partie paiement sur Cloudflare

Le site reste sur Vercel. Seule la partie Stripe (création du paiement + confirmation de paiement) tourne sur Cloudflare, dans un petit service appelé **filandflow-paiement**.

Tout le code est prêt dans le dépôt. Il te reste uniquement des réglages dans des tableaux de bord (Cloudflare, Stripe, Vercel). Compte 30 à 45 minutes.

> Tant que les étapes 4 et 5 ne sont pas faites, le site continue de fonctionner exactement comme avant (paiement via Vercel). Tu peux donc avancer à ton rythme sans rien casser.

---

## Étape 0 : ce qu'il te faut sous la main

Ouvre dans un onglet tes **variables Vercel** : projet *filandflow* → **Settings** → **Environment Variables**. Tu vas recopier ces valeurs :

| Nom | Où la retrouver si Vercel ne l'affiche pas |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | sanity.io/manage → ton projet (identifiant en haut) |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Développeurs → Clés API (`sk_live_...`) |
| `SANITY_API_WRITE_TOKEN` | sanity.io/manage → API → Tokens (en créer un « Editor » si besoin) |
| `RESEND_API_KEY` | resend.com → API Keys (en créer une si besoin) |
| `ORDER_EMAIL` | l'adresse qui reçoit les notifications de vente |

`STRIPE_WEBHOOK_SECRET` sera **nouveau** (créé à l'étape 4), ne recopie pas l'ancien.

---

## Étape 1 : créer le compte Cloudflare

1. Va sur **https://dash.cloudflare.com/sign-up** et crée un compte (gratuit, pas de carte bancaire).
2. Valide ton email.

## Étape 2 : relier GitHub et déployer le service

1. Dans le menu de gauche : **Compute (Workers)** → **Workers & Pages** → bouton **Create**.
2. Choisis **Import a repository** (ou « Continue with GitHub »), autorise Cloudflare sur ton compte GitHub, puis sélectionne le dépôt **Shamonell/filandflow**.
3. Écran de configuration :
   - **Project name** : `filandflow-paiement` (exactement ce nom, sinon le déploiement échoue)
   - **Build command** : laisser vide
   - **Deploy command** : `npx wrangler deploy` (valeur par défaut)
   - **Root directory** : `/` (valeur par défaut)
   - **Production branch** : `main`
4. Clique **Create and deploy**. Le premier déploiement prend 2 à 4 minutes.
5. À la fin, Cloudflare affiche l'adresse du service, du type :
   `https://filandflow-paiement.TON-SOUS-DOMAINE.workers.dev`
   **Note-la**, on l'appellera *l'adresse du worker* ensuite.
6. Vérifie : ouvre cette adresse dans ton navigateur. Tu dois voir
   `{"service":"filandflow-paiement","ok":true}`.

> Si le déploiement échoue parce que le code n'est pas encore sur `main`, il faut d'abord fusionner la branche de travail (je peux ouvrir la pull request).

## Étape 3 : ajouter les clés dans Cloudflare

Dans le worker **filandflow-paiement** → **Settings** → **Variables and Secrets** → **Add** :

| Nom | Type | Valeur |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Text | ton identifiant Sanity |
| `STRIPE_SECRET_KEY` | **Secret** | `sk_live_...` |
| `SANITY_API_WRITE_TOKEN` | **Secret** | ton token Sanity |
| `RESEND_API_KEY` | **Secret** | `re_...` |
| `ORDER_EMAIL` | **Secret** | ton adresse email |

Clique **Deploy** pour enregistrer. (L'adresse du site, `https://filandflow.fr`, est déjà configurée dans le code.)

## Étape 4 : brancher Stripe sur Cloudflare

1. **https://dashboard.stripe.com/webhooks** → **Add endpoint** (« Ajouter une destination »).
2. **URL** : *l'adresse du worker* suivie de `/webhooks/stripe`, par exemple
   `https://filandflow-paiement.TON-SOUS-DOMAINE.workers.dev/webhooks/stripe`
3. **Événement** : `checkout.session.completed` uniquement.
4. Valide, puis copie le **Signing secret** (`whsec_...`).
5. Retour dans Cloudflare → worker → **Variables and Secrets** → ajoute
   `STRIPE_WEBHOOK_SECRET` (**Secret**) = ce `whsec_...` → **Deploy**.
6. Toujours dans Stripe → Webhooks, **désactive** l'ancienne destination `https://filandflow.fr/api/webhooks/stripe` (ne la supprime pas tout de suite).
   Si les deux restaient actives, chaque vente enverrait les emails en double. Le worker sait traiter toutes les ventes, y compris celles lancées depuis Vercel, donc tu peux faire cette bascule tout de suite.

## Étape 5 : dire au site d'utiliser Cloudflare

1. Vercel → projet → **Settings** → **Environment Variables** → **Add** :
   - **Key** : `NEXT_PUBLIC_PAYMENT_API_URL`
   - **Value** : *l'adresse du worker* (sans `/` à la fin), ex. `https://filandflow-paiement.TON-SOUS-DOMAINE.workers.dev`
   - Environnement : **Production** (et Preview si tu veux)
2. **Deployments** → sur le dernier déploiement, menu `…` → **Redeploy**. Obligatoire : les variables `NEXT_PUBLIC_` ne sont prises en compte qu'au déploiement.

## Étape 6 : tester avec un vrai achat

1. Sur filandflow.fr, achète le bon cadeau le moins cher avec **réception par email** (pas de frais de port).
2. Vérifie que :
   - la page Stripe s'ouvre bien, et après paiement tu reviens sur la page « merci » ;
   - tu reçois l'email « Nouveau bon cadeau vendu » et le client (toi) l'email de confirmation ;
   - dans Stripe → Webhooks → la destination Cloudflare affiche un envoi **réussi (200)**.
3. Rembourse-toi dans Stripe (Paiements → le paiement → Rembourser).

Pour un produit de la boutique, vérifie aussi qu'il passe bien en « vendu » dans Sanity après l'achat.

**En cas de problème** : retire `NEXT_PUBLIC_PAYMENT_API_URL` dans Vercel + Redeploy, et réactive l'ancien webhook Stripe. Tout revient comme avant. Les erreurs du worker se lisent dans Cloudflare → worker → **Logs**.

## Étape 7 : faire le ménage (une fois que tout marche)

1. Dans Vercel, supprime `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` et `SANITY_API_WRITE_TOKEN` : Vercel n'en a plus besoin.
2. Dans Stripe, supprime l'ancien webhook désactivé.
3. Demande-moi de retirer les anciennes routes `/api/checkout` et `/api/webhooks/stripe` du site.

---

## Bon à savoir

- **Coût** : le forfait gratuit de Cloudflare Workers autorise 100 000 requêtes par jour, très largement suffisant ici.
- **Mises à jour** : chaque modification poussée sur `main` redéploie automatiquement le worker (Cloudflare) et le site (Vercel).
- **Adresse plus jolie (optionnel)** : on peut utiliser `paiement.filandflow.fr` au lieu de l'adresse `workers.dev`, mais seulement si le nom de domaine est géré par Cloudflare. Pas nécessaire : le client ne voit jamais cette adresse.
- **Règles Vercel** : le forfait gratuit de Vercel reste réservé aux sites non commerciaux, et une boutique en ligne reste un site commercial même si le paiement est ailleurs.
