// src/components/courses/ChapterList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { chaptersApi, Chapter } from "../../api/chaptersApi";

interface ChapterListProps {
  courseId: number;
}

export const ChapterList: React.FC<ChapterListProps> = ({ courseId }) => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await chaptersApi.getChaptersByCourse(courseId);
        setChapters(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapters.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) {
    return (
      <p
        style={{
          fontSize: 12,
          color: "rgba(148,163,184,0.9)",
          marginTop: 12,
        }}
      >
        Loading chapters...
      </p>
    );
  }

  if (error) {
    return (
      <p
        style={{
          fontSize: 12,
          color: "#fecaca",
          marginTop: 12,
        }}
      >
        {error}
      </p>
    );
  }

  if (chapters.length === 0) {
    return (
      <p
        style={{
          fontSize: 12,
          color: "rgba(148,163,184,0.9)",
          marginTop: 12,
        }}
      >
        This course doesn&apos;t have any chapters yet.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginTop: 18,
      }}
    >
      {chapters.map((chapter, index) => (
        <div
          key={chapter.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.9))",
            border: "1px solid rgba(31,41,55,0.9)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {index + 1}. {chapter.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(148,163,184,0.95)",
              }}
            >
              Chapter #{chapter.chapter_number ?? index + 1}
            </div>
          </div>

          <button
            type="button"
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: 0,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: "#e5e7eb",
              background:
                "radial-gradient(circle at 0 0, rgba(236,72,153,0.9), rgba(129,140,248,0.9))",
            }}
            onClick={() =>
              navigate(`/courses/${courseId}/chapters/${chapter.id}`)
            }
          >
            Open chapter
          </button>
        </div>
      ))}
    </div>
  );
};
