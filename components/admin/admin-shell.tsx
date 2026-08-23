import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Shared chrome for admin content list pages: heading, add button, flash messages.
export function AdminListHeader({
  title,
  subtitle,
  addHref,
  addLabel,
  flash,
  dbReady,
  seedNote,
}: {
  title: string;
  subtitle: string;
  addHref: string;
  addLabel: string;
  flash: { saved?: unknown; deleted?: unknown; error?: unknown };
  dbReady: boolean;
  seedNote: string;
}) {
  const { saved, deleted, error } = flash;
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button asChild className="bg-teal text-white hover:bg-teal/90">
          <Link href={addHref}>
            <Plus className="size-4" aria-hidden /> {addLabel}
          </Link>
        </Button>
      </div>
      {saved && <Flash tone="ok">Saved. Public pages have been refreshed.</Flash>}
      {deleted && <Flash tone="ok">Deleted.</Flash>}
      {error === "nodb" && (
        <Flash tone="error">
          MongoDB is not connected — changes can&apos;t be saved yet. Set MONGODB_URI in your
          environment first.
        </Flash>
      )}
      {!dbReady && !error && <Flash tone="muted">{seedNote}</Flash>}
    </>
  );
}

export function Flash({ tone, children }: { tone: "ok" | "error" | "muted"; children: React.ReactNode }) {
  const cls = {
    ok: "border-teal/30 bg-teal/5 text-teal",
    error: "border-destructive/30 bg-destructive/5 text-destructive",
    muted: "bg-card text-muted-foreground",
  }[tone];
  return <p className={`mt-4 rounded-lg border p-3 text-sm ${cls}`}>{children}</p>;
}

export function FormErrors({ error, required }: { error?: string; required: string }) {
  if (!error) return null;
  const msg = {
    missing: `${required} required.`,
    duplicate: "An entry with this slug already exists. Edit it instead, or choose a different slug.",
    nodb: "MongoDB is not connected — set MONGODB_URI before saving.",
  }[error];
  if (!msg) return null;
  return <Flash tone="error">{msg}</Flash>;
}

export function SourceBadge({ source }: { source: "seed" | "database" }) {
  return (
    <Badge variant="outline" className="text-muted-foreground">
      {source === "seed" ? "Static seed" : "Dashboard"}
    </Badge>
  );
}

export function PublishedBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <Badge variant="secondary" className={isPublished ? "bg-teal/10 text-teal" : "text-muted-foreground"}>
      {isPublished ? "Published" : "Hidden"}
    </Badge>
  );
}

export const selectCls =
  "border-input h-9 w-full rounded-lg border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
