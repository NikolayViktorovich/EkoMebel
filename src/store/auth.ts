import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";

export type Account = { name: string; email: string; role: Role };

type Auth = {
  user: Account | null;
  login: (email: string, name?: string) => Account;
  logout: () => void;
  isAdmin: () => boolean;
};

// демо-авторизация: admin@ekomebel.ru / любой пароль -> роль admin
export const useAuth = create<Auth>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, name) => {
        const role: Role = email.trim().toLowerCase() === "admin@ekomebel.ru" ? "admin" : "user";
        const acc: Account = {
          email: email.trim(),
          name: name?.trim() || (role === "admin" ? "Администратор" : email.split("@")[0]),
          role,
        };
        set({ user: acc });
        return acc;
      },
      logout: () => set({ user: null }),
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "ekomebel:auth" },
  ),
);
