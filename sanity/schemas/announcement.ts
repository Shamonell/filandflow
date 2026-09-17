import { defineType, defineField } from "sanity";
import { SLUG_MAX_LENGTH, slugify, slugWarning } from "./slugify";

/**
 * Annonce : une affiche, publiée telle quelle.
 *
 * Elisabeth prépare déjà des visuels pour Facebook et Instagram, avec toutes
 * les informations écrites dessus (dates, tarifs, lieu, contact). Ce type lui
 * permet de publier la même image sur le site en quelques clics, sans ressaisir
 * le contenu.
 *
 * Le titre et la date restent obligatoires, même si l'information figure déjà
 * sur l'image : un texte en pixels n'est lisible ni par un moteur de recherche,
 * ni par un lecteur d'écran, et ne permet aucun classement chronologique.
 * Ces deux champs suffisent à garder le site utilisable.
 */
export default defineType({
  name: "announcement",
  title: "Annonce (affiche)",
  type: "document",
  groups: [
    { name: "essentiels", title: "Essentiels", default: true },
    { name: "options", title: "Options" },
  ],
  fields: [
    defineField({
      name: "image",
      title: "Affiche",
      type: "image",
      options: { hotspot: false },
      description:
        "L'affiche telle que vous la publiez sur Facebook ou Instagram. Elle est montrée en entier, sans recadrage.",
      group: "essentiels",
      validation: (Rule) => Rule.required().error("L'affiche est obligatoire."),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description:
        "Ex. « Programme des vacances de la Toussaint ». Sert au référencement et aux lecteurs d'écran, puisque le texte de l'affiche n'est pas lisible par une machine.",
      group: "essentiels",
      validation: (Rule) => Rule.required().error("Le titre est obligatoire."),
    }),
    defineField({
      name: "slug",
      title: "Identifiant (slug)",
      type: "slug",
      options: { source: "title", maxLength: SLUG_MAX_LENGTH, slugify },
      description: "Généré depuis le titre. Cliquez sur « Generate ».",
      group: "essentiels",
      validation: (Rule) => [
        Rule.required().error("Cliquez sur « Generate » pour créer l'identifiant."),
        Rule.custom(slugWarning).warning(),
      ],
    }),
    defineField({
      name: "dateStart",
      title: "Date de début",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      description:
        "Premier jour concerné par l'annonce. Sert à classer les annonces de la plus proche à la plus lointaine.",
      group: "essentiels",
      validation: (Rule) => Rule.required().error("La date de début est obligatoire."),
    }),
    defineField({
      name: "dateEnd",
      title: "Date de fin (optionnel)",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      description:
        "Pour un programme sur plusieurs jours. Passé cette date, l'annonce disparaît automatiquement du site.",
      group: "essentiels",
    }),
    defineField({
      name: "summary",
      title: "Résumé court (optionnel)",
      type: "text",
      rows: 3,
      description:
        "Une ou deux phrases affichées à côté de l'affiche. Utile pour ceux qui ne peuvent pas voir l'image.",
      group: "options",
    }),
    defineField({
      name: "isActive",
      title: "Afficher sur le site",
      type: "boolean",
      description: "Décochez pour retirer l'annonce sans la supprimer.",
      group: "options",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Date de début (plus proche d'abord)",
      name: "dateStartAsc",
      by: [{ field: "dateStart", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", dateStart: "dateStart", media: "image", isActive: "isActive" },
    prepare({ title, dateStart, media, isActive }) {
      const date = dateStart
        ? new Date(dateStart).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "sans date";
      return {
        title: isActive === false ? `${title} (masquée)` : title,
        subtitle: date,
        media,
      };
    },
  },
});
