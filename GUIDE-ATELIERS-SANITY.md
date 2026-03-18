# Guide — Créer et gérer les ateliers sur Fil & Flow

## Le principe

Tu as des **pages types** (Couture, Broderie, Macramé, etc.) avec description et images.  
Chaque fois que tu organises une session, tu crées un **événement** qui réutilise ce type. Tu ne changes que : **date**, **prix**, **places**, **adresse**, et éventuellement une courte description pour cette session.

---

## Étape 1 : Les types d’atelier (déjà en place)

Les 7 types sont déjà créés dans Sanity :
- Couture
- Broderie
- Réparation & upcycling
- Argile (autodurcissante)
- Macramé
- Customisation de meuble
- Tissage

**Pour modifier** un type (texte, images) : Sanity Studio → **Type d’atelier** → clique sur le type → modifie → Publish.

---

## Étape 2 : Créer une session d’atelier

1. Va sur **https://filandflow.fr/admin** (ou ton URL Vercel)
2. Connecte-toi à Sanity
3. Menu de gauche → **Événement**
4. Clique sur **Create** (ou le bouton +)

### Champs à remplir

| Champ | Exemple | Obligatoire |
|-------|---------|-------------|
| **Type d'atelier** | Choisis (ex. Couture) | Oui |
| **Slug** | Clique sur "Generate" → ex. `atelier-couture-15-mars` | Oui |
| **Date de début** | 15 mars 2026, 14h00 | Oui |
| **Durée** | 2h | Optionnel (vient du type si vide) |
| **Lieu** | Chabeuil, Drôme | Optionnel (vient du type si vide) |
| **Prix** | 45 | Recommandé |
| **Capacité** | 8 | Recommandé |
| **Places réservées** | 0 | À mettre à jour après chaque inscription |
| **Description pour cette session** | "Cette fois nous réaliserons un sac à main." | Optionnel |
| **Statut** | Ouvert / Complet / Passé | Oui |

5. Clique sur **Publish**

---

## Où apparaît la session sur le site ?

- **Page du type** : `/atelier/couture` → dans "Prochaines sessions"
- **Page de la session** : `/atelier/atelier-couture-15-mars` → page détaillée avec inscription
- **Planning** : `/ateliers` → dans le mois correspondant (ex. mars 2026)

---

## Workflow au quotidien

1. **Nouvelle session** → Créer un Événement, choisir le type, remplir date/prix/places/lieu → Publish
2. **Après une inscription** → Éditer l’événement → Augmenter "Places réservées" de 1 → Publish
3. **Atelier complet** → Changer le Statut en "Complet"
4. **Session passée** → Changer le Statut en "Passé" (elle disparaît du planning)

---

## Ajouter un nouveau type d’atelier (au-delà des 7)

Si tu veux un 8ᵉ, 9ᵉ ou 10ᵉ type :

1. **Dans Sanity** : Type d’atelier → Create → remplir titre, slug, description, images
2. **Dans le code** : il faudra ajouter une page (ex. `app/atelier/nouveau-type/page.tsx`). Dis-le-moi et je te le fais.

---

## Récapitulatif

| Élément | Où le créer | Rôle |
|--------|-------------|------|
| Type d’atelier | Sanity (1 fois par type) | Texte, images, page réutilisable |
| Événement (session) | Sanity (à chaque nouvelle date) | Date, prix, places, lieu, inscription |
