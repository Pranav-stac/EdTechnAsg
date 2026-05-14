import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/layout/public-shell";
import { CheckoutButton } from "@/components/payments/checkout-button";
import { LeadTrigger } from "@/components/leads/lead-trigger";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await api<{ course: any }>(`/api/v1/courses/${slug}`);
  const course = data.course;
  if (!course) notFound();

  return (
    <PublicShell>
      <div className="container-page py-10">
        <p className="text-sm text-slate-500">
          Home / {course.category.name} / {course.title}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="card p-8">
            <p className="text-sm font-medium text-slate-500">{course.university.name}</p>
            <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
            <p className="mt-4 text-slate-600">{course.description}</p>
            <CourseDetailMeta course={course} />
          </div>
          <aside className="card h-fit p-6">
            <p className="text-sm text-slate-500">Total Fee</p>
            <p className="mt-2 text-3xl font-bold text-brand">{formatCurrency(course.fee)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.tags.map((tag: string) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <CheckoutButton courseSlug={course.slug} amount={course.fee} />
              <LeadTrigger source="enroll" courseSlug={course.slug} label="Talk to Expert" />
              <Link href="/courses" className="btn-secondary block text-center">
                Back to listing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}

function CourseDetailMeta({ course }: { course: any }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <p>
        <span className="font-semibold">Duration:</span> {course.duration}
      </p>
      <p>
        <span className="font-semibold">Mode:</span> {course.mode}
      </p>
      <p>
        <span className="font-semibold">Accreditation:</span> {course.accreditation}
      </p>
      <p>
        <span className="font-semibold">Rating:</span> {course.rating}
      </p>
    </div>
  );
}

const motionCourseDetailMeta = CourseDetailMeta;
