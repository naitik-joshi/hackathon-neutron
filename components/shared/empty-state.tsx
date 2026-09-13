import Link from "next/link";
import { AlertTriangle, ArrowRight, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utilities/cn";

export function StateFrame({
  title,
  description,
  href,
  action,
  tone = "empty",
  compact = false,
  className,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
  tone?: "empty" | "error";
  compact?: boolean;
  className?: string;
}) {
  const Icon = tone === "error" ? AlertTriangle : SearchX;
  return (
    <section
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "surface-panel border-dashed text-center",
        compact ? "p-6" : "px-6 py-10 sm:px-10",
        className,
      )}
    >
      <span className="icon-disc mx-auto" aria-hidden="true">
        <Icon size={20} />
      </span>
      <h2 className="type-h3 mt-4">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{description}</p>
      {href && action && (
        <Link
          className={buttonVariants({
            variant: "secondary",
            className: "mt-5",
          })}
          href={href}
        >
          {action} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

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
    <StateFrame
      title={title}
      description={description}
      href={href}
      action={action}
    />
  );
}

export function ErrorState({
  title,
  description,
  compact,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <StateFrame
      title={title}
      description={description}
      tone="error"
      compact={compact}
    />
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
