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

const feedbackBaseStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  padding: "8px 10px",
  borderRadius: 10,
};

const ChapterDetailPage: React.FC = () => {
  const { courseId, chapterId } = useParams<{
    courseId: string;
    chapterId: string;
  }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  // reset state ketika pindah chapter
  useEffect(() => {
    setSelectedAnswer(null);
    setSubmitting(false);
    setFeedback(null);
    setFeedbackIsError(false);
  }, [chapterId]);

  // ambil detail chapter
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

  const handleSubmitQuiz = async () => {
    if (!chapter || selectedAnswer === null) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await quizApi.submitQuiz({
        chapter_id: chapter.id,
        answer_index: selectedAnswer,
      }); // ApiResponse<{ is_correct, correct_answer_index, message }>

      const result = res.data;
      if (!result) {
        throw new Error("Invalid quiz response from server");
      }

      if (result.is_correct) {
        // jawaban benar → tampilkan pesan, lalu balik ke course detail
        setFeedbackIsError(false);
        setFeedback(result.message || "Correct answer! Chapter completed.");

        if (courseId) {
          setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 900);
        }
      } else {
        // jawaban salah → tampilkan pesan, tetap di halaman ini
        setFeedbackIsError(true);
        setFeedback(result.message || "Wrong answer. Please try again.");
        // user bisa ganti pilihan & submit ulang
      }
    } catch (err) {
      console.error(err);
      setFeedbackIsError(true);
      setFeedback("Failed to submit answer. Please try again in a moment.");
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

              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
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

              {feedback && (
                <p
                  style={{
                    ...feedbackBaseStyle,
                    backgroundColor: feedbackIsError
                      ? "rgba(127,29,29,0.7)"
                      : "rgba(22,163,74,0.35)",
                    border: feedbackIsError
                      ? "1px solid rgba(248,113,113,0.8)"
                      : "1px solid rgba(22,163,74,0.8)",
                    color: feedbackIsError ? "#fee2e2" : "#bbf7d0",
                  }}
                >
                  {feedback}
                </p>
              )}
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
