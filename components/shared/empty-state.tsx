import Link from "next/link";
import { Card } from "@/components/ui";
export function EmptyState({
  title,
  description,
  href = "/research",
  action = "Explore research",
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <Card className="border-dashed bg-slate-50/60 py-10 text-center">
      <h2 className="text-xl">{title}</h2>
      <p className="mx-auto my-3 max-w-xl text-slate-600">{description}</p>
      <Link className="text-link" href={href}>
        {action} →
      </Link>
    </Card>
  );
}
export function SetupState() {
  return (
    <EmptyState
      title="Research hub is being prepared"
      description="Research records will appear once the hub is connected. Team members can follow the environment and migration steps in the README."
      href="/auth/sign-in"
      action="Researcher sign in"
    />
  );
}
