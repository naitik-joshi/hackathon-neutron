import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { IJMRLogo } from "./ijmr-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#000922] text-slate-300">
      <div className="page-shell py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <IJMRLogo light subtitle="ACADEMIC JOURNAL & REPOSITORY" />
            <div className="pt-2 text-xs space-y-2 text-slate-400">
              <p className="font-semibold text-slate-200">
                Islington Journal of Multidisciplinary Research
              </p>
              <p className="font-mono text-[0.7rem] text-slate-400">
                ISSN: 2773-7829 (Online)
              </p>
              <p className="leading-relaxed pr-6">
                Open-access scholarly journal advancing interdisciplinary
                inquiry, AI computing, and contextual Nepali innovation. Published
                by Islington College in scholarly collaboration with international
                partners.
              </p>
            </div>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 tracking-wider text-[0.75rem] uppercase">
              Discover
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href="/publications"
                  className="hover:text-white transition-colors"
                >
                  Research Papers
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="hover:text-white transition-colors"
                >
                  Current Issue (Vol 6.1)
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="hover:text-white transition-colors"
                >
                  Corpus Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="hover:text-white transition-colors"
                >
                  Subject Disciplines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Community */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 tracking-wider text-[0.75rem] uppercase">
              Community
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href="/researchers"
                  className="hover:text-white transition-colors"
                >
                  Faculty & Researchers
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors"
                >
                  Collaborative Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className="hover:text-white transition-colors"
                >
                  Student Grants & Fellowships
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Symposia & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Publish & Ethics */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 tracking-wider text-[0.75rem] uppercase">
              Publish & Ethics
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link
                  href="/researcher/publications/new"
                  className="hover:text-white transition-colors"
                >
                  Submit Manuscript
                </Link>
              </li>
              <li>
                <Link
                  href="/researcher"
                  className="hover:text-white transition-colors"
                >
                  Author Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="hover:text-white transition-colors"
                >
                  Double-Blind Peer Review
                </Link>
              </li>
              <li>
                <Link
                  href="/researchers"
                  className="hover:text-white transition-colors"
                >
                  Editorial Board
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors"
                >
                  Research Ethics & IRB
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 tracking-wider text-[0.75rem] uppercase">
              Institutional Links
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="text-slate-300">Islington College Kathmandu</span>
              </li>
              <li>
                <span className="text-slate-400">Centre for Applied AI & Data Innovation</span>
              </li>
              <li>
                <span className="text-slate-400">London Metropolitan University Affiliate</span>
              </li>
              <li>
                <span className="text-slate-400">Slurm HPC Cluster Portal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Licenses & Disclaimers */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.7rem] text-slate-400">
          <p>
            © 2025 Islington Journal of Multidisciplinary Research (IJMR). Published by
            Islington College, Kamal Marg, Kathmandu, Nepal.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Lock size={12} className="text-[#0D9488]" />
              <span>Open Access CC-BY 4.0</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={13} className="text-[#9E1B32]" />
              <span>COPE Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
