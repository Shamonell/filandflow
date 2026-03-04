import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente - Fil & Flow",
  description: "Conditions générales de vente de Fil & Flow",
};

export default function CGVPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-4xl font-light tracking-wide md:text-5xl">
          Conditions générales de vente
        </h1>
        <div className="prose prose-lg mx-auto max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">1. Objet</h2>
            <p className="mb-4">
              Les présentes conditions générales de vente (CGV) s&apos;appliquent à toutes
              les ventes de créations artisanales réalisées par Fil & Flow.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">2. Commandes</h2>
            <p className="mb-4">
              Les commandes se font par contact direct (email, WhatsApp) ou lors
              d&apos;événements. Chaque création est unique et faite à la main.
            </p>
            <p>
              Les prix indiqués sont en euros TTC et peuvent varier selon les
              matériaux utilisés.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">3. Paiement</h2>
            <p className="mb-4">
              {/* À compléter avec les modalités de paiement réelles */}
              Les modalités de paiement sont convenues lors de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">4. Livraison</h2>
            <p className="mb-4">
              {/* À compléter avec les modalités de livraison réelles */}
              Les modalités de livraison ou de retrait sont convenues lors de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">5. Droit de rétractation</h2>
            <p className="mb-4">
              Conformément à la législation en vigueur, vous disposez d&apos;un droit de
              rétractation de 14 jours à compter de la réception de votre commande.
            </p>
            <p>
              Pour exercer ce droit, contactez-nous via le formulaire de contact.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">6. Contact</h2>
            <p>
              Pour toute question concernant ces CGV, vous pouvez nous contacter via
              le formulaire de contact disponible sur le site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

