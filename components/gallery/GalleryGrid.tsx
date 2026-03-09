"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

// 8 photos de la galerie (noms réels dans public/) : pochette1, pochette2, sacoche6, sacoche5, sac1, tissagepapier, bracelet, sacoche4
const GALLERY_IMAGES = [
  { src: "/pochette1.jpg", alt: "Pochette - réalisation Fil & Flow" },
  { src: "/pochette2.jpg", alt: "Pochette - réalisation Fil & Flow" },
  { src: "/sacoche6.jpg", alt: "Sacoche - réalisation Fil & Flow" },
  { src: "/sacoche5.jpg", alt: "Sacoche - réalisation Fil & Flow" },
  { src: "/sac1.jpg", alt: "Sac - réalisation Fil & Flow" },
  { src: "/tissagepapier.jpg", alt: "Tissage papier - réalisation Fil & Flow" },
  { src: "/bracelet.jpg", alt: "Bracelet - réalisation Fil & Flow" },
  { src: "/sacoche4.jpg", alt: "Sacoche - réalisation Fil & Flow" },
];

function GalleryImageItem({ image, index }: { image: GalleryImage; index: number }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-beige-200 to-beige-300 shadow-sm">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-beige-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-beige-600">Image {index + 1}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg bg-beige-200 shadow-sm transition-shadow hover:shadow-md">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function GalleryGrid() {
  return (
    <section className="bg-[#FBF8F3] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* En-tête */}
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              Galerie de réalisations
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
              Quelques instants capturés lors de nos ateliers, où la créativité
              rencontre la sérénité.
            </p>
          </div>

          {/* Grille d'images */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {GALLERY_IMAGES.map((image, index) => (
              <GalleryImageItem key={index} image={image} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

