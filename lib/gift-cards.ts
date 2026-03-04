/**
 * Configuration des bons cadeaux : id, nom, prix (€).
 * Modifiez les prix ici selon vos tarifs.
 */
export const GIFT_CARDS = [
  {
    id: "carte-cadeau",
    name: "Carte cadeau 1 atelier",
    price: 50,
    image: "/carte cadeau un atlier.png",
  },
  {
    id: "duo-creatif",
    name: "Duo créatif (2 ateliers)",
    price: 95,
    image: "/duo creatif.png",
  },
  {
    id: "pack-decouverte",
    name: "Pack découverte (3 ateliers)",
    price: 135,
    image: "/packe decouverte.png",
  },
] as const;

export type GiftCardId = (typeof GIFT_CARDS)[number]["id"];

export function getGiftCardById(id: string): (typeof GIFT_CARDS)[number] | undefined {
  return GIFT_CARDS.find((g) => g.id === id);
}
