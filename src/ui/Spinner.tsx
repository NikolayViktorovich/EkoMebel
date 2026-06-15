import { cn } from "@/lib/cn";

export default function Spinner({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Загрузка"
    />
  );
}

/** Полноблочный лоадер по центру. */
export function Loader({ label = "Загрузка…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-900/50">
      <Spinner size={30} className="text-brand-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
