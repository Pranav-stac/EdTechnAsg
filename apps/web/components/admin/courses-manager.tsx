"use client";

import { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  slug: string;
  fee: number;
  isPublished: boolean;
  university: { name: string };
};

const fetcher = (path: string) => api<{ items: Course[] }>(path);

export function AdminCoursesManager({ initialItems }: { initialItems: Course[] }) {
  const { data, mutate } = useSWR("/api/v1/admin/courses", fetcher, { fallbackData: { items: initialItems } });
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    fee: "150000",
    duration: "2 Years",
    mode: "Online",
    specialization: "General",
    categorySlug: "online-degrees",
    universitySlug: "amity-university",
    rating: "4.5",
    tags: "Live Classes, Placement Support",
    isPublished: true,
  });
  const [message, setMessage] = useState("");

  const createCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      await api("/api/v1/admin/courses", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          fee: Number(form.fee),
          rating: Number(form.rating),
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          isPublished: form.isPublished,
        }),
      });
      setMessage("Course created.");
      mutate();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Create failed");
    }
  };

  const togglePublish = async (course: Course) => {
    await api(`/api/v1/admin/courses/${course.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished: !course.isPublished }),
    });
    mutate();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={createCourse} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-2">
        <input className="input" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <input className="input" placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <textarea className="input min-h-24 md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        <input className="input" placeholder="Fee" value={form.fee} onChange={(event) => setForm({ ...form, fee: event.target.value })} required />
        <input className="input" placeholder="Duration" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} required />
        <input className="input" placeholder="Mode" value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value })} required />
        <input className="input" placeholder="Specialization" value={form.specialization} onChange={(event) => setForm({ ...form, specialization: event.target.value })} required />
        <input className="input" placeholder="Category slug" value={form.categorySlug} onChange={(event) => setForm({ ...form, categorySlug: event.target.value })} required />
        <input className="input" placeholder="University slug" value={form.universitySlug} onChange={(event) => setForm({ ...form, universitySlug: event.target.value })} required />
        <input className="input" placeholder="Tags comma separated" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} />
          Published
        </label>
        <button className="btn-primary md:col-span-2">Create Course</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Title</th>
              <th className="p-3">University</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Published</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((course) => (
              <tr key={course.id} className="border-b">
                <td className="p-3">{course.title}</td>
                <td className="p-3">{course.university.name}</td>
                <td className="p-3">{formatCurrency(course.fee)}</td>
                <td className="p-3">{course.isPublished ? "Yes" : "No"}</td>
                <td className="p-3">
                  <button className="btn-secondary" onClick={() => togglePublish(course)}>
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
