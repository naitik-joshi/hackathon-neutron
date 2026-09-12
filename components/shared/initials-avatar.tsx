import { UserRound } from "lucide-react";
import { cn } from "@/lib/utilities/cn";
import { getInitials } from "@/lib/utilities/initials";

export function InitialsAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = getInitials(name);
  return (
    <span className={cn("initials-avatar", className)} aria-hidden="true">
      {initials || <UserRound size={20} />}
    </span>
  );
}
