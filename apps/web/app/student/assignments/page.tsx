"use client";

import { AssignmentsPanel } from "@/components/student/assignments-panel";
import { useAsyncApi } from "@/lib/use-async-api";

export default function StudentAssignmentsPage() {
  const { data, loading, error } = useAsyncApi<{ items: any[] }>("/api/v1/student/assignments");

  if (loading) return <p className="text-sm text-slate-600">Loading assignments...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load assignments."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <AssignmentsPanel initialItems={data.items} />
    </div>
  );
}
