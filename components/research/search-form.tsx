import Link from "next/link";
import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
export function SearchForm({
  query = "",
  action = "/publications",
  label = "Find published research by title",
  id = "research-query",
  placeholder = "What would you like to explore?",
}: {
  query?: string;
  action?: string;
  label?: string;
  id?: string;
  placeholder?: string;
}) {
  return (
    <form
      action={action}
      method="GET"
      role="search"
      aria-label={label}
      className="directory-command"
    >
      <label htmlFor={id}>{label}</label>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          name="q"
          type="search"
          defaultValue={query}
          maxLength={100}
          placeholder={placeholder}
        />
        <Button type="submit" className="w-full sm:w-auto">
          <Search size={18} aria-hidden="true" />
          <span>Search</span>
        </Button>
        {query && (
          <Link href={action} className="text-link min-h-11 py-3 text-center">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
