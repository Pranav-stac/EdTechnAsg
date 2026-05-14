import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const data = await api<{
    leads: number;
    enrollments: number;
    revenue: number;
    activeLearners: number;
  }>("/api/v1/admin/analytics");

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
