"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import SalesTermsModal from "@/components/legal/SalesTermsModal";

type CheckoutButtonProps = {
  type: "product" | "gift";
  slug?: string;
  giftId?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function CheckoutButton({
  type,
  slug,
  giftId,
  children,
  className,
  size = "md",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const startCheckout = async () => {
    if (loading) return;
    const payload =
      type === "product"
        ? { type: "product", slug }
        : { type: "gift", giftId };
    if ((type === "product" && !slug) || (type === "gift" && !giftId)) {
      return;
    }
    setLoading(true);
    try {
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

  const handleOpenTerms = () => {
    if (loading) return;
    setShowTerms(true);
  };

  const termsHref = type === "gift" ? "/cgv#bons-cadeaux" : "/cgv#boutique";
  const scopePhrase =
    type === "gift"
      ? "l'achat de ce bon cadeau et le paiement sécurisé"
      : "l'achat de cette création et le paiement sécurisé";

  return (
    <>
      <Button
        type="button"
        onClick={handleOpenTerms}
        disabled={loading}
        className={className}
        size={size}
      >
        {loading ? "Redirection..." : children ?? "Payer en ligne"}
      </Button>
      <SalesTermsModal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onConfirm={() => {
          setShowTerms(false);
          void startCheckout();
        }}
        termsHref={termsHref}
        scopePhrase={scopePhrase}
      />
    </>
  );
}
