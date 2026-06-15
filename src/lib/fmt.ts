/** Формат цены: 45900 -> "45 900 ₽" */
export const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

/** Только число с разделителями: 45900 -> "45 900" */
export const num = (n: number) => n.toLocaleString("ru-RU");

/** ISO -> "20.02.2026" */
export const date = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

/** Склонение: plural(2, ["товар","товара","товаров"]) -> "товара" */
export const plural = (n: number, f: [string, string, string]) => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1 && b < 5) return f[1];
  if (b === 1) return f[0];
  return f[2];
};
