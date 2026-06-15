import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { CATS } from "@/data/seed";
import type { Cat, Product } from "@/types";
import Card from "@/ui/Card";
import Crumbs from "@/ui/Crumbs";
import Icon from "@/ui/Icon";
import Btn from "@/ui/Btn";
import { Loader } from "@/ui/Spinner";
import { cn } from "@/lib/cn";
import { rub } from "@/lib/fmt";

type Sort = "pop" | "cheap" | "exp" | "rate";
const SORTS: { v: Sort; l: string }[] = [
  { v: "pop", l: "По популярности" },
  { v: "cheap", l: "Сначала дешёвые" },
  { v: "exp", l: "Сначала дорогие" },
  { v: "rate", l: "По рейтингу" },
];

export default function Catalog() {
  const { data, loading } = useAsync(listProducts);
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q")?.toLowerCase() ?? "";
  const initCat = sp.get("cat") as Cat | null;

  const [cats, setCats] = useState<Cat[]>(initCat ? [initCat] : []);
  const [sort, setSort] = useState<Sort>("pop");
  const [stockOnly, setStockOnly] = useState(false);
  const [saleOnly, setSaleOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(80000);
  const [open, setOpen] = useState(false); // мобильные фильтры

  const list = useMemo(() => {
    let r = (data ?? []) as Product[];
    if (q) r = r.filter((p) => (p.name + p.material + p.cat).toLowerCase().includes(q));
    if (cats.length) r = r.filter((p) => cats.includes(p.cat));
    if (stockOnly) r = r.filter((p) => p.stock > 0);
    if (saleOnly) r = r.filter((p) => p.oldPrice);
    r = r.filter((p) => p.price <= maxPrice);
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      pop: (a, b) => Number(b.popular) - Number(a.popular) || b.reviews - a.reviews,
      cheap: (a, b) => a.price - b.price,
      exp: (a, b) => b.price - a.price,
      rate: (a, b) => b.rating - a.rating,
    };
    return [...r].sort(by[sort]);
  }, [data, q, cats, stockOnly, saleOnly, maxPrice, sort]);

  const toggleCat = (c: Cat) => {
    setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
    if (sp.has("cat")) {
      sp.delete("cat");
      setSp(sp, { replace: true });
    }
  };

  const reset = () => {
    setCats([]);
    setStockOnly(false);
    setSaleOnly(false);
    setMaxPrice(80000);
    if (sp.toString()) setSp({}, { replace: true });
  };

  const Filters = (
    <div className="space-y-6">
      <Group title="Категории">
        <div className="space-y-1.5">
          {CATS.map((c) => (
            <Check key={c.id} on={cats.includes(c.id as Cat)} onClick={() => toggleCat(c.id as Cat)}>
              {c.id}
            </Check>
          ))}
        </div>
      </Group>

      <Group title="Цена">
        <input
          type="range"
          min={8000}
          max={80000}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-sm text-ink-900/60">
          <span>до</span>
          <span className="font-semibold text-ink-900">{rub(maxPrice)}</span>
        </div>
      </Group>

      <Group title="Наличие">
        <div className="space-y-1.5">
          <Check on={stockOnly} onClick={() => setStockOnly((v) => !v)}>
            Только в наличии
          </Check>
          <Check on={saleOnly} onClick={() => setSaleOnly((v) => !v)}>
            Со скидкой
          </Check>
        </div>
      </Group>

      <Btn variant="ghost" block onClick={reset}>
        Сбросить фильтры
      </Btn>
    </div>
  );

  return (
    <div className="wrap py-6 sm:py-8">
      <Crumbs items={[{ label: "Главная", to: "/" }, { label: "Каталог" }]} />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {q ? `Поиск: «${sp.get("q")}»` : initCat ?? "Каталог"}
          </h1>
          <p className="mt-1 text-sm text-ink-900/50">
            {loading ? "Загрузка…" : `Найдено товаров: ${list.length}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold lg:hidden"
          >
            <Icon name="filter" size={16} /> Фильтры
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 cursor-pointer appearance-none rounded-xl border border-black/10 bg-white pl-4 pr-10 text-sm font-semibold outline-none focus:border-brand-500"
            >
              {SORTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
            <Icon name="chevd" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-900/40" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="card sticky top-24 p-5">{Filters}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {loading ? (
            <Loader />
          ) : list.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {list.map((p) => (
                <Card key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <Empty onReset={reset} />
          )}
        </div>
      </div>

      {/* мобильный drawer фильтров */}
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Фильтры</h3>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5">
                <Icon name="x" />
              </button>
            </div>
            {Filters}
            <Btn block className="mt-5" onClick={() => setOpen(false)}>
              Показать {list.length}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2.5 text-sm font-bold">{title}</h4>
      {children}
    </div>
  );
}

function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 text-left text-sm text-ink-900/75 hover:text-ink-900">
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
          on ? "border-brand-600 bg-brand-600 text-white" : "border-black/20",
        )}
      >
        {on && <Icon name="check" size={13} />}
      </span>
      {children}
    </button>
  );
}

function Empty({ onReset }: { onReset: () => void }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-20 text-center">
      <span className="text-5xl">🔍</span>
      <h3 className="text-lg font-bold">Ничего не найдено</h3>
      <p className="max-w-xs text-sm text-ink-900/50">Попробуйте изменить параметры фильтра или сбросить их.</p>
      <Btn variant="outline" onClick={onReset}>
        Сбросить фильтры
      </Btn>
    </div>
  );
}
