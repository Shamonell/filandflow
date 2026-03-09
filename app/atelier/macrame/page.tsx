import { Metadata } from "next";
import {
  getTemplateBySlug,
  getEventsByTemplateSlug,
} from "@/lib/queries";
import WorkshopTypePage from "@/components/atelier/WorkshopTypePage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Atelier Macramé - Fil & Flow",
  description:
    "Initiation au macramé : nœuds, suspensions, bijoux ou déco. Une technique ancestrale accessible à tous.",
};

export default async function MacramePage() {
  const template = await getTemplateBySlug("macrame");
  const events = await getEventsByTemplateSlug("macrame");
  return <WorkshopTypePage template={template} events={events} />;
}
