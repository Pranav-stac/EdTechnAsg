import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function AdminCoursesPage() {
  const data = await api<{ items: any[] }>("/api/v1/admin/courses");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Title</th>
              <th className="p-3">University</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="p-3">{course.title}</td>
                <td className="p-3">{course.university.name}</td>
                <td className="p-3">{formatCurrency(course.fee)}</td>
                <td className="p-3">{course.isPublished ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
