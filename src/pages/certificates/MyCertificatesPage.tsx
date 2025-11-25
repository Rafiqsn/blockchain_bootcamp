// src/pages/certificates/MyCertificatesPage.tsx
import React, { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import {
  certificatesApi,
  Certificate,
} from "../../api/certificatesApi";

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
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "10px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(148,163,184,0.95)",
  maxWidth: "560px",
};

const cardStyle: React.CSSProperties = {
  marginTop: "28px",
  borderRadius: "24px",
  padding: "22px 22px 24px",
  background:
    "radial-gradient(circle at top left, rgba(129,140,248,0.18), transparent 55%), #020617",
  border: "1px solid rgba(148,163,184,0.18)",
  boxShadow:
    "0 24px 60px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "3px 10px",
  borderRadius: 999,
  fontSize: "10px",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  border: "1px solid rgba(52,211,153,0.7)",
  color: "rgba(167,243,208,0.95)",
  marginBottom: 10,
};

const certTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: 6,
};

const metaRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  marginTop: 12,
};

const metaLeftStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(148,163,184,0.95)",
  lineHeight: 1.5,
};

const metaRightStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 6,
  fontSize: "11px",
  color: "rgba(148,163,184,0.9)",
};

const statusPillBase: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const verifyButtonStyle: React.CSSProperties = {
  marginTop: 6,
  padding: "6px 14px",
  borderRadius: 999,
  border: 0,
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 600,
  color: "#e5e7eb",
  background:
    "linear-gradient(to right, #22c55e, #14b8a6)",
  boxShadow: "0 12px 26px rgba(34,197,94,0.55)",
};

const messageStyle: React.CSSProperties = {
  marginTop: 18,
  fontSize: 12,
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
        const res = await certificatesApi.myCertificates(); // ApiResponse<Certificate[]>
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
    if (cert.on_chain) return; // sudah on-chain

    try {
      setVerifyingId(cert.id);
      setMessage(null);

      const res = await certificatesApi.verify(cert.certificate_id); // ApiResponse<Certificate>
      const updated = res.data;

      // update list
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

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "--";
    return new Date(value).toLocaleString();
  };

  const shorten = (hash?: string | null) => {
    if (!hash) return "--";
    if (hash.length <= 12) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-4)}`;
  };

  return (
    <AppLayout>
      <div style={pageWrapperStyle}>
        <div style={sectionTitleStyle}>CERTIFICATES</div>
        <h1 style={headingStyle}>My certificates</h1>
        <p style={subtitleStyle}>
          View the certificates you&apos;ve earned from completing
          blockchain bootcamp courses. Each one can be verified on-chain.
        </p>

        {loading && (
          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(148,163,184,0.9)" }}>
            Loading certificates...
          </p>
        )}

        {error && (
          <p
            style={{
              marginTop: 24,
              fontSize: 12,
              color: "#fecaca",
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(127, 29, 29, 0.6)",
              border: "1px solid rgba(248, 113, 113, 0.6)",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && certificates.length === 0 && (
          <p
            style={{
              marginTop: 24,
              fontSize: 12,
              color: "rgba(148,163,184,0.9)",
            }}
          >
            You don&apos;t have any certificates yet. Complete a course and
            claim your first one.
          </p>
        )}

        {!loading &&
          !error &&
          certificates.map((cert) => {
            const statusStyle: React.CSSProperties = cert.on_chain
              ? {
                  ...statusPillBase,
                  background: "rgba(34,197,94,0.18)",
                  color: "rgba(187,247,208,0.95)",
                  border: "1px solid rgba(34,197,94,0.8)",
                }
              : {
                  ...statusPillBase,
                  background: "rgba(248,250,252,0.02)",
                  color: "rgba(248,250,252,0.82)",
                  border: "1px solid rgba(148,163,184,0.55)",
                };

            return (
              <section key={cert.id} style={cardStyle}>
                <div style={badgeStyle}>ON-CHAIN CERTIFICATE</div>
                <div style={certTitleStyle}>{cert.course_title}</div>

                <div style={metaRowStyle}>
                  <div style={metaLeftStyle}>
                    <div>
                      <strong>ID:</strong> {cert.certificate_id}
                    </div>
                    <div>
                      <strong>Issued at:</strong>{" "}
                      {formatDate(cert.issued_at)}
                    </div>
                    <div>
                      <strong>Tx hash:</strong> {shorten(cert.tx_hash || cert.certificate_hash || undefined)}
                    </div>
                  </div>

                  <div style={metaRightStyle}>
                    <span>
                      Chapters completed: {cert.chapters_completed}
                    </span>
                    {cert.block_number && (
                      <span>Block #{cert.block_number}</span>
                    )}

                    <span style={statusStyle}>
                      {cert.on_chain ? "ON-CHAIN" : "PENDING"}
                    </span>

                    {!cert.on_chain && (
                      <button
                        type="button"
                        style={verifyButtonStyle}
                        disabled={verifyingId === cert.id}
                        onClick={() => handleVerify(cert)}
                      >
                        {verifyingId === cert.id
                          ? "Verifying..."
                          : "Verify on-chain"}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );
          })}

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
