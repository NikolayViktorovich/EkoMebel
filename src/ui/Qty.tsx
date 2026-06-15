import Icon from "./Icon";
import { cn } from "@/lib/cn";

export default function Qty({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-11";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className={cn("inline-flex items-center rounded-xl border border-black/10 bg-white", h)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(w, "grid h-full place-items-center rounded-l-xl text-ink-900/70 transition hover:bg-black/5 disabled:opacity-40")}
        aria-label="Уменьшить"
      >
        <Icon name="minus" size={16} />
      </button>
      <span className="min-w-[2.25rem] text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(w, "grid h-full place-items-center rounded-r-xl text-ink-900/70 transition hover:bg-black/5 disabled:opacity-40")}
        aria-label="Увеличить"
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
