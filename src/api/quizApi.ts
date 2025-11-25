// src/api/quizApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface QuizSubmitPayload {
  chapter_id: number;
  answer_index: number;
}

// Sesuaikan dengan response backend-mu.
// Kalau backend kirim field tambahan tidak masalah (TypeScript akan tetap oke).
export interface QuizSubmitResult {
  correct: boolean;
  message: string;
  next_chapter_id?: number | null;
}

export const quizApi = {
  submitQuiz: (payload: QuizSubmitPayload) =>
    http.post<ApiResponse<QuizSubmitResult>>("/quiz/submit", payload),
};
