"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { QuizQuestion } from "@/lib/types";

// Bulk format: one question per line
//   Question text | option A | option B | option C | option D | correct (1-4) | explanation
function parseBulk(text: string): QuizQuestion[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const [q, ...rest] = parts;
      const explanationIdx = rest.length - 1;
      // Find the first numeric token from the end: the correct answer number.
      let correctPos = -1;
      for (let i = rest.length - 1; i >= 0; i--) if (/^\d+$/.test(rest[i])) { correctPos = i; break; }
      if (correctPos === -1) return { text: q, options: rest, correctIndex: 0 };
      const options = rest.slice(0, correctPos);
      const explanation = correctPos < explanationIdx ? rest.slice(correctPos + 1).join(" | ") : "";
      return { text: q, options, correctIndex: Math.max(0, Number(rest[correctPos]) - 1), explanation };
    })
    .filter((q) => q.text && q.options.length >= 2);
}

export function QuizBuilder({ name, initial }: { name: string; initial: QuizQuestion[] }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initial);
  const [bulk, setBulk] = useState("");
  const update = (fn: (q: QuizQuestion[]) => QuizQuestion[]) => setQuestions((prev) => fn(structuredClone(prev)));

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(questions)} />
      <p className="text-sm text-muted-foreground">{questions.length} questions</p>
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-xl border bg-secondary/30 p-3">
          <div className="flex items-start gap-2">
            <span className="mt-2 w-8 text-sm font-semibold text-muted-foreground">Q{qi + 1}</span>
            <Textarea rows={2} value={q.text} onChange={(e) => update((s) => { s[qi].text = e.target.value; return s; })} placeholder="Question text" className="flex-1 bg-card" />
            <div className="flex flex-col">
              <Button type="button" variant="ghost" size="icon" aria-label="Move up" onClick={() => update((s) => { if (qi > 0) [s[qi - 1], s[qi]] = [s[qi], s[qi - 1]]; return s; })}><ChevronUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Move down" onClick={() => update((s) => { if (qi < s.length - 1) [s[qi + 1], s[qi]] = [s[qi], s[qi + 1]]; return s; })}><ChevronDown className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Delete question" onClick={() => update((s) => { s.splice(qi, 1); return s; })}><Trash2 className="size-4 text-destructive" /></Button>
            </div>
          </div>
          <div className="mt-2 grid gap-2 pl-10 sm:grid-cols-2">
            {q.options.map((opt, oi) => (
              <label key={oi} className={`flex items-center gap-2 rounded-lg border bg-card px-2 ${q.correctIndex === oi ? "border-teal" : ""}`}>
                <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => update((s) => { s[qi].correctIndex = oi; return s; })} className="accent-teal" title="Mark as correct" />
                <Input value={opt} onChange={(e) => update((s) => { s[qi].options[oi] = e.target.value; return s; })} placeholder={`Option ${oi + 1}`} className="border-0 shadow-none focus-visible:ring-0" />
                <button type="button" aria-label="Remove option" onClick={() => update((s) => { s[qi].options.splice(oi, 1); if (s[qi].correctIndex >= s[qi].options.length) s[qi].correctIndex = 0; return s; })} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
              </label>
            ))}
            <Button type="button" variant="ghost" size="sm" className="justify-start" onClick={() => update((s) => { s[qi].options.push(""); return s; })}><Plus className="size-3.5" aria-hidden /> Add option</Button>
            <div className="sm:col-span-2"><Input value={q.explanation ?? ""} onChange={(e) => update((s) => { s[qi].explanation = e.target.value; return s; })} placeholder="Explanation shown after submission (optional)" className="bg-card" /></div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => update((s) => { s.push({ text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }); return s; })}>
        <Plus className="size-4" aria-hidden /> Add question
      </Button>

      <details className="rounded-xl border bg-card p-4">
        <summary className="cursor-pointer text-sm font-semibold text-navy">Bulk import questions (paste from a spreadsheet)</summary>
        <p className="mt-2 text-xs text-muted-foreground">One question per line: <code className="font-mono">Question | Option A | Option B | Option C | Option D | 2 | Explanation</code> — the number is the correct option (1–4). Explanation is optional.</p>
        <Textarea rows={6} value={bulk} onChange={(e) => setBulk(e.target.value)} className="mt-2 font-mono text-xs" placeholder="What is 2+2? | 3 | 4 | 5 | 6 | 2 | Basic arithmetic" />
        <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => { const parsed = parseBulk(bulk); if (parsed.length) { update((s) => [...s, ...parsed]); setBulk(""); } }}>
          Append {parseBulk(bulk).length || ""} parsed question{parseBulk(bulk).length === 1 ? "" : "s"}
        </Button>
      </details>
    </div>
  );
}
