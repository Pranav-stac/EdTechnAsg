import Link from "next/link";
import { Star } from "lucide-react";
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

export function CourseCard({
  course,
  compared,
  onCompareToggle,
}: {
  course: Course;
  compared?: boolean;
  onCompareToggle?: () => void;
}) {
  const initials = course.university.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-sm font-bold text-brand">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{course.university.name}</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{course.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                {course.rating.toFixed(1)}
              </span>
              <span>{course.duration}</span>
              <span>{course.mode}</span>
              <span>UGC Approved</span>
            </div>
          </div>
        </div>
        <div className="lg:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Fee</p>
          <p className="mt-1 text-2xl font-bold text-brand">{formatCurrency(course.fee)}</p>
        </div>
      </div>
      <CourseCardFooter course={course} compared={compared} onCompareToggle={onCompareToggle} />
    </article>
  );
}

function CourseCardFooter({
  course,
  compared,
  onCompareToggle,
}: {
  course: Course;
  compared?: boolean;
  onCompareToggle?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-surface-line bg-surface-muted/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <CourseCardTags tags={course.tags} />
      <div className="flex items-center gap-3">
        {onCompareToggle ? (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={Boolean(compared)} onChange={onCompareToggle} />
            Compare
          </label>
        ) : (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input type="checkbox" /> Compare
          </label>
        )}
        <Link href={`/courses/${course.slug}`} className="btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

function CourseCardTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="badge">
          {tag}
        </span>
      ))}
    </div>
  );
}
