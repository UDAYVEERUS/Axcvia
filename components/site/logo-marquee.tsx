import { hiringPartners } from "@/lib/data/site";

function LogoRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex w-max shrink-0 items-center gap-6 pr-6" aria-hidden={ariaHidden}>
      {hiringPartners.map((partner) => (
        <div
          key={partner.name}
          className="flex items-center gap-3 rounded-2xl border bg-card px-6 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-md"
        >
          {/* Plain <img>: the favicon service redirects across hosts, so next/image
              optimization is skipped for these tiny logos. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            className="size-7 rounded-md object-contain"
          />
          <span className="whitespace-nowrap text-sm font-semibold text-foreground/70">
            {partner.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LogoMarquee() {
  return (
    <div
      className="group relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      role="list"
      aria-label="Hiring network companies"
    >
      <div className="flex w-max [animation:marquee-x_38s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
        <LogoRow />
        <LogoRow ariaHidden />
      </div>
    </div>
  );
}
