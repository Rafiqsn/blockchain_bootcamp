// src/pages/courses/CourseDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { coursesApi, Course } from "../../api/coursesApi";
import { chaptersApi, Chapter } from "../../api/chaptersApi";
import { certificatesApi, Certificate } from "../../api/certificatesApi";

const pageWrapperStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 24px 48px",
  color: "#f9fafb",
};

const breadcrumbStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(148, 163, 184, 0.9)",
  marginBottom: "12px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: 700,
  marginBottom: "12px",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(148, 163, 184, 0.95)",
  maxWidth: "560px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.2fr)",
  gap: "24px",
  marginTop: "28px",
};

const cardStyle: React.CSSProperties = {
  borderRadius: "24px",
  padding: "24px 24px 28px",
  background:
    "radial-gradient(circle at top left, rgba(129, 140, 248, 0.2), transparent 55%), #020617",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  boxShadow:
    "0 24px 60px rgba(15, 23, 42, 0.9), 0 0 0 1px rgba(15, 23, 42, 0.9)",
};

const rightCardStyle: React.CSSProperties = {
  ...cardStyle,
  background:
    "radial-gradient(circle at top, rgba(168, 85, 247, 0.18), transparent 55%), #020617",
};

const metaRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "18px",
  marginBottom: "18px",
};

const pillStyle: React.CSSProperties = {
  fontSize: "11px",
  padding: "4px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  color: "rgba(226, 232, 240, 0.9)",
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginTop: "12px",
};

const statItemStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85))",
  border: "1px solid rgba(30, 64, 175, 0.6)",
  fontSize: "11px",
};

const statLabelStyle: React.CSSProperties = {
  color: "rgba(148, 163, 184, 0.95)",
  marginBottom: "4px",
};

const statValueStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "0",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  color: "#f9fafb",
  background:
    "radial-gradient(circle at 10% 0, #f973ff 0, #a855f7 20%, #6366f1 55%, #4f46e5 100%)",
  boxShadow:
    "0 0 0 1px rgba(129, 140, 248, 0.7), 0 16px 35px rgba(79, 70, 229, 0.7)",
};

const claimButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "0",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  color: "#f9fafb",
  background:
    "radial-gradient(circle at 0 0, rgba(34,197,94,0.9), rgba(22,163,74,0.9))",
  boxShadow:
    "0 0 0 1px rgba(34,197,94,0.7), 0 16px 30px rgba(22,163,74,0.7)",
};

const backLinkStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(148, 163, 184, 0.9)",
  cursor: "pointer",
  marginTop: "18px",
};

const chapterListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "18px",
};

const chapterItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 14px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9))",
  border: "1px solid rgba(31, 41, 55, 0.9)",
};

const chapterTitleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
};

const chapterMetaStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "rgba(148, 163, 184, 0.95)",
};

const chapterButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "0",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 600,
  color: "#e5e7eb",
  background:
    "radial-gradient(circle at 0 0, rgba(236, 72, 153, 0.9), rgba(129, 140, 248, 0.9))",
};

const mutedTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(148, 163, 184, 0.9)",
  marginTop: "16px",
};

const CourseDetailPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const id = params.id;

  useEffect(() => {
    if (!id) return;

    const courseId = Number(id);
    setLoading(true);
    setError(null);

    Promise.all([
      coursesApi.getCourseDetail(courseId),
      chaptersApi.getChaptersByCourse(courseId),
      certificatesApi.myCertificates(),
    ])
      .then(([courseRes, chaptersRes, certsRes]) => {
        setCourse(courseRes.data);
        setChapters(chaptersRes.data);
        setMyCertificates(certsRes.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load course details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // perhitungan progress & status klaim
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((ch) => ch.is_completed).length;
  const completionRate =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  const hasClaimedCertificate =
    !!course &&
    myCertificates.some((cert) => cert.course_id === course.id);

  const canClaimCertificate = completionRate >= 75 && !hasClaimedCertificate;

  const certificatesStatusText = hasClaimedCertificate
    ? "Certificate claimed"
    : canClaimCertificate
    ? "Ready to mint"
    : "Keep learning";

  const handleClaimCertificate = async () => {
    if (!course || !canClaimCertificate) return;

    try {
      setClaiming(true);
      setClaimMessage(null);

      const res = await certificatesApi.claimCertificate(course.id);
      setClaimMessage(res.message || "Certificate claimed successfully.");

      // tambahkan certificate baru ke state supaya tombol langsung nonaktif
      if (res.data) {
        setMyCertificates((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
      setClaimMessage("Failed to claim certificate. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const claimButtonDisabled = !canClaimCertificate || claiming;

  const claimButtonLabel = hasClaimedCertificate
    ? "Certificate claimed"
    : claiming
    ? "Claiming..."
    : "Claim certificate";

  return (
    <AppLayout>
      <div style={pageWrapperStyle}>
        <div style={breadcrumbStyle}>COURSE OVERVIEW</div>
        <h1 style={headingStyle}>
          {course ? course.title : "Loading course..."}
        </h1>
        <p style={subheadingStyle}>
          {course
            ? course.description
            : "Fetching course information from the Quiz-Chain registry."}
        </p>

        {loading && (
          <p
            style={{
              marginTop: 24,
              color: "rgba(148,163,184,0.9)",
              fontSize: 12,
            }}
          >
            Loading chapters and metadata...
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

        {!loading && !error && course && (
          <div style={gridStyle}>
            {/* LEFT: course summary */}
            <section style={cardStyle}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(148,163,184,0.95)",
                  marginBottom: 8,
                }}
              >
                Course snapshot
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
                {course.title}
              </div>
              <p style={{ fontSize: 13, color: "rgba(148,163,184,0.95)" }}>
                {course.description}
              </p>

              <div style={metaRowStyle}>
                <span style={pillStyle}>{course.level ?? "All levels"}</span>
                <span style={pillStyle}>
                  {chapters.length} chapter{chapters.length !== 1 && "s"}
                </span>
              </div>

              <div style={statRowStyle}>
                <div style={statItemStyle}>
                  <div style={statLabelStyle}>Progress</div>
                  <div style={statValueStyle}>
                    {completionRate}% completed
                  </div>
                </div>
                <div style={statItemStyle}>
                  <div style={statLabelStyle}>Certificates ready</div>
                  <div style={statValueStyle}>{certificatesStatusText}</div>
                </div>
              </div>

              {/* Buttons */}
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  style={primaryButtonStyle}
                  onClick={() => {
                    const firstIncomplete =
                      chapters.find((ch) => !ch.is_completed) || chapters[0];

                    if (firstIncomplete) {
                      navigate(
                        `/courses/${course.id}/chapters/${firstIncomplete.id}`
                      );
                    }
                  }}
                >
                  Start first chapter
                </button>

                <button
                  type="button"
                  style={{
                    ...claimButtonStyle,
                    opacity: claimButtonDisabled ? 0.4 : 1,
                    cursor: claimButtonDisabled ? "not-allowed" : "pointer",
                  }}
                  disabled={claimButtonDisabled}
                  onClick={handleClaimCertificate}
                >
                  {claimButtonLabel}
                </button>
              </div>

              {claimMessage && (
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: claimMessage.toLowerCase().includes("failed")
                      ? "#fecaca"
                      : "#bbf7d0",
                  }}
                >
                  {claimMessage}
                </p>
              )}

              <div style={backLinkStyle} onClick={() => navigate(-1)}>
                ← Back to dashboard
              </div>
            </section>

            {/* RIGHT: chapter list */}
            <section style={rightCardStyle}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Your chapters
              </div>
              <p style={{ fontSize: 12, color: "rgba(148,163,184,0.95)" }}>
                Work through each chapter in order. Finish them all to unlock
                your on-chain certificate.
              </p>

              <div style={chapterListStyle}>
                {chapters.map((chapter) => (
                  <div key={chapter.id} style={chapterItemStyle}>
                    <div>
                      <div style={chapterTitleStyle}>
                        {chapter.chapter_number}. {chapter.title}
                      </div>
                      <div style={chapterMetaStyle}>
                        Chapter #{chapter.chapter_number}
                        {chapter.is_completed ? " · Completed" : ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      style={chapterButtonStyle}
                      onClick={() =>
                        navigate(
                          `/courses/${course.id}/chapters/${chapter.id}`
                        )
                      }
                    >
                      Open chapter
                    </button>
                  </div>
                ))}

                {chapters.length === 0 && (
                  <p style={mutedTextStyle}>
                    This course doesn’t have any chapters yet. Please check back
                    later.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {!loading && !course && !error && (
          <p style={mutedTextStyle}>
            Course not found. It may have been removed from the registry.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default CourseDetailPage;
