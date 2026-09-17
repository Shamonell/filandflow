"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DeliveryChoiceModal from "@/components/checkout/DeliveryChoiceModal";
import PaymentChoiceModal from "@/components/checkout/PaymentChoiceModal";
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
  /** Nom de l'article, repris dans les messages pré-remplis du paiement sur place. */
  itemLabel?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function CheckoutButton({
  type,
  slug,
  giftId,
  basePrice,
  itemLabel,
  children,
  className,
  size = "md",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Choix du mode de règlement, en amont du choix de livraison.
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);

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

  // « Acheter » ouvre d'abord le choix du mode de règlement. Auparavant, ce
  // clic menait directement au choix de livraison puis à Stripe, sans qu'un
  // paiement sur place soit proposé nulle part.
  const openModal = () => {
    if (loading) return;
    setShowPaymentChoice(true);
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
      <PaymentChoiceModal
        open={showPaymentChoice}
        onClose={() => setShowPaymentChoice(false)}
        onPayOnline={() => {
          setShowPaymentChoice(false);
          setShowModal(true);
        }}
        itemLabel={itemLabel ?? (isGift ? "ce bon cadeau" : "cette création")}
        price={basePrice}
      />
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
