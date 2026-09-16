import { Navbar, type NavGroup } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CartProvider } from "@/components/site/cart-provider";
import { LeadPopup } from "@/components/site/lead-popup";
import { StickyBar } from "@/components/site/sticky-bar";
import { site } from "@/lib/data/site";
import { getCatalogNav, getCourseOptions } from "@/lib/services/courses";
import { getLandingNav, getSettings } from "@/lib/services/lms";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [landingGroups, settings, courseOptions, catalog] = await Promise.all([
    getLandingNav(),
    getSettings(),
    getCourseOptions(),
    getCatalogNav(),
  ]);
  // Landing pages can target the same menu ("Mock Tests") or its old name
  // ("Classes"), so merge by label and drop duplicate links.
  const byLabel = new Map<string, NavGroup>();
  for (const g of [
    { label: "Courses", href: "/courses", items: [{ label: "All courses", href: "/courses?type=classes" }, ...catalog.classes] },
    { label: "Mock Tests", href: "/mock-tests", items: [{ label: "All mock test series", href: "/mock-tests" }, ...catalog.mockTests] },
    ...landingGroups,
  ]) {
    const label = g.label === "Classes" ? "Courses" : g.label;
    const existing = byLabel.get(label);
    if (!existing) byLabel.set(label, { ...g, label, items: [...g.items] });
    else existing.items.push(...g.items.filter((i) => !existing.items.some((e) => e.href === i.href)));
  }
  const groups = [...byLabel.values()];
  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              alternateName: `${site.name} — ${site.tagline}`,
              description: site.description,
              url: site.url,
              logo: `${site.url}/logo.png`,
              image: `${site.url}/logo.png`,
              telephone: site.phone,
              email: site.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: site.address,
                addressLocality: "Kanpur",
                addressRegion: "Uttar Pradesh",
                addressCountry: "IN",
              },
              areaServed: { "@type": "Country", name: "India" },
              knowsLanguage: ["en", "hi"],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: site.phone,
                email: site.email,
                contactType: "admissions",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
              },
              openingHours: "Mo-Sa 09:00-20:00",
              sameAs: Object.values(site.social),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              name: site.name,
              url: site.url,
              publisher: { "@id": `${site.url}/#organization` },
              inLanguage: "en-IN",
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${site.url}/courses?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
          ]),
        }}
      />
      <Navbar groups={groups} announcement={settings.announcement} />
      <main className="flex-1 pb-14 lg:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <StickyBar />
      {settings.popupEnabled && (
        <LeadPopup
          delaySeconds={settings.popupDelaySeconds}
          courseOptions={courseOptions}
          promoTitle={settings.promoTitle}
          promoText={settings.promoText}
          promoCode={settings.promoCode}
        />
      )}
    </CartProvider>
  );
}
