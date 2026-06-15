import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { cn } from "@/lib/cn";
import { useCart } from "@/store/cart";
import { useFav } from "@/store/fav";
import { useAuth } from "@/store/auth";

const NAV = [
  { to: "/catalog", label: "Каталог" },
  { to: "/about", label: "О нас" },
  { to: "/blog", label: "Блог" },
  { to: "/contacts", label: "Контакты" },
];

export default function Header() {
  const loc = useLocation();
  const nav = useNavigate();
  const onHome = loc.pathname === "/";
  const count = useCart((s) => s.items.reduce((n, l) => n + l.qty, 0));
  const favN = useFav((s) => s.ids.length);
  const user = useAuth((s) => s.user);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [loc.pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    nav(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/[.06] bg-white">
      <div className="wrap flex h-16 items-center gap-3 md:h-[4.5rem] md:gap-5">
        <Logo className="shrink-0" />

        {/* поиск — на десктопе */}
        <form onSubmit={submit} className={cn("relative hidden flex-1 lg:block", !onHome && "lg:max-w-md")}>
          <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск мебели…"
            className="h-11 w-full rounded-xl border border-black/10 bg-cream/60 pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
          />
        </form>

        {/* навигация */}
        <nav className="ml-auto hidden items-center gap-1 md:flex lg:ml-0">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  isActive ? "text-brand-600" : "text-ink-900/70 hover:text-brand-600",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* иконки */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <IconLink to="/favorites" icon="heart" badge={favN} label="Избранное" className="hidden sm:inline-grid" />
          <IconLink to="/cart" icon="cart" badge={count} label="Корзина" />
          <IconLink to={user ? "/account" : "/login"} icon="user" label="Профиль" />
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-900/70 hover:bg-black/5 md:hidden"
            aria-label="Меню"
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {open && <MobileMenu onClose={() => setOpen(false)} onSearch={submit} q={q} setQ={setQ} />}
    </header>
  );
}

function IconLink({
  to,
  icon,
  badge,
  label,
  className,
}: {
  to: string;
  icon: string;
  badge?: number;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn("relative grid h-10 w-10 place-items-center rounded-lg text-ink-900/75 transition hover:bg-black/5 hover:text-brand-600", className)}
    >
      <Icon name={icon} size={22} />
      {!!badge && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileMenu({
  onClose,
  onSearch,
  q,
  setQ,
}: {
  onClose: () => void;
  onSearch: (e: React.FormEvent) => void;
  q: string;
  setQ: (v: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={ref} className="absolute right-0 top-0 h-full w-[82vw] max-w-xs bg-white p-5 shadow-pop">
        <div className="mb-5 flex items-center justify-between">
          <Logo />
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5" aria-label="Закрыть">
            <Icon name="x" />
          </button>
        </div>
        <form onSubmit={onSearch} className="relative mb-4">
          <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-900/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск мебели…" className="field pl-11" />
        </form>
        <nav className="flex flex-col">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="rounded-lg px-3 py-3 text-base font-semibold text-ink-900/80 hover:bg-black/5">
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/favorites" className="rounded-lg px-3 py-3 text-base font-semibold text-ink-900/80 hover:bg-black/5">
            Избранное
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
