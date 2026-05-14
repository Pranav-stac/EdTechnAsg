import Link from "next/link";
import { TRUST_METRICS } from "@manzilchaser/shared";
import { PublicShell } from "@/components/layout/public-shell";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";

export default async function HomePage() {
  const [courses, categories, testimonials, partners] = await Promise.all([
    api<{ items: any[] }>("/api/v1/courses?pageSize=6"),
    api<{ items: any[] }>("/api/v1/categories"),
    api<{ items: any[] }>("/api/v1/testimonials"),
    api<{ items: any[] }>("/api/v1/partners"),
  ]);

  return (
    <PublicShell>
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="badge bg-white/10 text-white">Live Classes · Top Universities · 4.8/5 Student Rating</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Admissions. Learning. Careers. Global Skills.
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              Your trusted partner from school to success with counseling, learning, and career outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary bg-white text-brand hover:bg-slate-100">
                Explore Courses
              </Link>
              <Link href="/courses?search=MBA" className="btn-secondary border-white text-white hover:bg-white/10">
                Talk to Expert
              </Link>
            </div>
          </div>
          <div className="card bg-white/10 p-8 backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-3">
              {["Live Classes", "Top Universities", "4.8/5 Rating"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-center text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_METRICS.map((metric) => (
            <div key={metric.label} className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-2xl font-bold text-brand">{metric.value}</p>
              <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Top Categories</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.items.map((category) => (
            <Link
              key={category.id}
              href={`/courses?category=${category.slug}`}
              className="card p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-lg font-semibold">{category.name}</p>
              <p className="mt-2 text-sm text-slate-600">{category.description || "Explore programs and enroll with confidence."}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand py-16 text-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Compare. Decide. Enroll.</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl bg-white/10">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4">University</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Accreditation</th>
                </tr>
              </thead>
              <tbody>
                {["Amity University", "Manipal University", "LPU"].map((name) => (
                  <tr key={name} className="border-b border-white/10">
                    <td className="p-4">{name}</td>
                    <td className="p-4">2 Years</td>
                    <td className="p-4">Online</td>
                    <td className="p-4">UGC Approved</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="section-title">Popular Courses</h2>
          <Link href="/courses" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        <PopularCourses courses={courses.items} />
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="section-title">Top Universities & Partners</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {partners.items.map((partner) => (
              <div key={partner.id} className="card px-6 py-4 text-sm font-semibold">
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Success Stories</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.items.map((item) => (
            <blockquote key={item.id} className="card p-6">
              <p className="text-slate-700">“{item.quote}”</p>
              <footer className="mt-4 text-sm font-semibold text-brand">
                {item.name} · {item.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

function PopularCourses({ courses }: { courses: any[] }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

const motionPopularCourses = PopularCourses;
