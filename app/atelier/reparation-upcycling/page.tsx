import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Réparation & Upcycling - Fil & Flow",
  description:
    "Donnez une seconde vie à vos vêtements et objets. Réparation, customisation et transformation créative.",
};

export default async function ReparationUpcyclingPage() {
  const template = await getTemplateBySlug("reparation-upcycling");
  const events = await getEventsByTemplateSlug("reparation-upcycling");
  return <WorkshopTypePage template={template} events={events} />;
}
