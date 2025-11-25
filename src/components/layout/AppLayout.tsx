// src/components/layout/AppLayout.tsx
import type React from "react";
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  background:
    "radial-gradient(circle at top left, #1f2937 0, #020617 45%, #020617 100%)",
  color: "#f9fafb",
  padding: "24px 32px 32px",
  boxSizing: "border-box",
};

const contentStyle: React.CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 24,
};

const navbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 20px",
  borderRadius: 999,
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.98))",
  boxShadow: "0 18px 40px rgba(15,23,42,0.7)",
  border: "1px solid rgba(148,163,184,0.25)",
};

const brandStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const brandLogoStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background:
    "radial-gradient(circle at 30% 0, #f97316, #e11d48 45%, #4f46e5 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 30px rgba(168,85,247,0.7)",
};

const navLinksStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  marginTop: 24,
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // aktif jika path persis atau prefix (misal /courses dan /courses/1)
  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <div style={shellStyle}>
      <div style={contentStyle}>
        {/* NAVBAR */}
        <header style={navbarStyle}>
          <div style={brandStyle}>
            <div style={brandLogoStyle}>⚡</div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#9ca3af",
                }}
              >
                Blockchain Bootcamp
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#e5e7eb",
                  opacity: 0.8,
                }}
              >
                Quiz-Chain Certificate Registry
              </div>
            </div>
          </div>

          <nav style={navLinksStyle}>
            {/* Dashboard */}
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "8px 18px",
                borderRadius: 999,
                border: "none",
                fontSize: 13,
                cursor: "pointer",
                background: isActive("/")
                  ? "radial-gradient(circle at 0 0, #a855f7, #4f46e5)"
                  : "transparent",
                color: "#f9fafb",
                boxShadow: isActive("/")
                  ? "0 0 25px rgba(129,140,248,0.8)"
                  : "none",
                transition: "all 0.18s ease",
              }}
            >
              Dashboard
            </button>

            {/* Courses → /courses (BUKAN /courses/1) */}
            <Link
              to="/courses"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                textDecoration: "none",
                color: isActive("/courses") ? "#e5e7eb" : "#9ca3af",
                background: isActive("/courses")
                  ? "rgba(30,64,175,0.65)"
                  : "transparent",
              }}
            >
              Courses
            </Link>

            {/* My Certificates */}
            <Link
              to="/certificates/my"
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 13,
                textDecoration: "none",
                color: isActive("/certificates/my") ? "#e5e7eb" : "#9ca3af",
                background: isActive("/certificates/my")
                  ? "rgba(30,64,175,0.65)"
                  : "transparent",
              }}
            >
              My Certificates
            </Link>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main style={mainStyle}>{children}</main>
      </div>
    </div>
  );
}
