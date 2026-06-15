import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export type Line = {
  id: string;
  name: string;
  material: string;
  price: number;
  emoji: string;
  qty: number;
};

type Cart = {
  items: Line[];
  add: (p: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

export const useCart = create<Cart>()(
  persist(
    (set, get) => ({
      items: [],
      add: (p, qty = 1) =>
        set((s) => {
          const i = s.items.findIndex((l) => l.id === p.id);
          if (i >= 0) {
            const items = s.items.slice();
            items[i] = { ...items[i], qty: items[i].qty + qty };
            return { items };
          }
          return {
            items: [...s.items, { id: p.id, name: p.name, material: p.material, price: p.price, emoji: p.emoji, qty }],
          };
        }),
      setQty: (id, qty) =>
        set((s) => ({ items: s.items.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((l) => l.id !== id) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, l) => n + l.qty, 0),
      total: () => get().items.reduce((n, l) => n + l.qty * l.price, 0),
    }),
    { name: "ekomebel:cart" },
  ),
);
