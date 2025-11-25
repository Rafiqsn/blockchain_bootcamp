// src/api/quizApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface QuizSubmitPayload {
  chapter_id: number;
  answer_index: number;
}

export interface QuizSubmitResult {
  is_correct: boolean;
  correct_answer_index: number;
  message: string;
}

export const quizApi = {
  submitQuiz: (payload: QuizSubmitPayload) =>
    http.post<ApiResponse<QuizSubmitResult>>("/quiz/submit", payload),
};
