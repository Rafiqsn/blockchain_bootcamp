// src/components/courses/CourseCard.tsx
import { Link } from "react-router-dom";
import type { Course } from "../../api/coursesApi";

interface Props {
  course: Course;
}

export function CourseCard({ course }: Props) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-500 hover:bg-slate-900 transition"
    >
      <div className="mb-1 text-xs uppercase tracking-[0.12em] text-indigo-400">
        Course
      </div>
      <div className="text-lg font-semibold text-slate-50">
        {course.title}
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-slate-400">
        {course.description}
      </p>
      <div className="mt-3 text-xs text-slate-500">{course.level}</div>
    </Link>
  );
}
