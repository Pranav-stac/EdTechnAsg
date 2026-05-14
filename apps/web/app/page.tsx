import Image from "next/image";
import Link from "next/link";
import { TRUST_METRICS } from "@manzilchaser/shared";
import { PublicShell } from "@/components/layout/public-shell";
import { PopularCoursesTabs } from "@/components/home/popular-courses-tabs";
import { getCategoryStyle } from "@/lib/category-styles";
import { api } from "@/lib/api";

const whyChooseUs = [
  { label: "Courses", value: "1000+" },
  { label: "Top Universities", value: "200+" },
  { label: "Success Stories", value: "50K+" },
  { label: "Student Support", value: "24/7" },
];

const comparisonRows = [
  { university: "Amity University", fee: "₹1,80,000", duration: "2 Years", mode: "Online", accreditation: "UGC Approved" },
  { university: "Manipal University", fee: "₹2,10,000", duration: "2 Years", mode: "Online", accreditation: "UGC Approved" },
  { university: "LPU", fee: "₹1,95,000", duration: "2 Years", mode: "Hybrid", accreditation: "UGC Approved" },
];

export default async function HomePage() {
  const [courses, categories, testimonials, partners] = await Promise.all([
    api<{ items: any[] }>("/api/v1/courses?pageSize=6"),
    api<{ items: any[] }>("/api/v1/categories"),
    api<{ items: any[] }>("/api/v1/testimonials"),
    api<{ items: any[] }>("/api/v1/partners"),
  ]);

  return (
    <PublicShell>
      <section className="bg-hero-grid text-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <span className="pill">Live Classes (350+ Ongoing)</span>
              <span className="pill">Top Universities (200+ Partners)</span>
              <span className="pill">4.8/5 Student Rating</span>
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">Admissions. Learning. Careers. Global Skills.</h1>
            <p className="mt-4 max-w-xl text-lg text-blue-100">
              Your trusted partner from school to success with counseling, learning, and career outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/courses" className="btn-accent">
                Explore Courses
              </Link>
              <Link href="/courses?search=MBA" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/15">
                Talk to Expert
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/15 shadow-float">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                alt="Students learning together"
                width={1200}
                height={900}
                className="h-[420px] w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -left-4 top-8 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand shadow-float">Live Classes</div>
            <motionHomeHeroActions />
            <div className="absolute bottom-4 left-8 rounded-2xl bg-accent-green px-4 py-3 text-sm font-semibold text-white shadow-float">4.8/5 Rating</div>
          </div>
        </div>
      </section>

      <section className="border-b border-surface-line bg-white">
        <div className="container-page grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_METRICS.map((metric) => (
            <motionHomeTrustMetric key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Explore Top Categories</h2>
        <p className="section-subtitle">Choose your learning path by goal, class, skill, or mode.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.items.map((category) => {
            const style = getCategoryStyle(category.slug);
            const Icon = style.icon;
            return (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug}`}
                className="card p-6 transition hover:-translate-y-1 hover:shadow-panel"
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${style.className}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-lg font-semibold">{category.name}</p>
                <p className="mt-2 text-sm text-slate-600">{category.description || "Explore programs and enroll with confidence."}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-brand py-16 text-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Compare. Decide. Enroll.</h2>
          <p className="mt-2 max-w-2xl text-blue-100">Compare leading online MBA programs side by side before you enroll.</p>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-white/10">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4">University</th>
                  <th className="p-4">Total Fee</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Accreditation</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.university} className="border-b border-white/10">
                    <td className="p-4 font-medium">{row.university}</td>
                    <td className="p-4">{row.fee}</td>
                    <td className="p-4">{row.duration}</td>
                    <td className="p-4">{row.mode}</td>
                    <td className="p-4">{row.accreditation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => (
            <div key={item.label} className="stat-card text-center">
              <p className="text-3xl font-bold text-brand">{item.value}</p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Popular Courses</h2>
            <p className="section-subtitle">Browse trending, top rated, and most enrolled programs.</p>
          </div>
          <Link href="/courses" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        <PopularCoursesTabs courses={courses.items} />
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="section-title">Top Universities & Partners</h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {partners.items.map((partner) => (
              <div key={partner.id} className="card px-6 py-4 text-sm font-semibold">
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="section-title">Success Stories</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.items.map((item) => (
            <blockquote key={item.id} className="surface-panel">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-lg font-bold text-brand">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
              <p className="mt-5 text-slate-700">“{item.quote}”</p>
            </blockquote>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}

function HomeHeroActions() {
  return (
    <div className="absolute -right-2 bottom-10 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand shadow-float">
      Top Universities
    </div>
  );
}

function HomeTrustMetric({ metric }: { metric: { label: string; value: string } }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4 text-center">
      <p className="text-2xl font-bold text-brand">{metric.value}</p>
      <p className="mt-1 text-sm text-slate-600">{metric.label}</p>
    </div>
  );
}

const motionHomeHeroActions = HomeHeroActions;
const motionHomeTrustMetric = HomeTrustMetric;
