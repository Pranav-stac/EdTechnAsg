import { api } from "@/lib/api";

export default async function StudentCertificatesPage() {
  const data = await api<{ items: Array<{ id: string; courseTitle: string; university: string; issuedAt: string; certificateCode: string }> }>(
    "/api/v1/student/certificates"
  );

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold">Certificates</h1>
      <p className="mt-2 text-slate-600">Certificates are issued when a course reaches 100% completion.</p>
      <div className="mt-6 space-y-4">
        {data.items.length ? (
          data.items.map((certificate) => (
            <div key={certificate.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold">{certificate.courseTitle}</p>
              <p className="text-sm text-slate-600">{certificate.university}</p>
              <p className="mt-2 text-sm text-brand">Certificate code: {certificate.certificateCode}</p>
              <p className="text-sm text-slate-500">Issued {new Date(certificate.issuedAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No certificates yet. Complete all lessons in an enrolled course to unlock one.</p>
        )}
      </div>
    </div>
  );
}
