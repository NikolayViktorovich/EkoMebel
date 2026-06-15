import { cn } from "@/lib/cn";

/** Текстовый статус наличия по остатку. */
export default function Stock({ n, className }: { n: number; className?: string }) {
  if (n <= 0) return <span className={cn("text-sm font-semibold text-red-500", className)}>Нет в наличии</span>;
  if (n <= 5)
    return <span className={cn("text-sm font-semibold text-amber-600", className)}>Осталось {n} шт.</span>;
  return <span className={cn("text-sm font-semibold text-brand-600", className)}>В наличии</span>;
}
