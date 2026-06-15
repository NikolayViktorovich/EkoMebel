import { useState } from "react";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { createOrder } from "@/lib/api";
import type { Delivery } from "@/types";
import { rub, plural } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import Crumbs from "@/ui/Crumbs";
import Icon from "@/ui/Icon";
import Qty from "@/ui/Qty";
import Btn, { LinkBtn } from "@/ui/Btn";
import Spinner from "@/ui/Spinner";

type Step = 1 | 2 | 3;

const DELIVERY: { v: Delivery; icon: string; t: string; s: string; cost: number }[] = [
  { v: "courier", icon: "truck", t: "Курьерская доставка", s: "1–3 рабочих дня", cost: 500 },
  { v: "pickup", icon: "pin", t: "Самовывоз", s: "г. Москва, ул. Экологическая, 42", cost: 0 },
  { v: "tk", icon: "box", t: "Транспортная компания", s: "3–7 рабочих дней", cost: 1200 },
];

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const push = useToast((s) => s.push);
  const [step, setStep] = useState<Step>(1);
  const [orderId, setOrderId] = useState("");

  const sub = total();

  if (step === 3)
    return (
      <Shell step={step}>
        <Done orderId={orderId} />
      </Shell>
    );

  if (!items.length)
    return (
      <div className="wrap py-6 sm:py-8">
        <Crumbs items={[{ label: "Главная", to: "/" }, { label: "Корзина" }]} />
        <Title />
        <div className="card mt-6 flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-6xl">🛒</span>
          <h2 className="text-xl font-bold">Корзина пуста</h2>
          <p className="max-w-xs text-ink-900/50">Добавьте товары из каталога, чтобы оформить заказ.</p>
          <LinkBtn to="/catalog" size="lg" className="mt-1">
            Перейти в каталог
          </LinkBtn>
        </div>
      </div>
    );

  return (
    <Shell step={step}>
      {step === 1 ? (
        <Step1
          sub={sub}
          onNext={() => setStep(2)}
          items={items}
          setQty={setQty}
          remove={remove}
          clear={() => {
            clear();
            push("Корзина очищена", "info");
          }}
        />
      ) : (
        <Step2 sub={sub} onBack={() => setStep(1)} onDone={(id) => { setOrderId(id); setStep(3); }} />
      )}
    </Shell>
  );
}

function Shell({ step, children }: { step: Step; children: React.ReactNode }) {
  return (
    <div className="wrap py-6 sm:py-8">
      <Crumbs items={[{ label: "Главная", to: "/" }, { label: "Корзина" }]} />
      <Title />
      <Stepper step={step} />
      {children}
    </div>
  );
}

