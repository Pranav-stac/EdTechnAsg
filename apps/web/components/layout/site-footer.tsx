import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-surface-line bg-white">
      <SiteFooterInner />
    </footer>
  );
}

function SiteFooterInner() {
  return (
    <div className="container-page grid gap-8 py-12 md:grid-cols-4">
      <div>
        <p className="text-lg font-bold text-brand">MANZILCHASER</p>
        <p className="mt-3 text-sm text-slate-600">
          Trusted partner from school to success with admissions, learning, and career guidance.
        </p>
      </div>
      <div>
        <p className="font-semibold text-slate-900">Programs</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li><Link href="/courses?search=Online%20Degrees" className="hover:text-brand">Online Degrees</Link></li>
          <li><Link href="/courses?search=Coding" className="hover:text-brand">Coding & IT</Link></li>
          <li><Link href="/courses?search=Study%20Abroad" className="hover:text-brand">Study Abroad</Link></li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-slate-900">Support</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li><Link href="/courses?search=MBA" className="hover:text-brand">Talk to Expert</Link></li>
          <li><Link href="/student" className="hover:text-brand">Student Dashboard</Link></li>
          <li><Link href="/admin" className="hover:text-brand">Admin CRM</Link></li>
        </ul>
      </div>
      <div>
        <p className="font-semibold text-slate-900">Contact</p>
        <p className="mt-3 text-sm text-slate-600">+91 98765 43210</p>
        <p className="text-sm text-slate-600">support@manzilchaser.com</p>
      </div>
    </div>
  );
}