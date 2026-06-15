import PageHead from "@/ui/PageHead";
import Icon from "@/ui/Icon";
import { date } from "@/lib/fmt";

const POSTS = [
  { emoji: "♻️", tag: "Эко", title: "Как мебель из вторсырья помогает планете", excerpt: "Разбираемся, сколько отходов экономит один переработанный стол и почему это важно.", date: "2026-05-28", read: 5 },
  { emoji: "🪑", tag: "Гид", title: "Как выбрать кресло из переработанного текстиля", excerpt: "На что обратить внимание при покупке мягкой мебели: каркас, наполнитель, обивка.", date: "2026-05-14", read: 7 },
  { emoji: "🌱", tag: "Материалы", title: "Что такое масло-воск и почему оно безопасно", excerpt: "Натуральные покрытия против лаков: разбираем плюсы для здоровья и экологии.", date: "2026-04-30", read: 4 },
  { emoji: "🛏️", tag: "Интерьер", title: "Спальня в эко-стиле: 6 простых идей", excerpt: "Собираем уютную и экологичную спальню без лишних трат и пластика.", date: "2026-04-18", read: 6 },
  { emoji: "🌍", tag: "Эко", title: "Замкнутый цикл производства: как это работает", excerpt: "От сбора сырья до готового изделия — путь переработанной мебели.", date: "2026-04-02", read: 8 },
  { emoji: "🧹", tag: "Уход", title: "Уход за мебелью из переработанного дерева", excerpt: "Простые правила, которые продлят жизнь вашей мебели на годы.", date: "2026-03-21", read: 3 },
];

export default function Blog() {
  return (
    <>
      <PageHead crumb={[{ label: "Главная", to: "/" }, { label: "Блог" }]} title="Блог" sub="Статьи об экологии, материалах и уходе за мебелью." />
      <section className="wrap py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.title} className="card lift flex flex-col overflow-hidden">
              <div className="grid aspect-[16/9] place-items-center bg-brand-50 text-6xl">
                <span>{p.emoji}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="inline-flex w-fit rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">{p.tag}</span>
                <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-900/55">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-ink-900/45">
                  <span className="flex items-center gap-1"><Icon name="clock" size={13} /> {p.read} мин</span>
                  <span>•</span>
                  <span>{date(p.date)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
