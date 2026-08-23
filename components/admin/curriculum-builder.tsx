"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CurriculumSection, Lesson } from "@/lib/types";

const selectCls = "border-input h-9 rounded-lg border bg-transparent px-2 text-sm outline-none";

function newId() {
  return `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// Sections → lessons editor. Serialises to a hidden JSON input named `name`.
export function CurriculumBuilder({ name, initial, quizOptions }: { name: string; initial: CurriculumSection[]; quizOptions: { slug: string; title: string }[] }) {
  const [sections, setSections] = useState<CurriculumSection[]>(initial);
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  const update = (fn: (s: CurriculumSection[]) => CurriculumSection[]) => setSections((prev) => fn(structuredClone(prev)));
  const move = <T,>(arr: T[], i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return arr;
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(sections)} />
      {sections.map((sec, si) => (
        <div key={si} className="rounded-xl border bg-secondary/30 p-3">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4 text-muted-foreground" aria-hidden />
            <Input value={sec.title} onChange={(e) => update((s) => { s[si].title = e.target.value; return s; })} placeholder="Section title, e.g. Module 1 — Core Java" className="bg-card font-medium" />
            <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => update((s) => move(s, si, -1))}><ChevronUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => update((s) => move(s, si, 1))}><ChevronDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label="Delete section" onClick={() => update((s) => { s.splice(si, 1); return s; })}><Trash2 className="size-4 text-destructive" /></Button>
          </div>
          <div className="mt-2 space-y-2 pl-6">
            {sec.lessons.map((l, li) => {
              const key = `${si}-${li}`;
              const open = openLesson === key;
              const set = (patch: Partial<Lesson>) => update((s) => { s[si].lessons[li] = { ...s[si].lessons[li], ...patch }; return s; });
              return (
                <div key={l.id} className="rounded-lg border bg-card">
                  <div className="flex items-center gap-2 p-2">
                    <select value={l.type} onChange={(e) => set({ type: e.target.value as Lesson["type"] })} className={selectCls} aria-label="Lesson type">
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <Input value={l.title} onChange={(e) => set({ title: e.target.value })} placeholder="Lesson title" className="flex-1" />
                    <Input type="number" min="0" value={l.durationMinutes ?? 0} onChange={(e) => set({ durationMinutes: Number(e.target.value) || 0 })} className="w-20" aria-label="Duration (minutes)" title="Duration in minutes" />
                    <label className="flex items-center gap-1 text-xs whitespace-nowrap"><input type="checkbox" checked={Boolean(l.isPreview)} onChange={(e) => set({ isPreview: e.target.checked })} className="accent-teal" /> Preview</label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setOpenLesson(open ? null : key)}>{open ? "Less" : "More"}</Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => update((s) => { move(s[si].lessons, li, -1); return s; })}><ChevronUp className="size-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => update((s) => { move(s[si].lessons, li, 1); return s; })}><ChevronDown className="size-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Delete lesson" onClick={() => update((s) => { s[si].lessons.splice(li, 1); return s; })}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                  {open && (
                    <div className="grid gap-2 border-t p-3 sm:grid-cols-2">
                      {l.type === "video" && (
                        <div className="sm:col-span-2"><Input value={l.videoUrl ?? ""} onChange={(e) => set({ videoUrl: e.target.value })} placeholder="Video URL — YouTube (unlisted), Vimeo, or direct .mp4 / Cloudinary" /></div>
                      )}
                      {l.type === "quiz" && (
                        <div className="sm:col-span-2">
                          <select value={l.quizSlug ?? ""} onChange={(e) => set({ quizSlug: e.target.value })} className={`${selectCls} w-full`} aria-label="Quiz">
                            <option value="">— Select a quiz (create under Admin → Quizzes) —</option>
                            {quizOptions.map((q) => <option key={q.slug} value={q.slug}>{q.title}</option>)}
                          </select>
                        </div>
                      )}
                      <Input value={l.attachmentLabel ?? ""} onChange={(e) => set({ attachmentLabel: e.target.value })} placeholder="Attachment label (e.g. Class notes PDF)" />
                      <Input value={l.attachmentUrl ?? ""} onChange={(e) => set({ attachmentUrl: e.target.value })} placeholder="Attachment URL" />
                      <div className="sm:col-span-2"><Textarea rows={3} value={l.content ?? ""} onChange={(e) => set({ content: e.target.value })} placeholder="Lesson notes (Markdown) — shown under the video / as the document body" /></div>
                    </div>
                  )}
                </div>
              );
            })}
            <Button type="button" variant="outline" size="sm" onClick={() => update((s) => { s[si].lessons.push({ id: newId(), title: "", type: "video", durationMinutes: 0 }); return s; })}>
              <Plus className="size-3.5" aria-hidden /> Add lesson
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => update((s) => { s.push({ title: "", lessons: [] }); return s; })}>
        <Plus className="size-4" aria-hidden /> Add section
      </Button>
    </div>
  );
}
