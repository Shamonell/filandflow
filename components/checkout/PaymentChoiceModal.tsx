"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { getContactEmail, mailtoLink, whatsappLink } from "@/lib/contact";

type PaymentChoiceModalProps = {
  open: boolean;
  onClose: () => void;
  /** L'acheteur a choisi la carte : on enchaîne sur le choix de livraison puis Stripe. */
  onPayOnline: () => void;
  /** Nom de l'article, repris dans les messages pré-remplis. */
  itemLabel: string;
  price: number;
};

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

type Step = "method" | "onsite";
type SendState = "idle" | "sending" | "sent" | "error";

/**
 * Premier écran du tunnel d'achat : payer maintenant, ou payer sur place.
 *
 * Auparavant, « Acheter » ouvrait Stripe immédiatement. Beaucoup d'acheteurs
 * préfèrent régler de la main à la main à l'atelier ; ce choix était invisible.
 *
 * Le chemin « sur place » propose deux voies de contact, plus un formulaire qui
 * prévient Elisabeth directement. Ce formulaire est le chemin fiable : un lien
 * WhatsApp ou mailto dépend d'une application installée chez le visiteur, et
 * s'il ne va pas au bout, personne ne sait que l'article l'intéressait.
 */
export default function PaymentChoiceModal({
  open,
  onClose,
  onPayOnline,
  itemLabel,
  price,
}: PaymentChoiceModalProps) {
  const [step, setStep] = useState<Step>("method");
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" });
  const loadedAtRef = useRef<number>(Date.now());
  const dialogRef = useRef<HTMLDivElement>(null);

  // Repart d'un état propre à chaque ouverture.
  useEffect(() => {
    if (!open) return;
    setStep("method");
    setSendState("idle");
    setErrorMessage(null);
    setForm({ name: "", email: "", phone: "", website: "" });
    loadedAtRef.current = Date.now();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const formattedPrice = priceFormatter.format(price);
  const enquiry = `Bonjour Elisabeth,\n\nJe souhaite acheter « ${itemLabel} » (${formattedPrice}) et régler sur place à l'atelier.\n\nQuand serait-il possible de passer ?\n\nMerci !`;

  const whatsappUrl = whatsappLink(enquiry);
  const mailUrl = mailtoLink(`Réservation — ${itemLabel}`, enquiry);
  const contactEmail = getContactEmail();

  const submitNotification = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sendState === "sending") return;

    setSendState("sending");
    setErrorMessage(null);

    const lines = [
      `Demande de réservation avec paiement sur place.`,
      ``,
      `Article : ${itemLabel}`,
      `Prix : ${formattedPrice}`,
      ``,
      `Prénom : ${form.name || "non précisé"}`,
      `Téléphone : ${form.phone || "non précisé"}`,
    ];

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          message: lines.join("\n"),
          website: form.website, // pot de miel anti-robot
          loadedAt: loadedAtRef.current,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSendState("error");
        setErrorMessage(
          data.error ||
            "L'envoi a échoué. Utilisez WhatsApp ci-dessus, Elisabeth vous répondra directement.",
        );
        return;
      }
      setSendState("sent");
    } catch {
      setSendState("error");
      setErrorMessage(
        "L'envoi a échoué. Utilisez WhatsApp ci-dessus, Elisabeth vous répondra directement.",
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={step === "method" ? "Choix du mode de paiement" : "Paiement sur place"}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(35,27,20,0.6)] p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === dialogRef.current?.parentElement) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-light text-[#5C3A21] md:text-2xl">
              {step === "method" ? "Comment souhaitez-vous régler ?" : "Paiement à l'atelier"}
            </h2>
            <p className="mt-1 text-sm text-[#5F6C72]">
              {itemLabel} — <span className="font-medium text-[#6F8F72]">{formattedPrice}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="-mr-2 -mt-2 rounded-full p-2 text-[#5F6C72] transition hover:bg-[#F2EEE7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6F8F72]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === "method" ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onPayOnline}
              className="w-full rounded-xl border-2 border-[#6F8F72] bg-[#6F8F72] p-5 text-left text-white transition hover:bg-[#5A726D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6F8F72] focus-visible:ring-offset-2"
            >
              <span className="block text-base font-medium">Payer maintenant par carte</span>
              <span className="mt-1 block text-sm text-white/85">
                Paiement sécurisé, puis choix de la livraison.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStep("onsite")}
              className="w-full rounded-xl border-2 border-[#6F8F72]/30 bg-white p-5 text-left transition hover:border-[#6F8F72]/60 hover:bg-[#EEF4EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6F8F72] focus-visible:ring-offset-2"
            >
              <span className="block text-base font-medium text-[#5C3A21]">
                Payer sur place, à l&apos;atelier
              </span>
              <span className="mt-1 block text-sm text-[#5F6C72]">
                Vous convenez d&apos;un moment avec Elisabeth et réglez en main propre.
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-[#5F6C72]">
              Prévenez Elisabeth pour réserver cette création. Vous conviendrez ensemble
              d&apos;un moment pour la récupérer à l&apos;atelier et la régler sur place.
            </p>

            {(whatsappUrl || mailUrl) && (
              <div className="space-y-2">
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="flex w-full items-center justify-center gap-2">
                      Écrire sur WhatsApp
                    </Button>
                  </a>
                )}
                {mailUrl && (
                  <a href={mailUrl} className="block">
                    <Button variant="outline" className="flex w-full items-center justify-center gap-2">
                      Ouvrir mon logiciel de messagerie
                    </Button>
                  </a>
                )}
              </div>
            )}

            {sendState === "sent" ? (
              <div className="rounded-xl bg-[#EEF4EE] p-5 text-center">
                <p className="font-medium text-[#5C3A21]">Votre demande est partie.</p>
                <p className="mt-1 text-sm text-[#5F6C72]">
                  Elisabeth vous recontacte rapidement pour convenir d&apos;un moment.
                </p>
              </div>
            ) : (
              <form onSubmit={submitNotification} className="space-y-3">
                <div className="flex items-center gap-4 pb-1" aria-hidden>
                  <span className="h-px flex-1 bg-[#5C3A21]/12" />
                  <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[#5F6C72]">
                    ou laissez-lui un mot
                  </span>
                  <span className="h-px flex-1 bg-[#5C3A21]/12" />
                </div>

                {/* Pot de miel : invisible pour un humain, rempli par les robots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm text-[#5F6C72]">Prénom</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-[#5C3A21]/15 px-3 py-2 text-[#1F2933] outline-none transition focus:border-[#6F8F72] focus:ring-1 focus:ring-[#6F8F72]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm text-[#5F6C72]">Téléphone</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-[#5C3A21]/15 px-3 py-2 text-[#1F2933] outline-none transition focus:border-[#6F8F72] focus:ring-1 focus:ring-[#6F8F72]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm text-[#5F6C72]">
                    Votre e-mail <span className="text-[#C76B3A]">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-[#5C3A21]/15 px-3 py-2 text-[#1F2933] outline-none transition focus:border-[#6F8F72] focus:ring-1 focus:ring-[#6F8F72]"
                  />
                </label>

                {errorMessage && (
                  <p className="rounded-lg bg-[#C76B3A]/10 px-3 py-2 text-sm text-[#A8552A]">
                    {errorMessage}
                    {contactEmail && (
                      <>
                        {" "}
                        Vous pouvez aussi écrire à{" "}
                        <span className="font-medium">{contactEmail}</span>.
                      </>
                    )}
                  </p>
                )}

                <Button type="submit" disabled={sendState === "sending"} className="w-full">
                  {sendState === "sending" ? "Envoi…" : "Prévenir Elisabeth"}
                </Button>
              </form>
            )}

            <button
              type="button"
              onClick={() => setStep("method")}
              className="text-sm text-[#5F6C72] underline-offset-2 transition hover:text-[#6F8F72] hover:underline"
            >
              ← Revenir au choix du paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
