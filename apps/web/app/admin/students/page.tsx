import { api } from "@/lib/api";

export default async function AdminStudentsPage() {
  const data = await api<{ items: any[] }>("/api/v1/admin/students");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Students</h1>
      <AdminStudentsList items={data.items} />
    </div>
  );
}

function AdminStudentsList({ items }: { items: any[] }) {
  return (
    <div className="mt-6 space-y-4">
      {items.map((student) => (
        <div key={student.id} className="rounded-2xl border border-slate-200 p-4">
          <p className="font-semibold">{student.name}</p>
          <p className="text-sm text-slate-600">{student.email || student.phone}</p>
          <p className="mt-2 text-sm text-slate-600">{student.enrollments.length} enrollments</p>
        </div>
      ))}
    </div>
  );
}

const motionAdminStudentsList = AdminStudentsList;
