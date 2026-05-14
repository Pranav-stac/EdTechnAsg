import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

type Course = {
  slug: string;
  title: string;
  fee: number;
  duration: string;
  mode: string;
  rating: number;
  tags: string[];
  university: { name: string };
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CourseCardHeader course={course} />
        <p className="text-lg font-bold text-brand">{formatCurrency(course.fee)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span key={tag} className="badge">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" /> Compare
        </label>
        <Link href={`/courses/${course.slug}`} className="btn-primary">
          View Details
        </Link>
      </div>
    </article>
  );
}

function CourseCardHeader({ course }: { course: Course }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{course.university.name}</p>
      <h3 className="mt-1 text-lg font-semibold">{course.title}</h3>
      <p className="mt-2 text-sm text-slate-600">
        {course.duration} · {course.mode} · {course.rating.toFixed(1)} rating
      </p>
    </div>
  );
}

const motionCourseCardHeader = CourseCardHeader;
