"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Testimonial {
  name: string;
  text: string;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sophie",
    text: "Un moment de pure détente. J'ai adoré créer de mes mains dans cette atmosphère bienveillante.",
    rotation: -1.5,
    color: "bg-[#FBF8F3]",
    accentColor: "from-[#E8B4B8] to-[#F5D5D8]",
    delay: 0,
  },
  {
    name: "Marie",
    text: "Elisabeth a su créer un espace apaisant où j'ai pu me reconnecter à ma créativité sans pression.",
    rotation: 1.2,
    color: "bg-white",
    accentColor: "from-[#A8D5BA] to-[#C4E4D1]",
    delay: 100,
  },
  {
    name: "Claire",
    text: "Je recommande vivement ces ateliers. Un vrai moment pour soi, dans la douceur et la bienveillance.",
    rotation: -0.8,
    color: "bg-[#FBF8F3]",
    accentColor: "from-[#D4A574] to-[#E8C9A0]",
    delay: 200,
  },
  {
    name: "Julie",
    text: "Après une journée chargée, cet atelier m'a fait le plus grand bien. Je me suis sentie accueillie et écoutée.",
    rotation: 1.5,
    color: "bg-white",
    accentColor: "from-[#B8A9C9] to-[#D4C9E4]",
    delay: 300,
  },
  {
    name: "Camille",
    text: "Une expérience humaine et créative qui m'a redonné confiance en mes capacités. Merci !",
    rotation: -1,
    color: "bg-[#FBF8F3]",
    accentColor: "from-[#F4A5AE] to-[#F8C0C7]",
    delay: 400,
  },
];

export default function TestimonialsCollage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#EEF4EE] py-20 md:py-28">
      {/* Éléments décoratifs SVG en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {/* Fils de couture décoratifs */}
        <svg
          className="absolute -left-20 top-20 h-64 w-64 animate-pulse"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 50 Q100 30 150 50 T200 50"
            stroke="#6F8F72"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <circle cx="50" cy="50" r="3" fill="#6F8F72" />
          <circle cx="150" cy="50" r="3" fill="#6F8F72" />
        </svg>

        {/* Épingle décorative */}
        <svg
          className="absolute right-10 top-32 h-24 w-24 rotate-12"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10 L50 60 M45 15 L55 15 M45 20 L55 20 M50 60 L40 80 M50 60 L60 80"
            stroke="#6F8F72"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Ciseaux décoratifs */}
        <svg
          className="absolute bottom-20 left-10 h-32 w-32 -rotate-12"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 30 Q50 20 70 30 L70 50 Q50 40 30 50 Z"
            stroke="#6F8F72"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="30" cy="40" r="4" fill="#6F8F72" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* En-tête centré avec illustration */}
          <div className="mb-16 text-center">
            {/* Illustration de la bulle de parole */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/Bulle de parole.png"
                alt=""
                width={192}
                height={192}
                className="h-36 w-36 object-contain md:h-40 md:w-40 lg:h-48 lg:w-48"
                aria-hidden
              />
            </div>

            <h2 className="mb-6 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              Elles en parlent
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5F6C72] md:text-xl lg:text-2xl">
              Les participantes partagent leur expérience et leur ressenti
              après avoir vécu un moment de création et de bien-être.
            </p>
          </div>

          {/* Grille créative des avis */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-700 ease-out ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: `${testimonial.delay}ms`,
                }}
              >
                {/* Carte avec rotation subtile et bordure colorée */}
                <div
                  className={`relative h-full overflow-hidden rounded-2xl ${testimonial.color} p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
                  style={{
                    transform: `rotate(${testimonial.rotation}deg)`,
                  }}
                >
                  {/* Bordure colorée en haut */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.accentColor}`} />
                  
                  {/* Pastille colorée décorative */}
                  <div className={`absolute top-4 right-4 h-3 w-3 rounded-full bg-gradient-to-br ${testimonial.accentColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/0 transition-all duration-300 group-hover:from-white/10 group-hover:via-white/5 group-hover:to-white/0" />
                  
                  {/* Contenu */}
                  <div className="relative">
                    {/* Guillemets décoratifs avec couleur */}
                    <div className={`mb-4 text-4xl font-serif bg-gradient-to-br ${testimonial.accentColor} bg-clip-text text-transparent`}>
                      &quot;
                    </div>
                    
                    <p className="mb-6 text-[#1F2933] leading-relaxed">
                      {testimonial.text}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className={`h-px flex-1 bg-gradient-to-r ${testimonial.accentColor} opacity-30`} />
                      <p className={`text-sm font-medium bg-gradient-to-r ${testimonial.accentColor} bg-clip-text text-transparent`}>
                        {testimonial.name}
                      </p>
                    </div>
                  </div>

                  {/* Élément décoratif en bas à droite */}
                  <div className={`absolute bottom-4 right-4 h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.accentColor} opacity-0 blur-md transition-all duration-300 group-hover:opacity-20`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

