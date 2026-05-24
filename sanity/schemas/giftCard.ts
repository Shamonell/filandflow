import { defineField, defineType } from "sanity";

/**
 * Offre de bon cadeau (prix et texte gérés dans le CMS).
 * Le slug sert d'identifiant stable pour Stripe (ne pas le changer en production).
 */
export default defineType({
  name: "giftCard",
  title: "Bon cadeau",
  type: "document",
  groups: [
    { name: "essentiels", title: "Essentiels", default: true },
    { name: "image", title: "Visuel" },
  ],
  validation: (Rule) =>
    Rule.custom((doc) => {
      const d = doc as
        | {
            image?: { asset?: { _ref?: string } };
            legacyImagePath?: string;
          }
        | undefined;
      if (!d) return true;
      const hasMedia = !!d.image?.asset;
      const hasPath = !!d.legacyImagePath?.trim();
      if (hasMedia || hasPath) return true;
      return "Ajoutez une image (média) ou un chemin de fichier dans /public.";
    }),
  fields: [
    defineField({
      name: "title",
      title: "Nom de l'offre",
      type: "string",
      description:
        "Ex. « Carte cadeau 1 atelier », « Duo créatif (2 ateliers) », « Pack découverte ».",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Le nom de l'offre est obligatoire."),
    }),
    defineField({
      name: "price",
      title: "Prix (en euros)",
      type: "number",
      description:
        "Montant TTC affiché et facturé via Stripe (en euros, pas en centimes).",
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
      options: { source: "title", maxLength: 96 },
      description:
        "Ex. carte-cadeau, duo-creatif, pack-decouverte. ⚠️ Utilisé par le paiement en ligne : ne le modifiez plus une fois publié.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Cliquez sur « Generate » pour créer l'identifiant."),
    }),
    defineField({
      name: "sortOrder",
      title: "Ordre d'affichage",
      type: "number",
      description:
        "Plus le chiffre est petit, plus l'offre apparaît en premier sur la page Bons cadeaux. Ex. 1 = en premier.",
      initialValue: 0,
      group: "essentiels",
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: "image",
      title: "Visuel du bon cadeau",
      type: "image",
      options: { hotspot: true },
      description:
        "Recommandé. Si vide, le chemin « Image /public » ci-dessous est utilisé (uniquement pour les anciennes cartes).",
      group: "image",
    }),
    defineField({
      name: "legacyImagePath",
      title: "Image /public (chemin fichier, optionnel)",
      type: "string",
      description:
        "Pour les anciens visuels stockés dans /public (ex. /carte cadeau un atlier.png). Laissez vide si vous utilisez l'image Sanity ci-dessus.",
      placeholder: "/carte cadeau un atlier.png",
      group: "image",
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      slug: "slug.current",
      media: "image",
    },
    prepare({ title, price, slug, media }) {
      const priceLabel = typeof price === "number" ? `${price} €` : "Prix ?";
      return {
        title: title || "Sans titre",
        subtitle: slug ? `${slug} — ${priceLabel}` : priceLabel,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
