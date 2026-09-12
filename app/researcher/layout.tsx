import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { signOut } from "@/features/auth/actions";
export const dynamic = "force-dynamic";
export default async function ResearcherLayout({ children }: { children: React.ReactNode }) { await requireRole(["researcher"]); return <><nav aria-label="Researcher navigation" className="mb-8 flex flex-wrap gap-5 text-sm"><Link href="/researcher">Overview</Link><Link href="/researcher/publications">My publications</Link><Link href="/researcher/publications/new">New submission</Link><form action={signOut}><button className="text-link">Sign out</button></form></nav>{children}</>; }
