import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Produit (boutique)",
  type: "document",
  groups: [
    { name: "essentiels", title: "Essentiels", default: true },
    { name: "images", title: "Photos" },
    { name: "details", title: "Description & statut" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom du produit",
      type: "string",
      description:
        "Le titre affiché sur la boutique. Ex. « Sac en tissu fleuri », « Trousse brodée main ».",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Le nom du produit est obligatoire."),
    }),
    defineField({
      name: "price",
      title: "Prix (en euros)",
      type: "number",
      description:
        "Prix TTC affiché sur la boutique et facturé via Stripe. Saisir le montant en euros (ex. 45 pour 45 €).",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required()
          .positive()
          .error("Le prix doit être un nombre positif."),
    }),
    defineField({
      name: "slug",
      title: "Identifiant (slug)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description:
        "Identifiant utilisé dans l'URL (ex. sac-fleuri). Cliquez sur « Generate » après avoir saisi le nom.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Cliquez sur « Generate » pour créer l'identifiant."),
    }),
    defineField({
      name: "images",
      title: "Photos du produit",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description:
        "Au moins une photo. La première est utilisée comme image principale. Vous pouvez en ajouter plusieurs pour les vues différentes.",
      group: "images",
      validation: (Rule) =>
        Rule.min(1).error("Au moins une photo est nécessaire."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      description:
        "Présentez le produit : matières, dimensions, finitions, anecdote de création… Texte simple, allez à la ligne pour aérer.",
      group: "details",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description:
        "« Disponible » = achetable en ligne. « En demande » / « Réservé » = visible mais non achetable. « Vendu » = marqué automatiquement après paiement Stripe.",
      options: {
        list: [
          { title: "Disponible (achetable)", value: "disponible" },
          { title: "En demande", value: "en demande" },
          { title: "Réservé", value: "réservé" },
          { title: "Vendu", value: "vendu" },
        ],
        layout: "radio",
      },
      initialValue: "disponible",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      status: "status",
      price: "price",
    },
    prepare({ title, media, status, price }) {
      const priceLabel =
        typeof price === "number" ? `${price.toFixed(2)} €` : "Prix non renseigné";
      return {
        title: title || "Sans titre",
        media,
        subtitle: `${priceLabel} — ${status ?? "?"}`,
      };
    },
  },
});
