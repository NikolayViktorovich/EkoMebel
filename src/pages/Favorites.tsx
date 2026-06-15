import { listProducts } from "@/lib/api";
import { useAsync } from "@/lib/use";
import { useFav } from "@/store/fav";
import PageHead from "@/ui/PageHead";
import Card from "@/ui/Card";
import { LinkBtn } from "@/ui/Btn";
import { Loader } from "@/ui/Spinner";

export default function Favorites() {
  const ids = useFav((s) => s.ids);
  const { data, loading } = useAsync(listProducts);
  const list = (data ?? []).filter((p) => ids.includes(p.id));

  return (
    <>
      <PageHead crumb={[{ label: "Главная", to: "/" }, { label: "Избранное" }]} title="Избранное" sub="Товары, которые вы отметили как понравившиеся." />
      <section className="wrap py-12">
        {loading ? (
          <Loader />
        ) : list.length ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {list.map((p) => (
              <Card key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-6xl">💚</span>
            <h2 className="text-xl font-bold">В избранном пусто</h2>
            <p className="max-w-xs text-ink-900/50">Нажимайте на сердечко у товаров, чтобы сохранить их здесь.</p>
            <LinkBtn to="/catalog" size="lg">
              Перейти в каталог
            </LinkBtn>
          </div>
        )}
      </section>
    </>
  );
}
