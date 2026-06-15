import Icon from "@/ui/Icon";
import { cn } from "@/lib/cn";

export function PanelTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-extrabold tracking-tight">{children}</h1>
      {action}
    </div>
  );
}

const tones = {
  green: "bg-brand-100 text-brand-600",
  blue: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
} as const;

export function Stat({
  label,
  value,
  icon,
  tone = "green",
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
  tone?: keyof typeof tones;
}) {
  return (
    <div className="card flex items-center justify-between p-5">
      <div className="min-w-0">
        <div className="text-sm text-ink-900/50">{label}</div>
        <div className="mt-1 truncate text-2xl font-extrabold sm:text-3xl">{value}</div>
      </div>
      <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon name={icon} size={24} />
      </span>
    </div>
  );
}

/** Обёртка для прокручиваемой таблицы. */
export function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      {title && <h2 className="border-b border-black/[.06] px-5 py-4 text-lg font-bold">{title}</h2>}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
