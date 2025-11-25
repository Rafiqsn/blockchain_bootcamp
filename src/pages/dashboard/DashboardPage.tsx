// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { coursesApi, Course } from "../../api/coursesApi";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // asumsi response: { success, message, data }
        const res = await coursesApi.getCourses();
        setCourses(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeCourses = courses.length;
  const certificatesReady = 0;

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "32px 24px 56px",
          color: "#f9fafb",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT – OVERVIEW CARD */}
          <section
            style={{
              borderRadius: "28px",
              padding: "22px 22px 26px",
              background:
                "radial-gradient(circle at 0% 0%, rgba(129,140,248,0.35), transparent 55%), #020617",
              boxShadow:
                "0 36px 80px rgba(15,23,42,0.95), 0 0 0 1px rgba(30,64,175,0.35)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 14px",
                borderRadius: 999,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#e5e7eb",
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(129,140,248,0.7)",
              }}
            >
              Dashboard
            </span>

            <h1
              style={{
                marginTop: 18,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              Welcome back to your dashboard
            </h1>

            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                color: "#cbd5f5",
                maxWidth: 420,
              }}
            >
              Track your quiz progress, explore blockchain courses, and unlock
              verifiable certificates on-chain.
            </p>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <div
                style={{
                  borderRadius: 18,
                  padding: "10px 12px",
                  background:
                    "linear-gradient(135deg,#020617,#020617,rgba(15,23,42,0.95))",
                  boxShadow:
                    "0 20px 45px rgba(15,23,42,0.95), inset 0 0 0 1px rgba(148,163,184,0.2)",
                }}
              >
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Active courses
                </div>
                <div
                  style={{ marginTop: 6, fontSize: 20, fontWeight: 600 }}
                >
                  {activeCourses}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  padding: "10px 12px",
                  background:
                    "linear-gradient(135deg,#020617,#020617,rgba(15,23,42,0.95))",
                  boxShadow:
                    "0 20px 45px rgba(15,23,42,0.95), inset 0 0 0 1px rgba(148,163,184,0.2)",
                }}
              >
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Certificates ready
                </div>
                <div
                  style={{ marginTop: 6, fontSize: 20, fontWeight: 600 }}
                >
                  {certificatesReady}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  padding: "10px 12px",
                  background:
                    "linear-gradient(135deg,#020617,#020617,rgba(15,23,42,0.95))",
                  boxShadow:
                    "0 20px 45px rgba(15,23,42,0.95), inset 0 0 0 1px rgba(148,163,184,0.2)",
                }}
              >
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Time to next quiz
                </div>
                <div
                  style={{ marginTop: 6, fontSize: 20, fontWeight: 600 }}
                >
                  Anytime
                </div>
              </div>
            </div>

            <p
              style={{
                marginTop: 18,
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              Tip: complete all chapters in a course to mint your certificate to
              the Quiz-Chain registry.
            </p>
          </section>

          {/* RIGHT – YOUR COURSES PANEL */}
          <section
            style={{
              borderRadius: 28,
              padding: "22px 22px 26px",
              background:
                "radial-gradient(circle at 0% 0%, rgba(236,72,153,0.3), transparent 60%), #020617",
              boxShadow:
                "0 36px 80px rgba(15,23,42,0.95), 0 0 0 1px rgba(30,64,175,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Your courses
                </h2>
                <p
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: "#cbd5f5",
                  }}
                >
                  Pick a course to continue your learning journey.
                </p>
              </div>
            </div>

            {loading && (
              <p
                style={{
                  marginTop: 18,
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                Loading courses...
              </p>
            )}

            {error && !loading && (
              <p
                style={{
                  marginTop: 18,
                  fontSize: 12,
                  color: "#fecaca",
                }}
              >
                {error}
              </p>
            )}

            {!loading && !error && (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {courses.map((course) => (
                  <article
                    key={course.id}
                    style={{
                      borderRadius: 20,
                      padding: "14px 16px",
                      background:
                        "linear-gradient(135deg,#020617,#020617,rgba(15,23,42,0.96))",
                      boxShadow:
                        "0 18px 45px rgba(15,23,42,0.9), inset 0 0 0 1px rgba(148,163,184,0.2)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        display: "inline-flex",
                        padding: "3px 9px",
                        borderRadius: 999,
                        border: "1px solid rgba(129,140,248,0.65)",
                        color: "#c7d2fe",
                        marginBottom: 8,
                      }}
                    >
                      Core track
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                          }}
                        >
                          {course.title}
                        </h3>
                        <p
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: "#cbd5f5",
                          }}
                        >
                          {course.description}
                        </p>
                        <button
                          type="button"
                          style={{
                            marginTop: 10,
                            padding: "7px 14px",
                            borderRadius: 999,
                            border: 0,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#e5e7eb",
                            background:
                              "radial-gradient(circle at 10% 0,#f973ff 0,#a855f7 25%,#6366f1 60%,#4f46e5)",
                            boxShadow:
                              "0 12px 28px rgba(79,70,229,0.8)",
                          }}
                        >
                          Continue course
                        </button>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 4,
                          fontSize: 11,
                          color: "rgba(148,163,184,0.95)",
                        }}
                      >
                        <span>{course.level || "All levels"}</span>
                        <span style={{ fontSize: 18, opacity: 0.7 }}>↗</span>
                      </div>
                    </div>
                  </article>
                ))}

                {courses.length === 0 && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(148,163,184,0.9)",
                    }}
                  >
                    No courses yet. Your bootcamp catalog will appear here.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
