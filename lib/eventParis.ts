import { formatInTimeZone } from "date-fns-tz";
import fr from "date-fns/locale/fr";

/** Fuseau utilisé pour tous les ateliers (France métropolitaine). */
export const EVENT_TIMEZONE = "Europe/Paris";

function toDate(iso: string): Date {
  return new Date(iso);
}

/** Formate une date Sanity (ISO) en calendrier / heure locale Paris. */
export function formatEventInParis(iso: string, pattern: string): string {
  return formatInTimeZone(toDate(iso), EVENT_TIMEZONE, pattern, { locale: fr });
}

/** Clé jour calendaire à Paris (tri / comparaison). */
export function parisDayKey(iso: string): string {
  return formatInTimeZone(toDate(iso), EVENT_TIMEZONE, "yyyy-MM-dd");
}

export function todayParisDayKey(): string {
  return formatInTimeZone(new Date(), EVENT_TIMEZONE, "yyyy-MM-dd");
}

/** La session a lieu le jour J ou après, selon le calendrier parisien. */
export function isEventOnOrAfterTodayParis(iso: string): boolean {
  return parisDayKey(iso) >= todayParisDayKey();
}
