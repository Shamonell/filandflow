import { Metadata } from "next";
import { getEvents, Event } from "@/lib/queries";
import ContactButton from "@/components/ui/ContactButton";
import MonthCard from "@/components/ateliers/MonthCard";
import { format, parseISO } from "date-fns";
import fr from "date-fns/locale/fr";

// ISR : régénère la page toutes les 30 secondes (suppressions/modifs Sanity visibles rapidement)
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Ateliers - Fil & Flow",
  description: "Découvrez nos ateliers créatifs et réservez votre place pour un moment de bien-être et de création",
};

// Fonction pour grouper les ateliers par mois
function groupEventsByMonth(events: Awaited<ReturnType<typeof getEvents>>) {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Comparer seulement les dates, pas les heures
  const grouped: Record<string, typeof events> = {};

  events.forEach((event) => {
    const eventDate = new Date(event.dateStart);
    eventDate.setHours(0, 0, 0, 0);
    
    // Ignorer les ateliers dont la date est passée (peu importe le statut)
    if (eventDate < now) return;

    const monthKey = format(eventDate, "MMMM yyyy", { locale: fr });
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(event);
  });

  // Trier les mois par date
  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    // Extraire le mois et l'année pour créer une date comparable
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    
    // Créer une date au 1er du mois pour comparer
    const dateA = parseISO(`${yearA}-${getMonthNumber(monthA)}-01`);
    const dateB = parseISO(`${yearB}-${getMonthNumber(monthB)}-01`);
    
    return dateA.getTime() - dateB.getTime();
  });

  return sortedMonths.map((monthKey) => {
    const [monthName, year] = monthKey.split(" ");
    return {
      monthKey,
      monthName,
      year,
      events: grouped[monthKey],
    };
  });
}

// Helper pour convertir le nom du mois en numéro
function getMonthNumber(monthName: string): string {
  const months: Record<string, string> = {
    janvier: "01",
    février: "02",
    mars: "03",
    avril: "04",
    mai: "05",
    juin: "06",
    juillet: "07",
    août: "08",
    septembre: "09",
    octobre: "10",
    novembre: "11",
    décembre: "12",
  };
  return months[monthName.toLowerCase()] || "01";
}

export default async function AteliersPage() {
  let events: Event[] = [];
  try {
    events = await getEvents();
  } catch (error) {
    console.error("Erreur lors de la récupération des ateliers:", error);
    events = [];
  }

  const eventsByMonth = groupEventsByMonth(events);

  return (
    <div className="bg-[#FBF8F3]">
      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24">
        {/* En-tête - aligné à gauche, style éditorial */}
        <div className="mb-16 max-w-3xl">
          <h1 className="mb-0 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
            Planning des ateliers
          </h1>
        </div>

        {/* Grille de cartes mensuelles */}
        {events.length === 0 ? (
          <div className="rounded-lg bg-[#EEF4EE] p-12 text-center">
            <p className="text-lg text-[#5F6C72]">
              Aucun atelier programmé pour le moment.
            </p>
            <p className="mt-4 text-[#5F6C72]">
              N&apos;hésitez pas à me contacter pour être informé(e) des
              prochaines dates.
            </p>
          </div>
        ) : eventsByMonth.length === 0 ? (
          <div className="rounded-lg bg-[#EEF4EE] p-12 text-center">
            <p className="text-lg text-[#5F6C72]">
              Aucun atelier à venir pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {eventsByMonth.map(({ monthKey, monthName, year, events: monthEvents }) => (
              <MonthCard
                key={monthKey}
                monthKey={monthKey}
                monthName={monthName}
                year={year}
                eventCount={monthEvents.length}
              />
            ))}
          </div>
        )}

        {/* Section contact - style cohérent avec l'accueil */}
        <div className="mt-20 rounded-lg bg-[#EEF4EE] p-10 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-light text-[#5C3A21] md:text-3xl">
            Une question sur les ateliers ?
          </h2>
          <p className="mb-6 text-lg text-[#5F6C72]">
            N&apos;hésitez pas à me contacter, je serai ravie de vous renseigner.
          </p>
          <ContactButton size="lg" />
        </div>
      </div>
    </div>
  );
}


