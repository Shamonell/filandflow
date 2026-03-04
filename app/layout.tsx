import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://filandflow.fr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF8F3",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fil & Flow - Ateliers créatifs à Chabeuil, Drôme",
    template: "%s | Fil & Flow",
  },
  description:
    "Découvrez les ateliers créatifs de Fil & Flow : couture, broderie, macramé dans une ambiance bienveillante. Ateliers à Chabeuil (Drôme) et à domicile.",
  keywords: [
    "ateliers créatifs",
    "couture",
    "broderie",
    "macramé",
    "Chabeuil",
    "Drôme",
    "bien-être",
    "création",
    "fait main",
    "ateliers à domicile",
  ],
  authors: [{ name: "Fil & Flow" }],
  creator: "Fil & Flow",
  publisher: "Fil & Flow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Fil & Flow",
    title: "Fil & Flow - Ateliers créatifs à Chabeuil, Drôme",
    description:
      "Découvrez les ateliers créatifs de Fil & Flow : couture, broderie, macramé dans une ambiance bienveillante.",
    images: [
      {
        url: "/nouveau logo.png",
        width: 800,
        height: 600,
        alt: "Fil & Flow - Ateliers créatifs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fil & Flow - Ateliers créatifs",
    description:
      "Découvrez les ateliers créatifs de Fil & Flow : couture, broderie, macramé.",
    images: ["/nouveau logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Ajouter les codes de vérification si nécessaire
    // google: "votre-code-google",
    // yandex: "votre-code-yandex",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}


