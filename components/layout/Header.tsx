"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Détection du scroll pour le menu sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    // Vérifier les chemins les plus spécifiques en premier pour éviter les conflits
    // (ex: /ateliers-chez-vous ne doit pas activer /ateliers)
    if (path === "/ateliers-chez-vous") {
      return pathname === "/ateliers-chez-vous";
    }
    if (path === "/ateliers") {
      return pathname === "/ateliers" || pathname.startsWith("/atelier/") || pathname.startsWith("/ateliers/");
    }
    if (path === "/boutique") {
      return pathname === "/boutique" || pathname.startsWith("/produit/");
    }
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-beige-200 bg-[#FBF8F3] transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 max-w-[70%]">
        {/* Ligne 1 : Logo à gauche + Titre "Fil & Flow" centré */}
        <div className="relative flex items-center">
          {/* Logo à gauche */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Logo
              width={140}
              height={140}
              className="h-28 w-28 object-contain md:h-36 md:w-36 transition-transform hover:scale-105"
              priority
            />
          </Link>
          
          {/* Titre "Fil & Flow" centré - desktop seulement */}
          <div className="hidden absolute left-1/2 -translate-x-1/2 text-center md:block">
            <h1 className="text-2xl font-light tracking-wide text-[#5C3A21] md:text-3xl">
              Fil & Flow
            </h1>
          </div>
          
          {/* Bouton Menu Mobile - collé à droite */}
          <button
            className="md:hidden ml-auto flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-7 w-7 text-[#1F2933]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Ligne 2 : Menu Desktop centré */}
        <nav className="hidden md:flex items-center justify-center -mt-2">
            <ul className="flex gap-6">
              <li>
                <Link
                  href="/"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Accueil
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ateliers"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/ateliers")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Ateliers
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/ateliers") ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ateliers-chez-vous"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/ateliers-chez-vous")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Parenthèses à la maison
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/ateliers-chez-vous")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bons-cadeaux"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/bons-cadeaux")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Bons cadeaux
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/bons-cadeaux")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/boutique"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/boutique")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Boutique
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/boutique")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/a-propos")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  À propos
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/a-propos")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`relative text-lg font-medium transition-colors group ${
                    isActive("/contact")
                      ? "text-accent"
                      : "text-[#1F2933] hover:text-accent"
                  }`}
                >
                  Contact
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                      isActive("/contact")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="border-t border-beige-200 py-4 md:hidden">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ateliers"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/ateliers")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ateliers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ateliers-chez-vous"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/ateliers-chez-vous")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Parenthèses à la maison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bons-cadeaux"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/bons-cadeaux")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bons cadeaux
                  </Link>
                </li>
                <li>
                  <Link
                    href="/boutique"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/boutique")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Boutique
                  </Link>
                </li>
                <li>
                  <Link
                    href="/a-propos"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/a-propos")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`block text-sm font-medium transition-colors ${
                      isActive("/contact")
                        ? "text-accent"
                        : "text-[#1F2933] hover:text-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}
      </div>
    </header>
  );
}
