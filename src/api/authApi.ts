// src/api/authApi.ts
import { http } from "./httpClient";

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    http.post<AuthResponse>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    http.post<AuthResponse>("/auth/login", data),

  me: () => http.get<User>("/auth/me"),
};
