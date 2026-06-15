import PageHead from "@/ui/PageHead";
import Icon from "@/ui/Icon";
import { LinkBtn } from "@/ui/Btn";

const STATS = [
  ["500+", "Довольных клиентов"],
  ["12 т", "Переработано материалов"],
  ["6", "Категорий мебели"],
  ["5 лет", "Гарантия на всё"],
];

const VALUES = [
  { icon: "recycle", t: "Вторичные материалы", s: "Используем только переработанное сырьё: дерево, пластик, текстиль и стекло." },
  { icon: "leaf", t: "Безопасные покрытия", s: "Натуральные масла и воски без растворителей. Сертификат EN 71-3." },
  { icon: "shield", t: "Долговечность", s: "Прочные конструкции и гарантия 5 лет на каждое изделие." },
  { icon: "truck", t: "Доставка по РФ", s: "Привезём в любой город страны удобным для вас способом." },
];

const STEPS = [
  ["Сбор сырья", "Принимаем отходы мебельных производств и вторсырьё."],
  ["Сортировка", "Отбираем материалы, пригодные для новой жизни."],
  ["Производство", "Создаём мебель на современном оборудовании."],
  ["Доставка", "Бережно доставляем готовое изделие к вам домой."],
];

export default function About() {
  return (
    <>
      <PageHead
        crumb={[{ label: "Главная", to: "/" }, { label: "О нас" }]}
        title="О компании"
        sub="ЭкоМебель — это мебель из переработанных материалов. Мы даём вещам вторую жизнь, заботясь о планете и вашем интерьере."
      />

      <section className="wrap py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="card p-6 text-center">
              <div className="text-3xl font-extrabold text-brand-600">{n}</div>
              <div className="mt-1 text-sm text-ink-900/55">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-4">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Наши ценности</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.t} className="card flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600">
                <Icon name={v.icon} size={24} />
              </span>
              <div>
                <h3 className="font-bold">{v.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-900/60">{v.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-12">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Как мы работаем</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, s], i) => (
            <div key={t} className="relative card p-6">
              <span className="text-3xl font-extrabold text-brand-200">0{i + 1}</span>
              <h3 className="mt-2 font-bold">{t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-900/60">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-12">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand-600 px-6 py-12 text-center text-white">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Готовы обустроить дом экологично?</h2>
          <p className="max-w-md text-white/80">Загляните в каталог — там более десятка изделий из переработанных материалов.</p>
          <LinkBtn to="/catalog" variant="white" size="lg">
            Смотреть каталог
          </LinkBtn>
        </div>
      </section>
    </>
  );
}
