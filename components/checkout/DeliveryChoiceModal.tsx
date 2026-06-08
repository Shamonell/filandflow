"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DeliveryMode, DeliveryOption } from "@/lib/deliveryOptions";

type DeliveryChoiceModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (mode: DeliveryMode) => void;
  options: DeliveryOption[];
  /** Titre affiché en haut de la modal (ex: "Comment recevoir votre commande ?") */
  title: string;
  /** Lien vers la section pertinente des CGV (#boutique ou #bons-cadeaux). */
  termsHref: string;
  /** Phrase contextualisée dans l'engagement CGV (ex: "l'achat de cette création"). */
  termsScopePhrase: string;
  /** Prix du produit/bon cadeau, affiché dans le récapitulatif final. */
  basePrice: number;
};

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export default function DeliveryChoiceModal({
  open,
  onClose,
  onConfirm,
  options,
  title,
  termsHref,
  termsScopePhrase,
  basePrice,
}: DeliveryChoiceModalProps) {
  // Sélectionne par défaut la première option active.
  const defaultSelected = options.find((o) => !o.disabled && o.id) ?? null;
  const [selectedId, setSelectedId] = useState<DeliveryMode | null>(
    defaultSelected?.id ?? null
  );
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Reset à chaque ouverture pour repartir d'un état propre.
  useEffect(() => {
    if (open) {
      setSelectedId(defaultSelected?.id ?? null);
      setTermsAccepted(false);
    }
  }, [open, defaultSelected?.id]);

  if (!open) return null;

  const selectedOption = options.find((o) => o.id === selectedId) ?? null;
  const canConfirm = selectedOption !== null && termsAccepted;
  const totalPrice = basePrice + (selectedOption?.price ?? 0);

  const handleClose = () => {
    setTermsAccepted(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm || !selectedId) return;
    setTermsAccepted(false);
    onConfirm(selectedId);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#5C3A21]/50 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#6F8F72]/20 bg-[#FBF8F3] shadow-xl",
          "max-h-[90vh] flex flex-col"
        )}
      >
        {/* En-tête */}
        <div className="border-b border-[#6F8F72]/15 bg-white px-6 py-5 md:px-8">
          <h2
            id="delivery-modal-title"
            className="font-serif text-xl font-light text-[#5C3A21] md:text-2xl"
          >
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#5F6C72]">
            Choisissez la formule qui vous convient le mieux.
          </p>
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {/* Options de livraison */}
          <fieldset className="space-y-3">
            <legend className="sr-only">Mode de livraison</legend>
            {options.map((option) => {
              const isSelected = option.id === selectedId;
              const isDisabled = !!option.disabled || option.id === null;
              return (
                <label
                  key={`${option.label}-${option.id ?? "disabled"}`}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all",
                    isDisabled &&
                      "cursor-not-allowed border-[#6F8F72]/10 bg-[#EEF4EE]/30 opacity-60",
                    !isDisabled &&
                      isSelected &&
                      "border-[#6F8F72] bg-white shadow-md ring-2 ring-[#6F8F72]/20",
                    !isDisabled &&
                      !isSelected &&
                      "border-[#6F8F72]/20 bg-white hover:border-[#6F8F72]/50 hover:bg-[#FBF8F3]"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery-mode"
                    value={option.id ?? ""}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {
                      if (!isDisabled && option.id) setSelectedId(option.id);
                    }}
                    aria-disabled={isDisabled}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#6F8F72]"
                  />
                  <span
                    className="mt-0.5 text-2xl leading-none"
                    aria-hidden="true"
                  >
                    {option.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={cn(
                          "font-medium",
                          isDisabled ? "text-[#5F6C72]" : "text-[#5C3A21]"
                        )}
                      >
                        {option.label}
                      </span>
                      <span
                        className={cn(
                          "whitespace-nowrap text-sm font-semibold",
                          isDisabled
                            ? "italic text-[#5F6C72]"
                            : option.price === 0
                              ? "text-[#6F8F72]"
                              : "text-[#5C3A21]"
                        )}
                      >
                        {isDisabled
                          ? option.disabledLabel ?? "Indisponible"
                          : option.price === 0
                            ? "Gratuit"
                            : priceFormatter.format(option.price)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[#5F6C72]">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </fieldset>

          {/* Récapitulatif */}
          {selectedOption && (
            <div className="mt-6 rounded-xl border border-[#6F8F72]/15 bg-white px-5 py-4">
              <div className="flex justify-between text-sm text-[#5F6C72]">
                <span>Sous-total</span>
                <span>{priceFormatter.format(basePrice)}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-[#5F6C72]">
                <span>Livraison</span>
                <span>
                  {selectedOption.price === 0
                    ? "Gratuit"
                    : priceFormatter.format(selectedOption.price)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-[#6F8F72]/15 pt-3 font-semibold text-[#5C3A21]">
                <span>Total</span>
                <span>{priceFormatter.format(totalPrice)}</span>
              </div>
            </div>
          )}

          {/* CGV */}
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-[#1F2933]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-[#6F8F72]/40 text-[#6F8F72] focus:ring-[#6F8F72]"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>
              J&apos;atteste avoir lu et accepter les{" "}
              <Link
                href={termsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#6F8F72] underline hover:text-[#5A726D]"
              >
                conditions générales de vente
              </Link>{" "}
              applicables à {termsScopePhrase}.
            </span>
          </label>
        </div>

        {/* Pied de page */}
        <div className="border-t border-[#6F8F72]/15 bg-white px-6 py-4 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-[#6F8F72]/30 px-4 py-2.5 text-sm font-medium text-[#5C3A21] hover:bg-[#EEF4EE]"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={handleConfirm}
              className="rounded-lg bg-[#6F8F72] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5A726D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuer vers le paiement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
