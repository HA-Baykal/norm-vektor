
import VideoGallery from "../components/VideoGallery";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";
type Category = "all" | "windows" | "conditioners" | "ventilation" | "drilling";
type PortfolioItem = { category: Exclude<Category, "all">; path: string; title: string; address: string; date: string; text: string; };
const portfolioItems: PortfolioItem[] = [
  { category: "windows", path: "images/windows/window-1.jpg", title: "Тёплое остекление лоджии", address: "Иркутск, мкр Солнечный, ул. Байкальская 250", date: "Июнь 2025", text: "Была холодная лоджия. VEKA Softline 70 + Solar, утеплили и отделали под ключ. Теперь кабинет, зимой +22°." },
  { category: "windows", path: "images/windows/window-2.jpg", title: "Окна под ключ-весь дом", address: "Иркутск - Новокшонова 25", date: "Май 2024", text: "Дом из бруса. VEKA WHS 60, пароизоляция по ГОСТу. откосы. за 2 дня." },
  { category: "windows", path: "images/windows/window-3.jpg", title: "Установка 2 окон и входная дверь в беседку", address: "Иркутск, Байкальский тракт - Роял Парк", date: "Апрель 2025", text: "Черный рал(9005)  VEKA + MACO, монтаж за 1 день с уборкой." },
  { category: "conditioners", path: "images/conditioners/ac-1.jpg", title: "2 кондиционера в 2-комнатной", address: "Иркутск, Багратиона 46/6", date: "Июль 2026", text: "09BTU+12BTU на 50м², трасса 7м, вакуумирование, запуск за 6 часов." },
  { category: "conditioners", path: "images/conditioners/ac-2.jpg", title: "Кассетный Ballu в офисе 80м²", address: "Ангарск, 182 квартал", date: "Июнь 2026", text: "Кассетник 36 BTU в Армстронг, тихо на весь офис." },
  { category: "conditioners", path: "images/conditioners/ac-3.jpg", title: "Чистка и обслуживание Electrolux 07", address: "Шелехов, 3 мкр 25", date: "Май 2025", text: "Полная чистка внутреннего блока, мойка фильтров и заправка фреона, за 1 час без снятия." },
  { category: "ventilation", path: "images/ventilation/vent-1.jpg", title: "Приточно вытяжная вентиляция", address: "Иркутск, ЖК Сити Парк", date: "Июнь 2026", text: "Приточно вытяжная вентиляция по всей квартире + 2 прибора Vakio - Экономия на отоплении, проветривание без потери тепла." },
  { category: "ventilation", path: "images/ventilation/vent-4.jpg", title: "Вентиляция кафе 120м²", address: "Иркутск, К. Маркса 40", date: "Февраль 2025", text: "Приточно-вытяжная с рекуперацией, спрятали за потолком." },
  { category: "drilling", path: "images/drilling/drill-1.jpg", title: "Отверстие 132мм под бризер", address: "Иркутск, Радужный", date: "Июнь 2025", text: "Сухое 132мм в монолите 350мм с пылесосом — ни пылинки." },
  { category: "drilling", path: "images/drilling/drill-2.jpg", title: "Отверстие 132мм под вытяжку", address: "Тункинская долина - отель", date: "Май 2026", text: "сухое под вентиляцию за 20 мин, стена целая." },
  { category: "drilling", path: "images/drilling/drill-3.jpg", title: "Проход 200мм под вытяжку", address: "Иркутск, Карла Либнехта 202", date: "Апрель 2026", text: "Мокрое 250мм в железобетоне 200мм за час." },
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
        <img src={path} alt={title} loading="lazy" onError={() => setError(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">📷</div>
      )}
    </div>
  );
}
export default function PortfolioPage() {
  useSeo(
    "Портфолио работ — окна, кондиционеры и вентиляция в Иркутске | Вектор Комфорта",
    "Портфолио компании Вектор Комфорта: остекление балконов и окон ПВХ, монтаж кондиционеров, вентиляция и алмазное бурение. Реальные объекты в Иркутске, Ангарске, Шелехове и пригороде."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Портфолио", path: "/portfolio" },
  ]);
  const [filter, setFilter] = useState<Category>("all");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const filtered = filter === "all" ? portfolioItems : portfolioItems.filter((i) => i.category === filter);
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [selected]);
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300"><Link to="/" className="hover:underline">Главная</Link> / Портфолио</div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Наши работы</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Реальные объекты в Иркутске и области: окна, кондиционеры, вентиляция и бурение. Нажми фильтр и карточку — увидишь адрес.</p>
        </div>
      </section>
      <VideoGallery />
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filters.map((f) => (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)} className={`rounded-full px-5 py-3 text-sm font-black transition ${filter === f.key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>{f.label}</button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <button key={item.path + item.title} type="button" onClick={() => setSelected(item)} className="group overflow-hidden rounded-[1.5rem] bg-white text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[1.75rem]">
                <PhotoWithFallback path={item.path} title={item.title} />
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-black text-[#1a3a5c] sm:text-base leading-tight">{item.title}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-semibold text-slate-500"><span>📍 {item.address}</span><span>•</span><span>🕒 {item.date}</span></div>
                  <div className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">{item.text}</div>
                  <div className="mt-3 text-xs font-black text-[#ff6b35]">Смотреть →</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-14 rounded-[1.5rem] bg-[#1a3a5c] p-8 text-center text-white sm:rounded-[2rem] sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">Хотите так же?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">Бесплатно выедем и рассчитаем. Отвечаем за 5 минут.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="tel:+79149146606" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]">📞 Позвонить +7 (914) 914-66-06</a>
              <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-black text-[#1a3a5c] transition hover:bg-slate-100"><span className="w-6 h-6 rounded bg-[#1a3a5c] text-white grid place-items-center text-[10px] font-black">MAX</span> Написать в MAX</a>
            </div>
          </div>
        </div>
      </section>
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/85 px-3 pb-6 pt-20 backdrop-blur-sm sm:px-4 sm:pt-28" onClick={() => setSelected(null)}>
          <div className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[2rem]" onClick={(e) => e.stopPropagation()}>
            <PhotoWithFallback path={selected.path} title={selected.title} />
            <div className="p-5 sm:p-7">
              <h3 className="text-xl font-black text-[#1a3a5c] sm:text-2xl leading-tight">{selected.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-sm font-bold text-slate-500"><span>📍 {selected.address}</span><span>•</span><span>🕒 {selected.date}</span></div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{selected.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:+79149146606" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-black text-white hover:bg-[#e95620]">📞 Позвонить</a>
                <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white hover:bg-[#122943]"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[9px] font-black">MAX</span> Написать</a>
                <button type="button" onClick={() => setSelected(null)} className="w-full sm:w-auto rounded-full bg-slate-100 px-6 py-3 text-sm font-black text-slate-700 hover:bg-slate-200">Закрыть ✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
