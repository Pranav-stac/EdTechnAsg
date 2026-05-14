"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const COMPARE_KEY = "manzilchaser.compare";

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_KEY);
    if (stored) setCompare(JSON.parse(stored));
  }, []);

  const toggleCompare = (slug: string) => {
    setCompare((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug].slice(-3);
      localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const compared = courses.filter((course) => compare.includes(course.slug));

  return (
    <div className="space-y-6">
      {compare.length ? (
        <div className="surface-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-brand">Compare selected programs ({compare.length}/3)</p>
            <button className="text-sm text-slate-500" onClick={() => { setCompare([]); localStorage.removeItem(COMPARE_KEY); }}>
              Clear
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {compared.map((course) => (
              <div key={course.id} className="rounded-2xl border border-surface-line p-4">
                <p className="font-semibold">{course.title}</p>
                <p className="mt-1 text-sm text-slate-600">{course.university.name}</p>
                <p className="mt-3 text-sm font-semibold text-brand">₹{course.fee.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            compared={compare.includes(course.slug)}
            onCompareToggle={() => toggleCompare(course.slug)}
          />
        ))}
      </div>
      {courses.length === 0 ? (
        <div className="surface-panel text-center">
          <p className="font-semibold">No programs found</p>
          <p className="mt-2 text-sm text-slate-600">Try adjusting your filters or search keywords.</p>
          <Link href="/courses" className="btn-primary mt-4 inline-flex">
            Reset filters
          </Link>
        </div>
      ) : null}
    </div>
  );
}
