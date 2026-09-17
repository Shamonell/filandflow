"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Announcement } from "@/lib/queries";

/**
 * Affiches publiées telles quelles.
 *
 * Contrainte principale : ces visuels portent toute leur information en texte
 * incrusté. Ils sont donc affichés ENTIERS (`object-contain`), jamais rognés,
 * et cliquables pour être lus en grand — un tarif ou une date coupée rendrait
 * l'annonce inutile.
 */
export default function AnnouncementGrid({ announcements }: { announcements: Announcement[] }) {
  const [zoomed, setZoomed] = useState<Announcement | null>(null);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  if (!announcements.length) return null;

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {announcements.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
          >
            <button
              type="button"
              onClick={() => setZoomed(item)}
              className="block w-full cursor-zoom-in bg-[#F2EEE7]"
              aria-label={`Agrandir l'affiche : ${item.title}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={item.width}
                height={item.height}
                className="h-auto w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
            <figcaption className="space-y-1 px-5 py-4">
              <h3 className="font-serif text-lg font-light text-[#5C3A21]">{item.title}</h3>
              <p className="text-sm text-[#5F6C72]">{formatPeriod(item)}</p>
              {item.summary && (
                <p className="pt-1 text-sm leading-relaxed text-[#5F6C72]">{item.summary}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.title}
          onClick={() => setZoomed(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[rgba(35,27,20,0.94)] p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setZoomed(null)}
            aria-label="Fermer"
            className="fixed right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Largeur plafonnée plutôt que hauteur : une affiche portrait doit
              rester lisible, quitte à faire défiler la page. */}
          <Image
            src={zoomed.imageUrl}
            alt={zoomed.title}
            width={zoomed.width}
            height={zoomed.height}
            onClick={(event) => event.stopPropagation()}
            className="h-auto w-full max-w-2xl rounded-lg"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      )}
    </>
  );
}

function formatPeriod({ dateStart, dateEnd }: Announcement): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  if (!dateEnd || dateEnd === dateStart) return `À partir du ${fmt(dateStart)}`;
  return `Du ${fmt(dateStart)} au ${fmt(dateEnd)}`;
}
