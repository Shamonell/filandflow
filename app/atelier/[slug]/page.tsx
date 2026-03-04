import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { getEventBySlug, getEvents } from "@/lib/queries";
import Button from "@/components/ui/Button";
import ContactButton from "@/components/ui/ContactButton";
import { cn } from "@/lib/utils";
import { getRemainingPlaces, getPlacesMessage, hasAvailablePlaces } from "@/lib/eventUtils";

interface EventPageProps {
  params: { slug: string };
}

// ISR : régénère la page toutes les 60 secondes pour les nouveaux ateliers
export const revalidate = 60;

// Génère tous les slugs d'ateliers à venir pour l'export statique
export async function generateStaticParams() {
  try {
    const events = await getEvents();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Ne générer que les ateliers à venir
    return events
      .filter((event) => {
        const eventDate = new Date(event.dateStart);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
      })
      .map((event) => ({
        slug: event.slug.current,
      }));
  } catch (error) {
    console.error("Erreur lors de la génération des paramètres statiques:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) {
    return {
      title: "Atelier non trouvé - Fil & Flow",
    };
  }
  return {
    title: `${event.title} - Fil & Flow`,
    description: `Rejoignez-nous pour l'atelier ${event.title}.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  let event;
  try {
    event = await getEventBySlug(params.slug);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'atelier:", error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  const date = new Date(event.dateStart);
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr });
  const formattedTime = format(date, "HH:mm", { locale: fr });

  const statusColors = {
    ouvert: "bg-green-100 text-green-800 border-green-200",
    complet: "bg-red-100 text-red-800 border-red-200",
    passé: "bg-gray-100 text-gray-600 border-gray-200",
  };

  // Calcul des places restantes
  const remainingPlaces = getRemainingPlaces(event);
  const placesInfo = getPlacesMessage(event);
  const hasPlaces = hasAvailablePlaces(event);

  const placesColors = {
    available: "bg-[#EEF4EE] text-[#6F8F72] border-[#6F8F72]/20",
    few: "bg-orange-50 text-orange-700 border-orange-200",
    full: "bg-red-50 text-red-700 border-red-300 font-semibold",
  };

  // Vérifier si l'atelier est passé
  const eventDate = new Date(event.dateStart);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Si l'atelier est passé, ne pas l'afficher (404)
  if (eventDate < today) {
    notFound();
  }

  // Configuration WhatsApp et Contact
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@fil-et-flow.fr";
  
  // Message pré-rempli pour l'inscription
  const inscriptionMessage = `Bonjour Elisabeth,\n\nJe souhaite m'inscrire à l'atelier "${event.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nPourriez-vous me confirmer s'il reste des places disponibles ?\n\nMerci !`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inscriptionMessage)}`;
  const contactUrl = `/contact?message=${encodeURIComponent(inscriptionMessage)}`;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-light tracking-wide md:text-4xl">
                {event.title}
              </h1>
              <div className="flex items-center gap-2">
                {placesInfo.text && (
                  <span
                    className={cn(
                      "rounded-full border-2 px-3 py-1 text-xs font-semibold",
                      placesColors[placesInfo.variant]
                    )}
                  >
                    {placesInfo.text}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full border-2 px-3 py-1 text-sm font-semibold",
                    statusColors[event.status]
                  )}
                >
                  {event.status === "complet" ? "Complet" : event.status === "ouvert" ? "Ouvert" : "Passé"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 space-y-6 rounded-lg border border-beige-200 bg-beige-50 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">Date</h3>
              <p className="text-lg text-gray-900">{formattedDate}</p>
              <p className="text-gray-600">à {formattedTime}</p>
            </div>
            {event.duration && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Durée
                </h3>
                <p className="text-lg text-gray-900">{event.duration}</p>
              </div>
            )}
            {event.location && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Lieu</h3>
                <p className="text-lg text-gray-900">{event.location}</p>
              </div>
            )}
            {event.price !== undefined && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">Prix</h3>
                <p className="text-lg text-gray-900">
                  {event.price.toFixed(2)} €
                </p>
              </div>
            )}
            {event.capacity && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Capacité
                </h3>
                {remainingPlaces !== null && remainingPlaces >= 0 ? (
                  <>
                    <p className={`text-lg font-medium ${
                      remainingPlaces === 0 
                        ? "text-red-600" 
                        : remainingPlaces <= 3 
                        ? "text-orange-600" 
                        : "text-gray-900"
                    }`}>
                      {event.capacity} participant{event.capacity > 1 ? "s" : ""}
                      {remainingPlaces === 0 
                        ? " — Complet" 
                        : ` — ${remainingPlaces} place${remainingPlaces > 1 ? "s" : ""} disponible${remainingPlaces > 1 ? "s" : ""}`
                      }
                    </p>
                    {remainingPlaces === 0 && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        Aucune place disponible
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-lg text-gray-900">
                    {event.capacity} participant{event.capacity > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {event.description && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-light text-gray-900">
              À propos de cet atelier
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4 whitespace-pre-line leading-relaxed">
                {typeof event.description === "string"
                  ? event.description
                  : "Description disponible"}
              </p>
            </div>
          </div>
        )}

        {/* Section rassurance */}
        <div className="mb-8 rounded-lg bg-almond-50 p-6 md:p-8">
          <h2 className="mb-4 text-xl font-medium text-gray-900">
            Ce que vous devez savoir
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0 text-almond-500" aria-hidden="true">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Tout le matériel est fourni</p>
                <p className="text-sm text-gray-600">
                  Vous n&apos;avez besoin de rien apporter
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0 text-almond-500" aria-hidden="true">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Aucun niveau requis</p>
                <p className="text-sm text-gray-600">
                  Débutants et initiés sont les bienvenus
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0 text-almond-500" aria-hidden="true">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Petits groupes</p>
                <p className="text-sm text-gray-600">
                  Pour un accompagnement personnalisé
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0 text-almond-500" aria-hidden="true">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Sans pression</p>
                <p className="text-sm text-gray-600">
                  Créez à votre rythme, dans la bienveillance
                </p>
              </div>
            </div>
          </div>
        </div>

        {event.status === "ouvert" && hasPlaces && (
          <div className="space-y-6 rounded-lg bg-white border border-beige-200 p-6 md:p-8">
            <div className="text-center">
              <h3 className="mb-4 text-xl font-medium text-gray-900">
                Réserver votre place
              </h3>
              <p className="mb-6 text-gray-700">
                Vous pouvez réserver sans paiement en ligne. Le paiement se fait
                sur place le jour de l&apos;atelier.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Button size="lg" className="flex items-center gap-2">
                    <img
                      src="/icone whatapp.PNG"
                      alt=""
                      className="h-5 w-5 object-contain"
                      aria-hidden="true"
                    />
                    Je m&apos;inscris par WhatsApp
                  </Button>
                </a>
                <Link href={contactUrl}>
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <img
                      src="/icone lettre coeur.PNG"
                      alt=""
                      className="h-5 w-5 object-contain"
                      aria-hidden="true"
                    />
                    Je m&apos;inscris par email
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-600">
                Les deux options vous permettent de m&apos;envoyer un message avec les détails de l&apos;atelier pré-remplis.
              </p>
            </div>
          </div>
        )}

        {(event.status === "ouvert" && !hasPlaces) || event.status === "complet" ? (
          <div className="rounded-lg bg-red-50 border-2 border-red-200 p-6 text-center md:p-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="mb-4 text-xl font-semibold text-red-800">
              Atelier complet
            </p>
            <p className="mb-4 text-red-700">
              Cet atelier est actuellement complet. Cependant, les places sont mises à jour quotidiennement et des désistements peuvent survenir.
            </p>
            <p className="mb-6 text-sm text-red-600">
              Si vous souhaitez vous inscrire, je peux vous ajouter à la liste d&apos;attente. 
              Si une place se libère entre le moment où vous m&apos;écrivez et le jour de l&apos;atelier, 
              je vous contacterai pour vous proposer la place disponible.
            </p>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour Elisabeth,\n\nJe souhaite être ajouté(e) à la liste d'attente pour l'atelier "${event.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nMerci !`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100">
                  <img
                    src="/icone whatapp.PNG"
                    alt=""
                    className="h-5 w-5 object-contain"
                    aria-hidden="true"
                  />
                  Me contacter par WhatsApp
                </Button>
              </a>
              <Link href={`/contact?message=${encodeURIComponent(`Bonjour Elisabeth,\n\nJe souhaite être ajouté(e) à la liste d'attente pour l'atelier "${event.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nMerci !`)}`}>
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100">
                  <img
                    src="/icone lettre coeur.PNG"
                    alt=""
                    className="h-5 w-5 object-contain"
                    aria-hidden="true"
                  />
                  Me contacter par email
                </Button>
              </Link>
            </div>
            <div className="pt-4 border-t border-red-200">
              <Link href="/ateliers">
                <Button size="lg" className="bg-[#6F8F72] hover:bg-[#5A726D] text-white">
                  Voir les autres ateliers disponibles
                </Button>
              </Link>
            </div>
          </div>
        ) : null}

        </div>
      </div>
    </div>
  );
}

