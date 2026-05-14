import Link from "next/link";
import { api } from "@/lib/api";

export default async function StudentDashboardPage() {
  const data = await api<{
    stats: { coursesEnrolled: number; liveClasses: number; assignments: number; testScore: number };
    enrollments: any[];
    liveClasses: any[];
    assignments: any[];
    announcements: any[];
  }>("/api/v1/student/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Ankit Sharma</h1>
        <p className="mt-2 text-slate-600">Track your learning, classes, and progress in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Courses Enrolled", data.stats.coursesEnrolled],
          ["Live Classes", data.stats.liveClasses],
          ["Assignments", data.stats.assignments],
          ["Test Score", `${data.stats.testScore}%`],
        ].map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <section className="card p-6">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {data.enrollments.map((enrollment) => (
            <div key={enrollment.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold">{enrollment.course.title}</p>
              <p className="mt-1 text-sm text-slate-600">{enrollment.course.university.name}</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-brand" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{enrollment.progress}% complete</p>
              <Link href={`/learn/${enrollment.course.slug}`} className="btn-primary mt-4 inline-flex">
                Continue
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Upcoming Live Classes</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.liveClasses.map((item) => (
              <li key={item.id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-slate-600">{new Date(item.startsAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.announcements.map((item) => (
              <li key={item.id} className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium">{item.title}</p>
                <p className="text-slate-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
    </div>
  );
}

const motionStatCard = StatCard;
