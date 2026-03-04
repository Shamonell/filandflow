import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-beige-200 bg-[#FBF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-4">
              <Logo
                width={140}
                height={140}
                className="h-28 w-28 object-contain md:h-36 md:w-36"
              />
            </div>
            <p className="text-sm text-[#5F6C72]">
              Ateliers créatifs pour prendre soin de soi et créer de ses mains
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/boutique"
                  className="text-gray-600 hover:text-almond-500"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  href="/ateliers"
                  className="text-gray-600 hover:text-almond-500"
                >
                  Ateliers
                </Link>
              </li>
              <li>
                <Link
                  href="/ateliers-chez-vous"
                  className="text-gray-600 hover:text-almond-500"
                >
                  Parenthèses à la maison
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-gray-600 hover:text-almond-500"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-almond-500"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Informations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/mentions-legales"
                  className="hover:text-primary-600"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-primary-600">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-beige-200 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Fil & Flow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}


