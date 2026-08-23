import type { Trainer } from "@/lib/types";
import { trainers as staticTrainers } from "@/lib/data/people";
import { TrainerModel } from "@/lib/models/trainer";
import { loadMerged, strings } from "@/lib/services/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toTrainer(doc: any): Trainer {
  return {
    name: doc.name,
    slug: doc.slug,
    role: doc.role ?? "",
    bio: doc.bio ?? "",
    expertise: strings(doc.expertise),
    experienceYears: doc.experienceYears ?? 0,
    linkedin: doc.linkedin ?? "",
    photo: doc.photo ?? "",
  };
}

export function getAllTrainers() {
  return loadMerged(staticTrainers, TrainerModel, toTrainer);
}

export async function getTrainerBySlug(slug: string) {
  if (!slug) return undefined;
  return (await getAllTrainers()).find((t) => t.slug === slug);
}
