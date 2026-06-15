import { Link } from "react-router-dom";
import { listOrders, listProducts, listUsers } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { rub, date } from "@/lib/fmt";
import Badge from "@/ui/Badge";
import { Loader } from "@/ui/Spinner";
import { PanelTitle, Stat } from "./parts";
import { STATUS } from "./status";

export default function Dash() {
  const products = useAsync(listProducts);
  const orders = useAsync(listOrders);
  const users = useAsync(listUsers);

  if (products.loading || orders.loading || users.loading) return <Loader />;

  const os = orders.data ?? [];
  const revenue = os.reduce((s, o) => s + o.total, 0);

  return (
    <>
      <PanelTitle>Дашборд</PanelTitle>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Всего товаров" value={products.data?.length ?? 0} icon="box" tone="green" />
        <Stat label="Заказы" value={os.length} icon="list" tone="blue" />
        <Stat label="Выручка" value={rub(revenue)} icon="card" tone="green" />
        <Stat label="Пользователи" value={users.data?.length ?? 0} icon="users" tone="violet" />
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/[.06] px-5 py-4">
          <h2 className="text-lg font-bold">Последние заказы</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Все заказы
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-black/[.06] text-left text-ink-900/50">
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Дата</th>
                <th className="px-5 py-3 font-semibold">Товары</th>
                <th className="px-5 py-3 font-semibold">Сумма</th>
                <th className="px-5 py-3 font-semibold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {os.slice(0, 5).map((o) => {
                const st = STATUS[o.status];
                const qty = o.items.reduce((n, i) => n + i.qty, 0);
                return (
                  <tr key={o.id} className="border-b border-black/[.04] last:border-0 hover:bg-black/[.015]">
                    <td className="px-5 py-4 font-bold">#{o.id}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink-900/60">{date(o.date)}</td>
                    <td className="px-5 py-4 text-ink-900/60">{qty} поз.</td>
                    <td className="whitespace-nowrap px-5 py-4 font-bold">{rub(o.total)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </td>
                  </tr>
                );
              })}
              {!os.length && (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-ink-900/45">
                    Заказов пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
