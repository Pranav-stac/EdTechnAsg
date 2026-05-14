"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  submissionNote?: string | null;
  course: { title: string };
};

export function AssignmentsPanel({ initialItems }: { initialItems: Assignment[] }) {
  const [items, setItems] = useState(initialItems);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const submit = async (assignmentId: string) => {
    const submissionNote = drafts[assignmentId]?.trim();
    if (!submissionNote || submissionNote.length < 5) {
      setMessage("Enter at least 5 characters before submitting.");
      return;
    }

    setMessage("");
    try {
      const data = await api<{ assignment: Assignment }>(`/api/v1/student/assignments/${assignmentId}/submit`, {
        method: "POST",
        body: JSON.stringify({ submissionNote }),
      });
      setItems((current) => current.map((item) => (item.id === assignmentId ? data.assignment : item)));
      setMessage("Assignment submitted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Submission failed");
    }
  };

  return (
    <div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 p-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-600">
              {item.course.title} · due {new Date(item.dueDate).toLocaleDateString()} · {item.status}
            </p>
            {item.submissionNote ? (
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{item.submissionNote}</p>
            ) : (
              <div className="mt-3 space-y-3">
                <textarea
                  className="input min-h-24"
                  placeholder="Write your assignment response"
                  value={drafts[item.id] || ""}
                  onChange={(event) => setDrafts({ ...drafts, [item.id]: event.target.value })}
                />
                <button className="btn-primary" onClick={() => submit(item.id)}>
                  Submit Assignment
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
