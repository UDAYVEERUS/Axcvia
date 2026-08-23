import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { site } from "@/lib/data/site";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/site/print-button";

export const metadata: Metadata = { title: "Certificate of Completion", robots: { index: false } };
export const dynamic = "force-dynamic";

// Publicly verifiable by URL — the ID is an unguessable ObjectId.
export default async function CertificatePage({ params }: PageProps<"/certificate/[id]">) {
  const { id } = await params;
  if (!isDbConfigured()) notFound();
  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const e: any = await EnrollmentModel.findById(id).lean().catch(() => null);
  if (!e || !e.certificateIssuedAt) notFound();
  const certNo = `AXC-${String(e._id).slice(-8).toUpperCase()}`;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 print:p-0">
      <div className="mb-4 flex justify-end print:hidden"><PrintButton /></div>
      <div className="relative overflow-hidden rounded-2xl border-8 border-double border-navy bg-white p-10 text-center text-navy shadow-xl sm:p-16 print:shadow-none">
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-teal/10" />
        <div aria-hidden className="absolute -bottom-20 -left-16 size-64 rounded-full bg-gold/15" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.3em] text-teal">{site.name}</p>
        <h1 className="relative mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Certificate of Completion</h1>
        <p className="relative mt-8 text-muted-foreground">This is to certify that</p>
        <p className="relative mt-2 text-3xl font-bold">{e.name}</p>
        <p className="relative mt-6 text-muted-foreground">has successfully completed the course</p>
        <p className="relative mt-2 text-2xl font-semibold">{e.courseTitle}</p>
        <p className="relative mt-8 text-sm text-muted-foreground">Issued on {formatDate(new Date(e.certificateIssuedAt).toISOString())}</p>
        <div className="relative mt-12 flex items-end justify-between text-left text-xs text-muted-foreground">
          <div><p className="font-mono">Certificate no. {certNo}</p><p>Verify at {site.url}/certificate/{String(e._id)}</p></div>
          <div className="text-right"><div className="mb-1 h-px w-40 bg-navy" /><p>Authorised signatory, {site.name}</p></div>
        </div>
      </div>
    </section>
  );
}
