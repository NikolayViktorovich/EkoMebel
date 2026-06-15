import { Navigate, Link } from "react-router-dom";
import { listOrders } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { useAuth } from "@/store/auth";
import { useFav } from "@/store/fav";
import { useToast } from "@/store/toast";
import PageHead from "@/ui/PageHead";
import Icon from "@/ui/Icon";
import Btn, { LinkBtn } from "@/ui/Btn";
import Badge from "@/ui/Badge";
import { Loader } from "@/ui/Spinner";
import { rub, date } from "@/lib/fmt";
import { STATUS } from "@/admin/status";

export default function Account() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const favN = useFav((s) => s.ids.length);
  const push = useToast((s) => s.push);
  const { data, loading } = useAsync(listOrders);

  if (!user) return <Navigate to="/login" replace />;

  const orders = data ?? [];

  return (
    <>
      <PageHead crumb={[{ label: "Главная", to: "/" }, { label: "Личный кабинет" }]} title={`Привет, ${user.name}!`} sub={user.email} />
      <section className="wrap grid gap-8 py-12 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-4">
          <div className="card p-6 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-3xl font-extrabold text-brand-600">
              {user.name[0]?.toUpperCase()}
            </div>
            <h2 className="mt-3 font-bold">{user.name}</h2>
            <p className="text-sm text-ink-900/50">{user.email}</p>
            {user.role === "admin" && (
              <Badge tone="green" className="mt-2">
                Администратор
              </Badge>
            )}
          </div>

          <div className="card divide-y divide-black/[.06]">
            <Link to="/favorites" className="flex items-center gap-3 px-5 py-4 hover:bg-black/[.02]">
              <Icon name="heart" size={18} className="text-brand-600" /> Избранное
              <span className="ml-auto rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">{favN}</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-3 px-5 py-4 hover:bg-black/[.02]">
              <Icon name="cart" size={18} className="text-brand-600" /> Корзина
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="flex items-center gap-3 px-5 py-4 hover:bg-black/[.02]">
                <Icon name="cog" size={18} className="text-brand-600" /> Админ-панель
              </Link>
            )}
          </div>

          <Btn
            variant="outline"
            block
            onClick={() => {
              logout();
              push("Вы вышли из аккаунта", "info");
            }}
          >
            <Icon name="out" size={18} /> Выйти
          </Btn>
        </aside>

        <div>
          <h2 className="mb-4 text-xl font-extrabold">Мои заказы</h2>
          {loading ? (
            <Loader />
          ) : orders.length ? (
            <div className="space-y-4">
              {orders.map((o) => {
                const st = STATUS[o.status];
                return (
                  <div key={o.id} className="card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">#{o.id}</span>
                        <span className="text-sm text-ink-900/45">{date(o.date)}</span>
                      </div>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-ink-900/65">
                      {o.items.map((it) => (
                        <div key={it.id} className="flex justify-between gap-3">
                          <span>
                            {it.name} <span className="text-ink-900/40">×{it.qty}</span>
                          </span>
                          <span className="shrink-0 font-semibold">{rub(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-black/[.06] pt-3">
                      <span className="text-sm text-ink-900/50">Итого</span>
                      <span className="font-extrabold text-brand-600">{rub(o.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-3 py-16 text-center">
              <span className="text-5xl">📦</span>
              <p className="font-semibold">У вас пока нет заказов</p>
              <LinkBtn to="/catalog">Перейти в каталог</LinkBtn>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
