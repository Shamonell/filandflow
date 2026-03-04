import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  title: "Atelier / Événement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dateStart",
      title: "Date et heure de début",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Durée",
      type: "string",
      description: "Ex: 2h, 3h30, 1 journée",
      placeholder: "2h",
    }),
    defineField({
      name: "location",
      title: "Lieu",
      type: "string",
      description: "Adresse ou lieu de l'atelier",
    }),
    defineField({
      name: "price",
      title: "Prix (€)",
      type: "number",
      description: "Prix optionnel de l'atelier",
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
      description: "Nombre de places déjà réservées (à mettre à jour manuellement)",
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
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
      title: "title",
      dateStart: "dateStart",
      status: "status",
    },
    prepare({ title, dateStart, status }) {
      const date = dateStart
        ? new Date(dateStart).toLocaleDateString("fr-FR")
        : "Date non définie";
      return {
        title,
        subtitle: `${date} - ${status}`,
      };
    },
  },
});


