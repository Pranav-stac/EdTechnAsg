import { api } from "@/lib/api";

export default async function StudentLiveClassesPage() {
  const data = await api<{ liveClasses: any[] }>("/api/v1/student/dashboard");
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Live Classes</h1>
      <ul className="mt-6 space-y-3">
        {data.liveClasses.map((item) => (
          <li key={item.id} className="rounded-xl bg-slate-50 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-600">{new Date(item.startsAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
