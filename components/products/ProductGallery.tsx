"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  /** Image affichée en grand dans la fiche. */
  src: string;
  /** Vignette, plus légère. */
  thumb: string;
  /** Version haute définition, utilisée dans la visionneuse plein écran. */
  full: string;
  alt: string;
}

interface ProductGalleryProps {
  photos: GalleryPhoto[];
  title: string;
}

/**
 * Galerie d'une fiche produit : image principale cliquable, vignettes, et
 * visionneuse plein écran au clic.
 *
 * Avant, les photos secondaires étaient affichées en vignettes inertes et
 * seules les images 2 à 5 apparaissaient : on ne pouvait ni les agrandir ni
 * voir les suivantes. Ici toutes les photos sont accessibles, au clic comme
 * au clavier (flèches, Échap).
 */
export default function ProductGallery({ photos, title }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const count = photos.length;
  const hasMultiple = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      // Navigation circulaire : après la dernière on revient à la première.
      setCurrent(((index % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);

  // Navigation clavier. Les flèches ne s'activent que si plusieurs photos.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && zoomed) {
        setZoomed(false);
        return;
      }
      if (!hasMultiple) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomed, hasMultiple, next, previous]);

  // Empêche le défilement de la page derrière la visionneuse.
  useEffect(() => {
    if (!zoomed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomed]);

  if (count === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-[#F2EEE7] text-sm text-text-secondary">
        Aucune photo disponible
      </div>
    );
  }

  const photo = photos[current];

  return (
    <div className="space-y-4">
      {/* Image principale */}
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#F2EEE7] ring-1 ring-black/5">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
          aria-label={`Agrandir la photo ${current + 1} sur ${count}`}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </button>

        {hasMultiple && (
          <>
            <ArrowButton side="left" onClick={previous} label="Photo précédente" />
            <ArrowButton side="right" onClick={next} label="Photo suivante" />

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
              {current + 1} / {count}
            </div>
          </>
        )}
      </div>

      {/* Vignettes : toutes les photos, pas seulement les quatre premières */}
      {/* Vignettes de taille fixe : une grille à 5 colonnes rendait deux
          photos minuscules et perdues dans le vide. */}
      {hasMultiple && (
        <ul className="flex flex-wrap gap-3">
          {photos.map((item, index) => (
            <li key={item.thumb}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === current}
                aria-label={`Voir la photo ${index + 1} sur ${count}`}
                className={cn(
                  "relative block h-20 w-20 overflow-hidden rounded-lg bg-[#F2EEE7] transition sm:h-24 sm:w-24",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-signature focus-visible:ring-offset-2",
                  index === current
                    ? "ring-2 ring-signature ring-offset-2 ring-offset-[#FBF8F3]"
                    : "opacity-70 ring-1 ring-black/5 hover:opacity-100",
                )}
              >
                <Image
                  src={item.thumb}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/*
        Visionneuse plein écran.
        Le fond est écrit en rgba() et non en `bg-[#231B14]/92` : le modificateur
        d'opacité appliqué à une couleur arbitraire ne génère aucune classe, et
        l'overlay restait transparent.
      */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo ${current + 1} sur ${count}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(35,27,20,0.94)] p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/*
            stopPropagation : un clic sur la photo ne referme pas la visionneuse.
            Hauteur explicite en vh : `h-full` sur un enfant de conteneur
            `items-center` ne résolvait à rien et la photo restait à la taille
            de la vignette.
          */}
          <div
            className="relative h-[82vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={photo.full}
              alt={photo.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {hasMultiple && (
            <div
              className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6"
              onClick={(event) => event.stopPropagation()}
            >
              <ViewerArrow onClick={previous} label="Photo précédente" direction="left" />
              <span className="text-sm tracking-wide text-white/80">
                {current + 1} / {count}
              </span>
              <ViewerArrow onClick={next} label="Photo suivante" direction="right" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-heading shadow-sm backdrop-blur-sm transition",
        "hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-signature",
        // Discret au repos sur grand écran, toujours visible au toucher.
        "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}

function ViewerArrow({
  onClick,
  label,
  direction,
}: {
  onClick: () => void;
  label: string;
  direction: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}
