import { cn } from "@/lib/cn";

type Tone = "green" | "red" | "amber" | "blue" | "violet" | "gray";

const tones: Record<Tone, string> = {
  green: "bg-brand-100 text-brand-700",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-sky-100 text-sky-700",
  violet: "bg-violet-100 text-violet-700",
  gray: "bg-black/[.06] text-ink-900/60",
};

export default function Badge({
  tone = "gray",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}
