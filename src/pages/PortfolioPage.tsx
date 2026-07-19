import VideoGallery from "../components/VideoGallery";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// ============================================================================
// СТРАНИЦА ПОРТФОЛИО с фильтрами по категориям
// ============================================================================
// Как добавлять работы: копируйте объект в массиве portfolioItems.
// Фото кладите в public/images/portfolio/
// ============================================================================
type Category = "all" | "windows" | "conditioners" | "ventilation" | "drilling";
const portfolioItems: { category: Exclude<Category, "all">; path: string; title: string }[] = [
  { category: "windows", path: "images/portfolio/okna-1.jpg", title: "Остекление балкона" },
  { category: "windows", path: "images/portfolio/okna-2.jpg", title: "ПВХ окна в квартире" },
  { category: "windows", path: "images/portfolio/okna-3.jpg", title: "Алюминиевые конструкции" },
  { category: "conditioners", path: "images/portfolio/cond-1.jpg", title: "Монтаж сплит-системы" },
  { category: "conditioners", path: "images/portfolio/cond-2.jpg", title: "Кондиционер в офисе" },
  { category: "conditioners", path: "images/portfolio/cond-3.jpg", title: "Сервис кондиционера" },
  { category: "ventilation", path: "images/portfolio/vent-1.jpg", title: "Бризер в квартире" },
  { category: "ventilation", path: "images/portfolio/vent-2.jpg", title: "Вентиляция ресторана" },
  { category: "ventilation", path: "images/portfolio/vent-3.jpg", title: "Воздуховоды на объекте" },
  { category: "drilling", path: "images/portfolio/bur-1.jpg", title: "Отверстие под вентиляцию" },
  { category: "drilling", path: "images/portfolio/bur-2.jpg", title: "Сухое бурение" },
  { category: "drilling", path: "images/portfolio/bur-3.jpg", title: "Бурение под трубы" },
];
const filters: { key: Category; label: string }[] = [
  { key: "all", label: "Все работы" },
  { key: "windows", label: "Окна" },
  { key: "conditioners", label: "Кондиционеры" },
  { key: "ventilation", label: "Вентиляция" },
  { key: "drilling", label: "Бурение" },
];
function PhotoWithFallback({ path, title }: { path: string; title: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      {!error ? (
        <img
          src={path}
          alt={title}
          loading="lazy"
          onError={() => setError(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">📷</div>
      )}
    </div>
  );
}
export default function PortfolioPage() {
  const [filter, setFilter] = useState<Category>("all");
  const [selected, setSelected] = useState<(typeof portfolioItems)[number] | null>(null);
  const filtered = filter === "all" ? portfolioItems : portfolioItems.filter((i) => i.category === filter);
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / Портфолио
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Наши работы</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Реальные объекты в Иркутске и области: окна, кондиционеры, вентиляция и алмазное бурение.
            Выберите категорию, чтобы посмотреть работы по направлению.
          </p>
        </div>
      </section>
      <VideoGallery />
      {/* Фильтры + сетка */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-5 py-3 text-sm font-black transition ${
                  filter === f.key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => setSelected(item)}
                className="group overflow-hidden rounded-[1.5rem] bg-white text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[1.75rem]"
              >
                <PhotoWithFallback path={item.path} title={item.title} />
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-black text-[#1a3a5c] sm:text-base">{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
          {/* CTA */}
          <div className="mt-14 rounded-[1.5rem] bg-[#1a3a5c] p-8 text-center text-white sm:rounded-[2rem] sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">Хотите так же?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Оставьте заявку — бесплатно выедем на замер и подготовим расчёт стоимости.
            </p>
            <a
              href="tel:+79149146606"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Позвонить +7 (914) 914-66-06
            </a>
          </div>
        </div>
      </section>
      {/* Лайтбокс */}
      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/85 px-3 pb-6 pt-20 backdrop-blur-sm sm:px-4 sm:pt-28"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <PhotoWithFallback path={selected.path} title={selected.title} />
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <h3 className="text-xl font-black text-[#1a3a5c] sm:text-2xl">{selected.title}</h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#122943] sm:w-auto"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
