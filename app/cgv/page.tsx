import { Metadata } from "next";
import Link from "next/link";

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
        <p className="mb-10 rounded-lg border border-[#6F8F72]/20 bg-[#EEF4EE]/50 p-4 text-sm text-[#5F6C72]">
          Document d&apos;information à destination des clientes et clients. Les textes
          visent à refléter des pratiques courantes pour des ateliers créatifs et des
          achats en ligne ; ils ne remplacent pas un conseil juridique personnalisé.
          Adaptez les coordonnées et détails (SIRET, TVA, adresse) avec votre
          situation réelle.
        </p>
        <div className="prose prose-lg mx-auto max-w-none text-gray-700">
          <section className="mb-8" id="objet">
            <h2 className="mb-4 text-2xl font-medium">1. Objet et champ d&apos;application</h2>
            <p className="mb-4">
              Les présentes conditions générales de vente (CGV) régissent les relations
              contractuelles entre <strong>Fil & Flow</strong> (ci-après « le vendeur
              ») et toute personne physique consommatrice (ci-après « le client »)
              pour les commandes et réservations passées via le site internet, par
              messagerie, courriel ou en atelier.
            </p>
            <p>
              Toute commande ou demande de réservation implique l&apos;adhésion pleine
              et entière aux présentes CGV, sans préjudice des droits dont le client
              dispose en vertu du Code de la consommation.
            </p>
          </section>

          <section className="mb-8" id="identification">
            <h2 className="mb-4 text-2xl font-medium">2. Informations sur le vendeur</h2>
            <p className="mb-4">
              {/* Renseigner les mentions obligatoires réelles */}
              <strong>Raison sociale / nom commercial :</strong> Fil & Flow
              <br />
              <strong>Adresse :</strong> [à compléter]
              <br />
              <strong>Contact :</strong> via le{" "}
              <Link href="/contact" className="text-[#6F8F72] underline">
                formulaire de contact
              </Link>
              <br />
              <strong>SIRET :</strong> [à compléter] — <strong>TVA :</strong> [le cas
              échéant, à compléter]
            </p>
          </section>

          <section className="mb-8" id="ateliers">
            <h2 className="mb-4 text-2xl font-medium">
              3. Ateliers créatifs (réservation)
            </h2>
            <p className="mb-4">
              Les ateliers sont des prestations de services ponctuelles avec un nombre
              de places limité. Les descriptions (durée, lieu, contenu, niveau requis)
              figurent sur les fiches ateliers et peuvent être complétées par échange
              avec le vendeur.
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Réservation :</strong> une demande par messagerie (WhatsApp) ou
                courriel vaut proposition d&apos;inscription. Le vendeur confirme la
                disponibilité des places et, le cas échéant, la réservation ferme.
              </li>
              <li>
                <strong>Prix :</strong> le prix affiché est en euros TTC (ou le cas
                échéant HT + TVA) pour la session concernée. Le paiement est convenu
                avec le vendeur (souvent sur place le jour de l&apos;atelier, sauf
                mention contraire).
              </li>
              <li>
                <strong>Annulation / report par le client :</strong> toute annulation
                ou demande de report doit être faite dans les meilleurs délais. Des
                frais ou l&apos;absence de remboursement peuvent être prévus selon le
                délai et les circonstances ; le vendeur s&apos;efforce de proposer une
                solution équitable (report sur une autre date, avoir, etc.).
              </li>
              <li>
                <strong>Annulation par le vendeur :</strong> en cas d&apos;annulation
                ou de force majeure, le vendeur propose le remboursement ou un report ;
                aucune indemnité complémentaire ne sera due.
              </li>
              <li>
                <strong>Droit de rétractation :</strong> pour les prestations de loisirs
                avec date ou période d&apos;exécution convenue, le droit de rétractation
                prévu aux articles L. 221-18 et suivants du Code de la consommation peut
                ne pas s&apos;appliquer (article L. 221-28). Le client est informé avant
                la conclusion du contrat.
              </li>
            </ul>
          </section>

          <section className="mb-8" id="bons-cadeaux">
            <h2 className="mb-4 text-2xl font-medium">4. Bons cadeaux</h2>
            <p className="mb-4">
              Les bons cadeaux achetés en ligne permettent de bénéficier d&apos;un ou
              plusieurs ateliers selon l&apos;offre choisie. Le paiement est traité de
              façon sécurisée par Stripe. Après paiement validé, le client reçoit les
              instructions d&apos;utilisation (par courriel) conformément au processus en
              place.
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Durée de validité :</strong> sauf mention sur l&apos;offre, une
                durée indicative de douze (12) mois à compter de la date d&apos;achat
                peut s&apos;appliquer ; toute durée différente sera indiquée au moment de
                l&apos;achat.
              </li>
              <li>
                <strong>Utilisation :</strong> le bon cadeau est nominatif ou transférable
                selon les modalités communiquées ; il est utilisé lors de la réservation
                d&apos;une session disposant de places disponibles.
              </li>
              <li>
                <strong>Non remboursable :</strong> sauf obligation légale (ex. défaut
                de fourniture du service) ou politique commerciale exceptionnelle
                annoncée, le bon cadeau n&apos;est pas échangeable contre espèces et
                n&apos;est pas remboursable après expiration de la période de
                rétractation lorsque celle-ci est applicable.
              </li>
              <li>
                <strong>Rétractation :</strong> lorsque le client est éligible au droit
                de rétractation pour un achat à distance, il peut l&apos;exercer dans le
                délai légal de quatorze (14) jours sans motif, selon les modalités
                prévues au Code de la consommation, sauf si la prestation a commencé
                avant la fin de ce délai avec accord exprès du client et renoncement au
                droit de rétractation.
              </li>
            </ul>
          </section>

          <section className="mb-8" id="boutique">
            <h2 className="mb-4 text-2xl font-medium">
              5. Créations artisanales (boutique en ligne)
            </h2>
            <p className="mb-4">
              Les pièces proposées sur la boutique sont souvent uniques ou réalisées en
              petite série. Les photographies et descriptions sont fournies à titre
              indicatif ; de légères variations (couleurs, finitions) peuvent exister du
              fait du caractère artisanal.
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Prix :</strong> affichés en euros TTC, frais d&apos;expédition
                éventuels précisés avant validation de la commande.
              </li>
              <li>
                <strong>Paiement :</strong> par carte bancaire via Stripe lorsque
                l&apos;option est activée, ou selon les modalités convenues avec le
                vendeur.
              </li>
              <li>
                <strong>Livraison / retrait :</strong> délais et modalités communiqués
                lors de la commande. La propriété des produits est transférée après
                paiement intégral ; le risque de perte est traité selon la réglementation
                applicable.
              </li>
              <li>
                <strong>Droit de rétractation :</strong> pour les biens conformes vendus
                à distance, le délai légal de quatorze (14) jours s&apos;applique sauf
                exceptions (biens personnalisés, périssables, etc.).
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">6. Moyens de paiement sécurisé</h2>
            <p className="mb-4">
              Les paiements par carte sont traités par le prestataire Stripe. Le vendeur
              ne conserve pas les numéros de carte. En cas de litige sur
              l&apos;opération bancaire, le client peut contacter son établissement
              bancaire et utiliser les mécanismes prévus par la réglementation (ex.
              médiation de la consommation).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">7. Données personnelles</h2>
            <p className="mb-4">
              Les données nécessaires à la gestion des commandes et réservations sont
              traitées conformément à la politique de confidentialité du site et au
              RGPD. Le client dispose d&apos;un droit d&apos;accès, de rectification et
              de suppression (voir page{" "}
              <Link href="/contact" className="text-[#6F8F72] underline">
                contact
              </Link>{" "}
              ou mentions légales si une page dédiée existe).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">8. Réclamations et médiation</h2>
            <p className="mb-4">
              Pour toute réclamation, le client contacte le vendeur en priorité par
              courriel ou messagerie. À défaut de solution amiable, le client peut
              saisir un médiateur de la consommation conformément aux articles L. 612-1
              et suivants du Code de la consommation, ou toute autre voie prévue par la
              loi.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-medium">9. Droit applicable</h2>
            <p className="mb-4">
              Les présentes CGV sont soumises au droit français. En cas de litige, les
              tribunaux français seront compétents, sous réserve des dispositions
              impératives applicables.
            </p>
          </section>

          <section className="mb-8" id="contact-cgv">
            <h2 className="mb-4 text-2xl font-medium">10. Contact</h2>
            <p>
              Pour toute question concernant ces CGV :{" "}
              <Link href="/contact" className="text-[#6F8F72] underline">
                formulaire de contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