function Title() {
  return (
    <h1 className="mt-3 flex items-center gap-3 text-3xl font-extrabold tracking-tight">
      <Icon name="cart" size={30} /> Корзина
    </h1>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = ["Корзина", "Оформление", "Готово"];
  return (
    <div className="my-6 flex justify-center">
      <div className="inline-flex overflow-hidden rounded-full bg-brand-50 p-1 ring-1 ring-brand-100">
        {steps.map((s, i) => {
          const n = (i + 1) as Step;
          const active = n === step;
          const done = n < step;
          return (
            <span
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition sm:px-5",
                active ? "bg-ink-900 text-white" : done ? "bg-brand-600 text-white" : "text-ink-900/45",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full text-xs",
                  active ? "bg-white/20" : done ? "bg-white/20" : "bg-black/10",
                )}
              >
                {done ? <Icon name="check" size={12} /> : n}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Шаг 1: корзина ───────── */

function Step1({
  items,
  setQty,
  remove,
  clear,
  sub,
  onNext,
}: {
  items: ReturnType<typeof useCart.getState>["items"];
  setQty: (id: string, n: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  sub: number;
  onNext: () => void;
}) {
  const count = items.reduce((n, l) => n + l.qty, 0);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div>
        {/* десктоп: таблица */}
        <div className="card hidden overflow-hidden sm:block">
          <div className="grid grid-cols-[1fr_8rem_9rem_8rem_3rem] items-center gap-2 bg-brand-50/60 px-5 py-3 text-sm font-semibold text-ink-900/55">
            <span>Товар</span>
            <span>Цена</span>
            <span>Кол-во</span>
            <span>Сумма</span>
            <span />
          </div>
          {items.map((l) => (
            <div key={l.id} className="grid grid-cols-[1fr_8rem_9rem_8rem_3rem] items-center gap-2 border-t border-black/[.06] px-5 py-4">
              <Item l={l} />
              <span className="text-sm">{rub(l.price)}</span>
              <Qty value={l.qty} onChange={(n) => setQty(l.id, n)} size="sm" />
              <span className="font-bold">{rub(l.price * l.qty)}</span>
              <button onClick={() => remove(l.id)} className="grid h-9 w-9 place-items-center rounded-lg bg-red-500 text-white transition hover:bg-red-600" aria-label="Удалить">
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* мобильные карточки */}
        <div className="space-y-3 sm:hidden">
          {items.map((l) => (
            <div key={l.id} className="card p-4">
              <div className="flex justify-between gap-3">
                <Item l={l} />
                <button onClick={() => remove(l.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-500 text-white" aria-label="Удалить">
                  <Icon name="trash" size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Qty value={l.qty} onChange={(n) => setQty(l.id, n)} size="sm" />
                <span className="font-bold">{rub(l.price * l.qty)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Btn variant="outline" onClick={clear}>
            <Icon name="trash" size={16} /> Очистить корзину
          </Btn>
          <LinkBtn to="/catalog" variant="outline">
            <Icon name="arrl" size={16} /> Продолжить покупки
          </LinkBtn>
        </div>
      </div>

      <aside>
        <div className="card sticky top-24 p-6">
          <h2 className="text-xl font-extrabold">Итого</h2>
          <div className="my-4 h-px bg-black/[.06]" />
          <Row l={`Товары (${count} ${plural(count, ["шт.", "шт.", "шт."])})`} v={rub(sub)} />
          <Row l="Доставка" v={<span className="text-ink-900/45">рассчитывается</span>} />
          <div className="my-4 h-px bg-black/[.06]" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold">Итого</span>
            <span className="text-xl font-extrabold text-brand-600">{rub(sub)}</span>
          </div>
          <Btn block size="lg" className="mt-5" onClick={onNext}>
            <Icon name="card" size={18} /> Оформить заказ
          </Btn>
        </div>
      </aside>
    </div>
  );
}

function Item({ l }: { l: { emoji: string; name: string; material: string } }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">{l.emoji}</div>
      <div className="min-w-0">
        <div className="truncate font-semibold leading-snug">{l.name}</div>
        <div className="truncate text-xs text-ink-900/45">{l.material}</div>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-ink-900/60">{l}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

/* ───────── Шаг 2: оформление ───────── */

function Step2({ sub, onBack, onDone }: { sub: number; onBack: () => void; onDone: (id: string) => void }) {
  const { items, clear } = useCart();
  const push = useToast((s) => s.push);
  const [del, setDel] = useState<Delivery>("courier");
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "" });
  const [busy, setBusy] = useState(false);

  const cost = DELIVERY.find((d) => d.v === del)!.cost;
  const total = sub + cost;
  const needAddr = del !== "pickup";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 11 || (needAddr && !f.address.trim())) {
      push("Заполните обязательные поля", "err");
      return;
    }
    setBusy(true);
    try {
      const order = await createOrder({
        items: items.map((l) => ({ id: l.id, name: l.name, material: l.material, price: l.price, qty: l.qty })),
        delivery: del,
        deliveryCost: cost,
        address: needAddr ? f.address.trim() : "Самовывоз",
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || undefined,
        total,
      });
      clear();
      onDone(order.id);
    } catch {
      push("Не удалось оформить заказ", "err");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="card space-y-6 p-6">
        <section>
          <h2 className="text-lg font-extrabold">Данные доставки</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Имя" req>
              <input className="field" placeholder="Ваше имя" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            </Field>
            <Field label="Телефон" req>
              <input className="field" placeholder="+7 (___) ___-__-__" value={f.phone} onChange={(e) => setF({ ...f, phone: phoneMask(e.target.value) })} inputMode="tel" />
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <input className="field" placeholder="email@example.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} type="email" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-extrabold">Способ доставки</h2>
          <div className="mt-4 space-y-3">
            {DELIVERY.map((d) => (
              <label
                key={d.v}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition",
                  del === d.v ? "border-brand-500 bg-brand-50/70 ring-1 ring-brand-500" : "border-black/10 hover:border-brand-300",
                )}
              >
                <input type="radio" name="del" checked={del === d.v} onChange={() => setDel(d.v)} className="sr-only" />
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon name={d.icon} size={20} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{d.t}</span>
                  <span className="block text-sm text-ink-900/50">
                    {d.cost ? `${d.s} • ${rub(d.cost)}` : `Бесплатно • ${d.s}`}
                  </span>
                </span>
                <span className={cn("grid h-5 w-5 place-items-center rounded-full border-2", del === d.v ? "border-brand-600" : "border-black/20")}>
                  {del === d.v && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                </span>
              </label>
            ))}
          </div>
        </section>

        {needAddr && (
          <Field label="Адрес доставки" req>
            <textarea
              className="field min-h-[5rem] resize-none"
              placeholder="Город, улица, дом, квартира"
              value={f.address}
              onChange={(e) => setF({ ...f, address: e.target.value })}
            />
          </Field>
        )}
      </div>

      <aside>
        <div className="card sticky top-24 p-6">
          <h2 className="text-xl font-extrabold">Ваш заказ</h2>
          <div className="my-4 h-px bg-black/[.06]" />
          <div className="space-y-2">
            {items.map((l) => (
              <div key={l.id} className="flex justify-between gap-3 text-sm">
                <span className="text-ink-900/65">
                  {l.name} <span className="text-ink-900/40">×{l.qty}</span>
                </span>
                <span className="shrink-0 font-semibold">{rub(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 h-px bg-black/[.06]" />
          <Row l="Подытог" v={rub(sub)} />
          <Row l="Доставка" v={cost ? rub(cost) : "Бесплатно"} />
          <div className="my-4 h-px bg-black/[.06]" />
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold">Итого</span>
            <span className="text-xl font-extrabold text-brand-600">{rub(total)}</span>
          </div>
          <Btn block size="lg" className="mt-5" type="submit" disabled={busy}>
            {busy ? <Spinner size={18} /> : <Icon name="check" size={18} />}
            {busy ? "Оформляем…" : "Оформить заказ"}
          </Btn>
          <Btn type="button" variant="outline" block className="mt-3" onClick={onBack}>
            <Icon name="arrl" size={16} /> Вернуться в корзину
          </Btn>
        </div>
      </aside>
    </form>
  );
}

function Field({ label, req, className, children }: { label: string; req?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-semibold">
        {label} {req && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function phoneMask(v: string) {
  const d = v.replace(/\D/g, "").replace(/^8/, "7").replace(/^([^7])/, "7$1").slice(0, 11);
  if (!d) return "";
  let r = "+7";
  if (d.length > 1) r += ` (${d.slice(1, 4)}`;
  if (d.length >= 4) r += `) ${d.slice(4, 7)}`;
  if (d.length >= 7) r += `-${d.slice(7, 9)}`;
  if (d.length >= 9) r += `-${d.slice(9, 11)}`;
  return r;
}

/* ───────── Шаг 3: готово ───────── */

function Done({ orderId }: { orderId: string }) {
  return (
    <div className="card mx-auto mt-2 flex max-w-lg flex-col items-center gap-2 py-14 text-center">
      <span className="text-6xl">🎉</span>
      <h2 className="mt-2 text-2xl font-extrabold">Заказ оформлен!</h2>
      <p className="text-ink-900/55">
        Номер заказа: <span className="font-bold text-ink-900">#{orderId}</span>
      </p>
      <p className="mt-1 max-w-xs text-sm text-ink-900/50">Мы свяжемся с вами для подтверждения заказа.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <LinkBtn to="/catalog">
          <Icon name="grid" size={18} /> Продолжить покупки
        </LinkBtn>
        <LinkBtn to="/account" variant="outline">
          Мои заказы
        </LinkBtn>
      </div>
    </div>
  );
}
