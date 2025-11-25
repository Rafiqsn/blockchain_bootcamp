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

  const handleAuthSuccess = (rawRes: any) => {
  // backend kirim { success, message, data: { access_token, token_type, user } }
  const payload = rawRes.data ?? rawRes; // kalau nanti authApi sudah mengembalikan data langsung

  const accessToken = payload.access_token;
  const user = payload.user;

  if (!accessToken || !user) {
    console.error("Invalid auth response shape:", rawRes);
    throw new Error("Invalid auth response from server");
  }

  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
  setLoading(false);
};


  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await authApi.login({ email, password });
    handleAuthSuccess(res);
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    const res = await authApi.register({ username, email, password });
    handleAuthSuccess(res);
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
