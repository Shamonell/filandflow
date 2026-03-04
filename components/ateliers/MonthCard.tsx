"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface MonthCardProps {
  monthKey: string; // Format "janvier 2024"
  eventCount: number;
  year: string;
  monthName: string;
}

export default function MonthCard({
  monthKey,
  eventCount,
  year,
  monthName,
}: MonthCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fonction pour obtenir le nom du fichier image du mois
  const getMonthImage = (month: string): string => {
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
    
    const normalizedMonth = month.toLowerCase();
    const imageName = monthMap[normalizedMonth] || normalizedMonth;
    return `/${imageName}.png`;
  };

  // Générer le chemin de l'image (ex: /janvier.png)
  const imagePath = getMonthImage(monthName);

  // Capitaliser le nom du mois pour l'affichage
  const displayMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Générer le slug pour l'URL (ex: "janvier-2024")
  const monthSlug = `${monthName.toLowerCase()}-${year}`;

  return (
    <Link
      href={`/ateliers/${monthSlug}`}
      className="group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
    >
      {/* Image de fond */}
      <div className="relative h-[280px] w-full md:h-[320px] lg:h-[360px]">
        {imageError ? (
          // Fallback si l'image n'existe pas
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EEF4EE] via-[#FBF8F3] to-[#d9ead9]">
            <div className="text-center">
              <span className="text-4xl font-light text-[#6F8F72] md:text-5xl">
                {displayMonth}
              </span>
            </div>
          </div>
        ) : (
          <Image
            src={imagePath}
            alt={`Ateliers de ${displayMonth} ${year}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}

        {/* Overlay gradient subtil pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {/* Contenu par-dessus l'image */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
          <div className="relative z-10">
            <h3 className="mb-2 text-3xl font-light text-white md:text-4xl lg:text-5xl">
              {displayMonth}
            </h3>
            <p className="text-lg text-white/90 md:text-xl">
              {eventCount} atelier{eventCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Indicateur de clic (discret) */}
        <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-white/90 p-2 backdrop-blur-sm">
            <svg
              className="h-5 w-5 text-[#6F8F72]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

