/**
 * Source unique des coordonnées de contact.
 *
 * Pourquoi ce fichier existe
 * --------------------------
 * Le numéro WhatsApp et l'adresse e-mail étaient répétés dans plusieurs pages,
 * chacune avec sa propre valeur de repli. En production, aucune des variables
 * n'étant définie, le site affichait :
 *   - https://wa.me/33600000000        -> +33 6 00 00 00 00, numéro inexistant
 *   - mailto:contact@fil-et-flow.fr    -> domaine différent du site (filandflow.fr)
 *
 * Règle retenue : une coordonnée non configurée ne produit PAS de lien de repli.
 * Un bouton absent vaut mieux qu'un bouton qui mène dans le vide.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER est inlinée au build : la renseigner après coup
 * dans le panneau de l'hébergeur ne suffit pas, il faut reconstruire.
 */

/** Valeurs de repli historiques, à traiter comme « non configuré ». */
const PLACEHOLDERS = new Set(["33600000000", "600000000", "0600000000"]);

/**
 * Numéro WhatsApp au format international sans séparateurs (ex. 33612345678),
 * ou `null` si non configuré.
 */
export function getWhatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (!digits || PLACEHOLDERS.has(digits)) return null;

  // Un numéro français saisi en 06… est converti en 336…
  const normalized = digits.startsWith("0") ? `33${digits.slice(1)}` : digits;

  // Garde-fou : un numéro international plausible fait 8 à 15 chiffres (E.164).
  if (normalized.length < 8 || normalized.length > 15) return null;

  return normalized;
}

/** Placeholders historiques d'adresse e-mail, à traiter comme « non configuré ». */
const EMAIL_PLACEHOLDERS = new Set([
  "contact@example.com",
  "contact@fil-et-flow.fr",
]);

/** Adresse e-mail publique, ou `null` si non configurée. */
export function getContactEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim().toLowerCase();
  if (!raw || EMAIL_PLACEHOLDERS.has(raw)) return null;
  return raw;
}

/**
 * Lien `mailto:` pré-rempli, ou `null` si aucune adresse n'est configurée.
 *
 * À n'utiliser qu'en option secondaire : un lien mailto n'ouvre rien chez un
 * visiteur sans client de messagerie configuré. Le formulaire du site reste le
 * chemin fiable.
 */
export function mailtoLink(subject: string, body: string): string | null {
  const email = getContactEmail();
  if (!email) return null;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Lien WhatsApp pré-rempli, ou `null` si aucun numéro n'est configuré. */
export function whatsappLink(message: string): string | null {
  const number = getWhatsappNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Lien vers le formulaire de contact du site, message pré-rempli.
 *
 * Préféré à `mailto:` : un lien mailto n'ouvre rien chez un visiteur sans
 * client de messagerie configuré — c'est le cas de la majorité des navigateurs
 * de bureau aujourd'hui, et c'est ce qui donnait l'impression que le bouton
 * « Envoyer un e-mail » ne faisait rien. Le formulaire, lui, marche pour tout
 * le monde. La page /contact lit le paramètre `message` et le pré-remplit.
 */
export function contactFormLink(message: string): string {
  return `/contact?message=${encodeURIComponent(message)}`;
}
