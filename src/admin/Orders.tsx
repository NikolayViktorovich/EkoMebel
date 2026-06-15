import { listOrders, setOrderStatus } from "@/lib/api";
import { useAsync } from "@/lib/use";
import type { Delivery, OrderStatus } from "@/types";
import { rub, date } from "@/lib/fmt";
import Badge from "@/ui/Badge";
import Icon from "@/ui/Icon";
import { Loader } from "@/ui/Spinner";
import { PanelTitle } from "./parts";
import { STATUS } from "./status";
import { useToast } from "@/store/toast";

const DEL: Record<Delivery, string> = { courier: "Курьер", pickup: "Самовывоз", tk: "ТК" };

export default function Orders() {
  const { data, loading, reload } = useAsync(listOrders);
  const push = useToast((s) => s.push);

  const change = async (id: string, status: OrderStatus) => {
    await setOrderStatus(id, status);
    push("Статус заказа обновлён");
    reload();
  };

  if (loading) return <Loader />;
  const orders = data ?? [];

  return (
    <>
      <PanelTitle>Управление заказами</PanelTitle>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[60rem] text-sm">
            <thead>
              <tr className="border-b border-black/[.06] text-left text-ink-900/50">
                <Th>ID</Th>
                <Th>Дата</Th>
                <Th>Товары</Th>
                <Th>Доставка</Th>
                <Th>Адрес</Th>
                <Th>Сумма</Th>
                <Th>Статус</Th>
                <Th>Действия</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const st = STATUS[o.status];
                return (
                  <tr key={o.id} className="border-b border-black/[.04] align-top last:border-0 hover:bg-black/[.015]">
                    <Td className="font-bold">#{o.id}</Td>
                    <Td className="whitespace-nowrap text-ink-900/60">{date(o.date)}</Td>
                    <Td>
                      <div className="space-y-0.5">
                        {o.items.map((it) => (
                          <div key={it.id} className="whitespace-nowrap">
                            {it.name} <span className="text-ink-900/40">×{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div>{DEL[o.delivery]}</div>
                      <div className="text-xs text-ink-900/45">{o.deliveryCost ? rub(o.deliveryCost) : "0 ₽"}</div>
                    </Td>
                    <Td className="max-w-[14rem] text-ink-900/60">{o.address}</Td>
                    <Td className="whitespace-nowrap font-bold">{rub(o.total)}</Td>
                    <Td>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </Td>
                    <Td>
                      <div className="relative">
                        <select
                          value={o.status}
                          onChange={(e) => change(o.id, e.target.value as OrderStatus)}
                          className="h-9 cursor-pointer appearance-none rounded-lg border border-black/10 bg-white pl-3 pr-8 text-sm font-medium outline-none focus:border-brand-500"
                        >
                          {(Object.keys(STATUS) as OrderStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {STATUS[s].label}
                            </option>
                          ))}
                        </select>
                        <Icon name="chevd" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-900/40" />
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {!orders.length && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-ink-900/45">
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

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 ${className ?? ""}`}>{children}</td>;
}
