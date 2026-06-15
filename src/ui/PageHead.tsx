import Crumbs from "./Crumbs";

/** Шапка внутренней страницы: хлебные крошки + заголовок + подзаголовок. */
export default function PageHead({
  crumb,
  title,
  sub,
}: {
  crumb: { label: string; to?: string }[];
  title: string;
  sub?: string;
}) {
  return (
    <div className="border-b border-black/[.06] bg-brand-50/50">
      <div className="wrap py-8 sm:py-10">
        <Crumbs items={crumb} />
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-ink-900/55">{sub}</p>}
      </div>
    </div>
  );
}
