import type { ComponentProps } from "react";
import { cn } from "@/lib/utilities/cn";

type ButtonVariant =
  "primary" | "secondary" | "soft" | "ghost" | "danger" | "editorial";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0";
const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-action)] text-white shadow-[var(--shadow-rest)] hover:bg-[var(--color-action-hover)]",
  secondary:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]",
  soft: "bg-[var(--color-info-soft)] text-[var(--color-info)] hover:bg-[var(--color-info-soft-hover)]",
  ghost:
    "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-strong)]",
  editorial:
    "bg-[var(--color-ruby)] text-white hover:bg-[var(--color-ruby-strong)]",
};

export function buttonVariants({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return cn(buttonBase, buttonStyles[variant], className);
}

export const buttonClass = buttonVariants();

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button className={buttonVariants({ variant, className })} {...props} />
  );
}
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-rest)]",
        className,
      )}
      {...props}
    />
  );
}
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}
const field =
  "w-full min-h-11 rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-3 text-base text-[var(--color-text)] shadow-[var(--shadow-rest)] transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] placeholder:text-[var(--color-text-subtle)] hover:border-[var(--color-ink-soft)] focus:border-[var(--color-action)] focus:outline-none focus:ring-4 focus:ring-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)]";
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-40", className)} {...props} />;
}
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(field, className)} {...props} />;
}

export function FieldHelp({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("mt-1.5 text-xs text-[var(--color-text-muted)]", className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      role="alert"
      className={cn(
        "mt-1.5 text-sm font-medium text-[var(--color-danger)]",
        className,
      )}
      {...props}
    />
  );
}

type MessageTone = "info" | "success" | "warning" | "error";

const messageStyles: Record<MessageTone, string> = {
  info: "border-[var(--color-info-border)] bg-[var(--color-info-soft)] text-[var(--color-info)]",
  success:
    "border-[var(--color-success-border)] bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  error:
    "border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
};

export function FormMessage({
  tone = "info",
  title,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { tone?: MessageTone; title?: string }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[var(--radius-md)] border p-4 text-sm leading-relaxed",
        messageStyles[tone],
        className,
      )}
      {...props}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children}
    </div>
  );
}
