import { PageHeader } from "@/components/shared/page-header";
import { AttentionList } from "@/components/admin/attention-list";
import { OverviewMetrics } from "@/components/admin/overview-metrics";
import { getAdminOverview } from "@/features/operations/queries";

export default async function Admin() {
  const { metrics, attention } = await getAdminOverview();

  return (
    <>
      <PageHeader
        eyebrow="Institutional workspace"
        title="Research operations"
        description="Review submissions and keep public research trustworthy."
      />
      <OverviewMetrics metrics={metrics} />
      <div className="my-10 border-t border-slate-200" />
      <AttentionList items={attention} />
    </>
  );
}
