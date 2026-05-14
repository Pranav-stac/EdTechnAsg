"use client";

import { useAsyncApi } from "@/lib/use-async-api";

export default function StudentLiveClassesPage() {
  const { data, loading, error } = useAsyncApi<{ liveClasses: any[] }>("/api/v1/student/dashboard");

  if (loading) return <p className="text-sm text-slate-600">Loading live classes...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load live classes."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Live Classes</h1>
      <ul className="mt-6 space-y-3">
        {data.liveClasses.map((item) => (
          <li key={item.id} className="rounded-xl bg-slate-50 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-600">{new Date(item.startsAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
