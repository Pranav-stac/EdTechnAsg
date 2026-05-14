import { api } from "@/lib/api";

export default async function StudentAttendancePage() {
  const data = await api<{ items: any[] }>("/api/v1/student/attendance");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <ul className="mt-6 space-y-3">
        {data.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <span>{new Date(item.date).toLocaleDateString()}</span>
            <span className={item.status === "present" ? "text-green-700" : "text-rose-700"}>{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
