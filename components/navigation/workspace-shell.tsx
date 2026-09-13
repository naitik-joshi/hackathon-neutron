import type { ReactNode } from "react";
import { WorkspaceNav, type WorkspaceLink } from "./workspace-nav";

export function WorkspaceShell({
  title,
  identity,
  links,
  children,
}: {
  title: string;
  identity: string;
  links: WorkspaceLink[];
  children: ReactNode;
}) {
  return (
    <div className="workspace-shell">
      <WorkspaceNav title={title} identity={identity} links={links} />
      <div className="workspace-content" data-workspace={title.toLowerCase()}>
        {children}
      </div>
    </div>
  );
}
