"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SalesTermsModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  termsHref: string;
  /** Ex. « l'inscription à cet atelier » / « l'achat de ce bon cadeau » */
  scopePhrase: string;
};

export default function SalesTermsModal({
  open,
  onClose,
  onConfirm,
  termsHref,
  scopePhrase,
}: SalesTermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (open) setAccepted(false);
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setAccepted(false);
    onClose();
  };

  const handleConfirm = () => {
    if (!accepted) return;
    setAccepted(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-terms-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#5C3A21]/50 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#6F8F72]/20 bg-[#FBF8F3] p-6 shadow-xl md:p-8">
        <h2
          id="sales-terms-title"
          className="font-serif text-xl font-light text-[#5C3A21] md:text-2xl"
        >
          Conditions de vente
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-[#5F6C72]">
          Avant de poursuivre {scopePhrase}, merci de confirmer que vous avez pris
          connaissance des{" "}
          <Link
            href={termsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#6F8F72] underline hover:text-[#5A726D]"
          >
            conditions générales de vente
          </Link>{" "}
          (dont la partie applicable à votre demande).
        </p>
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-[#1F2933]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#6F8F72]/40 text-[#6F8F72] focus:ring-[#6F8F72]"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <span>
            J&apos;atteste avoir lu les conditions applicables et les accepter sans
            réserve pour cette demande.
          </span>
        </label>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#6F8F72]/30 px-4 py-2.5 text-sm font-medium text-[#5C3A21] hover:bg-white"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!accepted}
            onClick={handleConfirm}
            className="rounded-lg bg-[#6F8F72] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#5A726D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
