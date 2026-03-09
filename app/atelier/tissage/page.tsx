import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Tissage - Fil & Flow",
  description:
    "Découvrez le tissage sur métier à tisser. Créez des écharpes, tapis ou pièces décoratives uniques.",
};

export default async function TissagePage() {
  const template = await getTemplateBySlug("tissage");
  const events = await getEventsByTemplateSlug("tissage");
  return <WorkshopTypePage template={template} events={events} />;
}
