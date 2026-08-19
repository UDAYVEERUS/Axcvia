import Link from "next/link";
import { ArrowRight, BookOpen, Database, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses as staticCourses } from "@/lib/data/courses";
import { connectDb, isDbConfigured } from "@/lib/db";
import { CourseModel } from "@/lib/models/course";
import { LeadModel } from "@/lib/models/lead";

async function getCounts() {
  if (!isDbConfigured()) {
    return { dbCourses: 0, leads: 0, newLeads: 0, dbReady: false };
  }
  try {
    await connectDb();
    const [dbCourses, leads, newLeads] = await Promise.all([
      CourseModel.countDocuments(),
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ status: "new" }),
    ]);
    return { dbCourses, leads, newLeads, dbReady: true };
  } catch {
    return { dbCourses: 0, leads: 0, newLeads: 0, dbReady: false };
  }
}

export default async function AdminOverviewPage() {
  const { dbCourses, leads, newLeads, dbReady } = await getCounts();

  const cards = [
    {
      title: "Live Courses",
      value: staticCourses.length + dbCourses,
      hint: `${staticCourses.length} seeded · ${dbCourses} from dashboard`,
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      title: "Total Leads",
      value: leads,
      hint: dbReady ? `${newLeads} new & uncontacted` : "Connect MongoDB to collect leads",
      icon: Inbox,
      href: "/admin/leads",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage your training courses and student enquiries.
          </p>
        </div>
        <Badge
          variant={dbReady ? "secondary" : "outline"}
          className={dbReady ? "bg-teal/10 text-teal" : "text-muted-foreground"}
        >
          <Database className="mr-1 size-3" aria-hidden />
          {dbReady ? "MongoDB connected" : "MongoDB not connected — showing static seed data"}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="size-4 text-teal" aria-hidden />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-navy">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-teal">
                <Link href={card.href}>
                  Manage <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!dbReady && (
        <Card className="mt-6">
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-navy">Running on static seed data</p>
            <p className="mt-2">
              The website currently shows the {staticCourses.length} seeded courses defined in{" "}
              <code className="font-mono text-xs">lib/data/courses.ts</code>. To add or edit
              courses from this dashboard and start collecting enquiry leads, set{" "}
              <code className="font-mono text-xs">MONGODB_URI</code> in your environment (MongoDB
              Atlas free tier works). Courses you add here are merged over the seed — using the
              same slug as a seeded course overrides it.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
