import Link from "next/link";
import { Search } from "lucide-react";
import { Input, Button } from "@/components/ui";

interface FilterBarProps {
  currentStatus: string;
  query: string;
  counts: {
    all: number;
    ongoing: number;
    proposed: number;
    completed: number;
  };
}

export function ProjectFilterBar({
  currentStatus,
  query,
  counts,
}: FilterBarProps) {
  const tabs = [
    { id: "all", label: "All Projects", count: counts.all },
    { id: "ongoing", label: "Active / Ongoing", count: counts.ongoing },
    { id: "proposed", label: "Proposed", count: counts.proposed },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="my-8 space-y-4">
      {/* Search Input */}
      <form method="GET" action="/projects" className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="project-search" className="sr-only">
            Search projects by title or keyword
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} aria-hidden="true" />
          </div>
          <Input
            id="project-search"
            name="q"
            defaultValue={query}
            placeholder="Search projects by title or keyword..."
            className="pl-10"
          />
          {currentStatus !== "all" && (
            <input type="hidden" name="status" value={currentStatus} />
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Segmented Status Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Status:
        </span>
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          const searchParam = query ? `&q=${encodeURIComponent(query)}` : "";
          const href = `/projects?status=${tab.id}${searchParam}`;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#142c43] text-white shadow-sm font-semibold"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  isActive ? "bg-slate-700 text-blue-200" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
        {(query || currentStatus !== "all") && (
          <Link
            href="/projects"
            className="text-xs text-blue-700 hover:underline font-semibold ml-auto"
          >
            Reset filters
          </Link>
        )}
      </div>
    </div>
  );
}
