import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
export function SearchForm({
  query = "",
  action = "/publications",
  label = "Find published research by title",
  id = "research-query",
}: {
  query?: string;
  action?: string;
  label?: string;
  id?: string;
}) {
  return (
    <form
      action={action}
      method="GET"
      role="search"
      aria-label={label}
      className="mb-8 max-w-2xl"
    >
      <label htmlFor={id}>{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={id}
          name="q"
          type="search"
          defaultValue={query}
          maxLength={100}
          placeholder="What would you like to explore?"
        />
        <Button type="submit" className="w-full sm:w-auto">
          <Search size={18} aria-hidden="true" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}
