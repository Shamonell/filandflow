import { Metadata } from "next";
import ContactButton from "@/components/ui/ContactButton";

export const metadata: Metadata = {
  title: "À propos - Fil & Flow",
  description: "Découvrez l'histoire et la passion derrière Fil & Flow",
};

export default function AProposPage() {
  return (
    <div className="bg-[#FBF8F3]">
      {/* Hero Section avec photo */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
              {/* Photo d'Elisabeth */}
              <div className="relative h-64 w-64 flex-shrink-0 md:h-80 md:w-80">
                <div className="relative h-full w-full overflow-hidden rounded-full shadow-xl ring-4 ring-[#EEF4EE]">
                  <img
                    src="/photo elizabethe.PNG"
                    alt="Elisabeth - Créatrice de Fil & Flow"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
              
              {/* Texte d'introduction */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-6 text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
                  Bonjour, je suis <span className="text-[#6F8F72]">Elisabeth</span>
                </h1>
                <p className="text-xl leading-relaxed text-[#5F6C72] md:text-2xl">
                  Je vous accompagne dans votre voyage créatif, avec bienveillance et passion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Mon histoire */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              Mon histoire
            </h2>
            
            <div className="space-y-8">
              <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
                <p className="mb-6 text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Depuis toujours, la créativité occupe un espace central dans ma vie. 
                  Mais c&apos;est lors des épreuves que j&apos;ai traversées qu&apos;elle a pris 
                  une place essentielle. C&apos;est alors que j&apos;ai définitivement compris que 
                  l&apos;expression créative était une source puissante pour se connecter à soi-même 
                  et se reconnecter aux autres.
                </p>
                <p className="mb-6 text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Elle permet d&apos;explorer de nouvelles perspectives et d&apos;adopter des approches 
                  innovantes pour gérer le stress et la fatigue émotionnelle. Pour aider à exprimer 
                  des émotions difficiles. Mieux qu&apos;un antidépresseur, la création s&apos;est vite 
                  révélée indispensable à mon équilibre personnel.
                </p>
                <p className="text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Toujours en quête de nouvelles expériences créatives, cette curiosité d&apos;enfant 
                  ne m&apos;a jamais quittée. C&apos;est en souvenir de ces tendres moments de partage 
                  avec une grand-mère apprenante et bienveillante que j&apos;ai voulu favoriser le 
                  <span className="font-medium text-[#5C3A21]"> « faire ensemble »</span> et le 
                  partage de savoir-faire.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
                <p className="mb-6 text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Le contact humain reste ce qui nous définit le mieux. Dans ce vaste monde virtuel, 
                  mouvant et insaisissable qui nous entoure, je reste persuadée que les ateliers 
                  créatifs ont le pouvoir de rassemblement et de transmission. Ils peuvent être le 
                  tiers lieu où la vraie vie reprend enfin le dessus sur les heures de virtualité.
                </p>
                <p className="text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Nous avons tous une histoire unique à raconter. À travers les ateliers, je voudrais 
                  aider chacun à se raconter, s&apos;exprimer. Dérouler le fil pour raconter une histoire. 
                  Le but est véritablement de faire ressentir un état de création libre mais guidée, 
                  libéré de tout jugement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Mes clients */}
      <section className="bg-[#FBF8F3] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              Mes clients
            </h2>
            <p className="mb-16 text-center text-xl text-[#5F6C72] md:text-2xl">
              Mes ateliers s&apos;adressent à tous ceux qui cherchent un moment pour soi, 
              un espace de création et de partage.
            </p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Carte Retraitée */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 flex justify-center">
                  <img src="/illustration-retraitee.PNG" alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" aria-hidden />
                </div>
                <h3 className="mb-4 text-2xl font-medium text-[#5C3A21]">
                  Vous êtes retraitée
                </h3>
                <p className="mb-4 text-[#5F6C72] leading-relaxed">
                  Vous êtes veuve, isolée... Vous souhaitez établir de nouvelles relations 
                  et sortir de l&apos;isolement. Créer des liens authentiques. Redonner un sens 
                  à votre vie et redécouvrir des passions oubliées.
                </p>
                <p className="text-[#5C3A21] font-medium">
                  Mes ateliers sont une belle opportunité de vous reconnecter à vous-même 
                  mais aussi aux autres.
                </p>
              </div>

              {/* Carte Étudiante */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 flex justify-center">
                  <img src="/illustration-etudiante.PNG" alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" aria-hidden />
                </div>
                <h3 className="mb-4 text-2xl font-medium text-[#5C3A21]">
                  Vous êtes étudiante
                </h3>
                <p className="mb-4 text-[#5F6C72] leading-relaxed">
                  Dynamique et créative, vous cherchez à vous évader de votre quotidien académique 
                  chargé. Vous appréciez les moments de partage intergénérationnels et souhaitez 
                  vous détendre après des journées d&apos;études intenses.
                </p>
                <p className="text-[#5C3A21] font-medium">
                  Apprenez de nouvelles compétences et créez un réseau social physique diversifié 
                  et enrichissant.
                </p>
              </div>

              {/* Carte Mère au foyer */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 flex justify-center">
                  <img src="/illustration-mere-foyer.PNG" alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" aria-hidden />
                </div>
                <h3 className="mb-4 text-2xl font-medium text-[#5C3A21]">
                  Vous êtes mère au foyer
                </h3>
                <p className="mb-4 text-[#5F6C72] leading-relaxed">
                  Souvent le quotidien vous pèse, même si votre tendresse pour vos enfants est 
                  débordante d&apos;amour. Vous avez besoin d&apos;évasion, de temps pour vous.
                </p>
                <p className="text-[#5C3A21] font-medium">
                  Prendre du temps pour soi n&apos;est pas honteux, c&apos;est nécessaire. 
                  Et si vous fabriquiez un joli miroir en macramé pour décorer votre intérieur ?
                </p>
              </div>

              {/* Carte Responsable résidence seniors */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-4 flex justify-center">
                  <img src="/illustration-residence-seniors.PNG" alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" aria-hidden />
                </div>
                <h3 className="mb-4 text-2xl font-medium text-[#5C3A21]">
                  Responsable en résidence seniors
                </h3>
                <p className="mb-4 text-[#5F6C72] leading-relaxed">
                  Vous cherchez de la nouveauté pour vos résidents. Une activité qui puisse leur 
                  convenir et leur apporter du plaisir.
                </p>
                <p className="text-[#5C3A21] font-medium">
                  Je suis là pour vous, pour eux. Parce qu&apos;il n&apos;y a rien de pire que de 
                  laisser nos anciens pour compte.
                </p>
              </div>

              {/* Carte Assistante RH */}
              <div className="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <div className="mb-4 flex justify-center">
                  <img src="/illustration-assistante-rh.PNG" alt="" className="h-16 w-16 object-contain md:h-20 md:w-20" aria-hidden />
                </div>
                <h3 className="mb-4 text-2xl font-medium text-[#5C3A21]">
                  Assistante RH
                </h3>
                <p className="mb-4 text-[#5F6C72] leading-relaxed">
                  Vous souhaitez organiser des cohésions d&apos;équipe par l&apos;activité manuelle. 
                  Une activité fun où chacun y trouvera son compte.
                </p>
                <p className="text-[#5C3A21] font-medium">
                  Repartez avec en tête un moment partagé, des instants de rires, une nouvelle 
                  vision de vos collègues et surtout un souvenir commun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section En quoi suis-je différente */}
      <section className="bg-[#EEF4EE] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-4xl font-light text-[#5C3A21] md:text-5xl lg:text-6xl">
              En quoi suis-je différente ?
            </h2>

            <div className="space-y-8">
              <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
                <h3 className="mb-6 text-2xl font-medium text-[#5C3A21] md:text-3xl">
                  Une passion authentique
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  J&apos;aime mon travail et ce que je fais. C&apos;est la raison pour laquelle 
                  je me lève chaque matin. Il me permet de me dépasser et de viser toujours plus 
                  haut à chaque nouveau défi rencontré.
                </p>
                <p className="text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  Mes ateliers ont pour but d&apos;inviter les participants à explorer différentes 
                  techniques de création en utilisant le fil seul ou comme matière principale, 
                  en le combinant avec différentes matières telles que le tissu, le bois, l&apos;argile, 
                  le fer... C&apos;est une belle opportunité de découvrir des méthodes artistiques 
                  variées, de stimuler la créativité et de partager des moments conviviaux autour 
                  d&apos;une activité manuelle.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
                <h3 className="mb-6 text-2xl font-medium text-[#5C3A21] md:text-3xl">
                  L&apos;upcycling au cœur de mes valeurs
                </h3>
                <p className="text-lg leading-relaxed text-[#1F2933] md:text-xl">
                  L&apos;upcycling ou surcyclage en français fait partie intégrante de mes ateliers 
                  pour contribuer à réduire les déchets et l&apos;impact sur l&apos;environnement. 
                  Cette optique crée de la valeur puisque les objets, les matériaux devenus inutiles, 
                  se transforment en produits désirables. Chaque geste compte, car chaque petit pas 
                  contribue à préserver notre planète.
                </p>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-16 text-center">
              <ContactButton size="lg" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
