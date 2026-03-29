# Stripe — Configuration

## Montants affichés dans Stripe (Checkout)

Les prix dans le code (`product.price`, `gift.price`) sont en **euros** (nombre entier ou décimal).  
La création de session multiplie par **100** pour obtenir les **centimes** (`unit_amount: Math.round(price * 100)`), ce que Stripe attend.

- Si tu vois un montant **énorme** sur la page Stripe : vérifie que le prix dans Sanity ou dans `lib/gift-cards.ts` n’est **pas** déjà en centimes (ex. `5000` pour 50 € au lieu de `50`).
- En test, utilise les [cartes de test Stripe](https://docs.stripe.com/testing).

---

## Variables d'environnement (Vercel + .env.local)

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` ou `sk_live_...` | Oui |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` ou `pk_live_...` | Oui |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (voir ci-dessous) | Oui pour webhook |
| `ORDER_EMAIL` | Ton email pour recevoir les notifications de vente | Oui pour emails |
| `RESEND_API_KEY` | `re_...` (pour envoyer les emails) | Oui pour emails |
| `SANITY_API_WRITE_TOKEN` | Token Sanity avec droits d'écriture | Oui pour webhook |

---

## Configurer le webhook Stripe

1. Va sur **https://dashboard.stripe.com/webhooks**
2. Clique **Add endpoint**
3. **URL** : `https://filandflow.fr/api/webhooks/stripe` (ou ton domaine)
4. **Événements** : sélectionne `checkout.session.completed`
5. Clique **Add endpoint**
6. Récupère le **Signing secret** (commence par `whsec_`)
7. Ajoute dans Vercel : `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## Ce qui est en place

| Élément | Statut |
|---------|--------|
| Paiement Stripe + adresse livraison | OK |
| Webhook : produit → « vendu » dans Sanity | OK |
| Email à toi (client, adresse, montant, produit) | OK (si ORDER_EMAIL + RESEND_API_KEY) |
| Statut « En demande » (WhatsApp) | OK — à mettre manuellement dans Sanity |
| Email de confirmation au client | OK |

---

## Quand Stripe confirme le paiement → « vendu » automatique ?

**Oui.** Dès que Stripe envoie l’événement `checkout.session.completed` (paiement réussi), le webhook :
1. Met le produit en **« vendu »** dans Sanity
2. Envoie un email à toi (ORDER_EMAIL) avec les détails
3. Envoie un email de confirmation au client

---

## Statuts produit (Sanity)

- **Disponible** : en vente, bouton Acheter visible
- **En demande** : quelqu'un a contacté (WhatsApp), pas encore vendu — à mettre manuellement
- **Réservé** : réservé, en attente
- **Vendu** : mis automatiquement par le webhook après paiement Stripe

