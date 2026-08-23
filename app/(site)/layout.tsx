import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { CartProvider } from "@/components/site/cart-provider";
import { LeadPopup } from "@/components/site/lead-popup";
import { StickyBar } from "@/components/site/sticky-bar";
import { site } from "@/lib/data/site";
import { getCourseOptions } from "@/lib/services/courses";
import { getLandingNav, getSettings } from "@/lib/services/lms";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [groups, settings, courseOptions] = await Promise.all([getLandingNav(), getSettings(), getCourseOptions()]);
  return (
    <CartProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: site.name,
            description: site.description,
            url: site.url,
            telephone: site.phone,
            email: site.email,
            address: { "@type": "PostalAddress", streetAddress: site.address },
            sameAs: Object.values(site.social),
          }),
        }}
      />
      <Navbar groups={groups} announcement={settings.announcement} />
      <main className="flex-1 pb-14 lg:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <StickyBar />
      {settings.popupEnabled && <LeadPopup delaySeconds={settings.popupDelaySeconds} courseOptions={courseOptions} />}
    </CartProvider>
  );
}
