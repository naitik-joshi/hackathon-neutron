import type { ComponentProps } from "react";
import { cn } from "@/lib/utilities/cn";

type ButtonVariant = "primary" | "secondary" | "soft" | "ghost" | "danger";

const buttonBase =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";
const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#0f2042] text-white shadow-sm hover:bg-blue-900",
  secondary:
    "border border-slate-300 bg-white text-[#0f2042] hover:border-[#0f2042] hover:bg-slate-50",
  soft: "bg-[#eff4ff] text-[#0f2042] hover:bg-[#dce9ff]",
  ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  danger: "bg-[#9e1b32] text-white hover:bg-[#7f1527]",
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
        "rounded-lg border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,32,66,0.04)] transition-[border-color,box-shadow]",
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
        "inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
const field =
  "w-full rounded border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#0f2042] focus:outline-none focus:ring-4 focus:ring-[#0f2042]/10 disabled:bg-slate-100";
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-40", className)} {...props} />;
}
export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(field, className)} {...props} />;
}
