import { AssignmentsPanel } from "@/components/student/assignments-panel";
import { api } from "@/lib/api";

export default async function StudentAssignmentsPage() {
  const data = await api<{ items: any[] }>("/api/v1/student/assignments");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <AssignmentsPanel initialItems={data.items} />
    </div>
  );
}
