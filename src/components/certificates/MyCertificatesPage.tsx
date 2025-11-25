// src/pages/certificates/MyCertificatesPage.tsx
import { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { certificatesApi, type Certificate } from "../../api/certificatesApi";
import CertificateCard from "../../components/certificates/CertificateCard";

export default function MyCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificatesApi
      .myCertificates()
      .then(setCerts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white">My Certificates</h1>
        <p className="text-xs text-slate-400">
          Certificates are anchored on the blockchain for tamper-proof validation.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Loading certificates...</p>
      ) : certs.length === 0 ? (
        <p className="text-xs text-slate-400">
          You don&apos;t have any certificates yet. Complete a course and claim one!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((c) => (
            <CertificateCard key={c.id} cert={c} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
