import Link from "next/link";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { Event } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { getPlacesMessage } from "@/lib/eventUtils";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.dateStart);
  const dayNumber = format(date, "d", { locale: fr });
  const dayName = format(date, "EEEE", { locale: fr });
  const monthYear = format(date, "MMMM yyyy", { locale: fr });
  const time = format(date, "HH:mm", { locale: fr });

  const statusColors = {
    ouvert: "bg-green-100 text-green-800 border-green-200",
    complet: "bg-red-100 text-red-800 border-red-200",
    passé: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const placesInfo = getPlacesMessage(event);
  
  const placesColors = {
    available: "bg-[#EEF4EE] text-[#6F8F72] border-[#6F8F72]/20",
    few: "bg-orange-50 text-orange-700 border-orange-200",
    full: "bg-red-50 text-red-700 border-red-300 font-semibold",
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-beige-200 bg-white transition-all hover:shadow-lg hover:border-almond-300">
      <Link href={`/atelier/${event.slug.current}`}>
        <div className="p-6">
          {/* Date très visible */}
          <div className="mb-4 flex items-start gap-4">
            <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-almond-50 px-3 py-2 text-center">
              <span className="text-2xl font-semibold text-gray-900">
                {dayNumber}
              </span>
              <span className="text-xs font-medium uppercase text-gray-600">
                {format(date, "MMM", { locale: fr })}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">
                {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
              </p>
              <p className="text-xs text-gray-500">{monthYear}</p>
              <p className="mt-1 text-sm text-gray-700">à {time}</p>
            </div>
          </div>

          {/* Titre */}
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {event.title}
          </h3>

          {/* 2 infos principales */}
          <div className="mb-4 space-y-2 text-sm text-gray-700">
            {event.duration && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">⏱</span>
                <span>{event.duration}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📍</span>
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Badges statut et places */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold",
                statusColors[event.status]
              )}
            >
              {event.status === "complet" ? "Complet" : event.status === "ouvert" ? "Ouvert" : "Passé"}
            </span>
            {placesInfo.text && (
              <span
                className={cn(
                  "inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold",
                  placesColors[placesInfo.variant]
                )}
              >
                {placesInfo.text}
              </span>
            )}
          </div>

          {/* CTA discret */}
          <div className="pt-4 border-t border-beige-100">
            <span className="text-sm font-medium text-olive-600 group-hover:text-olive-700 transition-colors">
              Voir le détail →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

