import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { CATS } from "@/data/seed";

const cols = [
  {
    title: "Магазин",
    links: [
      { to: "/catalog", label: "Каталог" },
      { to: "/favorites", label: "Избранное" },
      { to: "/cart", label: "Корзина" },
      { to: "/account", label: "Личный кабинет" },
    ],
  },
  {
    title: "Компания",
    links: [
      { to: "/about", label: "О нас" },
      { to: "/blog", label: "Блог" },
      { to: "/contacts", label: "Контакты" },
      { to: "/admin", label: "Админ-панель" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/[.06] bg-ink-900 text-white/70">
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Мебель из переработанных материалов. Даём вещам вторую жизнь, заботясь о планете и вашем интерьере.
          </p>
          <div className="flex gap-2 text-white/55">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon name="leaf" size={18} /></span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon name="recycle" size={18} /></span>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Icon name="shield" size={18} /></span>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Категории</h4>
          <ul className="space-y-2.5 text-sm">
            {CATS.map((c) => (
              <li key={c.id}>
                <Link to={`/catalog?cat=${encodeURIComponent(c.id)}`} className="transition-colors hover:text-brand-300">
                  {c.id}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">{col.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-brand-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} ЭкоМебель. Все права защищены.</span>
          <span className="flex items-center gap-1.5">
            <Icon name="pin" size={14} /> г. Москва, ул. Экологическая, 42
          </span>
        </div>
      </div>
    </footer>
  );
}
