"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

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

  const handleClick = async () => {
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

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
      size={size}
    >
      {loading ? "Redirection..." : children ?? "Payer en ligne"}
    </Button>
  );
}
