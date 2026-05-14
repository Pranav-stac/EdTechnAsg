"use client";

import { AdminCoursesManager } from "@/components/admin/courses-manager";
import { useAsyncApi } from "@/lib/use-async-api";

export default function AdminCoursesPage() {
  const { data, loading, error } = useAsyncApi<{ items: any[] }>("/api/v1/admin/courses");

  if (loading) return <p className="text-sm text-slate-600">Loading courses...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load courses."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <AdminCoursesManager initialItems={data.items} />
    </div>
  );
}
