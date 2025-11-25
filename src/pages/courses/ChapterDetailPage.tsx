// src/pages/courses/ChapterDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { chaptersApi, Chapter } from "../../api/chaptersApi";
import { quizApi } from "../../api/quizApi";

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
  fontSize: "26px",
  fontWeight: 700,
  marginBottom: "12px",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "rgba(148, 163, 184, 0.95)",
  maxWidth: "560px",
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

const quizCardStyle: React.CSSProperties = {
  ...cardStyle,
  marginTop: "20px",
  background:
    "radial-gradient(circle at top, rgba(168, 85, 247, 0.18), transparent 55%), #020617",
};

const backLinkStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(148, 163, 184, 0.9)",
  cursor: "pointer",
  marginTop: "18px",
};

const optionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 10px",
  borderRadius: 12,
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
  border: "1px solid rgba(31,41,55,0.9)",
  fontSize: "13px",
};

const submitButtonStyle: React.CSSProperties = {
  marginTop: 16,
  padding: "8px 16px",
  borderRadius: 999,
  border: 0,
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  color: "#f9fafb",
  background:
    "radial-gradient(circle at 10% 0, #f973ff 0, #a855f7 20%, #6366f1 55%, #4f46e5 100%)",
  boxShadow:
    "0 0 0 1px rgba(129, 140, 248, 0.7), 0 16px 35px rgba(79, 70, 229, 0.7)",
};

const ChapterDetailPage: React.FC = () => {
  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chaptersInCourse, setChaptersInCourse] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ tiap pindah chapter, reset pilihan + state submit
  useEffect(() => {
    setSelectedAnswer(null);
    setSubmitting(false);
  }, [chapterId]);

  // ✅ ambil detail 1 chapter
  useEffect(() => {
    if (!chapterId) return;
    const idNum = Number(chapterId);
    if (Number.isNaN(idNum)) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await chaptersApi.getChapterDetail(idNum); // ApiResponse<Chapter>
        setChapter(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapter. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [chapterId]);

  // ✅ ambil semua chapter dalam course → untuk cari next chapter
  useEffect(() => {
    if (!courseId) return;
    const cid = Number(courseId);
    if (Number.isNaN(cid)) return;

    (async () => {
      try {
        const res = await chaptersApi.getChaptersByCourse(cid); // ApiResponse<Chapter[]>
        setChaptersInCourse(res.data);
      } catch (err) {
        console.error("Failed to load chapters for course", err);
      }
    })();
  }, [courseId]);

  const goToNextChapterOrBack = () => {
    if (!chapter || !courseId) return;

    const idx = chaptersInCourse.findIndex((ch) => ch.id === chapter.id);
    const next = idx >= 0 ? chaptersInCourse[idx + 1] : null;

    if (next) {
      // next chapter
      navigate(`/courses/${courseId}/chapters/${next.id}`, { replace: true });
    } else {
      // sudah chapter terakhir → balik ke course detail
      navigate(`/courses/${courseId}`, { replace: true });
    }
  };

  const handleSubmitQuiz = async () => {
    if (!chapter || selectedAnswer === null) return;

    try {
      setSubmitting(true);

      // kirim jawaban (benar/salah diurus backend + update is_completed)
      await quizApi.submitQuiz({
        chapter_id: chapter.id,
        answer_index: selectedAnswer,
      });

      // ❗ tidak perlu tampilkan benar/salah → langsung ke chapter berikutnya
      goToNextChapterOrBack();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim jawaban, coba lagi sebentar lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div style={pageWrapperStyle}>
        <div style={breadcrumbStyle}>CHAPTER</div>

        {loading && (
          <p
            style={{
              marginTop: 24,
              color: "rgba(148,163,184,0.9)",
              fontSize: 12,
            }}
          >
            Loading chapter...
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

        {!loading && !error && chapter && (
          <>
            <h1 style={headingStyle}>{chapter.title}</h1>
            <p style={subheadingStyle}>
              Chapter #{chapter.chapter_number ?? chapter.id} · Course #
              {chapter.course_id}
            </p>

            {/* Konten chapter */}
            <section style={cardStyle}>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "rgba(226,232,240,0.96)",
                }}
              >
                {chapter.content}
              </div>
            </section>

            {/* Quiz */}
            <section style={quizCardStyle}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Quiz
              </div>
              <p
                style={{
                  fontSize: 13,
                  marginBottom: 12,
                  color: "rgba(226,232,240,0.96)",
                }}
              >
                {chapter.quiz_question}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {chapter.quiz_options.map((option, idx) => (
                  <label key={idx} style={optionStyle}>
                    <input
                      type="radio"
                      name="quiz-option"
                      value={idx}
                      checked={selectedAnswer === idx}
                      onChange={() => setSelectedAnswer(idx)}
                      style={{ accentColor: "#6366f1" }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                style={{
                  ...submitButtonStyle,
                  opacity:
                    submitting || selectedAnswer === null ? 0.6 : 1,
                  cursor:
                    submitting || selectedAnswer === null
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={submitting || selectedAnswer === null}
                onClick={handleSubmitQuiz}
              >
                {submitting ? "Submitting..." : "Submit answer"}
              </button>
            </section>

            <div style={backLinkStyle} onClick={() => navigate(-1)}>
              ← Back
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ChapterDetailPage;
