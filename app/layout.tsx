import Link from "next/link";
import { Orbit } from "lucide-react";
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
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-5">
            <Link href="/" className="flex items-center gap-3 font-bold">
              <Orbit className="text-blue-700" aria-hidden="true" />
              <span>
                Islington <span className="font-normal">/ R&D Hub</span>
              </span>
            </Link>
            <nav
              aria-label="Main navigation"
              className="flex flex-wrap gap-5 text-sm"
            >
              <Link href="/research">Explore research</Link>
              <Link href="/publications">Publications</Link>
              <Link href="/researcher">Researcher area</Link>
              <Link href="/auth/sign-in">Sign in</Link>
            </nav>
          </div>
        </header>
        <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-slate-200 px-6 py-8 text-sm text-slate-600">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
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
