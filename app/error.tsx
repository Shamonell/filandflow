"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le débogage
    console.error("Erreur:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="mb-4 text-6xl font-light">Erreur</h1>
      <h2 className="mb-4 text-2xl font-light">Une erreur s&apos;est produite</h2>
      <p className="mb-8 text-gray-600">
        Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button onClick={reset}>Réessayer</Button>
        <Link href="/">
          <Button variant="outline">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}


