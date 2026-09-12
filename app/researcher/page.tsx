import { ResearcherDashboardView } from "@/components/researcher/dashboard";
import { getResearcherDashboard } from "@/features/researcher/queries";

export const metadata = {
  title: "Researcher Workspace | Islington R&D Digital Hub",
};

export default async function ResearcherDashboard() {
  const data = await getResearcherDashboard();

  return <ResearcherDashboardView data={data} />;
}
