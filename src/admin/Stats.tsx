import { listOrders, listProducts } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { rub, num } from "@/lib/fmt";
import { Loader } from "@/ui/Spinner";
import { PanelTitle, Stat } from "./parts";
import { STATUS } from "./status";
import type { OrderStatus } from "@/types";

export default function Stats() {
  const products = useAsync(listProducts);
  const orders = useAsync(listOrders);

  if (products.loading || orders.loading) return <Loader />;
  const ps = products.data ?? [];
  const os = orders.data ?? [];

  const revenue = os.reduce((s, o) => s + o.total, 0);
  const avg = os.length ? Math.round(revenue / os.length) : 0;
  const stockUnits = ps.reduce((s, p) => s + p.stock, 0);

  const catMap = new Map<string, number>();
  const pcat = new Map(ps.map((p) => [p.id, p.cat]));
  for (const o of os)
    for (const it of o.items) {
      const c = pcat.get(it.id) ?? "Прочее";
      catMap.set(c, (catMap.get(c) ?? 0) + it.price * it.qty);
    }
  const cats = [...catMap.entries()].sort((a, b) => b[1] - a[1]);
  const catMax = Math.max(1, ...cats.map((c) => c[1]));

  const stMap = new Map<OrderStatus, number>();
  for (const o of os) stMap.set(o.status, (stMap.get(o.status) ?? 0) + 1);

  const top = [...ps].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const topMax = Math.max(1, ...top.map((p) => p.reviews));

  return (
    <>
      <PanelTitle>Статистика</PanelTitle>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Выручка" value={rub(revenue)} icon="card" tone="green" />
        <Stat label="Средний чек" value={rub(avg)} icon="chart" tone="blue" />
        <Stat label="Всего заказов" value={os.length} icon="list" tone="violet" />
        <Stat label="Единиц на складе" value={num(stockUnits)} icon="box" tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-5 text-lg font-bold">Выручка по категориям</h2>
          <div className="space-y-4">
            {cats.map(([c, v]) => (
              <div key={c}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink-900/65">{c}</span>
                  <span className="font-semibold">{rub(v)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/[.06]">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(v / catMax) * 100}%` }} />
                </div>
              </div>
            ))}
            {!cats.length && <p className="text-sm text-ink-900/45">Нет данных</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-5 text-lg font-bold">Заказы по статусам</h2>
          <div className="space-y-4">
            {(Object.keys(STATUS) as OrderStatus[]).map((s) => {
              const n = stMap.get(s) ?? 0;
              const pct = os.length ? Math.round((n / os.length) * 100) : 0;
              const color = { amber: "bg-amber-400", blue: "bg-sky-400", violet: "bg-violet-400", green: "bg-brand-500" }[STATUS[s].tone];
              return (
                <div key={s}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-ink-900/65">{STATUS[s].label}</span>
                    <span className="font-semibold">{n} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/[.06]">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h2 className="mb-5 text-lg font-bold">Топ товаров по отзывам</h2>
        <div className="space-y-4">
          {top.map((p) => (
            <div key={p.id} className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-xl">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{p.name}</span>
                  <span className="shrink-0 font-semibold text-ink-900/55">{p.reviews} отзывов</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/[.06]">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(p.reviews / topMax) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
