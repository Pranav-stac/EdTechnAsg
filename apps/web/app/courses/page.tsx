import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { CourseCard } from "@/components/courses/course-card";
import { api } from "@/lib/api";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  if (!query.get("pageSize")) query.set("pageSize", "12");

  const [courses, universities] = await Promise.all([
    api<{ items: any[]; total: number; page: number; pageSize: number }>(`/api/v1/courses?${query.toString()}`),
    api<{ items: any[] }>("/api/v1/universities"),
  ]);

  const totalPages = Math.max(1, Math.ceil(courses.total / courses.pageSize));

  return (
    <PublicShell>
      <div className="container-page py-10">
        <p className="text-sm text-slate-500">Home / Online Degrees / Online MBA</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Online MBA Programs</h1>
            <p className="mt-2 text-slate-600">{courses.total}+ programs available</p>
          </div>
        </div>

        <form method="get" className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5">
          <input name="search" defaultValue={String(params.search || "")} placeholder="Search" className="input" />
          <input name="specialization" defaultValue={String(params.specialization || "")} placeholder="Specialization" className="input" />
          <select name="university" defaultValue={String(params.university || "")} className="input">
            <option value="">All universities</option>
            {universities.items.map((university) => (
              <option key={university.id} value={university.slug}>
                {university.name}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={String(params.sort || "popular")} className="input">
            <option value="popular">Sort by popularity</option>
            <option value="fee_asc">Fee: low to high</option>
            <option value="fee_desc">Fee: high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <button className="btn-primary">Apply Filters</button>
        </form>

        <div className="mt-8 grid gap-6">
          {courses.items.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
            const page = index + 1;
            const nextQuery = new URLSearchParams(query);
            nextQuery.set("page", String(page));
            return (
              <Link key={page} href={`/courses?${nextQuery.toString()}`} className="rounded-xl border px-4 py-2 text-sm">
                {page}
              </Link>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
}
