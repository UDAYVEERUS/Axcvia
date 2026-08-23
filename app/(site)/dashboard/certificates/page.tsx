import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/student/auth";
import { getStudentEnrollments } from "@/lib/student/enrollments";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Certificates", robots: { index: false } };

export default async function CertificatesPage() {
  const student = (await getCurrentStudent())!;
  const issued = (await getStudentEnrollments(student.id)).filter((e) => e.certificateIssuedAt);
  if (issued.length === 0) return <p className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">Complete all lessons in a course to earn its certificate of completion.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {issued.map((e) => (
        <div key={e.id} className="flex items-start gap-4 rounded-xl border bg-card p-5">
          <Award className="size-10 shrink-0 text-gold" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-navy">{e.courseTitle}</p>
            <p className="text-xs text-muted-foreground">Issued {formatDate(e.certificateIssuedAt!)}</p>
            <Button asChild size="sm" variant="outline" className="mt-3"><Link href={`/certificate/${e.id}`} target="_blank">View / print certificate</Link></Button>
          </div>
        </div>
      ))}
    </div>
  );
}
