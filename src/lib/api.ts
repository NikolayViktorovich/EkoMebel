import type { Order, OrderStatus, Product, Review, User } from "@/types";
import { store } from "./db";

/** Имитация сетевой задержки бэкенда. */
const wait = (ms = 320) => new Promise<void>((r) => setTimeout(r, ms));
const clone = <T>(v: T): T => structuredClone(v);
const uid = () => Math.random().toString(36).slice(2, 10);

/* ───────────────── Товары ───────────────── */

export async function listProducts(): Promise<Product[]> {
  await wait(280);
  return clone(store.get().products);
}

export async function getProduct(id: string): Promise<Product | null> {
  await wait(220);
  return clone(store.get().products.find((p) => p.id === id) ?? null);
}

export async function saveProduct(p: Product): Promise<Product> {
  await wait();
  const list = store.get().products.slice();
  const i = list.findIndex((x) => x.id === p.id);
  if (i >= 0) list[i] = p;
  else list.unshift({ ...p, id: `p${uid()}` });
  store.set({ products: list });
  return clone(i >= 0 ? p : list[0]);
}

export async function delProduct(id: string): Promise<void> {
  await wait();
  store.set({ products: store.get().products.filter((p) => p.id !== id) });
}

/* ───────────────── Заказы ───────────────── */

export async function listOrders(): Promise<Order[]> {
  await wait(280);
  return clone(store.get().orders).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function createOrder(o: Omit<Order, "id" | "date" | "status">): Promise<Order> {
  await wait(600);
  const order: Order = { ...o, id: `${Date.now()}`, date: new Date().toISOString(), status: "pending" };
  // списываем остатки со склада
  const list = store.get().products.map((p) => {
    const it = o.items.find((i) => i.id === p.id);
    return it ? { ...p, stock: Math.max(0, p.stock - it.qty) } : p;
  });
  store.set({ orders: [order, ...store.get().orders], products: list });
  return clone(order);
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await wait(200);
  store.set({ orders: store.get().orders.map((o) => (o.id === id ? { ...o, status } : o)) });
}

/* ───────────────── Отзывы ───────────────── */

export async function listReviews(productId: string): Promise<Review[]> {
  await wait(260);
  return clone(store.get().reviews)
    .filter((r) => r.productId === productId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function addReview(input: Omit<Review, "id" | "date">): Promise<Review> {
  await wait(420);
  const review: Review = { ...input, id: `${input.productId}-${uid()}`, date: new Date().toISOString() };
  // пересчёт среднего рейтинга и счётчика у товара (инкрементальное среднее)
  const products = store.get().products.map((p) => {
    if (p.id !== input.productId) return p;
    const count = p.reviews + 1;
    const rating = Math.round(((p.rating * p.reviews + input.rating) / count) * 10) / 10;
    return { ...p, reviews: count, rating };
  });
  store.set({ reviews: [review, ...store.get().reviews], products });
  return clone(review);
}

/* ───────────────── Пользователи ───────────────── */

export async function listUsers(): Promise<User[]> {
  await wait(260);
  return clone(store.get().users);
}

export async function delUser(id: string): Promise<void> {
  await wait();
  store.set({ users: store.get().users.filter((u) => u.id !== id) });
}
