import { useState } from "react";
import { delProduct, listProducts, saveProduct } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { CATS } from "@/data/seed";
import type { Cat, Product } from "@/types";
import { rub } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import Icon from "@/ui/Icon";
import Btn from "@/ui/Btn";
import Modal from "@/ui/Modal";
import Rating from "@/ui/Rating";
import Stock from "@/ui/Stock";
import { Loader } from "@/ui/Spinner";
import { PanelTitle } from "./parts";
import { useToast } from "@/store/toast";

export default function Products() {
  const { data, loading, reload } = useAsync(listProducts);
  const push = useToast((s) => s.push);
  const [edit, setEdit] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [del, setDel] = useState<Product | null>(null);

  if (loading) return <Loader />;
  const list = data ?? [];

  const onSave = async (p: Product) => {
    await saveProduct(p);
    push(creating ? "Товар добавлен" : "Товар обновлён");
    setEdit(null);
    setCreating(false);
    reload();
  };

  const onDelete = async () => {
    if (!del) return;
    await delProduct(del.id);
    push("Товар удалён", "info");
    setDel(null);
    reload();
  };

  return (
    <>
      <PanelTitle
        action={
          <Btn
            onClick={() => {
              setCreating(true);
              setEdit(blank());
            }}
          >
            <Icon name="plus" size={18} /> Добавить товар
          </Btn>
        }
      >
        Управление товарами
      </PanelTitle>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-black/[.06] text-left text-ink-900/50">
                <th className="px-5 py-3 font-semibold">Название</th>
                <th className="px-5 py-3 font-semibold">Категория</th>
                <th className="px-5 py-3 font-semibold">Цена</th>
                <th className="px-5 py-3 font-semibold">Остаток</th>
                <th className="px-5 py-3 font-semibold">Рейтинг</th>
                <th className="px-5 py-3 text-right font-semibold">Действия</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-black/[.04] last:border-0 hover:bg-black/[.015]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-xl">{p.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-semibold leading-snug">{p.name}</div>
                        <div className="text-xs text-ink-900/45">{p.material}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-900/65">{p.cat}</td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="font-bold">{rub(p.price)}</div>
                    {p.oldPrice && <div className="text-xs text-ink-900/40 line-through">{rub(p.oldPrice)}</div>}
                  </td>
                  <td className="px-5 py-3">
                    <Stock n={p.stock} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <Rating value={p.rating} reviews={p.reviews} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setCreating(false);
                          setEdit(p);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-brand-300 text-brand-600 transition hover:bg-brand-50"
                        aria-label="Редактировать"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        onClick={() => setDel(p)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-red-300 text-red-500 transition hover:bg-red-50"
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

      {edit && <Form product={edit} creating={creating} onClose={() => { setEdit(null); setCreating(false); }} onSave={onSave} />}

      <Modal open={!!del} onClose={() => setDel(null)} title="Удалить товар?">
        <p className="text-ink-900/60">
          Товар <b className="text-ink-900">«{del?.name}»</b> будет удалён без возможности восстановления.
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

function blank(): Product {
  return {
    id: "", name: "", cat: "Столы", material: "", price: 0, stock: 0, rating: 5, reviews: 0,
    emoji: "🪑", gallery: ["🪑", "🌿", "♻️", "📐"], desc: "", eco: "", specs: [],
  };
}

function Form({ product, creating, onClose, onSave }: { product: Product; creating: boolean; onClose: () => void; onSave: (p: Product) => Promise<void>; }) {
  const [p, setP] = useState<Product>(product);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fixed: Product = { ...p, gallery: [p.emoji, ...p.gallery.slice(1)] };
    await onSave(fixed);
    setBusy(false);
  };

  return (
    <Modal open onClose={onClose} title={creating ? "Новый товар" : "Редактирование товара"} size="lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[5rem_1fr]">
          <L label="Иконка">
            <input className="field text-center text-2xl" value={p.emoji} onChange={(e) => set("emoji", e.target.value)} maxLength={4} />
          </L>
          <L label="Название">
            <input className="field" required value={p.name} onChange={(e) => set("name", e.target.value)} />
          </L>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Категория">
            <div className="relative">
              <select className="field cursor-pointer appearance-none pr-9" value={p.cat} onChange={(e) => set("cat", e.target.value as Cat)}>
                {CATS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}
                  </option>
                ))}
              </select>
              <Icon name="chevd" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-900/40" />
            </div>
          </L>
          <L label="Материал">
            <input className="field" required value={p.material} onChange={(e) => set("material", e.target.value)} />
          </L>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <L label="Цена, ₽">
            <input className="field" type="number" min={0} required value={p.price || ""} onChange={(e) => set("price", +e.target.value)} />
          </L>
          <L label="Старая цена, ₽">
            <input className="field" type="number" min={0} value={p.oldPrice || ""} onChange={(e) => set("oldPrice", +e.target.value || undefined)} />
          </L>
          <L label="Остаток, шт.">
            <input className="field" type="number" min={0} required value={p.stock || ""} onChange={(e) => set("stock", +e.target.value)} />
          </L>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <L label="Рейтинг (0–5)">
            <input className="field" type="number" min={0} max={5} step={0.5} value={p.rating} onChange={(e) => set("rating", +e.target.value)} />
          </L>
          <L label="Кол-во отзывов">
            <input className="field" type="number" min={0} value={p.reviews || ""} onChange={(e) => set("reviews", +e.target.value)} />
          </L>
        </div>

        <L label="Описание">
          <textarea className="field min-h-[4.5rem] resize-none" value={p.desc} onChange={(e) => set("desc", e.target.value)} />
        </L>
        <L label="Экологическая информация">
          <textarea className="field min-h-[4.5rem] resize-none" value={p.eco} onChange={(e) => set("eco", e.target.value)} />
        </L>

        <div className="flex justify-end gap-3 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Btn>
          <Btn type="submit" disabled={busy}>
            <Icon name="check" size={16} /> {busy ? "Сохранение…" : "Сохранить"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={cn("block")}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
