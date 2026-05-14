"use client";

import { useAsyncApi } from "@/lib/use-async-api";
import { formatCurrency } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const { data, loading, error } = useAsyncApi<{ items: any[] }>("/api/v1/admin/payments");

  if (loading) return <p className="text-sm text-slate-600">Loading payments...</p>;
  if (error || !data) return <p className="text-sm text-rose-600">{error || "Unable to load payments."}</p>;

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="p-3">{payment.user.name}</td>
                <td className="p-3">{payment.course?.title || payment.purpose}</td>
                <td className="p-3">{formatCurrency(payment.amount)}</td>
                <td className="p-3">{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
