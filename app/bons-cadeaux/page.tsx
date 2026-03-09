import { Metadata } from "next";
import Image from "next/image";
import ContactButton from "@/components/ui/ContactButton";
import { GIFT_CARDS } from "@/lib/gift-cards";
import GiftCardImage from "@/components/bons-cadeaux/GiftCardImage";

export const metadata: Metadata = {
  title: "Bons cadeaux - Fil & Flow",
  description:
    "Offrez un moment de bien-être et de création avec nos cartes cadeaux et packs",
};

export default function BonsCadeauxPage() {
  return (
    <div className="bg-[#FBF8F3]">
      <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <div className="mx-auto flex justify-center px-4">
              <Image
                src="/bon cadeau.PNG"
                alt=""
                width={420}
                height={280}
                className="h-auto w-full max-w-[200px] object-contain sm:max-w-[280px] md:max-w-[360px] lg:max-w-[420px]"
                aria-hidden
              />
            </div>
            <h1 className="mb-6 text-4xl font-light tracking-wide text-[#5C3A21] md:text-5xl lg:text-6xl">
              Bons cadeaux
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#5F6C72] md:text-xl">
              Offrez un moment de bien-être et de création à quelqu&apos;un qui
              vous est cher. Une pause créative, un temps pour soi, un cadeau
              qui fait du bien.
            </p>
          </div>

          {/* Cartes cliquables - clic direct vers paiement en ligne */}
          <div className="mb-12 space-y-12">
            {GIFT_CARDS.map((card) => (
              <GiftCardImage
                key={card.id}
                cardId={card.id}
                image={card.image}
                name={card.name}
                price={card.price}
              />
            ))}
          </div>

          {/* Informations pratiques */}
          <section className="mb-12 rounded-lg bg-almond-50 p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-light text-gray-900 md:text-3xl">
              Informations pratiques
            </h2>
            <div className="space-y-6 text-gray-700">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center md:h-20 md:w-20">
                  <Image
                    src="/icone lettre coeur.PNG"
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain md:h-16 md:w-16"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Commande</p>
                  <p className="mt-1 leading-relaxed">
                    Paiement en ligne sécurisé (carte bancaire) ou par email
                    via le formulaire de contact pour un devis personnalisé.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center md:h-20 md:w-20">
                  <Image
                    src="/icone livraison.png"
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain md:h-16 md:w-16"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Livraison</p>
                  <p className="mt-1 leading-relaxed">
                    La carte cadeau vous sera envoyée par email (format PDF
                    élégant) ou par courrier si vous le souhaitez.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center md:h-20 md:w-20">
                  <Image
                    src="/icone calendrier.PNG"
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain md:h-16 md:w-16"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Réservation</p>
                  <p className="mt-1 leading-relaxed">
                    Le bénéficiaire de la carte cadeau me contacte directement
                    pour réserver son atelier selon les disponibilités.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center md:h-20 md:w-20">
                  <Image
                    src="/sablier.PNG"
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain md:h-16 md:w-16"
                    aria-hidden
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Validité</p>
                  <p className="mt-1 leading-relaxed">
                    Toutes les cartes cadeaux sont valables 1 an à compter de la
                    date d&apos;achat.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-lg bg-beige-50 p-8 text-center md:p-10">
            <div className="mb-4 flex justify-center">
              <Image
                src="/icone lettre coeur.PNG"
                alt=""
                width={96}
                height={96}
                className="h-20 w-20 object-contain opacity-90 md:h-24 md:w-24"
                aria-hidden
              />
            </div>
            <h2 className="mb-4 text-2xl font-light text-gray-900 md:text-3xl">
              Une question sur les bons cadeaux ?
            </h2>
            <p className="mb-6 text-lg text-gray-700">
              N&apos;hésitez pas à me contacter, je serai ravie de vous
              renseigner.
            </p>
            <ContactButton size="lg" />
          </section>
        </div>
      </div>
    </div>
  );
}
