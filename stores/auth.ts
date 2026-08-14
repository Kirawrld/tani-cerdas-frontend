// stores/auth.ts - Zustand auth store with localStorage persistence
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
    commodity: "kakao" | "padi" | "both";
  }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      login: async (email, password) => {
        const res = await api.post("/api/auth/login", { email, password });
        const { access_token, refresh_token } = res.data;
        // Simpan ke Zustand state
        set({ accessToken: access_token, refreshToken: refresh_token });
        // Simpan ke localStorage agar axios interceptor bisa baca
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        await get().fetchProfile();
      },

      register: async (data) => {
        const res = await api.post("/api/auth/register", data);
        set({ user: res.data });
        // Auto-login after register
        await get().login(data.email, data.password);
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      },

      fetchProfile: async () => {
        const res = await api.get("/api/auth/me");
        set({ user: res.data });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
