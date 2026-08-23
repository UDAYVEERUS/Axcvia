import type { PlacementStory } from "@/lib/types";
import { placementStories as staticStories } from "@/lib/data/people";
import { PlacementModel } from "@/lib/models/placement";
import { loadMerged } from "@/lib/services/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toPlacement(doc: any): PlacementStory {
  return {
    slug: doc.slug,
    studentName: doc.studentName,
    background: doc.background ?? "",
    company: doc.company ?? "",
    role: doc.role ?? "",
    packageLpa: doc.packageLpa ?? 0,
    year: doc.year ?? new Date().getFullYear(),
    courseTitle: doc.courseTitle ?? "",
  };
}

export function getAllPlacements() {
  return loadMerged(staticStories, PlacementModel, toPlacement);
}
