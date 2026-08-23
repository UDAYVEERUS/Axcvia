import Image from "next/image";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatInr } from "@/components/site/course-card";
import { HoverLift } from "@/components/site/motion";
import type { Bundle } from "@/lib/types";

export function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <HoverLift className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-xl">
        <Link href={`/bundles/${bundle.slug}`} className="relative h-44 overflow-hidden">
          {bundle.image ? <Image src={bundle.image} alt={bundle.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="h-full w-full bg-gradient-to-br from-navy to-teal" />}
          <Badge className="absolute left-3 top-3 bg-gold text-navy-deep hover:bg-gold"><Layers className="mr-1 size-3" aria-hidden /> Bundle · {bundle.courseSlugs.length} courses</Badge>
        </Link>
        <CardContent className="flex flex-1 flex-col">
          <h3 className="text-lg font-bold text-navy"><Link href={`/bundles/${bundle.slug}`} className="hover:text-teal">{bundle.title}</Link></h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{bundle.tagline}</p>
          <p className="mt-auto pt-4">
            <span className="text-xl font-extrabold text-navy">{formatInr(bundle.discountPrice)}</span>{" "}
            <span className="text-sm text-muted-foreground line-through">{formatInr(bundle.price)}</span>
            <Badge className="ml-2 bg-teal/10 text-teal hover:bg-teal/10">Save {formatInr(bundle.price - bundle.discountPrice)}</Badge>
          </p>
        </CardContent>
      </Card>
    </HoverLift>
  );
}
