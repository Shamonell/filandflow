import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getEventBySlug, getEvents } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import Button from "@/components/ui/Button";
import WorkshopSalesTermsButtons from "@/components/atelier/WorkshopSalesTermsButtons";
import { cn } from "@/lib/utils";
import {
  formatEventInParis,
  isEventOnOrAfterTodayParis,
} from "@/lib/eventParis";
import {
  getRemainingPlaces,
  getPlacesMessage,
  hasAvailablePlaces,
  getEventDisplayInfo,
} from "@/lib/eventUtils";

interface EventPageProps {
  params: { slug: string };
}

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const events = await getEvents();
    return events
      .filter((event) => isEventOnOrAfterTodayParis(event.dateStart))
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

  if (!isEventOnOrAfterTodayParis(event.dateStart)) notFound();

  const display = getEventDisplayInfo(event);
  const formattedDate = formatEventInParis(
    event.dateStart,
    "EEEE d MMMM yyyy"
  );
  const formattedTime = formatEventInParis(event.dateStart, "HH:mm");
  const remainingPlaces = getRemainingPlaces(event);
  const placesInfo = getPlacesMessage(event);
  const hasPlaces = hasAvailablePlaces(event);

  const statusColors = {
    ouvert: "bg-[#6F8F72]/15 text-[#5C3A21] border-[#6F8F72]/30",
    complet: "bg-red-50 text-red-800 border-red-200",
    passé: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const placesColors = {
    available: "bg-white/90 text-[#6F8F72] border-[#6F8F72]/30",
    few: "bg-amber-50/90 text-amber-800 border-amber-200",
    full: "bg-red-50/90 text-red-700 border-red-300 font-semibold",
  };

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "33600000000";
  const inscriptionMessage = `Bonjour Elisabeth,\n\nJe souhaite m'inscrire à l'atelier "${display.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nPourriez-vous me confirmer s'il reste des places disponibles ?\n\nMerci !`;
  const signupWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(inscriptionMessage)}`;
  const signupContactUrl = `/contact?message=${encodeURIComponent(inscriptionMessage)}`;
  const waitlistMessage = `Bonjour Elisabeth,\n\nJe souhaite être ajouté(e) à la liste d'attente pour l'atelier "${display.title}" prévu le ${formattedDate} à ${formattedTime}.\n\nMerci !`;
  const waitlistWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waitlistMessage)}`;
  const waitlistContactUrl = `/contact?message=${encodeURIComponent(waitlistMessage)}`;

  const heroImage = display.images?.[0];
  const galleryImages = (display.images?.length
    ? display.images.slice(1, 5)
    : []) as Array<{
    _key?: string;
    asset?: { _ref?: string };
    [key: string]: unknown;
  }>;

  return (
    <div className="min-h-screen bg-[#FBF8F3]">
      {/* Hero — grande image ou fond élégant */}
      <section className="relative">
        {heroImage ? (
          <div className="relative h-[45vh] min-h-[300px] w-full md:h-[50vh] lg:h-[55vh]">
            <Image
              src={urlFor(heroImage)
                .width(1600)
                .height(900)
                .format("webp")
                .url()}
              alt={display.title}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5C3A21]/80 via-[#5C3A21]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
              <div className="container mx-auto max-w-5xl">
                <h1 className="font-serif text-3xl font-light tracking-wide text-white drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
                  {display.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  {placesInfo.text && (
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
                        placesColors[placesInfo.variant]
                      )}
                    >
                      {placesInfo.text}
                    </span>
                  )}
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm",
                      event.status === "complet"
                        ? "border-red-300/50 bg-red-900/80 text-white"
                        : "border-white/40 bg-black/30 text-white"
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
          </div>
        ) : (
          <div className="relative flex min-h-[280px] items-center justify-center bg-gradient-to-br from-[#EEF4EE] via-[#FBF8F3] to-[#EEF4EE] md:min-h-[400px]">
            <div className="absolute inset-0 border-b border-[#6F8F72]/10" />
            <div className="relative z-10 px-6 text-center">
              <h1 className="font-serif text-3xl font-light text-[#5C3A21] md:text-4xl lg:text-5xl">
                {display.title}
              </h1>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {placesInfo.text && (
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium",
                      placesColors[placesInfo.variant]
                    )}
                  >
                    {placesInfo.text}
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
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
          </div>
        )}
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Bloc infos — date, durée, lieu, prix, places — style carte */}
        <div className="mb-12 -mt-8 rounded-2xl border border-[#6F8F72]/15 bg-white p-6 shadow-lg md:-mt-12 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">Date</p>
                <p className="mt-0.5 font-medium text-[#5C3A21]">{formattedDate}</p>
                <p className="text-sm text-[#5F6C72]">à {formattedTime}</p>
              </div>
            </div>
            {display.duration && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">Durée</p>
                  <p className="mt-0.5 font-medium text-[#5C3A21]">{display.duration}</p>
                </div>
              </div>
            )}
            {display.location && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">Lieu</p>
                  <p className="mt-0.5 font-medium text-[#5C3A21]">{display.location}</p>
                </div>
              </div>
            )}
            {event.price != null && event.price > 0 && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">Prix</p>
                  <p className="mt-0.5 font-medium text-[#5C3A21]">{event.price.toFixed(2)} €</p>
                </div>
              </div>
            )}
            {event.capacity != null && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#5F6C72]">Places</p>
                  <p className="mt-0.5 font-medium text-[#5C3A21]">
                    {event.capacity} participant{event.capacity > 1 ? "s" : ""}
                    {remainingPlaces !== null && remainingPlaces >= 0 && (
                      <span className={cn("ml-2", remainingPlaces === 0 ? "text-red-600" : "text-[#6F8F72]")}>
                        — {remainingPlaces === 0 ? "Complet" : `${remainingPlaces} disponible${remainingPlaces > 1 ? "s" : ""}`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description pour cette session (mise en avant) */}
        {display.sessionDescription && (
          <div className="mb-12 rounded-2xl border-l-4 border-[#6F8F72] bg-[#EEF4EE]/60 px-6 py-5">
            <p className="text-sm font-semibold text-[#5C3A21]">Pour cette session</p>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-[#1F2933]">
              {display.sessionDescription}
            </p>
          </div>
        )}

        {/* Galerie — layout asymétrique */}
        {galleryImages.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-6 font-serif text-2xl font-light text-[#5C3A21]">
              Quelques réalisations
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {galleryImages[0] && (
                <div className="col-span-2 row-span-2 relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-square">
                  <Image
                    src={urlFor(galleryImages[0]).width(800).height(600).format("webp").url()}
                    alt={`${display.title} - 1`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              )}
              {galleryImages.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={urlFor(img).width(400).height(400).format("webp").url()}
                    alt={`${display.title} - ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description principale */}
        {display.description && (
          <section className="mb-14">
            <h2 className="mb-6 font-serif text-2xl font-light text-[#5C3A21]">
              À propos de cet atelier
            </h2>
            <p className="max-w-3xl whitespace-pre-line leading-relaxed text-[#5F6C72]">
              {display.description}
            </p>
          </section>
        )}

        {/* Ce que vous devez savoir — style carte */}
        <section className="mb-14 rounded-2xl border border-[#6F8F72]/10 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 font-serif text-xl font-medium text-[#5C3A21]">
            Ce que vous devez savoir
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              { label: "Tout le matériel est fourni", sub: "Vous n'avez besoin de rien apporter" },
              { label: "Aucun niveau requis", sub: "Débutants et initiés sont les bienvenus" },
              { label: "Petits groupes", sub: "Pour un accompagnement personnalisé" },
              { label: "Sans pression", sub: "Créez à votre rythme, dans la bienveillance" },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 shrink-0 text-[#6F8F72]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

        <WorkshopSalesTermsButtons
          signupWhatsappUrl={signupWhatsappUrl}
          signupContactUrl={signupContactUrl}
          waitlistWhatsappUrl={waitlistWhatsappUrl}
          waitlistContactUrl={waitlistContactUrl}
          showSignup={event.status === "ouvert" && hasPlaces}
          showWaitlist={
            (event.status === "ouvert" && !hasPlaces) || event.status === "complet"
          }
        />
      </div>
    </div>
  );
}
