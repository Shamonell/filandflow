import { defineType, defineField } from "sanity";

/**
 * Type d'atelier (template réutilisable).
 * Créer un document par type : Couture, Broderie, Réparation & upcycling,
 * Argile autodurcissante, Macramé, Customisation de meuble, Tissage.
 * Chaque session (event) référence un de ces types et ne modifie que date, prix, places, etc.
 */
export default defineType({
  name: "workshopTemplate",
  title: "Type d'atelier (modèle)",
  type: "document",
  groups: [
    { name: "essentiels", title: "Essentiels", default: true },
    { name: "images", title: "Photos" },
    { name: "defaults", title: "Valeurs par défaut" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom du type",
      type: "string",
      description: "Ex. Couture, Broderie, Macramé, Tissage.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Le nom du type est obligatoire."),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL (slug)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description:
        "Ex. couture, broderie, macrame. ⚠️ Doit correspondre au chemin du code (ex. /atelier/couture). Ne modifiez pas un slug existant.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Cliquez sur « Generate » pour créer le slug."),
    }),
    defineField({
      name: "description",
      title: "Description de l'atelier",
      type: "text",
      rows: 8,
      description:
        "Texte présentant ce type d'atelier (commun à toutes les sessions). Allez à la ligne pour aérer.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("La description est obligatoire."),
    }),
    defineField({
      name: "images",
      title: "Photos de l'atelier",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "La 1ʳᵉ photo sert d'image principale (hero). Les suivantes apparaissent dans la galerie.",
      group: "images",
    }),
    defineField({
      name: "defaultDuration",
      title: "Durée par défaut",
      type: "string",
      description:
        "Ex. 2h, 3h30, 1 journée. Reprise automatiquement par chaque session, sauf si vous saisissez une durée différente sur la session.",
      placeholder: "2h",
      group: "defaults",
    }),
    defineField({
      name: "defaultLocation",
      title: "Lieu par défaut",
      type: "string",
      description:
        "Adresse ou ville habituelle. Reprise automatiquement par chaque session, sauf si vous saisissez un lieu différent sur la session.",
      group: "defaults",
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0", slug: "slug.current" },
    prepare({ title, media, slug }) {
      return {
        title: title || "Sans titre",
        media,
        subtitle: slug ? `Type — /atelier/${slug}` : "Type d'atelier",
      };
    },
  },
});
