import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 text-center">
    <div className="flex size-16 items-center justify-center rounded-2xl bg-teal/10">
        <Compass className="size-8 text-teal" aria-hidden />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-teal">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
        This page took a wrong turn
      </h1>
      <p className="mt-4 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Maybe one of our courses
        is what you were after?
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-teal text-white hover:bg-teal/90">
          <Link href="/courses">Browse Courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden /> Back to Home
          </Link>
        </Button>
      </div>
    </section>
  );
}
