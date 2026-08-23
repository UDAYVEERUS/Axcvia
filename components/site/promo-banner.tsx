import Link from "next/link";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";
import { site } from "@/lib/data/site";
import type { SiteSettings } from "@/lib/types";

export function PromoBanner({ settings }: { settings: SiteSettings }) {
  if (!settings.promoEnabled) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Reveal>
        <div className="grid gap-6 overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-r from-gold/15 via-card to-teal/10 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-deep"><Sparkles className="size-4" aria-hidden /> Limited offer</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">{settings.promoTitle}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{settings.promoText}</p>
            {settings.promoCode && (
              <p className="mt-3 text-sm">Use code <span className="rounded-md bg-navy px-2 py-1 font-mono font-bold text-white">{settings.promoCode}</span> at checkout</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90"><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle className="size-4" aria-hidden /> WhatsApp now</a></Button>
            <Button asChild size="lg" variant="outline"><a href={`tel:${site.phone.replace(/\s/g, "")}`}><Phone className="size-4" aria-hidden /> Call now</a></Button>
            <Button asChild size="lg" variant="ghost" className="text-navy"><Link href="/courses">Enroll now →</Link></Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
