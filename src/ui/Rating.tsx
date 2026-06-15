import { cn } from "@/lib/cn";

/** Звёзды рейтинга на иконках Bootstrap (full / half / empty). */
export default function Rating({
  value,
  reviews,
  size = 14,
  className,
}: {
  value: number;
  reviews?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="inline-flex items-center gap-px" aria-label={`Рейтинг ${value} из 5`} style={{ fontSize: size }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const d = value - i;
          const bi = d >= 0.75 ? "star-fill" : d >= 0.25 ? "star-half" : "star";
          return <i key={i} className={cn(`bi bi-${bi} leading-none`, bi === "star" ? "text-black/20" : "text-amber-400")} />;
        })}
      </span>
      {reviews != null && <span className="text-xs text-ink-900/50">({reviews})</span>}
    </span>
  );
}
