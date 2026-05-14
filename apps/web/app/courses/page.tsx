import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { api } from "@/lib/api";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  if (!query.get("pageSize")) query.set("pageSize", "12");

  const [courses, universities, categories] = await Promise.all([
    api<{ items: any[]; total: number; page: number; pageSize: number }>(`/api/v1/courses?${query.toString()}`),
    api<{ items: any[] }>("/api/v1/universities"),
    api<{ items: any[] }>("/api/v1/categories"),
  ]);

  const totalPages = Math.max(1, Math.ceil(courses.total / courses.pageSize));
  const heading = params.search
    ? String(params.search)
    : params.category
      ? categories.items.find((item) => item.slug === params.category)?.name || "Programs"
      : "Online MBA Programs";

  return (
    <PublicShell>
      <div className="border-b border-surface-line bg-white">
        <div className="container-page py-8">
          <p className="text-sm text-slate-500">Home / Online Degrees / {heading}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{heading}</h1>
          <p className="mt-2 text-slate-600">
            {courses.total}+ programs available with live classes, placement support, and expert counseling.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit">
          <form method="get" className="surface-panel space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Search</p>
              <input name="search" defaultValue={String(params.search || "")} placeholder="MBA, B.Tech, coding..." className="input mt-2" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Specialization</p>
              <input name="specialization" defaultValue={String(params.specialization || "")} placeholder="Finance, HR, IT..." className="input mt-2" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Category</p>
              <select name="category" defaultValue={String(params.category || "")} className="input mt-2">
                <option value="">All categories</option>
                {categories.items.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">University</p>
              <select name="university" defaultValue={String(params.university || "")} className="input mt-2">
                <option value="">All universities</option>
                {universities.items.map((university) => (
                  <option key={university.id} value={university.slug}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Min fee</p>
                <input name="feeMin" type="number" defaultValue={String(params.feeMin || "")} placeholder="50000" className="input mt-2" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Max fee</p>
                <input name="feeMax" type="number" defaultValue={String(params.feeMax || "")} placeholder="300000" className="input mt-2" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Sort by</p>
              <select name="sort" defaultValue={String(params.sort || "popular")} className="input mt-2">
                <option value="popular">Popularity</option>
                <option value="fee_asc">Fee: low to high</option>
                <option value="fee_desc">Fee: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
            <button className="btn-primary w-full">Apply Filters</button>
          </form>
        </aside>

        <div>
          <CourseCatalog courses={courses.items} />
          <div className="mt-8 flex flex-wrap gap-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
              const page = index + 1;
              const nextQuery = new URLSearchParams(query);
              nextQuery.set("page", String(page));
              return (
                <Link
                  key={page}
                  href={`/courses?${nextQuery.toString()}`}
                  className={`rounded-xl border px-4 py-2 text-sm ${
                    String(params.page || "1") === String(page) ? "border-brand bg-brand text-white" : "border-surface-line bg-white"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
