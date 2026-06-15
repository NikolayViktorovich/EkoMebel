import { create } from "zustand";
import { persist } from "zustand/middleware";

type Fav = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: () => number;
};

export const useFav = create<Fav>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      count: () => get().ids.length,
    }),
    { name: "ekomebel:fav" },
  ),
);
