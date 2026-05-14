"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";

type Course = {
  id: string;
  slug: string;
  title: string;
  fee: number;
  duration: string;
  mode: string;
  rating: number;
  tags: string[];
  university: { name: string };
};

const tabs = [
  { id: "trending", label: "Trending" },
  { id: "top-rated", label: "Top Rated" },
  { id: "most-enrolled", label: "Most Enrolled" },
] as const;

export function PopularCoursesTabs({ courses }: { courses: Course[] }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("trending");

  const items = useMemo(() => {
    const copy = [...courses];
    if (activeTab === "top-rated") return copy.sort((a, b) => b.rating - a.rating);
    if (activeTab === "most-enrolled") return copy.sort((a, b) => b.fee - a.fee);
    return copy;
  }, [activeTab, courses]);

  return (
    <div>
      <div className="mt-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === tab.id ? "bg-brand text-white" : "bg-white text-slate-600 ring-1 ring-surface-line"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {items.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
