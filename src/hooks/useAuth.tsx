// src/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi, User, AuthResponse } from "../api/authApi";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ambil user dari localStorage saat pertama kali load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Failed to parse stored user, clearing it:", err);
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  /**
   * Normalisasi response login:
   * - bisa langsung `AuthResponse`
   * - atau `ApiResponse<AuthResponse>` yang dibungkus `data`
   */
  const handleAuthSuccess = (raw: AuthResponse | { data: AuthResponse }) => {
    // kalau ada .data pakai itu, kalau tidak pakai objeknya langsung
    const payload: AuthResponse = (raw as any).data ?? (raw as AuthResponse);

    const accessToken = payload.access_token;
    const user = payload.user;

    if (!accessToken || !user) {
      console.error("Invalid auth response shape:", raw);
      throw new Error("Invalid auth response from server");
    }

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password }); // <== AuthResponse atau ApiResponse<AuthResponse>
      handleAuthSuccess(res);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  /**
   * Register TIDAK lagi memaksa shape response punya access_token.
   * Setelah register sukses, kita auto-login pakai email & password yang sama.
   */
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // backend register biasanya balikin { success, message, data: { user } } tanpa token
      await authApi.register({ username, email, password });

      // auto login setelah register berhasil
      const loginRes = await authApi.login({ email, password });
      handleAuthSuccess(loginRes);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
