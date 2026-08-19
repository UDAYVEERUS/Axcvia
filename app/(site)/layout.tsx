import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { site } from "@/lib/data/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
