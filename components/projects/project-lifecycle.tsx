import { CheckCircle2, CircleDot } from "lucide-react";
import type { Project } from "@/lib/supabase/database.types";

interface LifecycleStage {
  id: Project["status"];
  number: string;
  title: string;
  description: string;
}

const STAGES: LifecycleStage[] = [
  {
    id: "proposed",
    number: "01",
    title: "Proposal & Ethics",
    description: "Scope, institutional review & methodology planning",
  },
  {
    id: "ongoing",
    number: "02",
    title: "Active Investigation",
    description: "Experimentation, data curation & drafting outputs",
  },
  {
    id: "completed",
    number: "03",
    title: "Published & Verified",
    description: "Peer-reviewed outputs accepted into repository",
  },
  {
    id: "archived",
    number: "04",
    title: "Open Knowledge Archive",
    description: "Curated datasets & reproducible findings archived",
  },
];

export function ProjectLifecycle({ status }: { status: Project["status"] }) {
  const statusOrder: Record<Project["status"], number> = {
    proposed: 0,
    ongoing: 1,
    completed: 2,
    archived: 3,
  };

  const currentIndex = statusOrder[status];
  const percentComplete = Math.round(((currentIndex + 1) / STAGES.length) * 100);

  return (
    <section aria-label="Research Lifecycle Tracker" className="my-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="eyebrow block">Institutional Research Framework</span>
          <h2 className="mt-1 text-2xl">Project Lifecycle Pipeline</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Execution Progress</span>
            <span className="font-mono text-sm font-semibold text-[#142c43]">
              Stage {currentIndex + 1} of {STAGES.length}
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-mono text-xs font-bold text-blue-800 border border-blue-200">
            {percentComplete}%
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={stage.id}
              className={`flex flex-col justify-between rounded-lg p-4 border transition-all ${
                isCurrent
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : isDone
                    ? "border-emerald-200 bg-emerald-50/30 text-slate-800"
                    : "border-slate-200 bg-slate-50/60 text-slate-500 opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800"
                        : isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} aria-label="Completed" />
                    ) : isCurrent ? (
                      <CircleDot size={14} aria-label="Current active stage" />
                    ) : (
                      stage.number
                    )}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                      isDone
                        ? "text-emerald-700"
                        : isCurrent
                          ? "text-blue-700"
                          : "text-slate-500"
                    }`}
                  >
                    {isDone ? "Completed" : isCurrent ? "Current Stage" : "Upcoming"}
                  </span>
                </div>
                <h3 className={`text-base font-semibold ${isCurrent ? "text-blue-950 font-bold" : "text-slate-900"}`}>
                  {stage.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="mt-4 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isDone
                      ? "w-full bg-emerald-500"
                      : isCurrent
                        ? "w-3/4 bg-blue-600 animate-pulse"
                        : "w-0 bg-transparent"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
