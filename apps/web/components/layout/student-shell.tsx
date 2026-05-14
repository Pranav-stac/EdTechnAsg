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
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/" className="font-bold text-brand">
            MANZILCHASER
          </Link>
          <button onClick={logout} className="text-sm text-slate-600">
            Logout
          </button>
        </div>
      </div>
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-4">
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
