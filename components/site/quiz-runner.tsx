"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitQuizAction, type QuizResult } from "@/app/student-actions";
import type { Quiz } from "@/lib/types";

// Question payload stripped of answers for the live attempt.
export interface PublicQuestion {
  text: string;
  options: string[];
}

export interface ReviewQuestion extends PublicQuestion {
  correctIndex: number;
  explanation?: string;
}

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizRunner({
  quiz,
  questions,
  courseSlug,
  review,
}: {
  quiz: Pick<Quiz, "slug" | "title" | "description" | "durationMinutes" | "passingPercent" | "shuffle">;
  questions: PublicQuestion[];
  courseSlug: string;
  /** When reviewing a past attempt, full questions with answers plus the attempt. */
  review?: { questions: ReviewQuestion[]; result: QuizResult } | null;
}) {
  const [phase, setPhase] = useState<"intro" | "running" | "submitting" | "done">(review ? "done" : "intro");
  const [order, setOrder] = useState<number[]>(review?.result.order ?? []);
  const [answers, setAnswers] = useState<number[]>(review?.result.answers ?? []);
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(quiz.durationMinutes * 60);
  const [result, setResult] = useState<QuizResult | null>(review?.result ?? null);
  const [reviewQs, setReviewQs] = useState<ReviewQuestion[] | null>(review?.questions ?? null);
  const [error, setError] = useState("");
  const startedAt = useRef(0);

  function start() {
    const o = quiz.shuffle ? shuffled(questions.length) : questions.map((_, i) => i);
    setOrder(o);
    setAnswers(Array(o.length).fill(-1));
    setCurrent(0);
    setSecondsLeft(quiz.durationMinutes * 60);
    startedAt.current = Date.now();
    setResult(null);
    setReviewQs(null);
    setPhase("running");
  }

  async function submit() {
    setPhase("submitting");
    const res = await submitQuizAction({ quizSlug: quiz.slug, order, answers, timeTakenSeconds: Math.round((Date.now() - startedAt.current) / 1000) });
    if ("error" in res) {
      setError(res.error);
      setPhase("running");
      return;
    }
    setResult(res);
    // Fetch full questions (with answers) for the review screen.
    const r = await fetch(`/api/quizzes/${quiz.slug}/review?attempt=${res.attemptId}`);
    if (r.ok) setReviewQs((await r.json()).questions);
    setPhase("done");
  }

  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  });
  useEffect(() => {
    if (phase !== "running" || !quiz.durationMinutes) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          submitRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, quiz.durationMinutes]);

  const answered = useMemo(() => answers.filter((a) => a >= 0).length, [answers]);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (phase === "intro") {
    return (
      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-navy">{quiz.title}</h1>
        {quiz.description && <p className="mt-2 text-muted-foreground">{quiz.description}</p>}
        <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-3">
          <li className="rounded-lg bg-secondary/50 p-3"><span className="block text-xs uppercase tracking-wider text-muted-foreground">Questions</span><span className="font-bold text-navy">{questions.length}</span></li>
          <li className="rounded-lg bg-secondary/50 p-3"><span className="block text-xs uppercase tracking-wider text-muted-foreground">Time limit</span><span className="font-bold text-navy">{quiz.durationMinutes ? `${quiz.durationMinutes} min` : "None"}</span></li>
          <li className="rounded-lg bg-secondary/50 p-3"><span className="block text-xs uppercase tracking-wider text-muted-foreground">Pass mark</span><span className="font-bold text-navy">{quiz.passingPercent}%</span></li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">You&apos;ll see your score and the explanation for every question instantly after submitting. You can re-attempt as many times as you like.</p>
        <Button size="lg" className="mt-6 bg-teal text-white hover:bg-teal/90" onClick={start} disabled={questions.length === 0}>Start test</Button>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div className="space-y-6">
        <div className={`rounded-xl border p-6 sm:p-8 ${result.passed ? "border-teal/40 bg-teal/5" : "border-destructive/30 bg-destructive/5"}`}>
          {result.passed ? <CheckCircle2 className="size-12 text-teal" aria-hidden /> : <XCircle className="size-12 text-destructive" aria-hidden />}
          <h1 className="mt-3 text-2xl font-bold text-navy">{result.passed ? "Passed!" : "Not quite — keep practising"}</h1>
          <p className="mt-1 text-lg">
            <span className="font-extrabold text-navy">{result.score}/{result.total}</span> correct · <span className="font-semibold">{result.percent}%</span> (pass mark {quiz.passingPercent}%)
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button className="bg-teal text-white hover:bg-teal/90" onClick={start}><RotateCcw className="size-4" aria-hidden /> Re-attempt</Button>
            <Button asChild variant="outline"><Link href="/dashboard/results">All results</Link></Button>
            <Button asChild variant="ghost"><Link href={courseSlug ? `/learn/${courseSlug}` : "/dashboard"}>Back to course</Link></Button>
          </div>
        </div>
        {reviewQs && (
          <ol className="space-y-4">
            {result.order.map((qIdx, i) => {
              const q = reviewQs[qIdx];
              const chosen = result.answers[i];
              const correct = chosen === q.correctIndex;
              return (
                <li key={i} className="rounded-xl border bg-card p-5">
                  <p className="font-medium text-navy"><span className="mr-2 text-muted-foreground">Q{i + 1}.</span>{q.text}</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {q.options.map((opt, oi) => (
                      <li key={oi} className={`rounded-md border px-3 py-2 ${oi === q.correctIndex ? "border-teal bg-teal/10 font-medium" : oi === chosen ? "border-destructive bg-destructive/10" : ""}`}>
                        {opt}
                        {oi === q.correctIndex && <span className="ml-2 text-xs text-teal">Correct</span>}
                        {oi === chosen && oi !== q.correctIndex && <span className="ml-2 text-xs text-destructive">Your answer</span>}
                      </li>
                    ))}
                  </ul>
                  {chosen < 0 && <p className="mt-2 text-xs text-muted-foreground">Not answered</p>}
                  {q.explanation && <p className={`mt-3 rounded-md p-3 text-sm ${correct ? "bg-secondary/50" : "bg-gold/10"}`}><strong>Explanation:</strong> {q.explanation}</p>}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  const qIdx = order[current];
  const q = questions[qIdx];
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <p className="font-semibold text-navy">{quiz.title}</p>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{answered}/{order.length} answered</span>
          {quiz.durationMinutes > 0 && (
            <span className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono font-semibold ${secondsLeft < 60 ? "bg-destructive/10 text-destructive" : "bg-secondary text-navy"}`}>
              <Clock className="size-4" aria-hidden /> {mm}:{ss}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal">Question {current + 1} of {order.length}</p>
        <p className="mt-2 text-lg font-medium text-navy">{q.text}</p>
        <div className="mt-4 space-y-2">
          {q.options.map((opt, oi) => (
            <label key={oi} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm hover:bg-accent ${answers[current] === oi ? "border-teal bg-teal/5" : ""}`}>
              <input type="radio" name={`q-${current}`} checked={answers[current] === oi} onChange={() => setAnswers((a) => a.map((v, i) => (i === current ? oi : v)))} className="mt-0.5 accent-teal" />
              {opt}
            </label>
          ))}
        </div>
        {error && <p className="mt-3 flex items-center gap-1.5 text-sm text-destructive"><AlertTriangle className="size-4" aria-hidden /> {error}</p>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</Button>
          <div className="flex gap-2">
            {current < order.length - 1 ? (
              <Button className="bg-navy text-white hover:bg-navy/90" onClick={() => setCurrent((c) => c + 1)}>Next</Button>
            ) : null}
            <Button className="bg-teal text-white hover:bg-teal/90" disabled={phase === "submitting"} onClick={submit}>
              {phase === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden />} Submit test
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Question navigator">
          {order.map((_, i) => (
            <button key={i} type="button" onClick={() => setCurrent(i)} className={`size-8 rounded-md border text-xs font-medium ${i === current ? "border-teal bg-teal text-white" : answers[i] >= 0 ? "bg-teal/10 text-navy" : "text-muted-foreground"}`} aria-label={`Go to question ${i + 1}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
