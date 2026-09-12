import { Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
export function SearchForm({ query = "" }: { query?: string }) {
  return (
    <form action="/publications" className="mb-8 max-w-2xl">
      <label htmlFor="research-query">Find published research by title</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="research-query"
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
