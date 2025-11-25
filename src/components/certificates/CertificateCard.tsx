// src/components/certificates/CertificateCard.tsx
import { certificatesApi, type Certificate } from "../../api/certificatesApi";

interface Props {
  cert: Certificate;
}

export default function CertificateCard({ cert }: Props) {
  const statusColor = cert.on_chain ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-200";

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-2 flex items-center justify-between text-xs">
        <h3 className="font-semibold text-white">{cert.course_title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${statusColor}`}>
          {cert.on_chain ? "On-chain" : "Pending"}
        </span>
      </div>
      <p className="mb-1 text-[11px] text-slate-400">
        Certificate ID: <span className="font-mono">{cert.certificate_id}</span>
      </p>
      <p className="mb-3 text-[11px] text-slate-500">
        Issued at: {new Date(cert.issued_at).toLocaleString()}
      </p>
      <button
        className="mt-auto self-start rounded-lg bg-slate-800 px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-700"
        onClick={() => navigator.clipboard.writeText(cert.certificate_id)}
      >
        Copy Certificate ID
      </button>
    </div>
  );
}
