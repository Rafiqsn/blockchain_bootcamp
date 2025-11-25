// src/api/certificatesApi.ts
import { http } from "./httpClient";
import { ApiResponse } from "./types";

export interface Certificate {
  id: number;
  certificate_id: string;
  course_title: string;
  issued_at: string;
  on_chain: boolean;

  // field tambahan dari backend (boleh optional kalau tidak selalu ada)
  user_id?: number;
  chapters_completed?: number;
  certificate_hash?: string;
  tx_hash?: string;
  block_number?: number;
  created_at?: string;
}

export const certificatesApi = {
  // dipakai di CourseDetailPage (claim by course_id)
  claimCertificate: (courseId: number) =>
    http.post<ApiResponse<Certificate>>("/certificates/claim", {
      course_id: courseId,
    }),

  // alias (kalau masih ada kode lama yang pakai certificatesApi.claim)
  claim: (courseId: number) =>
    http.post<ApiResponse<Certificate>>("/certificates/claim", {
      course_id: courseId,
    }),

  myCertificates: () =>
    http.get<ApiResponse<Certificate[]>>("/certificates/my-certificates"),

  // ✅ verify juga balikin ApiResponse<Certificate> biar bisa pakai res.data
  verify: (certificateId: string) =>
    http.post<ApiResponse<Certificate>>("/certificates/verify", {
      certificate_id: certificateId,
    }),
};
