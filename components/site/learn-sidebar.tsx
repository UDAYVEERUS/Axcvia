import Link from "next/link";
import { CheckCircle2, Circle, ClipboardList, FileText, PlayCircle } from "lucide-react";
import type { Course, Quiz } from "@/lib/types";
import { formatMinutes } from "@/lib/video";
import { cn } from "@/lib/utils";

const icon = { video: PlayCircle, document: FileText, quiz: ClipboardList };

export function LearnSidebar({ course, quizzes, completed, activeId }: { course: Course; quizzes: Quiz[]; completed: string[]; activeId: string }) {
  const sections = course.curriculum ?? [];
  const linkedQuizSlugs = new Set(sections.flatMap((s) => s.lessons).map((l) => l.quizSlug).filter(Boolean));
  const extraQuizzes = quizzes.filter((q) => !linkedQuizSlugs.has(q.slug));
  const total = sections.reduce((n, s) => n + s.lessons.length, 0);
  const done = sections.flatMap((s) => s.lessons).filter((l) => completed.includes(l.id)).length;

  return (
    <aside className="flex h-full flex-col rounded-xl border bg-card">
      <div className="border-b p-4">
        <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-navy">← Dashboard</Link>
        <p className="mt-1 font-bold leading-snug text-navy">{course.title}</p>
        {total > 0 && (
          <>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-teal" style={{ width: `${Math.round((done / total) * 100)}%` }} /></div>
            <p className="mt-1 text-xs text-muted-foreground">{done}/{total} completed</p>
          </>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sections.map((s, i) => (
          <div key={s.title + i} className="mb-2">
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.title}</p>
            {s.lessons.map((l) => {
              const Icon = icon[l.type];
              const isDone = completed.includes(l.id);
              const href = l.type === "quiz" && l.quizSlug ? `/learn/${course.slug}/quiz/${l.quizSlug}` : `/learn/${course.slug}/${l.id}`;
              return (
                <Link key={l.id} href={href} className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent", activeId === l.id && "bg-teal/10 font-medium text-navy")}>
                  {isDone ? <CheckCircle2 className="size-4 shrink-0 text-teal" aria-hidden /> : <Circle className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />}
                  <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                  {l.durationMinutes ? <span className="text-xs text-muted-foreground">{formatMinutes(l.durationMinutes)}</span> : null}
                </Link>
              );
            })}
          </div>
        ))}
        {extraQuizzes.length > 0 && (
          <div className="mb-2">
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mock tests</p>
            {extraQuizzes.map((q) => (
              <Link key={q.slug} href={`/learn/${course.slug}/quiz/${q.slug}`} className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent", activeId === `quiz:${q.slug}` && "bg-teal/10 font-medium text-navy")}>
                <ClipboardList className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{q.title}</span>
                <span className="text-xs text-muted-foreground">{q.questions.length} Q</span>
              </Link>
            ))}
          </div>
        )}
        {(course.materials ?? []).length > 0 && (
          <div className="mb-2">
            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Study materials</p>
            {course.materials!.map((m) => (
              <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent">
                <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden /> <span className="truncate">{m.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
