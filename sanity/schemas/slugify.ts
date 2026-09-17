/**
 * Slugification et contrôle de format partagés par tous les schémas.
 *
 * Pourquoi ce fichier existe
 * --------------------------
 * Sanity n'applique sa slugification QUE lors d'un clic sur « Generate ».
 * Un texte saisi ou collé directement dans le champ slug est stocké tel quel.
 * C'est ce qui s'est produit en production : trois fiches produit ont un slug
 * qui reprend le titre complet, guillemets doubles et espace final inclus, par
 * exemple  Pochette livre matelassée, brodée "La femme assise"
 *
 * Conséquence concrète : au build, Next écrit un fichier par page prérendue.
 * Un système de fichiers qui refuse les guillemets ou tronque les espaces
 * finaux (NTFS) fait échouer l'export de ces pages, et `next build` sort en
 * code 1 sans écrire .next/standalone.
 *
 * Deux protections ici :
 *   - `slugify` : « Generate » produit toujours un identifiant propre.
 *   - `slugWarning` : une saisie manuelle non conforme est signalée dans le
 *     Studio. Volontairement un avertissement et non une erreur, pour ne pas
 *     bloquer la republication des trois fiches existantes, dont les URL sont
 *     déjà en ligne et ne doivent pas changer sans plan de redirection.
 */

/** Forme attendue : minuscules, chiffres, tirets simples, ni début ni fin en tiret. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Caractères qui font échouer l'écriture du fichier de page prérendue. */
const FILESYSTEM_HOSTILE = /["<>:|?*\\/]/;

export const SLUG_MAX_LENGTH = 96;

/**
 * Transforme un titre en identifiant d'URL sûr.
 * Utilisé par le bouton « Generate » du Studio.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD") // décompose les caractères accentués
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques : é -> e
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // tout le reste devient un tiret
    .replace(/^-+|-+$/g, "") // pas de tiret en tête ni en fin
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, ""); // la troncature peut laisser un tiret orphelin
}

/**
 * Contrôle de format affiché dans le Studio.
 * Rend `true` si le slug est acceptable, sinon le message à afficher.
 */
export function slugWarning(value?: { current?: string }): true | string {
  const current = value?.current;

  // L'absence de slug est traitée par la règle `required()` de chaque schéma.
  if (!current) return true;

  if (FILESYSTEM_HOSTILE.test(current)) {
    return (
      "Cet identifiant contient un caractère interdit (\" < > : | ? * \\ /). " +
      "Il fait échouer la mise en ligne. Cliquez sur « Generate » pour le corriger."
    );
  }

  if (current !== current.trim()) {
    return (
      "Cet identifiant commence ou finit par un espace, ce qui casse la mise en ligne. " +
      "Cliquez sur « Generate » pour le corriger."
    );
  }

  if (!SLUG_PATTERN.test(current)) {
    return (
      "Identifiant non conforme : uniquement des minuscules, des chiffres et des tirets, " +
      `par exemple « ${slugify(current) || "sac-fleuri"} ». Cliquez sur « Generate ».`
    );
  }

  return true;
}
