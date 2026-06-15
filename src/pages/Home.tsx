import { Link } from "react-router-dom";
import { listProducts } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { CATS } from "@/data/seed";
import Card from "@/ui/Card";
import Icon from "@/ui/Icon";
import { LinkBtn } from "@/ui/Btn";
import Spinner from "@/ui/Spinner";

const FEATURES = [
  { icon: "recycle", t: "100% Переработка", s: "Вторая жизнь материалов" },
  { icon: "truck", t: "Доставка по РФ", s: "В любой город страны" },
  { icon: "shield", t: "Гарантия 5 лет", s: "На всю продукцию" },
  { icon: "sprout", t: "Эко-сертификат", s: "Подтверждённое качество" },
];

export default function Home() {
  const { data, loading } = useAsync(listProducts);
  const popular = (data ?? []).filter((p) => p.popular).slice(0, 8);

  return (
    <>
      <Hero />
      <Features />
      <Cats />
      <section className="wrap py-12 sm:py-16">
        <Head title="Популярные товары" sub="Любимые покупателями эко-решения" to="/catalog" />
        {loading ? (
          <div className="grid place-items-center py-20 text-brand-600">
            <Spinner size={28} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {popular.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
      <Mission />
    </>
  );
}

function Hero() {
  return (
    <section className="wrap pt-4 sm:pt-6">
      <div className="overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-white sm:px-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Icon name="leaf" size={16} /> Экологичная мебель
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Из переработанных материалов.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Каждое изделие уникально и создано из вторичных материалов. Мы даём вещам вторую жизнь, заботясь о планете и вашем интерьере.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkBtn to="/catalog" variant="white" size="lg">
                Смотреть каталог
              </LinkBtn>
              <LinkBtn to="/about" size="lg" className="border border-white/40 bg-transparent text-white hover:bg-white/10">
                Узнать о миссии
              </LinkBtn>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["500+", "Довольных клиентов"],
                ["12 т", "Переработано материалов"],
                ["100%", "Экологично"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="text-3xl font-extrabold">{n}</dt>
                  <dd className="text-sm text-white/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto grid aspect-square max-w-sm place-items-center rounded-3xl bg-white/10 text-[10rem]">
              🪑
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="wrap py-12 sm:py-14">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.t} className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-brand-600">
              <Icon name={f.icon} size={28} />
            </div>
            <h3 className="mt-3 font-bold">{f.t}</h3>
            <p className="mt-0.5 text-sm text-ink-900/50">{f.s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cats() {
  return (
    <section className="wrap py-4">
      <Head title="Категории" sub="Подберите мебель под ваш интерьер" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATS.map((c) => (
          <Link
            key={c.id}
            to={`/catalog?cat=${encodeURIComponent(c.id)}`}
            className="card lift flex flex-col items-center gap-2 p-5 text-center"
          >
            <span className="text-4xl">{c.icon}</span>
            <span className="text-sm font-semibold leading-tight">{c.id}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="wrap py-4 sm:py-8">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-brand-50 p-8 ring-1 ring-brand-100 sm:p-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            <Icon name="recycle" size={16} /> Наша миссия
          </span>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">Меньше отходов — больше уюта</h2>
          <p className="mt-4 max-w-md leading-relaxed text-ink-900/65">
            Мы превращаем переработанные материалы в долговечную мебель. Покупая у нас, вы сокращаете количество отходов и поддерживаете замкнутый цикл производства.
          </p>
          <LinkBtn to="/about" variant="solid" className="mt-6">
            Подробнее о нас
          </LinkBtn>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["♻️", "Вторсырьё", "Все материалы"],
            ["🌍", "−12 т CO₂", "За год"],
            ["🌱", "EN 71-3", "Сертификат"],
          ].map(([e, t, s]) => (
            <div key={t} className="card flex flex-col items-center gap-1 p-4 text-center">
              <span className="text-3xl">{e}</span>
              <span className="text-sm font-bold">{t}</span>
              <span className="text-xs text-ink-900/50">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Head({ title, sub, to }: { title: string; sub?: string; to?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {sub && <p className="mt-1 text-ink-900/50">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex">
          Все товары <Icon name="chevr" size={16} />
        </Link>
      )}
    </div>
  );
}
