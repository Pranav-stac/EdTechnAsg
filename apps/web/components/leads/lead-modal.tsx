"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  source: "enroll" | "talk_to_expert" | "homepage";
  courseSlug?: string;
};

export function LeadModal({ open, onClose, source, courseSlug }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api("/api/v1/leads", {
        method: "POST",
        body: JSON.stringify({ ...form, source, courseSlug }),
      });
      setStatus("Thanks! Our counselor will contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Talk to Expert</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <textarea className="input min-h-24" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}
      </div>
    </div>
  );
}
