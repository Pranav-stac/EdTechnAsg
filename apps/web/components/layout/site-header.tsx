"use client";

import { useState } from "react";
import { MEGA_MENU, NAV_LINKS } from "@manzilchaser/shared";
import { Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { LeadModal } from "@/components/leads/lead-modal";
import { useAuth } from "@/components/providers/auth-provider";

export function SiteHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/courses?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="border-b border-surface-line bg-brand-light/60">
          <TopBar onLead={() => setLeadOpen(true)} />
        </div>
        <div className="border-b border-surface-line bg-white">
          <div className="container-page flex items-center gap-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">MC</span>
              <span className="text-lg font-bold tracking-tight text-brand">MANZILCHASER</span>
            </Link>
            <form onSubmit={onSearch} className="hidden flex-1 lg:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search for courses, exams, colleges..."
                  className="input pl-11"
                />
              </div>
            </form>
            <MainNavActions
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              onAuth={() => setAuthOpen(true)}
              user={user}
            />
          </div>
        </div>
        {mobileOpen ? <MobileMenu search={search} setSearch={setSearch} onSearch={onSearch} /> : null}
        <div className="relative hidden bg-brand lg:block">
          <div className="container-page flex items-center gap-5 py-3">
            <button
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand"
              onMouseEnter={() => setMegaOpen(true)}
              onFocus={() => setMegaOpen(true)}
            >
              All Categories
            </button>
            {NAV_LINKS.map((link) => (
              <Link key={link} href={`/courses?search=${encodeURIComponent(link)}`} className="nav-link">
                {link}
              </Link>
            ))}
          </div>
          {megaOpen ? <MegaMenu onClose={() => setMegaOpen(false)} onLead={() => setLeadOpen(true)} /> : null}
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} source="homepage" />
    </>
  );
}

function TopBar({ onLead }: { onLead: () => void }) {
  return (
    <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2 text-sm text-brand-navy">
      <p className="font-medium">Admissions. Learning. Careers. Global Skills.</p>
      <button onClick={onLead} className="inline-flex items-center gap-2 font-semibold text-brand">
        <Phone className="h-4 w-4" /> Talk to Expert: +91 98765 43210
      </button>
    </div>
  );
}

function MainNavActions({
  mobileOpen,
  setMobileOpen,
  onAuth,
  user,
}: {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  onAuth: () => void;
  user: { name: string; role: string } | null;
}) {
  return (
    <div className="ml-auto flex items-center gap-3">
      <button className="rounded-xl border border-surface-line p-2 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {user ? (
        <Link href={user.role === "admin" ? "/admin" : "/student"} className="btn-secondary">
          {user.name}
        </Link>
      ) : (
        <>
          <button onClick={onAuth} className="btn-secondary hidden sm:inline-flex">
            Login
          </button>
          <button onClick={onAuth} className="btn-primary">
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}

function MobileMenu({
  search,
  setSearch,
  onSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
  onSearch: (event: React.FormEvent) => void;
}) {
  return (
    <div className="border-b border-surface-line bg-white lg:hidden">
      <div className="container-page space-y-4 py-4">
        <form onSubmit={onSearch}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for courses, exams, colleges..."
            className="input"
          />
        </form>
        <MobileNavLinks />
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(MEGA_MENU).map(([key, items]) => (
            <div key={key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {items.map((item) => (
                  <li key={item}>
                    <Link href={`/courses?search=${encodeURIComponent(item)}`} className="text-slate-700">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileNavLinks() {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {NAV_LINKS.map((link) => (
        <Link key={link} href={`/courses?search=${encodeURIComponent(link)}`} className="text-slate-700">
          {link}
        </Link>
      ))}
    </div>
  );
}

function MegaMenu({ onClose, onLead }: { onClose: () => void; onLead: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full border-t border-white/10 bg-white shadow-panel" onMouseLeave={onClose}>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-5">
        {Object.entries(MEGA_MENU).map(([key, items]) => (
          <div key={key}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {items.map((item) => (
                <li key={item}>
                  <Link href={`/courses?search=${encodeURIComponent(item)}`} className="hover:text-brand">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded-2xl bg-hero-grid p-6 text-white">
          <h3 className="text-lg font-semibold">Admission Counseling</h3>
          <p className="mt-2 text-sm text-blue-100">Get expert guidance on programs, fees, and enrollment steps.</p>
          <button onClick={onLead} className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand">
            Talk to Expert
          </button>
        </div>
      </div>
    </div>
  );
}
