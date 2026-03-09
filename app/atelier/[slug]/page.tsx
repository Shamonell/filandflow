import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { getEventBySlug, getEvents } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  getRemainingPlaces,
  getPlacesMessage,
  hasAvailablePlaces,
  getEventDisplayInfo,
} from "@/lib/eventUtils";

interface EventPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((event) => {
        const eventDate = new Date(event.dateStart);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
      })
      .map((event) => ({ slug: event.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Atelier non trouvé - Fil & Flow" };
  const { title } = getEventDisplayInfo(event);
  return {
    title: `${title} - Fil & Flow`,
    description: `Rejoignez-nous pour l'atelier ${title}.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  let event;
  try {
    event = await getEventBySlug(params.slug);
  } catch {
    notFound();
  }
  if (!event) notFound();

  const eventDate = new Date(event.dateStart);
  eventDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (eventDate < today) notFound();

  const display = getEventDisplayInfo(event);
  const date = new Date(event.dateStart);
  const formattedDate = format(date, "EEEE d MMMM yyyy", { locale: fr });
  const formattedTime = format(date, "HH:mm", { locale: fr });
  const remainingPlaces = getRemainingPlaces(event);
  const placesInfo = getPlacesMessage(event);
  const hasPlaces = hasAvailablePlaces(event);

  const statusColors = {
    ouvert: "bg-green-100 text-green-800 border-green-200",
    complet: "bg-red-100 text-red-800 border-red-200",
    passé: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const placesColors = {
    available: "bg-[#EEF4EE] text-[#6F8F72] border-[#6F8F72]/20",
    few: "bg-orange-50 text-orange-700 border-orange-200",
    full: "bg-red-50 text-red-700 border-red-300 font-semibold",
  };

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000";
  const inscriptionMessage = `Bonjour Elisabeth,\n\nJe souhaite m'inscrire à l'atelier "${display.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nPourriez-vous me confirmer s'il reste des places disponibles ?\n\nMerci !`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inscriptionMessage)}`;
  const contactUrl = `/contact?message=${encodeURIComponent(inscriptionMessage)}`;

  const heroImage = display.images?.[0];
  const galleryImages = (display.images?.length
    ? display.images.slice(1, 5)
    : []) as Array<{
    _key?: string;
    asset?: { _ref?: string };
    [key: string]: unknown;
  }>;

  return (
    <div className="bg-[#FBF8F3]">
      {/* Hero image */}
      {heroImage && (
        <section className="relative h-[280px] w-full md:h-[360px] lg:h-[420px]">
          <Image
            src={urlFor(heroImage)
              .width(1200)
              .height(630)
              .format("webp")
              .url()}
            alt={display.title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto max-w-4xl">
              <h1 className="font-serif text-3xl font-light tracking-wide text-white drop-shadow-md md:text-4xl lg:text-5xl">
                {display.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {placesInfo.text && (
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold",
                      placesColors[placesInfo.variant]
                    )}
                  >
                    {placesInfo.text}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm",
                    event.status === "complet"
                      ? "border-red-300 bg-red-900/70"
                      : "border-white/30 bg-black/30"
                  )}
                >
                  {event.status === "complet"
                    ? "Complet"
                    : event.status === "ouvert"
                      ? "Ouvert"
                      : "Passé"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {!heroImage && (
        <section className="border-b border-beige-200 bg-[#EEF4EE] py-8 md:py-10">
          <div className="container mx-auto max-w-4xl px-4">
            <h1 className="font-serif text-3xl font-light text-[#5C3A21] md:text-4xl">
              {display.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
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
                {event.status === "complet"
                  ? "Complet"
                  : event.status === "ouvert"
                    ? "Ouvert"
                    : "Passé"}
              </span>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        {/* Bloc infos (date, durée, lieu, prix, places) */}
        <div className="mb-10 rounded-2xl border border-beige-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">
                Date
              </p>
              <p className="mt-1 font-medium text-[#5C3A21]">{formattedDate}</p>
              <p className="text-[#5F6C72]">à {formattedTime}</p>
            </div>
            {display.duration && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">
                  Durée
                </p>
                <p className="mt-1 font-medium text-[#5C3A21]">
                  {display.duration}
                </p>
              </div>
            )}
            {display.location && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">
                  Lieu
                </p>
                <p className="mt-1 font-medium text-[#5C3A21]">
                  {display.location}
                </p>
              </div>
            )}
            {event.price != null && event.price > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">
                  Prix
                </p>
                <p className="mt-1 font-medium text-[#5C3A21]">
                  {event.price.toFixed(2)} €
                </p>
              </div>
            )}
            {event.capacity != null && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">
                  Places
                </p>
                <p className="mt-1 font-medium text-[#5C3A21]">
                  {event.capacity} participant{event.capacity > 1 ? "s" : ""}
                  {remainingPlaces !== null && remainingPlaces >= 0 && (
                    <span
                      className={cn(
                        "ml-2",
                        remainingPlaces === 0 ? "text-red-600" : "text-[#6F8F72]"
                      )}
                    >
                      —{" "}
                      {remainingPlaces === 0
                        ? "Complet"
                        : `${remainingPlaces} disponible${remainingPlaces > 1 ? "s" : ""}`}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description pour cette session */}
        {display.sessionDescription && (
          <div className="mb-10 rounded-xl border-l-4 border-[#6F8F72] bg-[#EEF4EE]/50 px-5 py-4">
            <p className="text-sm font-medium text-[#5C3A21]">
              Pour cette session
            </p>
            <p className="mt-1 whitespace-pre-line text-[#1F2933]">
              {display.sessionDescription}
            </p>
          </div>
        )}

        {/* Description principale (du type d'atelier) */}
        {display.description && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-light text-[#5C3A21]">
              À propos de cet atelier
            </h2>
            <div className="prose max-w-none text-[#5F6C72]">
              <p className="whitespace-pre-line leading-relaxed">
                {display.description}
              </p>
            </div>
          </section>
        )}

        {/* Galerie d'images (2 à 4 images supplémentaires) */}
        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-light text-[#5C3A21]">
              Quelques réalisations
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl bg-beige-100"
                >
                  <Image
                    src={urlFor(img)
                      .width(400)
                      .height(400)
                      .format("webp")
                      .url()}
                    alt={`${display.title} - ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ce que vous devez savoir */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 font-serif text-xl font-medium text-[#5C3A21]">
            Ce que vous devez savoir
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Tout le matériel est fourni",
                sub: "Vous n'avez besoin de rien apporter",
              },
              {
                label: "Aucun niveau requis",
                sub: "Débutants et initiés sont les bienvenus",
              },
              {
                label: "Petits groupes",
                sub: "Pour un accompagnement personnalisé",
              },
              {
                label: "Sans pression",
                sub: "Créez à votre rythme, dans la bienveillance",
              },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 shrink-0 text-[#6F8F72]" aria-hidden>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-medium text-[#5C3A21]">{item.label}</p>
                  <p className="text-sm text-[#5F6C72]">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Inscription */}
        {event.status === "ouvert" && hasPlaces && (
          <section className="rounded-2xl border-2 border-[#6F8F72]/20 bg-[#EEF4EE] p-8 text-center md:p-10">
            <h3 className="mb-2 font-serif text-2xl font-light text-[#5C3A21]">
              Réserver votre place
            </h3>
            <p className="mb-6 text-[#5F6C72]">
              Réservation sans paiement en ligne. Le paiement se fait sur place
              le jour de l&apos;atelier.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center"
              >
                <Button size="lg" className="flex items-center gap-2">
                  <Image
                    src="/icone whatapp.PNG"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                    aria-hidden
                  />
                  Je m&apos;inscris par WhatsApp
                </Button>
              </a>
              <Link href={contactUrl}>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Image
                    src="/icone lettre coeur.PNG"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                    aria-hidden
                  />
                  Je m&apos;inscris par email
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-[#5F6C72]">
              Message avec les détails de l&apos;atelier pré-remplis.
            </p>
          </section>
        )}

        {/* Atelier complet */}
        {((event.status === "ouvert" && !hasPlaces) ||
          event.status === "complet") && (
          <section className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center md:p-10">
            <p className="mb-2 text-xl font-semibold text-red-800">
              Atelier complet
            </p>
            <p className="mb-6 text-red-700">
              Les places sont mises à jour régulièrement. Je peux vous ajouter en
              liste d&apos;attente.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Bonjour Elisabeth,\n\nJe souhaite être ajouté(e) à la liste d'attente pour l'atelier "${display.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nMerci !`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Image
                    src="/icone whatapp.PNG"
                    alt=""
                    width={20}
                    height={20}
                    className="mr-2 inline h-5 w-5 object-contain"
                    aria-hidden
                  />
                  Me contacter par WhatsApp
                </Button>
              </a>
              <Link
                href={`/contact?message=${encodeURIComponent(`Bonjour Elisabeth,\n\nJe souhaite être ajouté(e) à la liste d'attente pour l'atelier "${display.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nMerci !`)}`}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Me contacter par email
                </Button>
              </Link>
            </div>
            <div className="mt-6 border-t border-red-200 pt-6">
              <Link href="/ateliers">
                <Button
                  size="lg"
                  className="bg-[#6F8F72] text-white hover:bg-[#5A726D]"
                >
                  Voir les autres ateliers
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
