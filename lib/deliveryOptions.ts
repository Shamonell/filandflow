/**
 * Options de livraison — source unique de vérité utilisée par :
 * - La modal de choix côté front (DeliveryChoiceModal)
 * - La route /api/checkout pour configurer la session Stripe
 * - Le webhook pour adapter les emails au mode choisi
 *
 * Quand on ajoute / modifie un mode, on touche uniquement ce fichier
 * et le webhook (pour le wording des emails). Tout le reste se met à jour.
 */

/** Modes actifs (sélectionnables et envoyés au backend) */
export type DeliveryMode =
  | "retrait" // Retrait à l'atelier de Chabeuil
  | "colissimo" // Envoi domicile La Poste
  | "email" // Bon cadeau par email
  | "courrier"; // Bon cadeau par courrier postal

export interface DeliveryOption {
  /** Identifiant côté API. Pour les options à venir, on autorise null. */
  id: DeliveryMode | null;
  label: string;
  description: string;
  /** Montant en euros affiché au client et envoyé à Stripe (× 100 = centimes). */
  price: number;
  /** Emoji affiché à gauche dans la modal (cohérent avec l'identité visuelle du site). */
  icon: string;
  /** Si true, l'option est affichée mais non sélectionnable. */
  disabled?: boolean;
  /** Texte affiché à la place du prix quand l'option est désactivée. */
  disabledLabel?: string;
}

export const PRODUCT_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "retrait",
    label: "Retrait à l'atelier",
    description: "Chabeuil (Drôme), sur rendez-vous après confirmation",
    price: 0,
    icon: "🏠",
  },
  {
    id: "colissimo",
    label: "Colissimo domicile",
    description: "Livré chez vous par La Poste, suivi inclus (France métropolitaine)",
    price: 7.5,
    icon: "📦",
  },
  {
    id: null,
    label: "Point relais (Mondial Relay)",
    description: "Récupération en point relais près de chez vous",
    price: 4.9,
    icon: "📍",
    disabled: true,
    disabledLabel: "Bientôt disponible",
  },
];

export const GIFT_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "email",
    label: "Par email (PDF)",
    description: "Reçu instantanément dans votre boîte mail après paiement",
    price: 0,
    icon: "✉️",
  },
  {
    id: "retrait",
    label: "Retrait à l'atelier",
    description: "Chabeuil (Drôme), sur rendez-vous après confirmation",
    price: 0,
    icon: "🏠",
  },
  {
    id: "courrier",
    label: "Carte papier par courrier",
    description: "Belle carte cadeau envoyée par La Poste (France métropolitaine)",
    price: 2,
    icon: "💌",
  },
];

/** Helper : récupère une option par id depuis une liste. */
export function getDeliveryOption(
  options: DeliveryOption[],
  id: DeliveryMode
): DeliveryOption | null {
  return options.find((o) => o.id === id) ?? null;
}

/** Helper : libellé court pour les emails et metadata Stripe. */
export function getDeliveryShortLabel(mode: DeliveryMode | string): string {
  switch (mode) {
    case "retrait":
      return "Retrait à l'atelier (Chabeuil)";
    case "colissimo":
      return "Colissimo domicile (France)";
    case "email":
      return "Par email (PDF)";
    case "courrier":
      return "Carte papier par courrier";
    default:
      return mode;
  }
}
