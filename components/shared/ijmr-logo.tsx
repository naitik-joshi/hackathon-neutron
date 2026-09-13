import Image from "next/image";
import { cn } from "@/lib/utilities/cn";

export function BrandLogo({
  className,
  compact = false,
  priority = false,
}: {
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  return (
    <span className={cn("brand-lockup", className)}>
      <span className="brand-image-shell" aria-hidden="true">
        <Image
          src="/brand/ijmr-logo.svg"
          alt=""
          width={1080}
          height={427}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="h-auto w-full"
        />
      </span>
      <span className={cn("brand-product", compact && "hidden sm:grid")}>
        <strong>R&amp;D Digital Hub</strong>
        <small>Connected research at Islington</small>
      </span>
      <span className="sr-only">
        Islington Journal of Multidisciplinary Research — R&amp;D Digital Hub
      </span>
    </span>
  );
}

/** @deprecated Use BrandLogo with the approved IJMR asset. */
export const IJMRLogo = BrandLogo;
