import { Link } from "react-router-dom";
import type { Product } from "@/types";
import { rub } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import Icon from "./Icon";
import Rating from "./Rating";
import Stock from "./Stock";
import Btn from "./Btn";
import { useCart } from "@/store/cart";
import { useFav } from "@/store/fav";
import { useToast } from "@/store/toast";

export default function Card({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const fav = useFav();
  const push = useToast((s) => s.push);
  const liked = fav.has(p.id);
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const out = p.stock <= 0;

  return (
    <div className="card lift flex flex-col overflow-hidden">
      <Link to={`/product/${p.id}`} className="relative block">
        <div className="grid aspect-[4/3] place-items-center bg-brand-50 text-7xl">
          <span>{p.emoji}</span>
        </div>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">−{off}%</span>
          )}
          {p.popular && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">Хит</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            fav.toggle(p.id);
            push(liked ? "Удалено из избранного" : "Добавлено в избранное", "info");
          }}
          aria-label="В избранное"
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-colors",
            liked ? "text-red-500" : "text-ink-900/40 hover:text-ink-900/70",
          )}
        >
          <Icon name="heart" size={18} solid={liked} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-brand-600">{p.cat}</span>
        <Link to={`/product/${p.id}`} className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-brand-700">
          {p.name}
        </Link>
        <p className="mt-0.5 text-xs text-ink-900/45">{p.material}</p>

        <div className="mt-2 flex items-center justify-between">
          <Rating value={p.rating} reviews={p.reviews} />
          <Stock n={p.stock} className="text-xs" />
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-extrabold text-ink-900">{rub(p.price)}</div>
            {p.oldPrice && <div className="text-xs text-ink-900/40 line-through">{rub(p.oldPrice)}</div>}
          </div>
        </div>

        <Btn
          size="sm"
          block
          disabled={out}
          className="mt-3"
          onClick={() => {
            add(p);
            push("Товар добавлен в корзину");
          }}
        >
          <Icon name="cart" size={16} />
          {out ? "Нет в наличии" : "В корзину"}
        </Btn>
      </div>
    </div>
  );
}
