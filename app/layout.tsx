import { Suspense } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { ResearchPaperAssistant } from "@/components/assistant/research-paper-assistant";
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Suspense fallback={<div className="h-16 border-b bg-white" />}>
          <SiteHeader />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ResearchPaperAssistant />
      </body>
    </html>
  );
}
