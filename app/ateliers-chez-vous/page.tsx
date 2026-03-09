import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import WorkshopCard from "@/components/ateliers-chez-vous/WorkshopCard";
import ConceptFeature from "@/components/ateliers-chez-vous/ConceptFeature";

export const metadata: Metadata = {
  title: "Parenthèses à la maison - Fil & Flow",
  description: "L'art de transformer du fil en chef-d'œuvre. Ateliers couture à domicile dans la Drôme, ambiance conviviale et bienveillante.",
};

export default function AteliersChezVousPage() {
  return (
    <div className="bg-[#FBF8F3]">
      {/* Section HERO */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        {/* Image de fond : à remplacer par une photo axée art créatif / fil (pas cosmétique) si la cliente en fournit une */}
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/image atelier chez vous.PNG')`,
              backgroundColor: "#FBF8F3",
            }}
          />
          {/* Overlay pour améliorer la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />
        </div>

        {/* Contenu texte */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-light leading-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl">
              L&apos;art de transformer du fil en chef-d&apos;œuvre avec une touche de magie mécanique
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-2xl font-light leading-relaxed text-white drop-shadow-2xl md:text-3xl lg:text-4xl">
              L&apos;esprit positif de la créativité
            </p>
            <div className="mx-auto max-w-2xl space-y-3 text-xl text-white drop-shadow-2xl md:text-2xl lg:text-3xl">
              <p>Apprendre la couture</p>
              <p>Coudre en groupe</p>
              <p>Ambiance conviviale et bienveillante</p>
              <p>Sans investir dans une machine ou du matériel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Le concept" */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl xl:text-7xl">
              Le concept
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <ConceptFeature
                icon={
                  <Image
                    src="/tout materiel fourni.png"
                    alt=""
                    width={112}
                    height={112}
                    className="h-24 w-24 object-contain md:h-28 md:w-28"
                    aria-hidden
                  />
                }
                title="Tout le matériel fourni"
                description="Machines, tissus, petit matériel"
              />
              <ConceptFeature
                icon={
                  <Image
                    src="/petits groupes.png"
                    alt=""
                    width={112}
                    height={112}
                    className="h-24 w-24 object-contain md:h-28 md:w-28"
                    aria-hidden
                  />
                }
                title="4 à 6 participant(e)s"
                description="Minimum 4, maximum 6"
              />
              <ConceptFeature
                icon={
                  <svg
                    className="h-12 w-12 md:h-14 md:w-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2v7m-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2h2m-2 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4m-4 0v3"
                    />
                  </svg>
                }
                title="Atelier gratuit"
                description="Pour l'hôte / l'hôtesse"
              />
              <ConceptFeature
                icon={
                  <svg
                    className="h-12 w-12 md:h-14 md:w-14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                title="Zone principale"
                description="Drôme – Chabeuil + 30 km"
              />
            </div>

            <div className="mt-12 rounded-lg bg-[#FBF8F3] p-8 text-center">
              <p className="text-xl text-[#5F6C72] md:text-2xl">
                <strong className="text-[#5C3A21]">Région Drôme</strong>{" "}
                (Chabeuil et sur un rayon de 30 kms).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Exemples d'ateliers proposés" */}
      <section className="bg-[#FBF8F3] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl xl:text-7xl">
              Exemples d&apos;ateliers proposés
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              <WorkshopCard
                title="Pochette-sac"
                duration="4h"
                price="65€"
                imagePath="/ateliers-chez-vous/texas.jpg"
                imageAlt="Pochette-sac"
              />
              <WorkshopCard
                title="Pochette en chutes de tissus avec étiquette brodée"
                duration="2h30"
                price="50€"
                imagePath="/ateliers-chez-vous/pochette-chutes.jpg"
                imageAlt="Pochette en chutes de tissus avec étiquette brodée"
              />
              <WorkshopCard
                title="Housse de coussin patchwork zippée"
                duration="2h30"
                price="40€"
                imagePath="/ateliers-chez-vous/housse-coussin.jpg"
                imageAlt="Housse de coussin patchwork zippée"
              />
              <WorkshopCard
                title="Besace"
                duration="4h30"
                price="65€"
                imagePath="/ateliers-chez-vous/besace-nelson.jpg"
                imageAlt="Besace"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section "Comment organiser un atelier chez moi ?" */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl xl:text-7xl">
              Comment organiser un atelier chez moi ?
            </h2>

            <div className="mb-8 rounded-lg bg-[#FBF8F3] p-6 text-center">
              <p className="text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                Il vous suffit de m&apos;adresser un mail à{" "}
                <a
                  href="mailto:elisa.grenoble@gmail.com"
                  className="font-medium text-[#6F8F72] hover:underline"
                >
                  elisa.grenoble@gmail.com
                </a>{" "}
                ou de{" "}
                <Link
                  href="/contact"
                  className="font-medium text-[#6F8F72] hover:underline"
                >
                  me contacter directement depuis le site
                </Link>
                , en me précisant les éléments suivants :
              </p>
            </div>

            {/* Étapes visuelles */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {[
                {
                  num: "1",
                  text: "Votre adresse précise (afin que je puisse vous indiquer s'il est possible pour moi de me déplacer dans votre zone) ainsi que vos nom, prénom et numéro de téléphone",
                },
                {
                  num: "2",
                  text: "Le modèle que vous souhaiteriez coudre parmi les modèles proposés ci-dessus ou éventuellement un autre souhait (que je puisse étudier)",
                },
                {
                  num: "3",
                  text: "Le nombre de participant(e)s que vous avez déjà regroupé(e)s dans votre cercle d'amis et connaissances",
                },
                {
                  num: "4",
                  text: "Le nombre de machines à coudre dont nous aurons besoin (certain(e)s participant(e)s préfèrent et peuvent prendre leur propre machine)",
                },
                {
                  num: "5",
                  text: "Le niveau de couture des participants (notamment s'il y a des débutants qui n'ont jamais utilisé une machine)",
                },
                {
                  num: "6",
                  text: "Le nombre de personnes que vous pouvez accueillir chez vous",
                },
                {
                  num: "7",
                  text: "Vos disponibilités pour la tenue de cet atelier : jour et date que vous préférez, horaires",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="group relative rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#6F8F72] text-2xl font-medium text-white md:h-16 md:w-16 md:text-3xl">
                    {step.num}
                  </div>
                  <p className="text-base leading-relaxed text-[#5F6C72] md:text-lg">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section "Cours particuliers à domicile" */}
      <section className="bg-[#FBF8F3] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl xl:text-7xl">
              Cours particuliers à domicile
            </h2>

            <div className="rounded-lg bg-[#EEF4EE] p-10 md:p-12">
              <div className="space-y-6 text-center">
                <p className="text-xl leading-relaxed text-[#1F2933] md:text-2xl lg:text-3xl">
                  Un accompagnement personnalisé pour progresser à votre rythme
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg bg-white p-6 md:p-8">
                    <h3 className="mb-3 text-xl font-medium text-[#5C3A21] md:text-2xl">
                      Avec ou sans matériel
                    </h3>
                    <p className="text-base text-[#5F6C72] md:text-lg">
                      Je m&apos;adapte à votre équipement
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-6 md:p-8">
                    <h3 className="mb-3 text-xl font-medium text-[#5C3A21] md:text-2xl">
                      Aide sur projets personnels
                    </h3>
                    <p className="text-base text-[#5F6C72] md:text-lg">
                      Sacs, accessoires, rideaux, décoration intérieure
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-lg bg-white p-6 md:p-8">
                  <p className="mb-2 text-2xl font-light text-[#6F8F72] md:text-3xl">
                    25€/heure
                  </p>
                  <p className="text-base text-[#5F6C72] md:text-lg">
                    Forfaits possibles sur demande • Kits couture possibles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Voir le calendrier des ateliers" */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/icone calendrier.PNG"
                alt=""
                width={96}
                height={96}
                className="h-20 w-20 object-contain md:h-24 md:w-24"
                aria-hidden
              />
            </div>
            <h2 className="mb-6 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl xl:text-7xl">
              Voir le calendrier des ateliers
            </h2>
            <p className="mb-4 text-2xl text-[#5F6C72] md:text-3xl">
              Planning annoncé via Facebook Fil & Flow
            </p>
            <p className="mb-4 text-xl text-[#5F6C72] md:text-2xl">
              Réservations via le site
            </p>
            <div className="mt-10">
              <Link href="/ateliers">
                <Button size="lg">Voir les ateliers disponibles</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
