import { AdminCoursesManager } from "@/components/admin/courses-manager";
import { api } from "@/lib/api";

export default async function AdminCoursesPage() {
  const data = await api<{ items: any[] }>("/api/v1/admin/courses");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <AdminCoursesManager initialItems={data.items} />
    </div>
  );
}
