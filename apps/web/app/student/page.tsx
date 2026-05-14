import Link from "next/link";
import { BookOpen, CalendarDays, ClipboardList, Trophy } from "lucide-react";
import { api } from "@/lib/api";

export default async function StudentDashboardPage() {
  const data = await api<{
    stats: { coursesEnrolled: number; liveClasses: number; assignments: number; testScore: number };
    enrollments: any[];
    liveClasses: any[];
    assignments: any[];
    announcements: any[];
  }>("/api/v1/student/dashboard");

  const statItems = [
    { label: "Courses Enrolled", value: data.stats.coursesEnrolled, icon: BookOpen },
    { label: "Live Classes", value: data.stats.liveClasses, icon: CalendarDays },
    { label: "Assignments", value: data.stats.assignments, icon: ClipboardList },
    { label: "Test Score", value: `${data.stats.testScore}%`, icon: Trophy },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-hero-grid p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Student Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold">Welcome back, Ankit Sharma</h1>
        <p className="mt-2 max-w-2xl text-blue-100">Track your learning, classes, and progress in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <StudentStatCard key={item.label} item={item} Icon={Icon} />
          );
        })}
      </div>

      <section className="surface-panel">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <Link href="/student/courses" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        <StudentCourses enrollments={data.enrollments} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-panel">
          <h2 className="text-xl font-semibold">Upcoming Live Classes</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.liveClasses.map((item) => (
              <li key={item.id} className="rounded-2xl border border-surface-line bg-surface-muted p-4">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-slate-600">{new Date(item.startsAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface-panel">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.announcements.map((item) => (
              <li key={item.id} className="rounded-2xl border border-surface-line bg-surface-muted p-4">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-slate-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StudentStatCard({
  item,
  Icon,
}: {
  item: { label: string; value: string | number };
  Icon: typeof BookOpen;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{item.label}</p>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light text-brand">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-brand">{item.value}</p>
    </div>
  );
}

function StudentCourses({ enrollments }: { enrollments: any[] }) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {enrollments.map((enrollment) => (
        <div key={enrollment.id} className="overflow-hidden rounded-2xl border border-surface-line bg-white">
          <div className="h-28 bg-gradient-to-r from-brand to-brand-dark" />
          <div className="p-4">
            <p className="font-semibold text-slate-900">{enrollment.course.title}</p>
            <p className="mt-1 text-sm text-slate-600">{enrollment.course.university.name}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-brand" style={{ width: `${enrollment.progress}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{enrollment.progress}% complete</p>
            <Link href={`/learn/${enrollment.course.slug}`} className="btn-primary mt-4 inline-flex">
              Continue
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}