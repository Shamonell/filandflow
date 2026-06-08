"use client";

import { useState } from "react";
import Image from "next/image";
import DeliveryChoiceModal from "@/components/checkout/DeliveryChoiceModal";
import {
  GIFT_DELIVERY_OPTIONS,
  type DeliveryMode,
} from "@/lib/deliveryOptions";

interface GiftCardImageProps {
  cardId: string;
  image: string;
  name: string;
  price: number;
}

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function GiftCardImage({
  cardId,
  image,
  name,
  price,
}: GiftCardImageProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const startCheckout = async (deliveryMode: DeliveryMode) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gift", giftId: cardId, deliveryMode }),
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

  const handleOpen = () => {
    if (loading) return;
    setShowModal(true);
  };

  return (
    <>
      <div
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        role="button"
        tabIndex={0}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-lg text-[#6F8F72]">
                Redirection vers le paiement...
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-beige-200 p-6 text-center md:p-8">
          <h2 className="mb-2 text-xl font-medium text-[#5C3A21] md:text-2xl">
            {name}
          </h2>
          <p className="text-2xl font-semibold text-[#6F8F72]">
            {priceFormatter.format(price)}
          </p>
          <p className="mt-3 text-sm text-[#5F6C72]">
            Cliquez pour choisir votre mode de réception et payer en ligne
          </p>
        </div>
      </div>

      <DeliveryChoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(mode) => {
          setShowModal(false);
          void startCheckout(mode);
        }}
        options={GIFT_DELIVERY_OPTIONS}
        title="Comment recevoir votre bon cadeau ?"
        termsHref="/cgv#bons-cadeaux"
        termsScopePhrase="l'achat de ce bon cadeau"
        basePrice={price}
      />
    </>
  );
}
