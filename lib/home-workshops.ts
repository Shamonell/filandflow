/**
 * Exemples d'ateliers de la page /ateliers-chez-vous.
 *
 * Ces quatre cartes étaient écrites en dur dans le JSX de la page. Elles sont
 * désormais gérées depuis le Studio (type `homeWorkshop`), et cette liste sert
 * uniquement de repli : tant qu'aucun document n'est publié, ou si Sanity est
 * injoignable, la page affiche exactement ce qu'elle affichait avant.
 *
 * À supprimer une fois les quatre documents créés et vérifiés en ligne.
 *
 * Attention : les fichiers référencés ci-dessous n'existent PAS dans /public.
 * Le dossier public/ateliers-chez-vous est vide et n'a jamais été suivi par git,
 * si bien que ces quatre cartes affichent le dégradé de repli depuis toujours,
 * en production comme en local. Les chemins sont conservés pour le cas où les
 * photos seraient ajoutées ; la vraie solution est de les téléverser depuis le
 * Studio, ce que permet désormais le type `homeWorkshop`.
 */
export interface HomeWorkshop {
  id: string;
  title: string;
  /** Une ou deux phrases saisies dans le Studio. */
  description?: string;
  /** Facultatifs : vides quand la durée ou le tarif dépendent du groupe. */
  duration?: string;
  /** Déjà formaté pour l'affichage, symbole € compris. */
  price?: string;
  imagePath: string;
  imageAlt: string;
}

export const HOME_WORKSHOPS_FALLBACK: HomeWorkshop[] = [
  {
    id: "pochette-sac",
    title: "Pochette-sac",
    duration: "4h",
    price: "65€",
    imagePath: "/ateliers-chez-vous/texas.jpg",
    imageAlt: "Pochette-sac",
  },
  {
    id: "pochette-chutes-de-tissus",
    title: "Pochette en chutes de tissus avec étiquette brodée",
    duration: "2h30",
    price: "50€",
    imagePath: "/ateliers-chez-vous/pochette-chutes.jpg",
    imageAlt: "Pochette en chutes de tissus avec étiquette brodée",
  },
  {
    id: "housse-de-coussin-patchwork-zippee",
    title: "Housse de coussin patchwork zippée",
    duration: "2h30",
    price: "40€",
    imagePath: "/ateliers-chez-vous/housse-coussin.jpg",
    imageAlt: "Housse de coussin patchwork zippée",
  },
  {
    id: "besace",
    title: "Besace",
    duration: "4h30",
    price: "65€",
    imagePath: "/ateliers-chez-vous/besace-nelson.jpg",
    imageAlt: "Besace",
  },
];
