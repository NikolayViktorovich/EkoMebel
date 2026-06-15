import { useState } from "react";
import type { Review } from "@/types";
import { addReview, listReviews } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { date, plural } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import Rating from "./Rating";
import Btn from "./Btn";
import Icon from "./Icon";
import Spinner from "./Spinner";
import { Loader } from "./Spinner";
import { useToast } from "@/store/toast";

export default function Reviews({
  productId,
  rating,
  count,
  onChange,
}: {
  productId: string;
  rating: number;
  count: number;
  onChange?: () => void;
}) {
  const { data, loading, reload } = useAsync(() => listReviews(productId), [productId]);
  const push = useToast((s) => s.push);
  const [open, setOpen] = useState(false);

  const list = data ?? [];
  const dist = distribution(rating, count);

  const onAdded = () => {
    reload();
    onChange?.();
    setOpen(false);
    push("Спасибо! Ваш отзыв опубликован");
  };

  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Отзывы <span className="text-ink-900/35">{count}</span>
        </h2>
        <Btn variant="outline" onClick={() => setOpen((v) => !v)}>
          <Icon name="edit" size={16} /> Оставить отзыв
        </Btn>
      </div>

      <div className="card grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="flex flex-col items-center justify-center border-b border-black/[.06] pb-6 text-center sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
          <div className="text-5xl font-extrabold">{rating.toFixed(1)}</div>
          <Rating value={rating} size={18} className="mt-2" />
          <div className="mt-1.5 text-sm text-ink-900/50">
            {count} {plural(count, ["отзыв", "отзыва", "отзывов"])}
          </div>
        </div>
        <div className="space-y-2">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-3 text-sm">
              <span className="flex w-10 shrink-0 items-center gap-1 text-ink-900/60">
                {d.star} <i className="bi bi-star-fill text-amber-400" style={{ fontSize: 11 }} />
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[.06]">
                <div className="h-full rounded-full bg-amber-400" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right tabular-nums text-ink-900/50">{d.n}</span>
            </div>
          ))}
        </div>
      </div>

      {open && <Form productId={productId} onAdded={onAdded} onCancel={() => setOpen(false)} />}

      <div className="mt-6">
        {loading ? (
          <Loader label="Загрузка отзывов…" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((r) => (
              <Item key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Item({ r }: { r: Review }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 font-bold text-brand-600">
          {r.author[0]}
        </span>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{r.author}</div>
          <div className="text-xs text-ink-900/45">{date(r.date)}</div>
        </div>
        <Rating value={r.rating} className="ml-auto" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-900/70">{r.text}</p>
    </div>
  );
}

function Form({ productId, onAdded, onCancel }: { productId: string; onAdded: () => void; onCancel: () => void }) {
  const push = useToast((s) => s.push);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || text.trim().length < 10) {
      return push("Укажите имя и отзыв (от 10 символов)", "err");
    }
    setBusy(true);
    try {
      await addReview({ productId, author: author.trim(), rating, text: text.trim() });
      onAdded();
    } catch {
      push("Не удалось отправить отзыв", "err");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mt-4 space-y-4 p-6">
      <h3 className="text-lg font-bold">Ваш отзыв</h3>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Имя</span>
          <input className="field" placeholder="Как вас зовут" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Оценка</span>
          <div className="flex h-11 items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                aria-label={`${s} из 5`}
                className={cn("text-2xl leading-none transition-colors", (hover || rating) >= s ? "text-amber-400" : "text-black/20")}
              >
                <i className="bi bi-star-fill" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Отзыв</span>
        <textarea
          className="field min-h-[6rem] resize-none"
          placeholder="Поделитесь впечатлениями о товаре"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="flex justify-end gap-3">
        <Btn type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Btn>
        <Btn type="submit" disabled={busy}>
          {busy ? <Spinner size={16} /> : <Icon name="check" size={16} />} Опубликовать
        </Btn>
      </div>
    </form>
  );
}

function distribution(rating: number, count: number) {
  const base =
    rating >= 4.5 ? [0.7, 0.2, 0.06, 0.025, 0.015] : rating >= 4 ? [0.5, 0.28, 0.13, 0.06, 0.03] : [0.36, 0.3, 0.2, 0.09, 0.05];
  const ns = base.map((b) => Math.round(b * count));
  const diff = count - ns.reduce((a, b) => a + b, 0);
  ns[0] = Math.max(0, ns[0] + diff);
  const max = Math.max(1, ...ns);
  return ns.map((n, i) => ({ star: 5 - i, n, pct: (n / max) * 100 }));
}
