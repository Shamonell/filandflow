import { defineType, defineField } from "sanity";

/**
 * Session d'atelier (une date, un créneau).
 * Référence un "Type d'atelier" pour le contenu fixe (titre, description, images).
 * Seuls date, prix, places, et éventuellement description de session sont à renseigner.
 */
export default defineType({
  name: "event",
  title: "Atelier / Événement",
  type: "document",
  fields: [
    defineField({
      name: "template",
      title: "Type d'atelier",
      type: "reference",
      to: [{ type: "workshopTemplate" }],
      description: "Choisir le modèle (Couture, Broderie, Macramé, etc.). Si vide, utiliser Titre et Description ci-dessous (ancien mode).",
    }),
    defineField({
      name: "title",
      title: "Titre (si pas de type d'atelier)",
      type: "string",
      description: "Utilisé uniquement quand aucun type d'atelier n'est sélectionné. Sinon le titre vient du type.",
      hidden: ({ parent }) => !!parent?.template,
    }),
    defineField({
      name: "description",
      title: "Description (si pas de type d'atelier)",
      type: "text",
      rows: 4,
      description: "Utilisé uniquement quand aucun type d'atelier n'est sélectionné.",
      hidden: ({ parent }) => !!parent?.template,
    }),
    defineField({
      name: "slug",
      title: "Slug (URL de la session)",
      type: "slug",
      options: { maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: "Ex: couture-15-mars-2026. Unique par session. Générer à partir du type + date.",
    }),
    defineField({
      name: "dateStart",
      title: "Date et heure de début",
      type: "datetime",
      description:
        "Saisissez l’heure réelle du créneau en France. Sur le site, l’affichage utilise le fuseau Europe/Paris (heure d’été / hiver gérée automatiquement).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Durée (optionnel)",
      type: "string",
      description: "Si vide, la durée par défaut du type d'atelier est utilisée. Ex: 2h, 3h30",
      placeholder: "2h",
    }),
    defineField({
      name: "location",
      title: "Lieu (optionnel)",
      type: "string",
      description: "Si vide, le lieu par défaut du type d'atelier est utilisé.",
    }),
    defineField({
      name: "price",
      title: "Prix (€)",
      type: "number",
      description: "Prix de cette session",
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "capacity",
      title: "Capacité",
      type: "number",
      description: "Nombre maximum de participants",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "bookedPlaces",
      title: "Places réservées",
      type: "number",
      description: "À mettre à jour manuellement après chaque réservation",
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: "sessionDescription",
      title: "Description pour cette session",
      type: "text",
      rows: 3,
      description: "Ex: « Cette fois nous réaliserons un sac en tissu. » ou « Atelier spécial sac à main. » Optionnel.",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "Ouvert", value: "ouvert" },
          { title: "Complet", value: "complet" },
          { title: "Passé", value: "passé" },
        ],
        layout: "radio",
      },
      initialValue: "ouvert",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      templateTitle: "template.title",
      title: "title",
      dateStart: "dateStart",
      status: "status",
    },
    prepare({ templateTitle, title, dateStart, status }) {
      const date = dateStart
        ? new Date(dateStart).toLocaleDateString("fr-FR")
        : "Date non définie";
      const label = templateTitle || title || "Session";
      return {
        title: `${label} — ${date}`,
        subtitle: status,
      };
    },
  },
});
