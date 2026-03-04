"use client";

import Image from "next/image";
import { useState } from "react";

interface WorkshopCardProps {
  title: string;
  duration: string;
  price: string;
  imagePath: string;
  imageAlt: string;
}

export default function WorkshopCard({
  title,
  duration,
  price,
  imagePath,
  imageAlt,
}: WorkshopCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Image dominante */}
      <div className="relative h-64 w-full md:h-72">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EEF4EE] to-[#d9ead9]">
            <span className="text-lg text-[#6F8F72]">{title}</span>
          </div>
        ) : (
          <Image
            src={imagePath}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Contenu texte */}
      <div className="p-6">
        <h3 className="mb-3 text-2xl font-light text-[#5C3A21] md:text-3xl">{title}</h3>
        <div className="flex items-center justify-between text-base text-[#5F6C72] md:text-lg">
          <span>{duration}</span>
          <span className="font-medium text-[#6F8F72]">{price}</span>
        </div>
      </div>
    </div>
  );
}

