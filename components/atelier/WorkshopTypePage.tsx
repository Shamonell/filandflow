import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { urlFor } from "@/lib/sanity";
import EventCard from "@/components/events/EventCard";
import type { WorkshopTemplate } from "@/lib/queries";
import type { Event } from "@/lib/queries";

interface WorkshopTypePageProps {
  template: WorkshopTemplate | null;
  events: Event[];
}

export default function WorkshopTypePage({
  template,
  events,
}: WorkshopTypePageProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter((e) => {
    const d = new Date(e.dateStart);
    d.setHours(0, 0, 0, 0);
    return d >= now && (e.status === "ouvert" || e.status === "complet");
  });

  if (!template) {
    return (
      <div className="bg-[#FBF8F3] py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h1 className="mb-4 font-serif text-2xl text-[#5C3A21]">
            Page non disponible
          </h1>
          <p className="mb-6 text-[#5F6C72]">
            Cette page n&apos;est pas disponible pour le moment.
          </p>
          <Link
            href="/ateliers"
            className="text-[#6F8F72] underline hover:text-[#5A726D]"
          >
            ← Retour aux ateliers
          </Link>
        </div>
      </div>
    );
  }

  const images = template.images ?? [];
  const heroImage = images[0];
  const galleryImages = images.slice(1, 5);

  return (
    <div className="bg-[#FBF8F3]">
      {/* Hero */}
      {heroImage ? (
        <section className="relative h-[280px] w-full md:h-[360px] lg:h-[420px]">
          <Image
            src={urlFor(heroImage)
              .width(1200)
              .height(630)
              .format("webp")
              .url()}
            alt={template.title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto max-w-4xl">
              <h1 className="font-serif text-3xl font-light tracking-wide text-white drop-shadow-md md:text-4xl lg:text-5xl">
                {template.title}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-beige-200 bg-[#EEF4EE] py-12 md:py-14">
          <div className="container mx-auto max-w-4xl px-4">
            <h1 className="font-serif text-3xl font-light text-[#5C3A21] md:text-4xl">
              {template.title}
            </h1>
          </div>
        </section>
      )}

      <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        {/* Description */}
        {template.description && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-2xl font-light text-[#5C3A21]">
              À propos de cet atelier
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-[#5F6C72]">
              {template.description}
            </p>
          </section>
        )}

        {/* Galerie */}
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
                    alt={`${template.title} - ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Prochaines sessions */}
        <section className="mb-12">
          <h2 className="mb-6 font-serif text-2xl font-light text-[#5C3A21]">
            Prochaines sessions
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-beige-200 bg-white p-8 text-center">
              <p className="text-[#5F6C72]">
                Aucune session prévue pour le moment.
              </p>
              <Link
                href="/ateliers"
                className="mt-4 inline-block text-[#6F8F72] underline hover:text-[#5A726D]"
              >
                Voir tous les ateliers
              </Link>
            </div>
          )}
        </section>

        <Link
          href="/ateliers"
          className="text-[#6F8F72] underline hover:text-[#5A726D]"
        >
          ← Retour à la liste des ateliers
        </Link>
      </div>
    </div>
  );
}
