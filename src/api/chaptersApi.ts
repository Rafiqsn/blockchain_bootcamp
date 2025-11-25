// src/api/chaptersApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface Chapter {
  id: number;
  course_id: number;
  chapter_number: number;
  title: string;
  content: string;
  quiz_question: string;
  quiz_options: string[];
  is_completed: boolean;
}

// untuk list chapter per course
export const chaptersApi = {
  getChaptersByCourse: (courseId: number) =>
    http.get<ApiResponse<Chapter[]>>(`/chapters/course/${courseId}`),

  // untuk detail satu chapter
  getChapterDetail: (chapterId: number) =>
    http.get<ApiResponse<Chapter>>(`/chapters/${chapterId}`),
};
