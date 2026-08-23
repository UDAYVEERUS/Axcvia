import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HoverLift } from "@/components/site/motion";
import type { BlogPost } from "@/lib/types";
import { formatDate, slugify } from "@/lib/utils";

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <HoverLift className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-xl">
        <Link
          href={`/blog/${post.slug}`}
          className={featured ? "relative min-h-64 flex-1 overflow-hidden" : "relative h-48 shrink-0 overflow-hidden"}
        >
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-navy via-navy-deep to-teal" />
          )}
          <Badge className="absolute left-3 top-3 bg-gold text-navy-deep hover:bg-gold">
            {post.category}
          </Badge>
        </Link>
        <CardContent className={featured ? "flex shrink-0 flex-col" : "flex flex-1 flex-col"}>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {post.readingMinutes} min read
            </span>
          </div>
          <h3 className={featured ? "mt-3 text-xl font-bold text-navy" : "mt-3 text-lg font-bold leading-snug text-navy"}>
            <Link href={`/blog/${post.slug}`} className="hover:text-teal">
              {post.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/blog/tag/${slugify(tag)}`}>
                <Badge variant="secondary" className="hover:bg-teal/10 hover:text-teal">{tag}</Badge>
              </Link>
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-teal"
          >
            Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
