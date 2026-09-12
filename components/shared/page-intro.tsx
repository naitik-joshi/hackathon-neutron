import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  meta,
  actions,
  readingWidth = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
  actions?: ReactNode;
  readingWidth?: boolean;
}) {
  return (
    <header className={readingWidth ? "max-w-4xl" : "max-w-5xl"}>
      <p className="section-kicker">{eyebrow}</p>
      <h1 className="type-h1 mt-3 break-words">{title}</h1>
      <p className="mt-5 max-w-3xl text-lg text-muted sm:text-xl">
        {description}
      </p>
      {(meta || actions) && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {meta && (
            <div className="flex flex-wrap items-center gap-2">{meta}</div>
          )}
          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>
      )}
    </header>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h2 className="type-h2 mt-1">{title}</h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
