import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Icon from "@/ui/Icon";
import { cn } from "@/lib/cn";
import { useAuth } from "@/store/auth";
import Login from "@/pages/Login";

const NAV = [
  { to: "/admin", end: true, icon: "grid", label: "Дашборд" },
  { to: "/admin/products", icon: "box", label: "Товары" },
  { to: "/admin/orders", icon: "list", label: "Заказы" },
  { to: "/admin/users", icon: "users", label: "Пользователи" },
  { to: "/admin/stats", icon: "chart", label: "Статистика" },
];

export default function Admin() {
  const isAdmin = useAuth((s) => s.user?.role === "admin");
  const [open, setOpen] = useState(false);

  if (!isAdmin) return <Login />;

  const Side = (
    <nav className="flex flex-col gap-1 p-3">
      <div className="mb-2 flex items-center gap-2 px-3 py-2 text-sm font-bold text-brand-400">
        <Icon name="cog" size={18} /> Панель управления
      </div>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              isActive ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/90",
            )
          }
        >
          <Icon name={n.icon} size={18} /> {n.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/[.06] bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-black/5 lg:hidden" aria-label="Меню">
            <Icon name="menu" />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-brand-600">Эко</span>Мебель
            </span>
            <span className="rounded-md bg-ink-900 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">ADMIN</span>
          </Link>
        </div>
        <Link
          to="/"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-brand-600 px-4 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          <Icon name="ext" size={16} /> На сайт
        </Link>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 bg-ink-900 lg:block">{Side}</aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-64 bg-ink-900">
              <div className="flex items-center justify-between px-4 py-4">
                <span className="font-bold text-white">Меню</span>
                <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/10">
                  <Icon name="x" />
                </button>
              </div>
              {Side}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
