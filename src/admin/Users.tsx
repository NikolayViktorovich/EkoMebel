import { useState } from "react";
import { delUser, listUsers } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { rub, date } from "@/lib/fmt";
import type { User } from "@/types";
import Badge from "@/ui/Badge";
import Btn from "@/ui/Btn";
import Icon from "@/ui/Icon";
import Modal from "@/ui/Modal";
import { Loader } from "@/ui/Spinner";
import { PanelTitle } from "./parts";
import { useToast } from "@/store/toast";

export default function Users() {
  const { data, loading, reload } = useAsync(listUsers);
  const push = useToast((s) => s.push);
  const [del, setDel] = useState<User | null>(null);

  if (loading) return <Loader />;
  const list = data ?? [];

  const onDelete = async () => {
    if (!del) return;
    await delUser(del.id);
    push("Пользователь удалён", "info");
    setDel(null);
    reload();
  };

  return (
    <>
      <PanelTitle>Пользователи</PanelTitle>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-black/[.06] text-left text-ink-900/50">
                <th className="px-5 py-3 font-semibold">Пользователь</th>
                <th className="px-5 py-3 font-semibold">Телефон</th>
                <th className="px-5 py-3 font-semibold">Роль</th>
                <th className="px-5 py-3 font-semibold">Регистрация</th>
                <th className="px-5 py-3 font-semibold">Заказы</th>
                <th className="px-5 py-3 font-semibold">Потрачено</th>
                <th className="px-5 py-3 text-right font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b border-black/[.04] last:border-0 hover:bg-black/[.015]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-600">
                        {u.name[0]}
                      </span>
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-xs text-ink-900/45">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-ink-900/65">{u.phone ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Badge tone={u.role === "admin" ? "green" : "gray"}>{u.role === "admin" ? "Админ" : "Клиент"}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-ink-900/60">{date(u.joined)}</td>
                  <td className="px-5 py-3 font-semibold">{u.orders}</td>
                  <td className="whitespace-nowrap px-5 py-3 font-bold">{rub(u.spent)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDel(u)}
                        disabled={u.role === "admin"}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-red-300 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                        aria-label="Удалить"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!del} onClose={() => setDel(null)} title="Удалить пользователя?">
        <p className="text-ink-900/60">
          Пользователь <b className="text-ink-900">{del?.name}</b> будет удалён.
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
