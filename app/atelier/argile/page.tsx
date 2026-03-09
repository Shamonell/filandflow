import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Argile (autodurcissante) - Fil & Flow",
  description:
    "Modelage et création en argile autodurcissante. Pas de cuisson nécessaire, laissez libre cours à votre créativité.",
};

export default async function ArgilePage() {
  const template = await getTemplateBySlug("argile-autodurcissante");
  const events = await getEventsByTemplateSlug("argile-autodurcissante");
  return <WorkshopTypePage template={template} events={events} />;
}
