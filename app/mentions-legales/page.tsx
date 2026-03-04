import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - Fil & Flow",
  description: "Mentions légales du site Fil & Flow",
};

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-4xl font-light tracking-wide md:text-5xl">
          Mentions légales
        </h1>
        <div className="prose prose-lg mx-auto max-w-none text-gray-700">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">1. Éditeur du site</h2>
            <p className="mb-4">
              Le site fil-et-flow.fr est édité par :
            </p>
            <p className="mb-4">
              {/* À compléter avec les informations réelles */}
              [Nom de l&apos;artisane]<br />
              [Adresse complète]<br />
              [Numéro SIRET si applicable]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">2. Hébergement</h2>
            <p className="mb-4">
              Le site est hébergé par :
            </p>
              {/* À compléter avec les informations d'hébergement */}
            <p>
              [Nom de l&apos;hébergeur]<br />
              [Adresse de l&apos;hébergeur]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">3. Propriété intellectuelle</h2>
            <p className="mb-4">
              L&apos;ensemble du contenu de ce site (textes, images, logos) est la propriété
              de Fil & Flow et est protégé par les lois relatives à la propriété
              intellectuelle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">4. Protection des données</h2>
            <p className="mb-4">
              Les données personnelles collectées via le formulaire de contact sont
              utilisées uniquement pour répondre à vos demandes et ne sont pas transmises
              à des tiers.
            </p>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification
              et de suppression de vos données personnelles. Pour exercer ce droit,
              contactez-nous via le formulaire de contact.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">5. Contact</h2>
            <p>
              Pour toute question concernant ces mentions légales, vous pouvez nous
              contacter via le formulaire de contact disponible sur le site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

