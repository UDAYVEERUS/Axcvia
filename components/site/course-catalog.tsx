"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "@/components/site/course-card";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CourseCatalog({
  courses,
  categories,
}: {
  courses: Course[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [mode, setMode] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (mode !== "all" && c.mode !== mode && c.mode !== "hybrid") return false;
      if (q && !`${c.title} ${c.category} ${c.tagline}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [courses, query, category, mode]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="pl-9"
            aria-label="Search courses"
          />
        </div>
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList>
            <TabsTrigger value="all">All Formats</TabsTrigger>
            <TabsTrigger value="offline">Classroom</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["All", ...categories].map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}>
            <Badge
              variant={category === cat ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm",
                category === cat && "bg-navy hover:bg-navy"
              )}
            >
              {cat}
            </Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg font-semibold text-navy">No courses match your filters</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term or clear the category filter.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
