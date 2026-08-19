"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Faq } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...new Set(faqs.map((f) => f.category))],
    [faqs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (q && !`${f.question} ${f.answer}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [faqs, query, category]);

  return (
    <div>
      {/* Search */}
      <div className="relative mx-auto max-w-xl">
        <Search
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a question — fees, batches, placements…"
          aria-label="Search FAQs"
          className="h-12 rounded-full border-2 pl-12 pr-5 text-base shadow-sm focus-visible:border-teal"
        />
      </div>

      {/* Category pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by topic">
        {categories.map((cat) => {
          const count =
            cat === "All" ? faqs.length : faqs.filter((f) => f.category === cat).length;
          return (
            <button key={cat} onClick={() => setCategory(cat)}>
              <Badge
                variant={category === cat ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-1.5 text-sm transition-colors",
                  category === cat
                    ? "bg-teal hover:bg-teal"
                    : "hover:border-teal/50 hover:text-teal"
                )}
              >
                {cat}
                <span className={cn("ml-1 text-xs", category === cat ? "text-white/70" : "text-muted-foreground")}>
                  {count}
                </span>
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed bg-card p-10 text-center">
          <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold text-navy">No matching questions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term, or reach out below — we answer every question personally.
          </p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-card px-6 py-2 shadow-sm"
        >
          {filtered.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left font-semibold text-navy">
                <span>
                  {faq.question}
                  <Badge variant="secondary" className="ml-2 align-middle text-[10px]">
                    {faq.category}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
