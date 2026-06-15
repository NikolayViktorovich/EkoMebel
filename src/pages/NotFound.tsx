import { LinkBtn } from "@/ui/Btn";

export default function NotFound() {
  return (
    <div className="wrap grid place-items-center py-28 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-7xl">🌿</span>
        <h1 className="text-6xl font-extrabold text-brand-600">404</h1>
        <p className="text-lg font-semibold">Страница не найдена</p>
        <p className="max-w-sm text-ink-900/50">Возможно, она была перемещена или больше не существует.</p>
        <LinkBtn to="/" size="lg" className="mt-2">
          На главную
        </LinkBtn>
      </div>
    </div>
  );
}
