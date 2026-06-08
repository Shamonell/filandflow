"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DeliveryChoiceModal from "@/components/checkout/DeliveryChoiceModal";
import {
  PRODUCT_DELIVERY_OPTIONS,
  GIFT_DELIVERY_OPTIONS,
  type DeliveryMode,
} from "@/lib/deliveryOptions";

type CheckoutButtonProps = {
  type: "product" | "gift";
  slug?: string;
  giftId?: string;
  /** Prix de base (sans frais de port). Utilisé pour afficher le récap dans la modal. */
  basePrice: number;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function CheckoutButton({
  type,
  slug,
  giftId,
  basePrice,
  children,
  className,
  size = "md",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const startCheckout = async (deliveryMode: DeliveryMode) => {
    if (loading) return;
    if ((type === "product" && !slug) || (type === "gift" && !giftId)) return;

    setLoading(true);
    try {
      const payload =
        type === "product"
          ? { type: "product", slug, deliveryMode }
          : { type: "gift", giftId, deliveryMode };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const openModal = () => {
    if (loading) return;
    setShowModal(true);
  };

  const isGift = type === "gift";
  const options = isGift ? GIFT_DELIVERY_OPTIONS : PRODUCT_DELIVERY_OPTIONS;
  const modalTitle = isGift
    ? "Comment recevoir votre bon cadeau ?"
    : "Comment recevoir votre commande ?";
  const termsHref = isGift ? "/cgv#bons-cadeaux" : "/cgv#boutique";
  const termsScopePhrase = isGift
    ? "l'achat de ce bon cadeau"
    : "l'achat de cette création";

  return (
    <>
      <Button
        type="button"
        onClick={openModal}
        disabled={loading}
        className={className}
        size={size}
      >
        {loading ? "Redirection..." : children ?? "Payer en ligne"}
      </Button>
      <DeliveryChoiceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(mode) => {
          setShowModal(false);
          void startCheckout(mode);
        }}
        options={options}
        title={modalTitle}
        termsHref={termsHref}
        termsScopePhrase={termsScopePhrase}
        basePrice={basePrice}
      />
    </>
  );
}
