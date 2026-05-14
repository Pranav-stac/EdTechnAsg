"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

export function SettingsForm() {
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ user: { name: string; email?: string | null; phone?: string | null } }>("/api/v1/auth/me")
      .then((data) => {
        setForm({
          name: data.user.name,
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      await api("/api/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          email: form.email || null,
          phone: form.phone || null,
        }),
      });
      await refresh();
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading settings...</p>;
  }

  return (
    <form onSubmit={save} className="mt-6 max-w-xl space-y-4">
      <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />
      <input className="input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
      <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" />
      <button className="btn-primary">Save Settings</button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
