import Link from "next/link";
import { ArrowRight, BookOpen, Database, Inbox, Newspaper, Receipt, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts as staticPosts } from "@/lib/data/blog";
import { courses as staticCourses } from "@/lib/data/courses";
import { connectDb, isDbConfigured } from "@/lib/db";
import { BlogPostModel } from "@/lib/models/blog-post";
import { CourseModel } from "@/lib/models/course";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { OrderModel } from "@/lib/models/order";
import { StudentModel } from "@/lib/models/student";
import { formatInr } from "@/components/site/course-card";
import { LeadModel } from "@/lib/models/lead";

async function getCounts() {
  const empty = { dbCourses: 0, dbPosts: 0, leads: 0, newLeads: 0, enrollments: 0, pendingEnrollments: 0, students: 0, revenue: 0, pendingOrders: 0, dbReady: false };
  if (!isDbConfigured()) return empty;
  try {
    await connectDb();
    const [dbCourses, dbPosts, leads, newLeads, enrollments, pendingEnrollments, students, paidAgg, pendingOrders] = await Promise.all([
      CourseModel.countDocuments(),
      BlogPostModel.countDocuments(),
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ status: "new" }),
      EnrollmentModel.countDocuments(),
      EnrollmentModel.countDocuments({ status: "pending" }),
      StudentModel.countDocuments(),
      OrderModel.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      OrderModel.countDocuments({ status: "pending" }),
    ]);
    return { dbCourses, dbPosts, leads, newLeads, enrollments, pendingEnrollments, students, revenue: paidAgg[0]?.total ?? 0, pendingOrders, dbReady: true };
  } catch {
    return empty;
  }
}

export default async function AdminOverviewPage() {
  const { dbCourses, dbPosts, leads, newLeads, enrollments, pendingEnrollments, students, revenue, pendingOrders, dbReady } = await getCounts();

  const cards = [
    {
      title: "Live Courses",
      value: staticCourses.length + dbCourses,
      hint: `${staticCourses.length} seeded · ${dbCourses} from dashboard`,
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      title: "Revenue",
      value: formatInr(revenue),
      hint: dbReady ? `${pendingOrders} orders awaiting payment` : "Connect MongoDB",
      icon: Receipt,
      href: "/admin/orders",
    },
    {
      title: "Students",
      value: students,
      hint: "registered accounts",
      icon: Users,
      href: "/admin/students",
    },
    {
      title: "Blog Posts",
      value: staticPosts.length + dbPosts,
      hint: `${staticPosts.length} seeded · ${dbPosts} from dashboard`,
      icon: Newspaper,
      href: "/admin/blog",
    },
    {
      title: "Enrollments",
      value: enrollments,
      hint: dbReady ? `${pendingEnrollments} awaiting confirmation` : "Connect MongoDB to collect enrollments",
      icon: UserCheck,
      href: "/admin/enrollments",
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
            Manage courses, blog, faculty, testimonials, enrollments and enquiries.
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
