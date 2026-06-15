import { useState } from "react";
import { delOrder, listOrders, setOrderStatus } from "@/lib/api";
import { useAsync } from "@/lib/use";
import type { Delivery, Order, OrderStatus } from "@/types";
import { rub, date } from "@/lib/fmt";
import Badge from "@/ui/Badge";
import Btn from "@/ui/Btn";
import Icon from "@/ui/Icon";
import Modal from "@/ui/Modal";
import { Loader } from "@/ui/Spinner";
import { PanelTitle } from "./parts";
import { STATUS } from "./status";
import { useToast } from "@/store/toast";

const DEL: Record<Delivery, string> = { courier: "Курьер", pickup: "Самовывоз", tk: "ТК" };

export default function Orders() {
  const { data, loading, reload } = useAsync(listOrders);
  const push = useToast((s) => s.push);
  const [del, setDel] = useState<Order | null>(null);

  const change = async (id: string, status: OrderStatus) => {
    await setOrderStatus(id, status);
    push("Статус заказа обновлён");
    reload();
  };

  const onDelete = async () => {
    if (!del) return;
    await delOrder(del.id);
    push("Заказ удалён", "info");
    setDel(null);
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
                      <div className="flex items-center gap-2">
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
                        <button
                          onClick={() => setDel(o)}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-red-300 text-red-500 transition hover:bg-red-50"
                          aria-label="Удалить заказ"
                        >
                          <Icon name="trash" size={16} />
                        </button>
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

      <Modal open={!!del} onClose={() => setDel(null)} title="Удалить заказ?">
        <p className="text-ink-900/60">
          Заказ <b className="text-ink-900">#{del?.id}</b> будет удалён без возможности восстановления.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Btn variant="ghost" onClick={() => setDel(null)}>
            Отмена
          </Btn>
          <Btn variant="danger" onClick={onDelete}>
            <Icon name="trash" size={16} /> Удалить
          </Btn>
        </div>
      </Modal>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 ${className ?? ""}`}>{children}</td>;
}
