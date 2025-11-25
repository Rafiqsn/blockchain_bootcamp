// src/pages/certificates/MyCertificatesPage.tsx
import React, { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { certificatesApi, Certificate } from "../../api/certificatesApi";

const pageWrapperStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 24px 48px",
  color: "#f9fafb",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.9)",
  marginBottom: "6px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 700,
  marginBottom: "10px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(148,163,184,0.95)",
  maxWidth: "560px",
};

const listWrapperStyle: React.CSSProperties = {
  marginTop: "28px",
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const certCardStyle: React.CSSProperties = {
  borderRadius: "24px",
  padding: "18px 22px",
  background:
    "radial-gradient(circle at top left, rgba(129,140,248,0.18), transparent 55%), #020617",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow:
    "0 20px 50px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
};

const leftWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  minWidth: 0,
  flex: 1,
};

const accentStripStyle: React.CSSProperties = {
  width: 4,
  alignSelf: "stretch",
  borderRadius: 999,
  background:
    "linear-gradient(to bottom, #22c55e, #14b8a6, #0ea5e9)",
};

const iconCircleStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "999px",
  background:
    "radial-gradient(circle at 30% 0, rgba(34,197,94,0.85), rgba(59,130,246,0.6))",
  boxShadow: "0 0 26px rgba(59,130,246,0.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const iconLetterStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: "#e5e7eb",
};

const certTextWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  minWidth: 0,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  border: "1px solid rgba(148,163,184,0.7)",
  color: "rgba(209,213,219,0.95)",
};

const certTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#f9fafb",
};

const certSubtitleStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(148,163,184,0.95)",
};

const certMetaStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(156,163,175,0.95)",
};

const rightMetaStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 6,
};

const verifyButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: 999,
  border: 0,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  color: "#e5e7eb",
  background: "linear-gradient(to right, #22c55e, #14b8a6)",
  boxShadow: "0 14px 30px rgba(34,197,94,0.6)",
};

const verifiedTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(190,242,100,0.95)",
};

const emptyTextStyle: React.CSSProperties = {
  marginTop: 24,
  fontSize: 12,
  color: "rgba(148,163,184,0.9)",
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: 24,
  fontSize: 12,
  color: "#fecaca",
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(127, 29, 29, 0.6)",
  border: "1px solid rgba(248, 113, 113, 0.6)",
};

const messageStyle: React.CSSProperties = {
  marginTop: 18,
  fontSize: 12,
};

const formatDate = (cert: Certificate): string => {
  const raw = cert.issued_at || cert.created_at;
  if (!raw) return "--";
  try {
    return new Date(raw).toLocaleString();
  } catch {
    return raw;
  }
};

const MyCertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        const res = await certificatesApi.myCertificates();
        setCertificates(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load certificates.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleVerify = async (cert: Certificate) => {
    if (cert.on_chain) return;

    try {
      setVerifyingId(cert.id);
      setMessage(null);

      // verify by certificate_id, backend return updated certificate
      const res = await certificatesApi.verify(cert.certificate_id);
      const updated = res.data;

      setCertificates((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setMessage(res.message || "Certificate verified on-chain.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to verify certificate. Please try again.");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <AppLayout>
      <div style={pageWrapperStyle}>
        <div style={sectionTitleStyle}>CERTIFICATES</div>
        <h1 style={headingStyle}>My certificates</h1>
        <p style={subtitleStyle}>
          Your completed blockchain bootcamp courses. Each card represents one
          certificate you&apos;ve earned.
        </p>

        {loading && (
          <p
            style={{
              marginTop: 24,
              fontSize: 12,
              color: "rgba(148,163,184,0.9)",
            }}
          >
            Loading certificates...
          </p>
        )}

        {error && <p style={errorBoxStyle}>{error}</p>}

        {!loading && !error && certificates.length === 0 && (
          <p style={emptyTextStyle}>
            You don&apos;t have any certificates yet. Complete a course and
            claim your first certificate.
          </p>
        )}

        {!loading && !error && certificates.length > 0 && (
          <div style={listWrapperStyle}>
            {certificates.map((cert) => (
              <section key={cert.id} style={certCardStyle}>
                <div style={leftWrapperStyle}>
                  <div style={accentStripStyle} />
                  <div style={iconCircleStyle}>
                    <span style={iconLetterStyle}>C</span>
                  </div>
                  <div style={certTextWrapperStyle}>
                    <span style={badgeStyle}>Certificate</span>
                    <div style={certTitleStyle}>{cert.course_title}</div>
                    <div style={certSubtitleStyle}>
                      Blockchain Bootcamp · Quiz-Chain Registry
                    </div>
                    {/* ⬇️ Certificate ID */}
                    <div style={certMetaStyle}>
                      ID: {cert.certificate_id}
                    </div>
                    {/* ⬇️ Issued date */}
                    <div style={certMetaStyle}>
                      Issued at: {formatDate(cert)}
                    </div>
                  </div>
                </div>

                <div style={rightMetaStyle}>
                  {cert.on_chain ? (
                    <span style={verifiedTextStyle}>
                      Verified on-chain ✅
                    </span>
                  ) : (
                    <button
                      type="button"
                      style={{
                        ...verifyButtonStyle,
                        opacity: verifyingId === cert.id ? 0.6 : 1,
                        cursor:
                          verifyingId === cert.id ? "wait" : "pointer",
                      }}
                      disabled={verifyingId === cert.id}
                      onClick={() => handleVerify(cert)}
                    >
                      {verifyingId === cert.id ? "Verifying..." : "Verify"}
                    </button>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        {message && (
          <p
            style={{
              ...messageStyle,
              color: message.toLowerCase().includes("fail")
                ? "#fecaca"
                : "#bbf7d0",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default MyCertificatesPage;
