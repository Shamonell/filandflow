import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Couture - Fil & Flow",
  description:
    "Découvrez les ateliers couture de Fil & Flow. Initiation ou perfectionnement dans une ambiance bienveillante.",
};

export default async function CouturePage() {
  const template = await getTemplateBySlug("couture");
  const events = await getEventsByTemplateSlug("couture");
  return <WorkshopTypePage template={template} events={events} />;
}
