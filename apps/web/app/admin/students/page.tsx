"use client";

import { useAsyncApi } from "@/lib/use-async-api";

export default function AdminStudentsPage() {
  const { data, loading, error } = useAsyncApi<{ items: any[] }>("/api/v1/admin/students");

  if (loading) return <p className="text-sm text-slate-600">Loading students...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load students."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Students</h1>
      <div className="mt-6 space-y-4">
        {data.items.map((student) => (
          <div key={student.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-slate-600">{student.email || student.phone}</p>
            <p className="mt-2 text-sm text-slate-600">{student.enrollments.length} enrollments</p>
          </div>
        ))}
      </div>
    </div>
  );
}
