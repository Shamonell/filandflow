import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getEvents, Event } from "@/lib/queries";
import EventCard from "@/components/events/EventCard";
import ContactButton from "@/components/ui/ContactButton";
import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";

interface MonthPageProps {
  params: { month: string };
}

export const revalidate = 30;

// Génère tous les mois possibles pour l'export statique
export async function generateStaticParams() {
  const months = [
    "janvier",
    "fevrier",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "aout",
    "septembre",
    "octobre",
    "novembre",
    "decembre",
  ];
  
  const currentYear = new Date().getFullYear();
  const params: { month: string }[] = [];
  
  // Générer pour l'année actuelle et les 2 prochaines années
  for (let year = currentYear; year <= currentYear + 2; year++) {
    for (const month of months) {
      params.push({ month: `${month}-${year}` });
    }
  }
  
  return params;
}

export async function generateMetadata({
  params,
}: MonthPageProps): Promise<Metadata> {
  const monthName = decodeMonthSlug(params.month);
  return {
    title: `Ateliers ${monthName} - Fil & Flow`,
    description: `Découvrez les ateliers créatifs de ${monthName} et réservez votre place`,
  };
}

// Fonction pour obtenir le nom du fichier image du mois
function getMonthImage(monthName: string): string {
  const monthMap: { [key: string]: string } = {
    janvier: "janvier",
    fevrier: "fevrier",
    mars: "mars",
    avril: "avril",
    mai: "mai",
    juin: "juin",
    juillet: "juillet",
    aout: "aout",
    septembre: "septembre",
    octobre: "octobre",
    novembre: "novembre",
    decembre: "decembre",
  };
  
  const normalizedMonth = monthName.toLowerCase();
  const imageName = monthMap[normalizedMonth] || normalizedMonth;
  return `/${imageName}.png`;
}

// Fonction pour décoder le slug (ex: "janvier-2024" -> "janvier 2024")
function decodeMonthSlug(slug: string): string {
  const parts = slug.split("-");
  if (parts.length < 2) return slug;
  
  const monthName = parts[0];
  const year = parts[parts.length - 1];
  
  // Capitaliser le mois
  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  return `${capitalizedMonth} ${year}`;
}

// Fonction pour convertir le slug en format de recherche
function slugToMonthKey(slug: string): string {
  const parts = slug.split("-");
  if (parts.length < 2) return "";
  
  const monthName = parts[0];
  const year = parts[parts.length - 1];
  
  return `${monthName} ${year}`;
}

export default async function MonthPage({ params }: MonthPageProps) {
  let events: Event[] = [];
  try {
    events = await getEvents();
  } catch (error) {
    console.error("Erreur lors de la récupération des ateliers:", error);
    events = [];
  }

  const monthKey = slugToMonthKey(params.month);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer seulement les dates

  // Filtrer les ateliers du mois concerné (uniquement ceux à venir)
  const monthEvents = events.filter((event) => {
    const eventDate = new Date(event.dateStart);
    eventDate.setHours(0, 0, 0, 0);
    
    // Ignorer les ateliers dont la date est passée
    if (eventDate < now) return false;
    
    // Obtenir le mois/année de l'événement
    const eventMonthKey = format(eventDate, "MMMM yyyy", { locale: fr });
    
    // Comparaison directe d'abord (sensible à la casse et aux accents)
    if (eventMonthKey === monthKey) {
      return true;
    }
    
    // Si la comparaison directe échoue, essayer avec normalisation (sans accents, minuscules)
    const normalizedEventKey = eventMonthKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedMonthKey = monthKey.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return normalizedEventKey === normalizedMonthKey;
  });

  // Si aucun atelier trouvé, afficher un message au lieu d'une erreur 404
  // Ne pas utiliser notFound() pour permettre l'affichage de la page même sans événements

  const displayMonth = decodeMonthSlug(params.month);
  const monthName = params.month.split("-")[0];
  const monthImage = getMonthImage(monthName);

  return (
    <div className="bg-[#FBF8F3]">
      {/* Image du mois en hero */}
      <section className="relative overflow-hidden -mt-28 md:-mt-36">
        <div className="relative h-64 w-full md:h-80 lg:h-96 pt-28 md:pt-36">
          <Image
            src={monthImage}
            alt={`Ateliers de ${displayMonth}`}
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
          {/* Overlay gradient subtil pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          
          {/* Contenu texte par-dessus */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-12">
            <h1 className="mb-2 text-4xl font-light text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              {displayMonth}
            </h1>
            <p className="text-lg text-white drop-shadow-md md:text-xl">
              {monthEvents.length} atelier{monthEvents.length > 1 ? "s" : ""} programmé
              {monthEvents.length > 1 ? "s" : ""} ce mois
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        {/* Bouton retour */}
        <div className="mb-8">
          <Link
            href="/ateliers"
            className="inline-flex items-center text-[#6F8F72] transition-colors hover:text-[#5A726D]"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour au planning
          </Link>
        </div>

        {/* Grille d'ateliers */}
        {monthEvents.length === 0 ? (
          <div className="rounded-lg bg-[#EEF4EE] p-12 text-center">
            <p className="text-lg text-[#5F6C72]">
              Aucun atelier programmé pour {displayMonth}.
            </p>
            <p className="mt-4 text-[#5F6C72]">
              N&apos;hésitez pas à me contacter pour être informé(e) des
              prochaines dates.
            </p>
            <div className="mt-6">
              <ContactButton size="lg" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {monthEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Section contact - style cohérent avec l'accueil - seulement si il y a des ateliers */}
            <div className="mt-20 rounded-lg bg-[#EEF4EE] p-10 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-light text-[#5C3A21] md:text-3xl">
                Une question sur les ateliers ?
              </h2>
              <p className="mb-6 text-lg text-[#5F6C72]">
                N&apos;hésitez pas à me contacter, je serai ravie de vous renseigner.
              </p>
              <ContactButton size="lg" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


