import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Customisation de meuble - Fil & Flow",
  description:
    "Transformez un meuble d'occasion ou oublié. Peinture, patine, tissu : personnalisez selon vos envies.",
};

export default async function CustomisationMeublePage() {
  const template = await getTemplateBySlug("customisation-meuble");
  const events = await getEventsByTemplateSlug("customisation-meuble");
  return <WorkshopTypePage template={template} events={events} />;
}
