import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or per-user areas: nothing here is useful in search results.
      disallow: ["/api/", "/admin/", "/dashboard/", "/learn/", "/cart", "/checkout", "/certificate/", "/login", "/register"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
