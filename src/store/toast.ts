import { create } from "zustand";

export type Toast = { id: number; msg: string; kind: "ok" | "err" | "info" };

type State = {
  list: Toast[];
  push: (msg: string, kind?: Toast["kind"]) => void;
  drop: (id: number) => void;
};

export const useToast = create<State>((set) => ({
  list: [],
  push: (msg, kind = "ok") => {
    const id = Date.now() + Math.random();
    set((s) => ({ list: [...s.list, { id, msg, kind }] }));
    setTimeout(() => set((s) => ({ list: s.list.filter((t) => t.id !== id) })), 2600);
  },
  drop: (id) => set((s) => ({ list: s.list.filter((t) => t.id !== id) })),
}));
