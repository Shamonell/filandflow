import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Fil & Flow pour toute question sur nos ateliers créatifs ou pour organiser un atelier personnalisé.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
