"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur pour le débogage
    console.error("Erreur globale:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-6xl font-light">Erreur</h1>
          <h2 className="mb-4 text-2xl font-light">Une erreur critique s&apos;est produite</h2>
          <p className="mb-8 text-gray-600">
            Désolé, une erreur inattendue s&apos;est produite. Veuillez réessayer.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="rounded-md bg-olive-400 px-6 py-3 text-white hover:bg-olive-500"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="rounded-md border-2 border-olive-400 px-6 py-3 text-olive-500 hover:bg-olive-50"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}


