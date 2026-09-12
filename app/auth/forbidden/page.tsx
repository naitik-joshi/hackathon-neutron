import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { signOut } from "@/features/auth/actions";
import { buttonVariants } from "@/components/ui";
export default function Forbidden() {
  return (
    <section className="page-shell-tight flex min-h-[34rem] items-center justify-center">
      <div className="surface-panel w-full max-w-2xl p-7 text-center sm:p-10">
        <span className="icon-disc mx-auto" aria-hidden="true">
          <LockKeyhole size={21} />
        </span>
        <p className="section-kicker mt-5">Account access</p>
        <h1 className="type-h1 mt-2">This area needs a different role</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Your signed-in account does not have access. Researcher and
          administrator access is provisioned by the institution.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/account" className={buttonVariants()}>
            Go to my account
          </Link>
          <Link
            href="/research"
            className={buttonVariants({ variant: "secondary" })}
          >
            Browse public research
          </Link>
          <form action={signOut}>
            <button className={buttonVariants({ variant: "ghost" })}>
              Sign out
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
