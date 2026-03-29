import { defineField, defineType } from "sanity";

/**
 * Offre de bon cadeau (prix et texte gérés dans le CMS).
 * Le slug sert d’identifiant stable pour Stripe (ne pas le changer en production).
 */
export default defineType({
  name: "giftCard",
  title: "Bon cadeau",
  type: "document",
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
      name: "sortOrder",
      title: "Ordre d’affichage",
      type: "number",
      description: "Plus petit = affiché en premier.",
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Identifiant (slug)",
      type: "slug",
      options: { maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description:
        "Ex. carte-cadeau, duo-creatif, pack-decouverte. Utilisé par le paiement en ligne : ne le modifiez plus une fois en production.",
    }),
    defineField({
      name: "price",
      title: "Prix (€)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
      description: "Montant TTC affiché et facturé sur Stripe (en euros, pas en centimes).",
    }),
    defineField({
      name: "image",
      title: "Image (recommandé)",
      type: "image",
      options: { hotspot: true },
      description: "Visuel du bon cadeau. Si vide, le chemin « Image /public » est utilisé.",
    }),
    defineField({
      name: "legacyImagePath",
      title: "Image /public (chemin fichier)",
      type: "string",
      description:
        "Ex. /carte cadeau un atlier.png — fichier dans le dossier public du site. Laissez vide si vous utilisez l’image Sanity ci-dessus.",
      placeholder: "/carte cadeau un atlier.png",
    }),
  ],
  preview: {
    select: { title: "title", price: "price", slug: "slug.current" },
    prepare({ title, price, slug }) {
      return {
        title: title || "Sans titre",
        subtitle: slug ? `${slug} — ${price ?? "?"} €` : `${price ?? "?"} €`,
      };
    },
  },
  orderings: [
    {
      title: "Ordre (sortOrder)",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
