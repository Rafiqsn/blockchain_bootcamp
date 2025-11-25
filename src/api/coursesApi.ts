// src/api/coursesApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string | null;

  // field tambahan dari backend (boleh optional)
  total_chapters?: number; // dari response /courses/{id}
  user_progress?: number;  // jumlah chapter yang sudah user selesaikan
}

export const coursesApi = {
  // list course (dashboard / courses page)
  getCourses: () => http.get<ApiResponse<Course[]>>("/courses"),

  // detail course (punya total_chapters & user_progress)
  getCourseDetail: (courseId: number) =>
    http.get<ApiResponse<Course>>(`/courses/${courseId}`),
};
