import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "@/api/client";
import type { User } from "@/types";
import { getToken, setToken, clearToken } from "./tokenStorage";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setAuthToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuthToken(null);
    setUser(null);
  }, []);

  const hydrate = useCallback(async () => {
    try {
      const stored = getToken();
      if (!stored) return;
      const { data } = await api.get("/users", { params: { limit: 1 } });
      setAuthToken(stored);
      setUser(data[0]);
    } catch {
      logout();
    }
  }, [logout]);

  const value = useMemo(
    () => ({ token, user, login, logout, hydrate }),
    [token, user, login, logout, hydrate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
};
