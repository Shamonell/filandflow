"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SalesTermsModal from "@/components/legal/SalesTermsModal";

type Channel = "whatsapp" | "email" | null;

type WorkshopSalesTermsButtonsProps = {
  signupWhatsappUrl: string;
  signupContactUrl: string;
  waitlistWhatsappUrl: string;
  waitlistContactUrl: string;
  showSignup: boolean;
  showWaitlist: boolean;
};

export default function WorkshopSalesTermsButtons({
  signupWhatsappUrl,
  signupContactUrl,
  waitlistWhatsappUrl,
  waitlistContactUrl,
  showSignup,
  showWaitlist,
}: WorkshopSalesTermsButtonsProps) {
  const [modal, setModal] = useState<{
    channel: Channel;
    phase: "signup" | "waitlist";
  } | null>(null);

  const open = (phase: "signup" | "waitlist", channel: "whatsapp" | "email") => {
    setModal({ phase, channel });
  };

  const close = () => setModal(null);

  const runAction = () => {
    if (!modal) return;
    const { phase, channel } = modal;
    const wa = phase === "signup" ? signupWhatsappUrl : waitlistWhatsappUrl;
    const mail = phase === "signup" ? signupContactUrl : waitlistContactUrl;
    close();
    if (channel === "whatsapp") {
      window.open(wa, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = mail;
    }
  };

  const scope =
    modal?.phase === "waitlist"
      ? "votre demande de liste d’attente"
      : "votre inscription à cet atelier";

  return (
    <>
      {showSignup && (
        <section className="rounded-2xl border-2 border-[#6F8F72]/20 bg-[#EEF4EE] p-8 text-center md:p-12">
          <h3 className="mb-2 font-serif text-2xl font-light text-[#5C3A21] md:text-3xl">
            Réserver votre place
          </h3>
          <p className="mb-8 text-[#5F6C72]">
            Réservation sans paiement en ligne. Le paiement se fait sur place le jour
            de l&apos;atelier.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => open("signup", "whatsapp")}
              className="inline-flex justify-center"
            >
              <span className="inline-flex">
                <Button
                  size="lg"
                  className="flex items-center gap-2 bg-[#6F8F72] text-white hover:bg-[#5A726D]"
                >
                  <Image
                    src="/icone whatapp.PNG"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                    aria-hidden
                  />
                  Je m&apos;inscris par WhatsApp
                </Button>
              </span>
            </button>
            <button
              type="button"
              onClick={() => open("signup", "email")}
              className="inline-flex justify-center"
            >
              <span className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 border-[#6F8F72] text-[#5C3A21] hover:bg-[#6F8F72]/10"
                >
                  <Image
                    src="/icone lettre coeur.PNG"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                    aria-hidden
                  />
                  Je m&apos;inscris par email
                </Button>
              </span>
            </button>
          </div>
          <p className="mt-6 text-sm text-[#5F6C72]">
            Message avec les détails de l&apos;atelier pré-remplis.
          </p>
        </section>
      )}

      {showWaitlist && (
        <section className="rounded-2xl border-2 border-red-200 bg-red-50/80 p-8 text-center md:p-10">
          <p className="mb-2 font-serif text-xl font-medium text-red-800">
            Atelier complet
          </p>
          <p className="mb-8 text-red-700">
            Les places sont mises à jour régulièrement. Je peux vous ajouter en liste
            d&apos;attente.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => open("waitlist", "whatsapp")}
              className="inline-flex justify-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <Image
                  src="/icone whatapp.PNG"
                  alt=""
                  width={20}
                  height={20}
                  className="mr-2 inline h-5 w-5 object-contain"
                  aria-hidden
                />
                Me contacter par WhatsApp
              </Button>
            </button>
            <button
              type="button"
              onClick={() => open("waitlist", "email")}
              className="inline-flex justify-center"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Me contacter par email
              </Button>
            </button>
          </div>
          <div className="mt-8 border-t border-red-200 pt-8">
            <Link href="/ateliers">
              <Button size="lg" className="bg-[#6F8F72] text-white hover:bg-[#5A726D]">
                Voir les autres ateliers
              </Button>
            </Link>
          </div>
        </section>
      )}

      <SalesTermsModal
        open={modal !== null}
        onClose={close}
        onConfirm={runAction}
        termsHref="/cgv#ateliers"
        scopePhrase={scope}
      />
    </>
  );
}
