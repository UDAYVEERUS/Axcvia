import { Reveal } from "@/components/site/motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  /** Use "h1" for the page's primary heading. */
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal sm:text-sm">{eyebrow}</p>
      )}
      <Heading className="mt-2 text-[1.75rem] font-extrabold leading-tight text-navy sm:text-4xl">{title}</Heading>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </Reveal>
  );
}
