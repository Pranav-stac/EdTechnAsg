"use client";

import useSWR from "swr";
import { api } from "@/lib/api";

const fetcher = (path: string) => api<{ items: any[] }>(path);

export default function AdminLeadsPage() {
  const { data, mutate } = useSWR("/api/v1/admin/leads", fetcher);

  const updateStatus = async (id: string, status: string) => {
    await api(`/api/v1/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((lead) => (
              <tr key={lead.id} className="border-b">
                <td className="p-3">{lead.name}</td>
                <td className="p-3">
                  {lead.email}
                  <br />
                  {lead.phone}
                </td>
                <td className="p-3">{lead.source}</td>
                <td className="p-3">
                  <select
                    className="input"
                    value={lead.status}
                    onChange={(event) => updateStatus(lead.id, event.target.value)}
                  >
                    {["new", "contacted", "qualified", "closed"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
