"use client";

import { useAsyncApi } from "@/lib/use-async-api";

export default function StudentCoursesPage() {
  const { data, loading, error } = useAsyncApi<{ items: any[] }>("/api/v1/student/courses");

  if (loading) return <p className="text-sm text-slate-600">Loading courses...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load courses."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <div className="mt-6 space-y-4">
        {data.items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{item.course.title}</p>
            <p className="text-sm text-slate-600">{item.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
