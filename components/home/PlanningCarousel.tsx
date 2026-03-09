"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  src: string;
  alt: string;
  title: string;
  buttonLabel: string;
  href: string;
}

const slides: Slide[] = [
  {
    src: "/atelier1.jpg",
    alt: "Planning des ateliers Fil & Flow",
    title: "Le planning des ateliers",
    buttonLabel: "C'est quoi le planning ?",
    href: "/ateliers",
  },
  {
    src: "/atelier2.jpg",
    alt: "Boutique Fil & Flow",
    title: "La boutique Fil & Flow",
    buttonLabel: "Découvrir la boutique",
    href: "/boutique",
  },
  {
    src: "/image atelier chez vous.PNG",
    alt: "Parenthèses à la maison - ateliers à domicile",
    title: "Parenthèses à la maison",
    buttonLabel: "En savoir plus",
    href: "/ateliers-chez-vous",
  },
];

export default function PlanningCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<boolean[]>(
    new Array(slides.length).fill(false)
  );

  // Navigation vers le slide suivant
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  // Auto-play avec pause au hover
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(nextSlide, 5000); // 5 secondes
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  // Gestion des erreurs d'image
  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <section className="bg-[#FBF8F3] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Container des slides */}
          <div className="relative h-[260px] w-full md:h-[380px] lg:h-[420px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                {/* Image ou placeholder */}
                {imageErrors[index] ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EEF4EE] to-[#d9ead9]">
                    <span className="text-lg text-[#6F8F72]">
                      Image {index + 1}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
                    priority={index === 0}
                    onError={() => handleImageError(index)}
                  />
                )}

                {/* Gradient subtil en bas pour lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            ))}

            {/* Contenu texte + bouton par-dessus (selon le slide) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-10 md:pb-14">
              <h2
                className="mb-4 text-center text-3xl font-light text-white md:text-4xl lg:text-5xl"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              >
                {slides[currentIndex].title}
              </h2>
              <Link href={slides[currentIndex].href}>
                <button
                  className="rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-[#5C3A21] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl md:px-8 md:py-4 md:text-base"
                  aria-label={slides[currentIndex].buttonLabel}
                >
                  {slides[currentIndex].buttonLabel}
                </button>
              </Link>
            </div>
          </div>

          {/* Dots de navigation */}
          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Aller à la slide ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


