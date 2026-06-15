import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export default function Logo({ to = "/", light = false, className }: { to?: string; light?: boolean; className?: string }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight", className)}>
      <svg width="30" height="30" viewBox="0 0 24 24" className="shrink-0 text-brand-500">
        <path d="M12 21v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7z" fill="currentColor" opacity=".9" />
        <path d="M12 13C12 8 9 5 4 5c0 4 3 7 8 7z" fill="currentColor" opacity=".55" />
      </svg>
      <span className="text-xl leading-none">
        <span className="text-brand-600">Эко</span>
        <span className={light ? "text-white" : "text-ink-900"}>Мебель</span>
      </span>
    </Link>
  );
}
