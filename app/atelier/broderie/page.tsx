import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Broderie - Fil & Flow",
  description:
    "Apprenez la broderie traditionnelle et contemporaine avec Fil & Flow. Créez des pièces uniques à la main.",
};

export default async function BroderiePage() {
  const template = await getTemplateBySlug("broderie");
  const events = await getEventsByTemplateSlug("broderie");
  return <WorkshopTypePage template={template} events={events} />;
}
