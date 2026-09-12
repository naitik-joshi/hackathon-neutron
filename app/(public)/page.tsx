import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { listAreas, listPublications } from "@/features/research/queries";
import { AreaList } from "@/components/research/area-list";
import { PublicationList } from "@/components/research/publication-list";
import { SearchForm } from "@/components/research/search-form";
import { SetupState } from "@/components/shared/empty-state";
export default async function Home() {
  const configured = isSupabaseConfigured();
  const [areas, publications] = configured
    ? await Promise.all([listAreas(), listPublications("", 4)])
    : [[], []];
  return (
    <>
      <section className="mb-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="eyebrow">Islington College / Research & Development</p>
          <h1 className="my-5 max-w-2xl text-5xl leading-tight md:text-6xl">
            Ideas to explore.
            <br />
            <span className="text-blue-700">Research to connect.</span>
          </h1>
          <p className="mb-7 max-w-xl text-lg text-slate-600">
            Find research, understand the work behind it, and discover where you
            can contribute to the Islington R&D community.
          </p>
          <SearchForm />
        </div>
        <aside className="self-center rounded-2xl bg-[#142c43] p-8 text-white">
          <p className="mb-6 text-xs uppercase tracking-widest text-blue-200">
            Your path through research
          </p>
          {[
            ["Discover", "Find an area that sparks your curiosity."],
            ["Understand", "Read the research and its purpose."],
            ["Connect", "Meet the people and projects behind it."],
            ["Participate", "Share your own research for review."],
          ].map(([title, text], i) => (
            <div
              key={title}
              className="flex gap-4 border-t border-slate-600 py-4"
            >
              <span className="font-mono text-sm text-blue-200">0{i + 1}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
      {!configured && <SetupState />}
      <section className="my-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl">Explore by research area</h2>
          <Link href="/research" className="text-link">
            All research areas →
          </Link>
        </div>
        <AreaList areas={areas.slice(0, 4)} />
      </section>
      <section className="my-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl">Recently published</h2>
          <Link href="/publications" className="text-link">
            All publications →
          </Link>
        </div>
        {configured && <PublicationList items={publications} />}
      </section>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-blue-200 bg-blue-50 p-8">
        <div>
          <h2 className="text-3xl">
            Make your research part of the conversation.
          </h2>
          <p className="mt-3 text-slate-600">
            Researchers can submit publications for institutional review.
          </p>
        </div>
        <Link
          href="/researcher/publications/new"
          className="text-link flex items-center gap-2"
        >
          Submit research <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </section>
    </>
  );
}
