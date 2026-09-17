import { defineType, defineField } from "sanity";
import { SLUG_MAX_LENGTH, slugify, slugWarning } from "./slugify";

/**
 * « Exemples d'ateliers proposés » de la page /ateliers-chez-vous.
 *
 * Ces quatre cartes étaient écrites en dur dans le code, avec des images
 * déposées dans public/ateliers-chez-vous/. Elisabeth ne pouvait donc ni en
 * ajouter, ni corriger un tarif, sans passer par un développeur.
 */
export default defineType({
  name: "homeWorkshop",
  title: "Atelier chez vous (exemple)",
  type: "document",
  groups: [{ name: "essentiels", title: "Essentiels", default: true }],
  // Même règle que giftCard : une photo Sanity OU un chemin /public, mais pas rien.
  validation: (Rule) =>
    Rule.custom((doc) => {
      const d = doc as
        | { image?: { asset?: { _ref?: string } }; legacyImagePath?: string }
        | undefined;
      if (!d) return true;
      if (d.image?.asset || d.legacyImagePath?.trim()) return true;
      return "Ajoutez une photo, ou un chemin de fichier dans /public.";
    }),
  fields: [
    defineField({
      name: "title",
      title: "Nom de l'atelier",
      type: "string",
      description: "Ex. Pochette-sac, Besace, Housse de coussin patchwork zippée.",
      group: "essentiels",
      validation: (Rule) => Rule.required().error("Le nom est obligatoire."),
    }),
    defineField({
      name: "slug",
      title: "Identifiant (slug)",
      type: "slug",
      options: { source: "title", maxLength: SLUG_MAX_LENGTH, slugify },
      description:
        "Généré depuis le nom. Sert d'identifiant technique. Cliquez sur « Generate ».",
      group: "essentiels",
      validation: (Rule) => [
        Rule.required().error("Cliquez sur « Generate » pour créer l'identifiant."),
        Rule.custom(slugWarning).warning(),
      ],
    }),
    defineField({
      name: "description",
      title: "Description courte",
      type: "text",
      rows: 3,
      description:
        "Une ou deux phrases sur l'atelier : ce qu'on y fabrique, pour qui. Affichée sous le nom.",
      group: "essentiels",
    }),
    defineField({
      name: "duration",
      title: "Durée (optionnel)",
      type: "string",
      description: "Telle qu'elle doit s'afficher : 2h30, 4h, 4h30. Laissez vide si variable.",
      group: "essentiels",
    }),
    defineField({
      name: "price",
      title: "Tarif (optionnel)",
      type: "number",
      description:
        "En euros, par personne. Le symbole € est ajouté automatiquement. Laissez vide si le tarif dépend du groupe.",
      group: "essentiels",
      validation: (Rule) => Rule.min(0).error("Le tarif ne peut pas être négatif."),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description: "Photo de la réalisation. Format paysage de préférence.",
      group: "essentiels",
    }),
    defineField({
      name: "legacyImagePath",
      title: "Image /public (chemin fichier, optionnel)",
      type: "string",
      description:
        "Pour les visuels déjà présents dans /public (ex. /ateliers-chez-vous/besace-nelson.jpg). Laissez vide si vous utilisez la photo ci-dessus.",
      placeholder: "/ateliers-chez-vous/besace-nelson.jpg",
      group: "essentiels",
    }),
    defineField({
      name: "sortOrder",
      title: "Ordre d'affichage",
      type: "number",
      description: "Plus le nombre est petit, plus la carte apparaît tôt. 1, 2, 3, 4…",
      group: "essentiels",
      initialValue: 100,
    }),
    defineField({
      name: "isActive",
      title: "Afficher sur le site",
      type: "boolean",
      description: "Décochez pour retirer cet exemple de la page sans le supprimer.",
      group: "essentiels",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", duration: "duration", price: "price", media: "image", isActive: "isActive" },
    prepare({ title, duration, price, media, isActive }) {
      const bits = [duration, price != null ? `${price}€` : null].filter(Boolean).join(" · ");
      return {
        title: isActive === false ? `${title} (masqué)` : title,
        subtitle: bits,
        media,
      };
    },
  },
});
