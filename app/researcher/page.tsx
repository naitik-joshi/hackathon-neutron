import { ResearcherDashboardView } from "@/components/researcher/dashboard";
import { getResearcherDashboard } from "@/features/researcher/queries";

export const metadata = {
  title: "Researcher workspace",
};

export default async function ResearcherDashboard() {
  const data = await getResearcherDashboard();

  return <ResearcherDashboardView data={data} />;
}
