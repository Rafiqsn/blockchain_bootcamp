// src/pages/courses/CoursesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { coursesApi, Course } from "../../api/coursesApi";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await coursesApi.getCourses(); // ApiResponse<Course[]>
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppLayout>
      <div className="courses-page">
        {/* HEADER */}
        <header className="courses-header">
          <p className="courses-kicker">COURSES</p>
          <h1 className="courses-title">
            Browse blockchain bootcamp courses
          </h1>
          <p className="courses-subtitle">
            Pick a track, complete all chapters and quizzes, and mint a
            verifiable certificate on-chain.
          </p>
        </header>

        {/* STATE */}
        {loading && (
          <p className="courses-info">Loading courses...</p>
        )}

        {!loading && error && (
          <p className="courses-error">{error}</p>
        )}

        {/* LIST */}
        {!loading && !error && (
          <section className="courses-list">
            {courses.map((course) => (
              <article
                key={course.id}
                className="course-card"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="course-card-inner">
                  <div className="course-left">
                    <span className="course-track-pill">Core track</span>
                    <h2 className="course-name">{course.title}</h2>
                    <p className="course-description">
                      {course.description}
                    </p>

                    <button
                      type="button"
                      className="course-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      View course details
                    </button>
                  </div>

                  <div className="course-right">
                    <span className="course-level">
                      {course.level || "All levels"}
                    </span>
                    <span className="course-arrow">↗</span>
                  </div>
                </div>
              </article>
            ))}

            {courses.length === 0 && (
              <p className="courses-info">
                No courses available yet.
              </p>
            )}
          </section>
        )}
      </div>

      {/* INLINE STYLES – supaya konsisten dengan Dashboard & Auth */}
      <style>{`
        .courses-page {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 24px 48px;
          color: #f9fafb;
        }

        .courses-header {
          margin-bottom: 20px;
        }

        .courses-kicker {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(129, 140, 248, 0.85);
        }

        .courses-title {
          margin-top: 6px;
          font-size: 26px;
          font-weight: 700;
        }

        .courses-subtitle {
          margin-top: 4px;
          font-size: 13px;
          max-width: 540px;
          color: rgba(148, 163, 184, 0.95);
        }

        .courses-info {
          margin-top: 24px;
          font-size: 12px;
          color: rgba(148, 163, 184, 0.9);
        }

        .courses-error {
          margin-top: 24px;
          font-size: 12px;
          color: #fecaca;
        }

        .courses-list {
          margin-top: 24px;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
        }

        .course-card {
          border-radius: 20px;
          padding: 16px 18px;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 1),
            rgba(15, 23, 42, 0.96)
          );
          box-shadow:
            0 22px 50px rgba(15, 23, 42, 0.95),
            0 0 0 1px rgba(148, 163, 184, 0.22);
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.16s ease,
            border-color 0.16s ease;
        }

        .course-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 26px 60px rgba(15, 23, 42, 1),
            0 0 0 1px rgba(129, 140, 248, 0.55);
        }

        .course-card-inner {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .course-left {
          flex: 1;
        }

        .course-track-pill {
          display: inline-flex;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid rgba(129, 140, 248, 0.7);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c7d2fe;
          margin-bottom: 8px;
        }

        .course-name {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #e5e7eb;
        }

        .course-description {
          font-size: 13px;
          color: rgba(148, 163, 184, 0.95);
        }

        .course-cta {
          margin-top: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 0;
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
          background: linear-gradient(to right, #6366f1, #a855f7);
          box-shadow: 0 12px 28px rgba(79, 70, 229, 0.8);
          cursor: pointer;
        }

        .course-cta:hover {
          filter: brightness(1.05);
        }

        .course-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          font-size: 11px;
          color: rgba(148, 163, 184, 0.95);
          padding-top: 4px;
        }

        .course-arrow {
          font-size: 16px;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .courses-page {
            padding: 24px 18px 32px;
          }
          .course-card-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .course-right {
            align-items: flex-start;
          }
        }
      `}</style>
    </AppLayout>
  );
}
