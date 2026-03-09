import { defineType, defineField } from "sanity";

/**
 * Type d'atelier (template réutilisable).
 * Créer un document par type : Couture, Broderie, Réparation & upcycling,
 * Argile autodurcissante, Macramé, Customisation de meuble, Tissage.
 * Chaque session (event) référence un de ces types et ne modifie que date, prix, places, etc.
 */
export default defineType({
  name: "workshopTemplate",
  title: "Type d'atelier",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: "Ex: Couture, Broderie, Macramé, Tissage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (identifiant du type)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: "Ex: couture, broderie, macrame (utilisé pour les URLs si besoin)",
    }),
    defineField({
      name: "description",
      title: "Description de l'atelier",
      type: "text",
      rows: 8,
      description: "Texte de présentation commun à toutes les sessions de ce type",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Photos de l'atelier (hero + galerie). La première est utilisée en en-tête.",
    }),
    defineField({
      name: "defaultDuration",
      title: "Durée par défaut",
      type: "string",
      description: "Ex: 2h, 3h30, 1 journée. Peut être modifiée par session si besoin.",
      placeholder: "2h",
    }),
    defineField({
      name: "defaultLocation",
      title: "Lieu par défaut",
      type: "string",
      description: "Lieu habituel. Peut être modifié par session si besoin.",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Sans titre",
        subtitle: "Type d'atelier (template)",
      };
    },
  },
});
