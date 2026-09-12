import Link from "next/link";
import {
  Clock,
  Download,
  BookOpen,
  FileCheck2,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guards";
import { SubmissionForm } from "@/features/publications/submission-form";

export const metadata = {
  title: "Manuscript Submission & Peer-Review Intake | IJMR",
  description:
    "Submit your original empirical research to the Islington Journal of Multidisciplinary Research (ISSN: 2773-7829).",
};

export default async function NewPublication() {
  await requireRole(["researcher"]);

  return (
    <div className="page-shell space-y-8">
      {/* Top Header Strip (Stitch s8.png) */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#9E1B32] font-semibold">
          <span>•</span>
          <span>Submission Deadline: Oct 31, 2025 (Volume 6, Issue 2)</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <h1 className="display-lg text-[#0F2042]">
              Manuscript Submission & Peer-Review Intake
            </h1>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Submit your original empirical research, multidisciplinary systematic review, or short communication to the Islington Journal of Multidisciplinary Research (ISSN: 2773-7829).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
            <span className="font-mono text-[0.7rem] text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              <span>Draft auto-saved 2 mins ago</span>
            </span>
            <button type="button" className="btn-academic-outline text-xs py-1.5 px-2.5">
              <Download size={13} />
              <span>Export JSON</span>
            </button>
            <button type="button" className="btn-academic-outline text-xs py-1.5 px-2.5">
              <BookOpen size={13} />
              <span>Author Guidelines</span>
            </button>
            <Link
              href="/researcher/publications"
              className="btn-academic-primary text-xs py-1.5 px-3"
            >
              <FileCheck2 size={13} />
              <span>Submissions Log</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5-Step Intake Form Wizard */}
      <SubmissionForm />
    </div>
  );
}
