import type { ComponentProps } from "react";
import { cn } from "@/lib/utilities/cn";
export const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60";
export function Button({ className, ...props }: ComponentProps<"button">) { return <button className={cn(buttonClass, className)} {...props} />; }
export function Card({ className, ...props }: ComponentProps<"div">) { return <div className={cn("rounded-xl border border-slate-200 bg-white p-6", className)} {...props} />; }
export function Badge({ className, ...props }: ComponentProps<"span">) { return <span className={cn("inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700", className)} {...props} />; }
const field = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900";
export function Input({ className, ...props }: ComponentProps<"input">) { return <input className={cn(field, className)} {...props} />; }
export function Textarea({ className, ...props }: ComponentProps<"textarea">) { return <textarea className={cn(field, "min-h-40", className)} {...props} />; }
export function Select({ className, ...props }: ComponentProps<"select">) { return <select className={cn(field, className)} {...props} />; }
