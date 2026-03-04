import { Event } from "./queries";

/**
 * Calcule le nombre de places restantes pour un atelier
 */
export function getRemainingPlaces(event: Event): number | null {
  // Vérifier que capacity existe et est un nombre valide
  if (!event.capacity || typeof event.capacity !== 'number') return null;
  
  // bookedPlaces peut être undefined, null, ou 0, on le traite comme 0
  const booked = event.bookedPlaces ?? 0;
  const bookedNumber = typeof booked === 'number' ? booked : 0;
  
  const remaining = event.capacity - bookedNumber;
  return Math.max(0, remaining); // Ne jamais retourner un nombre négatif
}

/**
 * Détermine le message à afficher selon le nombre de places restantes
 * Messages doux et rassurants, jamais agressifs
 */
export function getPlacesMessage(event: Event): {
  text: string;
  variant: "available" | "few" | "full";
} {
  const remaining = getRemainingPlaces(event);

  // Si pas de capacité définie, ne rien afficher
  if (remaining === null) {
    return { text: "", variant: "available" };
  }

  // Atelier complet
  if (remaining === 0) {
    return {
      text: "Atelier complet",
      variant: "full",
    };
  }

  // Peu de places restantes (5 ou moins)
  if (remaining <= 5) {
    return {
      text: `Plus que ${remaining} place${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}`,
      variant: "few",
    };
  }

  // Places disponibles
  return {
    text: "Places disponibles",
    variant: "available",
  };
}

/**
 * Vérifie si l'atelier a encore des places disponibles
 */
export function hasAvailablePlaces(event: Event): boolean {
  const remaining = getRemainingPlaces(event);
  if (remaining === null) return true; // Si pas de capacité définie, considérer comme disponible
  return remaining > 0;
}
