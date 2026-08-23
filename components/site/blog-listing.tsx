import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/site/blog-card";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import type { BlogPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

export function BlogListing({
  posts,
  categories,
  activeCategory,
  eyebrow,
  title,
  description,
}: {
  posts: BlogPost[];
  categories: string[];
  activeCategory?: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const [lead, ...rest] = posts;
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        <Link href="/blog">
          <Badge
            variant={activeCategory ? "secondary" : "default"}
            className={activeCategory ? "hover:bg-teal/10" : "bg-navy hover:bg-navy"}
          >
            All posts
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/blog/category/${slugify(cat)}`}>
            <Badge
              variant={activeCategory === cat ? "default" : "secondary"}
              className={activeCategory === cat ? "bg-navy hover:bg-navy" : "hover:bg-teal/10"}
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No articles here yet — check back soon.</p>
      ) : (
        <>
          {lead && (
            <Reveal className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <BlogCard post={lead} featured />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {rest.slice(0, 2).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </Reveal>
          )}
          {rest.length > 2 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(2).map((post, i) => (
                <Reveal key={post.slug} delay={(i % 3) * 0.06}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
