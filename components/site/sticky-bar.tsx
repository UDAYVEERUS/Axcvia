import Link from "next/link";
import { MessageCircle, Phone, ShoppingBag, UserRound } from "lucide-react";
import { site } from "@/lib/data/site";

// Mobile-only bottom action bar (Call / WhatsApp / Enroll / Login).
export function StickyBar() {
  const items = [
    { href: `tel:${site.phone.replace(/\s/g, "")}`, label: "Call", icon: Phone, external: true },
    { href: `https://wa.me/${site.whatsapp}`, label: "WhatsApp", icon: MessageCircle, external: true },
    { href: "/courses", label: "Enroll", icon: ShoppingBag, external: false },
    { href: "/dashboard", label: "Account", icon: UserRound, external: false },
  ];
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background/95 backdrop-blur lg:hidden">
      {items.map((it) =>
        it.external ? (
          <a key={it.label} href={it.href} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-foreground/80">
            <it.icon className="size-5 text-teal" aria-hidden /> {it.label}
          </a>
        ) : (
          <Link key={it.label} href={it.href} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-foreground/80">
            <it.icon className="size-5 text-teal" aria-hidden /> {it.label}
          </Link>
        )
      )}
    </nav>
  );
}
