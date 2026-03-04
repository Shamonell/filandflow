import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Paiement annulé - Fil & Flow",
  description: "Votre paiement a été annulé",
};

export default function CheckoutCancelPage() {
  return (
    <div className="bg-[#FBF8F3] min-h-[60vh] flex items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-4 text-3xl font-light text-[#5C3A21] md:text-4xl">
          Paiement annulé
        </h1>
        <p className="mb-8 text-lg text-[#5F6C72]">
          Vous avez annulé le paiement. Aucun prélèvement n&apos;a été effectué.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/boutique">
            <Button size="lg">Retour à la boutique</Button>
          </Link>
          <Link href="/bons-cadeaux">
            <Button variant="outline" size="lg">
              Bons cadeaux
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
