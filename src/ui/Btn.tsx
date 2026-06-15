import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost" | "danger" | "white";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  solid: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  outline: "border border-brand-600 text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  ghost: "text-ink-900/70 hover:bg-black/5",
  danger: "border border-red-300 text-red-600 hover:bg-red-50",
  white: "bg-white text-brand-700 hover:bg-brand-50 shadow-sm",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
};

const base =
  "inline-flex select-none items-center justify-center font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

type Common = { variant?: Variant; size?: Size; block?: boolean; className?: string };

export function btnCls({ variant = "solid", size = "md", block, className }: Common) {
  return cn(base, variants[variant], sizes[size], block && "w-full", className);
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & Common;

const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  { variant, size, block, className, ...rest },
  ref,
) {
  return <button ref={ref} className={btnCls({ variant, size, block, className })} {...rest} />;
});

export default Btn;

export function LinkBtn({
  to,
  variant,
  size,
  block,
  className,
  children,
}: Common & { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className={btnCls({ variant, size, block, className })}>
      {children}
    </Link>
  );
}
