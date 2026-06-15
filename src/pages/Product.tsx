import { useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct, listProducts } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { rub } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import Crumbs from "@/ui/Crumbs";
import Icon from "@/ui/Icon";
import Rating from "@/ui/Rating";
import Stock from "@/ui/Stock";
import Qty from "@/ui/Qty";
import Btn from "@/ui/Btn";
import Card from "@/ui/Card";
import Reviews from "@/ui/Reviews";
import { Loader } from "@/ui/Spinner";
import { useCart } from "@/store/cart";
import { useFav } from "@/store/fav";
import { useToast } from "@/store/toast";

export default function Product() {
  const { id = "" } = useParams();
  const { data: p, loading, reload } = useAsync(() => getProduct(id), [id]);
  const { data: all } = useAsync(listProducts);

  const add = useCart((s) => s.add);
  const fav = useFav();
  const push = useToast((s) => s.push);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  if (loading) return <Loader />;
  if (!p)
    return (
      <div className="wrap py-24 text-center">
        <p className="text-lg font-semibold">Товар не найден</p>
      </div>
    );

  const liked = fav.has(p.id);
  const out = p.stock <= 0;
  const save = p.oldPrice ? p.oldPrice - p.price : 0;
  const related = (all ?? []).filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  return (
    <div className="wrap py-6 sm:py-8">
      <Crumbs items={[{ label: "Главная", to: "/" }, { label: "Каталог", to: "/catalog" }, { label: p.name }]} />

      <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* галерея */}
        <div>
          <div className="grid aspect-square place-items-center rounded-2xl bg-brand-50 text-[9rem] ring-1 ring-black/[.04]">
            {p.gallery[img]}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {p.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setImg(i)}
                className={cn(
                  "grid aspect-square place-items-center rounded-xl bg-white text-4xl ring-1 transition",
                  i === img ? "ring-2 ring-brand-500" : "ring-black/[.06] hover:ring-brand-300",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* инфо */}
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">{p.cat}</span>
            {p.oldPrice && <span className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">Скидка</span>}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{p.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5">
              <Rating value={p.rating} size={16} />
              <span className="text-sm text-ink-900/55">({p.reviews} отзывов)</span>
            </span>
            <span className="text-ink-900/20">•</span>
            <Stock n={p.stock} />
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-extrabold text-brand-600">{rub(p.price)}</span>
            {p.oldPrice && <span className="text-xl text-ink-900/40 line-through">{rub(p.oldPrice)}</span>}
          </div>
          {save > 0 && (
            <span className="mt-2 inline-block rounded-md bg-red-100 px-2.5 py-1 text-sm font-bold text-red-600">
              Экономия: {rub(save)}
            </span>
          )}

          <p className="mt-5 leading-relaxed text-ink-900/70">{p.desc}</p>

          {/* эко-блок */}
          <div className="mt-5 rounded-2xl border border-brand-200 bg-brand-50 p-4">
            <div className="flex items-center gap-2 font-bold text-brand-800">
              <Icon name="recycle" size={20} className="text-brand-600" /> Экологическая информация
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-900/70">{p.eco}</p>
          </div>

          {/* характеристики */}
          <dl className="mt-5 overflow-hidden rounded-2xl ring-1 ring-black/[.06]">
            {p.specs.map((s, i) => (
              <div key={s.k} className={cn("flex justify-between gap-4 px-4 py-2.5 text-sm", i % 2 ? "bg-white" : "bg-cream/70")}>
                <dt className="text-ink-900/55">{s.k}</dt>
                <dd className="font-semibold">{s.v}</dd>
              </div>
            ))}
          </dl>

          {/* действия */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Qty value={qty} onChange={setQty} max={Math.max(1, p.stock)} />
            <Btn
              size="lg"
              disabled={out}
              className="flex-1 min-w-[10rem]"
              onClick={() => {
                add(p, qty);
                push("Товар добавлен в корзину");
              }}
            >
              <Icon name="cart" size={18} /> {out ? "Нет в наличии" : "В корзину"}
            </Btn>
            <Btn
              variant="outline"
              size="lg"
              onClick={() => {
                fav.toggle(p.id);
                push(liked ? "Удалено из избранного" : "Добавлено в избранное", "info");
              }}
              className={cn(liked && "border-red-300 text-red-500")}
            >
              <Icon name="heart" size={18} solid={liked} /> В избранное
            </Btn>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-900/55">
            <span className="flex items-center gap-1.5"><Icon name="truck" size={16} /> Доставка от 500 ₽</span>
            <span className="flex items-center gap-1.5"><Icon name="shield" size={16} /> Гарантия 5 лет</span>
            <span className="flex items-center gap-1.5"><Icon name="recycle" size={16} /> Возврат 14 дней</span>
          </div>
        </div>
      </div>

      <Reviews productId={p.id} rating={p.rating} count={p.reviews} onChange={reload} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Похожие товары</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((r) => (
              <Card key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
