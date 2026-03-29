/**
 * Repli local si aucun document « Bon cadeau » n’est publié dans Sanity.
 * Dès que tu crées et publies les bons cadeaux dans /admin, ces valeurs ne sont plus utilisées pour l’affichage.
 */

export type GiftCardOffer = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

const FALLBACK = [
  {
    id: "carte-cadeau",
    title: "Carte cadeau 1 atelier",
    price: 50,
    imageUrl: "/carte cadeau un atlier.png",
  },
  {
    id: "duo-creatif",
    title: "Duo créatif (2 ateliers)",
    price: 95,
    imageUrl: "/duo creatif.png",
  },
  {
    id: "pack-decouverte",
    title: "Pack découverte (3 ateliers)",
    price: 135,
    imageUrl: "/packe decouverte.png",
  },
] as const satisfies readonly GiftCardOffer[];

export function giftCardsFallbackAsOffers(): GiftCardOffer[] {
  return [...FALLBACK];
}
