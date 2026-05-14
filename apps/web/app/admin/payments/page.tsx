import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  const data = await api<{ items: any[] }>("/api/v1/admin/payments");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Payments</h1>
      <PaymentsTable items={data.items} />
    </div>
  );
}

function PaymentsTable({ items }: { items: any[] }) {
  return (
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
          {items.map((payment) => (
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
  );
}

const motionPaymentsTable = PaymentsTable;
