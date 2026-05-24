import { defineType, defineField } from "sanity";

/**
 * Session d'atelier (une date, un créneau).
 * Référence un "Type d'atelier" pour le contenu fixe (titre, description, images).
 * Seuls date, prix, places, et éventuellement description de session sont à renseigner.
 */
export default defineType({
  name: "event",
  title: "Session d'atelier (date)",
  type: "document",
  groups: [
    { name: "essentiels", title: "Essentiels", default: true },
    { name: "places", title: "Places & prix" },
    { name: "details", title: "Détails (optionnel)" },
  ],
  fields: [
    defineField({
      name: "template",
      title: "Type d'atelier",
      type: "reference",
      to: [{ type: "workshopTemplate" }],
      description:
        "Choisir le type (Couture, Broderie, Macramé…). Le titre, la description et les photos sont repris du type. Vous ne remplissez ici que ce qui change pour cette session. Recommandé.",
      group: "essentiels",
    }),
    defineField({
      name: "dateStart",
      title: "Date et heure (France)",
      type: "datetime",
      description:
        "⚠️ Saisissez l'heure réelle française (ex. 14:00 pour 14h). Le site convertit automatiquement entre heure d'hiver et heure d'été. Si vous voyez un décalage d'1h sur le site après publication, vérifiez l'heure ici.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("La date et l'heure sont obligatoires."),
    }),
    defineField({
      name: "slug",
      title: "Identifiant URL (slug)",
      type: "slug",
      options: {
        maxLength: 96,
        source: (doc: Record<string, unknown>) => {
          const date = doc.dateStart ? String(doc.dateStart).slice(0, 10) : "session";
          return `atelier-${date}`;
        },
      },
      description:
        "Adresse de la page de cette session (ex. couture-15-mars-2026). Cliquez sur « Generate » ou saisissez manuellement. Doit être unique.",
      group: "essentiels",
      validation: (Rule) =>
        Rule.required().error("Cliquez sur « Generate » pour créer l'identifiant."),
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      description:
        "« Ouvert » = inscriptions possibles. « Complet » = plus de places (badge rouge visible). « Passé » = masqué du planning.",
      options: {
        list: [
          { title: "Ouvert (inscriptions possibles)", value: "ouvert" },
          { title: "Complet (plus de places)", value: "complet" },
          { title: "Passé (masqué du site)", value: "passé" },
        ],
        layout: "radio",
      },
      initialValue: "ouvert",
      group: "essentiels",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Prix (en euros)",
      type: "number",
      description:
        "Prix TTC affiché sur la page de la session. Saisir le montant en euros (ex. 45 pour 45 €).",
      group: "places",
      validation: (Rule) =>
        Rule.positive().error("Le prix doit être un nombre positif."),
    }),
    defineField({
      name: "capacity",
      title: "Nombre de places",
      type: "number",
      description: "Nombre maximum de participants pour cette session.",
      group: "places",
      validation: (Rule) =>
        Rule.positive()
          .integer()
          .error("Indiquez un nombre entier de places (ex. 8)."),
    }),
    defineField({
      name: "bookedPlaces",
      title: "Places déjà réservées",
      type: "number",
      description:
        "À mettre à jour à chaque inscription. Le site affiche automatiquement « X places restantes ». Si vous mettez le même chiffre que « Nombre de places », la session passe en « Complet ».",
      initialValue: 0,
      group: "places",
      validation: (Rule) =>
        Rule.min(0)
          .integer()
          .custom((booked, ctx) => {
            const capacity = (ctx.document as { capacity?: number } | undefined)?.capacity;
            if (typeof booked !== "number" || typeof capacity !== "number") return true;
            if (booked > capacity) {
              return `Vous avez ${booked} places réservées mais seulement ${capacity} de capacité. Augmentez la capacité ou diminuez les réservations.`;
            }
            return true;
          }),
    }),
    defineField({
      name: "duration",
      title: "Durée (optionnel)",
      type: "string",
      description:
        "Ex. 2h, 3h30, 1 journée. Laisser vide pour utiliser la durée par défaut du type d'atelier.",
      placeholder: "2h",
      group: "details",
    }),
    defineField({
      name: "location",
      title: "Lieu (optionnel)",
      type: "string",
      description:
        "Adresse ou ville de la session. Laisser vide pour utiliser le lieu par défaut du type d'atelier.",
      group: "details",
    }),
    defineField({
      name: "sessionDescription",
      title: "Note pour cette session (optionnel)",
      type: "text",
      rows: 3,
      description:
        "Ex. « Cette fois nous réaliserons un sac à main. » Texte court mis en avant en haut de la page, complémentaire à la description du type.",
      group: "details",
    }),
    // Champs de secours pour les anciens événements créés sans type d'atelier.
    // Masqués si un type est choisi (nouveau mode).
    defineField({
      name: "title",
      title: "Titre (ancien mode, sans type d'atelier)",
      type: "string",
      description:
        "À ne remplir que si AUCUN type d'atelier n'est sélectionné ci-dessus. Sinon, le titre vient du type.",
      hidden: ({ parent }) => !!parent?.template,
      group: "details",
    }),
    defineField({
      name: "description",
      title: "Description (ancien mode, sans type d'atelier)",
      type: "text",
      rows: 4,
      description:
        "À ne remplir que si AUCUN type d'atelier n'est sélectionné ci-dessus.",
      hidden: ({ parent }) => !!parent?.template,
      group: "details",
    }),
  ],
  preview: {
    select: {
      templateTitle: "template.title",
      title: "title",
      dateStart: "dateStart",
      status: "status",
      capacity: "capacity",
      booked: "bookedPlaces",
    },
    prepare({ templateTitle, title, dateStart, status, capacity, booked }) {
      const date = dateStart
        ? new Date(dateStart).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris",
          })
        : "Date non définie";
      const label = templateTitle || title || "Session sans type";
      const places =
        typeof capacity === "number"
          ? ` · ${(booked ?? 0)}/${capacity} places`
          : "";
      return {
        title: `${label} — ${date}`,
        subtitle: `${status ?? "?"}${places}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (prochaine session en premier)",
      name: "dateStartAsc",
      by: [{ field: "dateStart", direction: "asc" }],
    },
    {
      title: "Date (plus récente en premier)",
      name: "dateStartDesc",
      by: [{ field: "dateStart", direction: "desc" }],
    },
  ],
});
