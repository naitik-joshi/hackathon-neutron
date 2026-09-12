import Link from "next/link";
import { Search } from "lucide-react";
import { Input, Select, Button } from "@/components/ui";

export function ProjectFilterBar({
  currentStatus,
  query,
}: {
  currentStatus: string;
  query: string;
}) {
  const hasFilters = Boolean(query) || currentStatus !== "all";

  return (
    <form
      method="GET"
      action="/projects"
      role="search"
      aria-label="Find projects"
      className="directory-command project-filter-command"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="project-query">Search project titles</label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            aria-hidden="true"
          />
          <Input
            id="project-query"
            name="q"
            type="search"
            maxLength={100}
            defaultValue={query}
            className="pl-11"
            placeholder="Search recorded project titles"
          />
        </div>
      </div>
      <div className="sm:w-52">
        <label htmlFor="project-status">Project status</label>
        <Select id="project-status" name="status" defaultValue={currentStatus}>
          <option value="all">All statuses</option>
          <option value="proposed">Proposed</option>
          <option value="ongoing">Active / ongoing</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </Select>
      </div>
      <div className="flex items-center gap-3 sm:pb-px">
        <Button type="submit">Apply filters</Button>
        {hasFilters && (
          <Link href="/projects" className="text-link min-h-11 py-3">
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}
