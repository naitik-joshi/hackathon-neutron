import { cn } from "@/lib/utilities/cn";

export function IJMRMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-[#0F2042] text-white shadow-sm overflow-hidden",
        className || "w-10 h-10"
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        {/* Underline base */}
        <rect x="16" y="76" width="68" height="5" rx="2.5" fill="#94A3B8" />
        {/* I pillar */}
        <rect x="24" y="24" width="16" height="48" rx="2" fill="#E2E8F0" />
        {/* J stem and hook */}
        <path
          d="M48 24 H64 V56 C64 64 57 70 48 70 C43 70 40 68 38 66 L41 58 C43 60 45 61 48 61 C53 61 55 58 55 54 V24 H48 Z"
          fill="#0EA5E9"
        />
        {/* Red accent dot */}
        <circle cx="72" cy="30" r="8" fill="#B02A3E" />
      </svg>
    </div>
  );
}

export function IJMRLogo({
  className,
  markClassName,
  subtitle = "RESEARCH COMMUNITY",
  light = false,
}: {
  className?: string;
  markClassName?: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <IJMRMark className={markClassName || "w-9 h-9"} />
      <div className="flex flex-col leading-tight">
        <div className="flex items-center tracking-tight text-lg font-bold font-serif">
          <span className={light ? "text-white" : "text-[#0F2042]"}>IJMR</span>
          <span className="text-[#9E1B32] ml-1 tracking-wider uppercase text-[0.92rem]">
            ISLINGTON
          </span>
        </div>
        <span
          className={cn(
            "text-[0.65rem] font-semibold tracking-widest uppercase",
            light ? "text-slate-300" : "text-[#526277]"
          )}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
