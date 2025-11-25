// src/api/coursesApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
}

export const coursesApi = {
  getCourses: () => http.get<ApiResponse<Course[]>>("/courses"),

  getCourseDetail: (courseId: number) =>
    http.get<ApiResponse<Course>>(`/courses/${courseId}`),
};
