import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Paiement réussi - Fil & Flow",
  description: "Merci pour votre achat",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-[#FBF8F3] min-h-[60vh] flex items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72]">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-4 text-3xl font-light text-[#5C3A21] md:text-4xl">
          Merci pour votre achat
        </h1>
        <p className="mb-8 text-lg text-[#5F6C72]">
          Votre paiement a bien été enregistré. Vous allez recevoir un email de
          confirmation sous peu.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/boutique">
            <Button size="lg">Retour à la boutique</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
