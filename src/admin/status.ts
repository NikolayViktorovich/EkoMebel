import type { OrderStatus } from "@/types";

/** Карта статусов заказа: подпись + цветовой тон бейджа. */
export const STATUS: Record<OrderStatus, { label: string; tone: "amber" | "blue" | "violet" | "green" }> = {
  pending: { label: "Ожидает", tone: "amber" },
  processing: { label: "В обработке", tone: "blue" },
  shipped: { label: "Отправлен", tone: "violet" },
  delivered: { label: "Доставлен", tone: "green" },
};
