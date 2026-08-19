import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";

export function CtaBanner({
  title = "Not sure which course fits your goals?",
  description = "Talk to a career counsellor for free. We'll map your background to the right learning path and share real placement outcomes.",
  buttonLabel = "Get Free Counselling",
  href = "/contact",
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-12 text-center sm:px-12">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 size-64 rounded-full bg-teal/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 size-64 rounded-full bg-gold/20 blur-3xl"
          />
          <h2 className="relative text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-white/75">{description}</p>
          <Button
            asChild
            size="lg"
            className="relative mt-7 bg-gold text-navy-deep hover:bg-gold/90"
          >
            <Link href={href}>
              {buttonLabel} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
