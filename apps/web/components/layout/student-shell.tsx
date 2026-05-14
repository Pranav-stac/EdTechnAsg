"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";

const links = [
  ["Dashboard", "/student"],
  ["My Courses", "/student/courses"],
  ["Live Classes", "/student/live-classes"],
  ["Assignments", "/student/assignments"],
  ["Attendance", "/student/attendance"],
  ["My Wallet", "/student/wallet"],
  ["Certificates", "/student/certificates"],
  ["Settings", "/student/settings"],
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="container-page py-20">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <StudentShellHeader logout={logout} />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="surface-panel h-fit p-4">
          <nav className="space-y-1">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                  pathname === href ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}

function StudentShellHeader({ logout }: { logout: () => void }) {
  return (
    <div className="border-b border-surface-line bg-white">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm text-white">MC</span>
          MANZILCHASER
        </Link>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}
