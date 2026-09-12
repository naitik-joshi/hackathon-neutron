import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import "./globals.css";

export const metadata = {
  title: {
    default: "Islington Journal of Multidisciplinary Research (IJMR)",
    template: "%s | IJMR Islington Research Hub",
  },
  description:
    "Islington College Academic Repository & Peer-Reviewed Research Platform. Discover, publish, and collaborate on cutting-edge research.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAFBFD] text-[#0B1C30]">
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>

        {/* Global Announcement Ribbon */}
        <div className="announcement-banner">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#9E1B32] px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wide uppercase text-white">
                Announcement
              </span>
              <span className="text-slate-300">
                Call for Papers: IJMR Volume 6, Issue 2 — Multidisciplinary Innovation & AI in Nepal | Submission Deadline: October 31, 2025
              </span>
            </div>
            <Link
              href="/researcher/publications/new"
              className="hidden sm:inline-flex items-center gap-1 font-semibold text-white hover:underline shrink-0"
            >
              <span>Submit</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Scholarly Metadata Ribbon */}
        <div className="metadata-ribbon hidden md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-[0.7rem] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">
                IJMR Academic Repository
              </span>
              <span>•</span>
              <span>Peer-Reviewed Research Platform</span>
              <span>•</span>
              <span>Vol 6 (2025)</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[0.68rem]">
              <span>ISSN: 2773-7829 (Online)</span>
              <span>•</span>
              <span>Indexed in DOAJ & Google Scholar</span>
            </div>
          </div>
        </div>

        {/* Main Site Header */}
        <Suspense fallback={<div className="h-[68px] border-b bg-white" />}>
          <SiteHeader />
        </Suspense>

        {/* Page Content Body */}
        <main id="main" className="flex-1">
          {children}
        </main>

        {/* 5-Column Scholarly Academic Footer */}
        <SiteFooter />
      </body>
    </html>
  );
}
