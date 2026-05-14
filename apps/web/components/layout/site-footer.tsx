export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-brand">MANZILCHASER</p>
          <p className="mt-3 text-sm text-slate-600">
            Trusted partner from school to success with admissions, learning, and career guidance.
          </p>
        </div>
        <div>
          <p className="font-semibold">Programs</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Online Degrees</li>
            <li>Coding & IT</li>
            <li>Study Abroad</li>
          </ul>
        </div>
        <FooterSupport />
        <div>
          <p className="font-semibold">Contact</p>
          <p className="mt-3 text-sm text-slate-600">+91 98765 43210</p>
          <p className="text-sm text-slate-600">support@manzilchaser.com</p>
        </div>
      </div>
    </footer>
  );
}

function FooterSupport() {
  return (
    <div>
      <p className="font-semibold">Support</p>
      <ul className="mt-3 space-y-2 text-sm text-slate-600">
        <li>Talk to Expert</li>
        <li>Student Dashboard</li>
        <li>Admin CRM</li>
      </ul>
    </div>
  );
}

const motionFooterSupport = FooterSupport;
