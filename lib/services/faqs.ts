import type { Faq } from "@/lib/types";
import { faqs as staticFaqs } from "@/lib/data/people";
import { FaqModel } from "@/lib/models/faq";
import { loadMerged } from "@/lib/services/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toFaq(doc: any): Faq {
  return {
    slug: doc.slug,
    question: doc.question,
    answer: doc.answer ?? "",
    category: doc.category ?? "General",
  };
}

export function getAllFaqs() {
  return loadMerged(staticFaqs, FaqModel, toFaq);
}
