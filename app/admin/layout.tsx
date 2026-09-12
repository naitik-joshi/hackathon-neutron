import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { signOut } from "@/features/auth/actions";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);
  return (
    <>
      <nav
        aria-label="Admin navigation"
        className="mb-8 flex flex-wrap gap-5 text-sm"
      >
        <Link href="/admin">Admin overview</Link>
        <Link href="/admin/submissions">Publication submissions</Link>
        <form action={signOut}>
          <button className="text-link">Sign out</button>
        </form>
      </nav>
      {children}
    </>
  );
}
