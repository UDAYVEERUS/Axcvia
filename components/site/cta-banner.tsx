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
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-10 sm:px-12 sm:py-14">
          <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-teal-bright/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-28 -left-16 size-72 rounded-full bg-teal/30 blur-3xl" />
          <div className="relative grid items-center gap-6 text-center lg:grid-cols-[1fr_auto] lg:text-left">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{title}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/75 lg:mx-0">{description}</p>
            </div>
            <Button asChild size="lg" className="mx-auto bg-white text-navy hover:bg-white/90 lg:mx-0">
              <Link href={href}>
                {buttonLabel} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
