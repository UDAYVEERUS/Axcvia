import type { Model } from "mongoose";
import { connectDb, isDbConfigured } from "@/lib/db";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared read path for every content type: the site runs on the static seed
 * until entries are added from the admin dashboard. Database entries are
 * merged over the seed by slug, so saving an entry with a seeded slug
 * overrides it (and saving it unpublished hides it). Any DB failure falls back
 * to the seed so the public site never breaks.
 */
export async function loadMerged<T extends { slug: string }>(
  seed: T[],
  model: Model<any>,
  toItem: (doc: any) => T,
  sort?: Record<string, 1 | -1>
): Promise<T[]> {
  const bySlug = new Map<string, T | null>(seed.map((item) => [item.slug, item]));
  if (!isDbConfigured()) return seed;
  try {
    await connectDb();
    const docs = await model.find().sort(sort ?? { createdAt: -1 }).lean();
    for (const doc of docs) {
      // Unpublished DB entries hide the seed entry with the same slug.
      bySlug.set(doc.slug, doc.isPublished === false ? null : toItem(doc));
    }
  } catch (err) {
    console.error(`Failed to load ${model.modelName} from DB, using static seed:`, err);
    return seed;
  }
  return [...bySlug.values()].filter((item): item is T => item !== null);
}

/** Admin listing: seed rows plus every DB row (including unpublished ones). */
export async function loadForAdmin<T extends { slug: string }>(
  seed: T[],
  model: Model<any>,
  toItem: (doc: any) => T
): Promise<{
  rows: (T & { source: "seed" | "database"; isPublished: boolean })[];
  dbReady: boolean;
}> {
  type Row = T & { source: "seed" | "database"; isPublished: boolean };
  const bySlug = new Map<string, Row>(
    seed.map((item) => [item.slug, { ...item, source: "seed", isPublished: true }])
  );
  if (!isDbConfigured()) return { rows: [...bySlug.values()], dbReady: false };
  try {
    await connectDb();
    const docs = await model.find().sort({ createdAt: -1 }).lean();
    for (const doc of docs) {
      bySlug.set(doc.slug, {
        ...toItem(doc),
        source: "database" as const,
        isPublished: doc.isPublished !== false,
      });
    }
    return { rows: [...bySlug.values()], dbReady: true };
  } catch {
    return { rows: [...bySlug.values()], dbReady: false };
  }
}

export function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}
