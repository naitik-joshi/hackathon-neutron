import { Suspense } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import "./globals.css";
export const metadata = {
  title: {
    default: "Islington R&D Digital Hub",
    template: "%s | Islington R&D Digital Hub",
  },
  description:
    "Explore connected research areas, researchers, projects and published outputs. Public research is accessible without login.",
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
        <div className="announcement-banner text-center">
          Discover → Understand → Connect → Participate · Public research, open
          to everyone
        </div>
        <Suspense fallback={<div className="h-16 border-b bg-white" />}>
          <SiteHeader />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
