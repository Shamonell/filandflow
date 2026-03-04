import Link from "next/link";
import Button from "@/components/ui/Button";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import TestimonialsCollage from "@/components/testimonials/TestimonialsCollage";
import PlanningCarousel from "@/components/home/PlanningCarousel";

export const revalidate = 60;

export default async function Home() {
  return (
    <div className="bg-[#FBF8F3]">
      {/* Hero Section - Texte fort et émotionnel avec image de fond */}
      <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/image couture 1.PNG')`,
              backgroundColor: "#FBF8F3", // Fallback si l'image n'existe pas
            }}
          />
        </div>
        
        {/* Contenu texte */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Fond stylé avec image personnalisée */}
            <div className="mx-auto max-w-3xl">
              {/* Option C: image en <img> (pas de crop), texte par-dessus */}
              <div className="relative">
                <img
                  src="/fond texte acceuil.png"
                  alt=""
                  aria-hidden="true"
                  className="h-auto w-full select-none"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 lg:p-16">
                  <div className="w-full">
                    <h1 className="mb-4 text-[1.65rem] font-light leading-tight text-[#5C3A21] sm:mb-6 sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl">
              Tu rêves d&apos;un moment créatif pour toi,
              <br />
              <span className="text-[#6F8F72]">mais tu ne sais pas par où commencer</span>
            </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[#5F6C72] sm:mt-6 sm:text-xl md:mt-8 md:text-2xl">
              Prendre le temps de créer de tes mains, retrouver le plaisir simple
              de la création, sans pression ni performance. C&apos;est exactement
              ce que je te propose.
            </p>
          </div>
        </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Présentation du concept / bienfaits */}
      <section className="bg-[#FBF8F3] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-light text-heading md:text-5xl lg:text-6xl">
                Un espace bienveillant pour créer
              </h2>
            </div>
            <div className="grid gap-x-16 gap-y-8 sm:grid-cols-2">
              {/* Carte 1 : Des ateliers guidés */}
              <div className="group rounded-lg bg-white px-16 py-8 shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/atelier guidé.png"
                    alt="Illustration d'un accompagnement créatif pas à pas"
                    className="h-[140px] w-[200px] object-contain transition-all duration-600 ease-in-out sm:h-[160px] sm:w-[240px] lg:h-[180px] lg:w-[280px] group-hover:-translate-y-0.5 group-hover:opacity-[1.03]"
                  />
                </div>
                <h3 className="mb-3 text-center text-3xl font-medium text-[#5C3A21] md:text-4xl">
                  Des ateliers guidés
                </h3>
                <p className="text-center text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                  Je t&apos;accompagne pas à pas, avec bienveillance et
                  pédagogie. Aucun niveau n&apos;est requis, juste l&apos;envie
                  de créer.
                </p>
              </div>

              {/* Carte 2 : Petits groupes */}
              <div className="group rounded-lg bg-white px-16 py-8 shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/petits groupes.png"
                    alt="Illustration représentant un petit groupe bienveillant"
                    className="h-[140px] w-[200px] object-contain transition-all duration-600 ease-in-out sm:h-[160px] sm:w-[240px] lg:h-[180px] lg:w-[280px] group-hover:-translate-y-0.5 group-hover:opacity-[1.03]"
                  />
                </div>
                <h3 className="mb-3 text-center text-3xl font-medium text-[#5C3A21] md:text-4xl">
                  Petits groupes
                </h3>
                <p className="text-center text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                  Pour préserver l&apos;intimité et le lien humain. Chacune
                  avance à son rythme, dans une atmosphère apaisante et
                  bienveillante.
                </p>
              </div>

              {/* Carte 3 : Tout le matériel fourni */}
              <div className="group rounded-lg bg-white px-16 py-8 shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/tout materiel fourni.png"
                    alt="Illustration du matériel créatif prêt à l'emploi"
                    className="h-[140px] w-[200px] object-contain transition-all duration-600 ease-in-out sm:h-[160px] sm:w-[240px] lg:h-[180px] lg:w-[280px] group-hover:-translate-y-0.5 group-hover:opacity-[1.03]"
                  />
                </div>
                <h3 className="mb-3 text-center text-3xl font-medium text-[#5C3A21] md:text-4xl">
                  Tout le matériel fourni
                </h3>
                <p className="text-center text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                  Tu n&apos;as besoin de rien apporter. Tout est prêt pour toi,
                  pour que tu puisses te concentrer uniquement sur le plaisir de
                  créer.
                </p>
              </div>

              {/* Carte 4 : Sans pression */}
              <div className="group rounded-lg bg-white px-16 py-8 shadow-sm">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/sans pression.png"
                    alt="Illustration évoquant la création sans pression"
                    className="h-[140px] w-[200px] object-contain transition-all duration-600 ease-in-out sm:h-[160px] sm:w-[240px] lg:h-[180px] lg:w-[280px] group-hover:-translate-y-0.5 group-hover:opacity-[1.03]"
                  />
                </div>
                <h3 className="mb-3 text-center text-3xl font-medium text-[#5C3A21] md:text-4xl">
                  Sans pression
                </h3>
                <p className="text-center text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                  Pas de performance attendue, pas de jugement. Juste un moment
                  pour toi, pour exprimer ta créativité librement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section "Elles en parlent" - Retours des participantes */}
      <TestimonialsCollage />

      {/* Galerie de réalisations */}
      <GalleryGrid />

      {/* Section "Parenthèses à la maison" (ex-Ateliers chez vous) */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-light text-heading md:text-5xl lg:text-6xl">
              Parenthèses à la maison
            </h2>
            <p className="mb-10 text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
              Tu préfères créer dans ton espace, entre amies ou en famille ? Je
              me déplace chez toi pour animer un atelier sur mesure, dans une
              atmosphère encore plus intime et personnalisée.
            </p>
            <Link href="/ateliers-chez-vous">
              <Button size="lg">En savoir plus</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section "Le planning des ateliers" - Carousel */}
      <PlanningCarousel />

      {/* Section "Qui suis-je" */}
      <section className="bg-[#FBF8F3] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-4xl font-light text-heading md:text-5xl lg:text-6xl">
                Qui suis-je ?
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl bg-[#EEF4EE] shadow-xl transition-shadow duration-300 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row">
                {/* Photo d'Elisabeth */}
                <div className="relative h-80 w-full md:h-auto md:w-1/3 lg:w-2/5">
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src="/photo elizabethe.PNG"
                      alt="Elisabeth - Créatrice de Fil & Flow"
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                    {/* Overlay subtil pour plus de profondeur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6F8F72]/5 via-transparent to-transparent" />
                  </div>
                </div>
                
                {/* Contenu texte */}
                <div className="flex flex-col justify-center p-8 md:w-2/3 md:p-10 lg:w-3/5 lg:p-12">
              <p className="mb-6 text-xl leading-relaxed text-[#1F2933] md:text-2xl">
                    Je m&apos;appelle <span className="font-medium text-[#5C3A21]">Elisabeth</span>. Après un burn-out et une
                reconversion, j&apos;ai choisi de créer un espace où la
                créativité rencontre le bien-être, où l&apos;on prend le temps
                de créer de ses mains, sans pression ni performance.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-[#5F6C72]">
                Mon approche est bienveillante, accessible et humaine. Je crois
                profondément au pouvoir apaisant de la création manuelle et au
                lien social qu&apos;elle peut créer.
              </p>
                  <div className="text-center md:text-left">
                <Link href="/a-propos">
                  <Button variant="outline" size="lg">
                    En savoir plus sur mon parcours
                  </Button>
                </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
