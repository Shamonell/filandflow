import { defineType, defineField } from "sanity";
import { TagIcon } from "@sanity/icons";

/**
 * Rubrique de la boutique (« Sacs & sacoches », « Bijoux »…).
 *
 * Pas de champ slug : l'adresse de la rubrique (/boutique/sacs-et-sacoches)
 * est déduite du nom par lib/shop.ts, pour qu'Elisabeth n'ait jamais à
 * cliquer sur « Generate ». Renommer une rubrique change donc son adresse.
 *
 * Les rubriques se créent ici ou directement depuis une fiche produit
 * (bouton « + Nouvelle rubrique », voir sanity/components/CategoryInput.tsx).
 */
export default defineType({
  name: "shopCategory",
  title: "Rubrique de la boutique",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nom de la rubrique",
      type: "string",
      description:
        "Affiché sur l'étiquette de la boutique. Court et parlant, ex. « Sacs & sacoches », « Bijoux ».",
      validation: (Rule) => [
        Rule.required().error("Donnez un nom à la rubrique."),
        Rule.max(40).warning("Un nom court tient mieux sur l'étiquette (40 caractères max)."),
        Rule.custom(async (value, context) => {
          if (!value) return true;
          const id = context.document?._id?.replace(/^drafts\./, "") ?? "";
          const count = await context
            .getClient({ apiVersion: "2024-01-01" })
            .fetch<number>(
              `count(*[_type == "shopCategory" && lower(title) == lower($title) && !(_id in [$id, $draft])])`,
              { title: value.trim(), id, draft: `drafts.${id}` }
            );
          return count === 0 || "Une rubrique porte déjà ce nom.";
        }),
      ],
    }),
    defineField({
      name: "word",
      title: "Petit mot (facultatif)",
      type: "text",
      rows: 3,
      description:
        "Une ou deux phrases à la première personne, affichées avec votre photo au-dessus des pièces de cette rubrique. Laissez vide pour ne rien afficher.",
      validation: (Rule) =>
        Rule.max(220).warning("Une ou deux phrases suffisent (220 caractères max)."),
    }),
    defineField({
      name: "sortOrder",
      title: "Position dans le menu",
      type: "number",
      description:
        "Plus le chiffre est petit, plus l'étiquette est à gauche. Ex. 1 = première étiquette après « Tout voir ».",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [
    {
      title: "Position dans le menu",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", sortOrder: "sortOrder" },
    prepare({ title, sortOrder }) {
      return {
        title: title || "Rubrique sans nom",
        subtitle:
          typeof sortOrder === "number" ? `Position ${sortOrder}` : "Position non définie",
      };
    },
  },
});
