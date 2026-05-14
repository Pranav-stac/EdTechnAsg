"use client";

import { useAsyncApi } from "@/lib/use-async-api";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { data, loading, error } = useAsyncApi<{
    leads: number;
    enrollments: number;
    revenue: number;
    activeLearners: number;
  }>("/api/v1/admin/analytics");

  if (loading) return <p className="text-sm text-slate-600">Loading analytics...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load analytics."}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CRM Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Leads", data.leads],
          ["Enrollments", data.enrollments],
          ["Revenue", formatCurrency(data.revenue)],
          ["Active Learners", data.activeLearners],
        ].map(([label, value]) => (
          <div key={label} className="card p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
