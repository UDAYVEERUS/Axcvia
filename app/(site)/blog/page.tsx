import type { Metadata } from "next";
import { BlogListing } from "@/components/site/blog-listing";
import { CtaBanner } from "@/components/site/cta-banner";
import { getAllPosts, getBlogCategories } from "@/lib/services/blog";

export const metadata: Metadata = {
  title: "Blog — Career Guides, Tutorials & Interview Prep",
  description:
    "Practical guides from Axcvia's trainers: programming roadmaps, Java vs Python, React interview questions, QA careers, and student placement stories.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getBlogCategories()]);
  return (
    <>
      <BlogListing
        posts={posts}
        categories={categories}
        eyebrow="Axcvia Blog"
        title="Learn before you enroll"
        description="Roadmaps, interview prep, honest career comparisons, and stories from students who made the switch — written by the trainers who teach our batches."
      />
      <CtaBanner
        title="Ready to go from reading to building?"
        description="Book a free demo class with the trainer who wrote the guide you just read."
        buttonLabel="Book a Free Demo"
      />
    </>
  );
}
