import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import "./globals.css";
export const metadata = {
  title: {
    default: "Islington R&D Digital Hub",
    template: "%s | Islington R&D",
  },
  description: "Discover research. Understand ideas. Connect and participate.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Suspense fallback={<div className="h-[73px] border-b bg-white" />}>
          <SiteHeader />
        </Suspense>
        <main id="main" className="page-shell min-h-[70vh]">
          {children}
        </main>
        <footer className="border-t border-slate-200 px-6 py-8 text-sm text-slate-600">
          <div className="page-shell flex flex-wrap justify-between gap-4 py-0">
            <p>Islington College · R&D Digital Hub · Hackathon 2026</p>
            <Link href="/research" className="text-link">
              Find your next research connection
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
