import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CoursesPage from "../pages/courses/CoursesPage";
import CourseDetailPage from "../pages/courses/CourseDetailPage";
import MyCertificatesPage from "../pages/certificates/MyCertificatesPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ChapterDetailPage from "../pages/courses/ChapterDetailPage";


export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:courseId/chapters/:chapterId"
        element={
          <ProtectedRoute>
            <ChapterDetailPage />
          </ProtectedRoute>
        }
      />
    <Route
      path="/certificates/my"
      element={
        <ProtectedRoute>
          <MyCertificatesPage />
        </ProtectedRoute>
      }
    />


      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
