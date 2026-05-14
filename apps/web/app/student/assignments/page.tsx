import { api } from "@/lib/api";

export default async function StudentAssignmentsPage() {
  const data = await api<{ items: any[] }>("/api/v1/student/assignments");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <ul className="mt-6 space-y-3">
        {data.items.map((item) => (
          <li key={item.id} className="rounded-xl bg-slate-50 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-600">
              {item.course.title} · due {new Date(item.dueDate).toLocaleDateString()} · {item.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
