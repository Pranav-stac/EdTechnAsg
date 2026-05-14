import { api } from "@/lib/api";

async function getList(path: string) {
  const data = await api<{ items: any[] }>(path);
  return data.items;
}

export default async function StudentCoursesPage() {
  const items = await getList("/api/v1/student/courses");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{item.course.title}</p>
            <p className="text-sm text-slate-600">{item.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}
