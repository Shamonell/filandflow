import { getContactEmail, getWhatsappNumber } from "@/lib/contact";

/**
 * Données structurées JSON-LD décrivant l'activité.
 *
 * Sans elles, Google doit deviner qu'il a affaire à un atelier créatif situé à
 * Chabeuil : il lit du texte et des liens, mais rien ne lui dit explicitement
 * l'adresse, le téléphone ou la nature de l'activité. Ce bloc le lui donne dans
 * un format qu'il consomme directement, ce qui alimente la fiche locale et les
 * résultats enrichis.
 *
 * Le schéma est volontairement conservateur : on ne déclare que ce qui est
 * vérifiable dans le site lui-même. Déclarer des horaires ou des avis qu'on
 * n'affiche nulle part exposerait à une pénalité pour balisage trompeur.
 */
export default function LocalBusinessSchema({ siteUrl }: { siteUrl: string }) {
  const phone = getWhatsappNumber();
  const email = getContactEmail();

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#atelier`,
    name: "Fil & Flow",
    description:
      "Ateliers créatifs de couture, broderie, macramé et tissage à Chabeuil, dans la Drôme. Ateliers en petit groupe à l'atelier ou à domicile, matériel fourni.",
    url: siteUrl,
    image: `${siteUrl}/nouveau logo.png`,
    logo: `${siteUrl}/nouveau logo.png`,
    ...(phone ? { telephone: `+${phone}` } : {}),
    ...(email ? { email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: "2500 route du Vercors",
      postalCode: "26120",
      addressLocality: "Chabeuil",
      addressRegion: "Drôme",
      addressCountry: "FR",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        // Centre approximatif de Chabeuil : sert uniquement à délimiter la zone
        // d'intervention, pas à localiser l'atelier au mètre près.
        latitude: 44.8992,
        longitude: 5.0281,
      },
      geoRadius: 30000,
      description: "Chabeuil et 30 km alentour, pour les ateliers à domicile.",
    },
    knowsAbout: ["couture", "broderie", "macramé", "tissage", "upcycling", "modelage argile"],
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      // Le contenu est construit ici, jamais saisi par un visiteur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
