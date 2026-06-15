import { useToast } from "@/store/toast";
import Icon from "./Icon";
import { cn } from "@/lib/cn";

const map = {
  ok: { icon: "check", cls: "bg-brand-600 text-white" },
  err: { icon: "x", cls: "bg-red-600 text-white" },
  info: { icon: "info", cls: "bg-ink-900 text-white" },
} as const;

export default function Toaster() {
  const list = useToast((s) => s.list);
  const drop = useToast((s) => s.drop);
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
      {list.map((t) => {
        const m = map[t.kind];
        return (
          <div
            key={t.id}
            onClick={() => drop(t.id)}
            className={cn(
              "pointer-events-auto flex cursor-pointer items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-pop",
              m.cls,
            )}
          >
            <Icon name={m.icon} size={18} />
            <span className="leading-snug">{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
