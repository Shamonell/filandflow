"use client";

import { useState } from "react";

interface GiftCardImageProps {
  cardId: string;
  image: string;
  name: string;
  price: number;
}

export default function GiftCardImage({
  cardId,
  image,
  name,
  price,
}: GiftCardImageProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gift", giftId: cardId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Une erreur est survenue");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
    >
      <div className="relative w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-lg text-[#6F8F72]">Redirection vers le paiement...</div>
          </div>
        )}
      </div>
      <div className="border-t border-beige-200 p-6 text-center md:p-8">
        <h2 className="mb-2 text-xl font-medium text-[#5C3A21] md:text-2xl">
          {name}
        </h2>
        <p className="text-2xl font-semibold text-[#6F8F72]">
          {price} €
        </p>
        <p className="mt-3 text-sm text-[#5F6C72]">
          Cliquez sur l&apos;image pour payer en ligne
        </p>
      </div>
    </div>
  );
}
