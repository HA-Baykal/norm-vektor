import { Link } from "react-router-dom";
// ============================================================================
// БЛОК "БАЗА ЗНАНИЙ" для главной страницы — ПРЕМИАЛЬНАЯ ТЁМНАЯ ВЕРСИЯ
// Тёмно-синий фон выделяется среди светлых блоков и привлекает внимание.
// ============================================================================
const previewArticles = [
  {
    slug: "kak-vybrat-konditsioner-po-ploshchadi",
    icon: "❄️",
    category: "Кондиционеры",
    title: "Как выбрать кондиционер по площади помещения",
  },
  {
    slug: "kakie-plastikovye-okna-vybrat",
    icon: "🪟",
    category: "Окна",
    title: "Какие пластиковые окна выбрать для квартиры",
  },
  {
    slug: "zachem-nuzhna-ventilyatsiya",
    icon: "🌬️",
    category: "Вентиляция",
    title: "Зачем нужна вентиляция в квартире",
  },
];
export default function BazaZnaniyBanner() {
  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a3a5c] via-[#1a3a5c] to-[#10263d] px-6 py-12 shadow-2xl shadow-[#1a3a5c]/30 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Декоративные светящиеся пятна */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff6b35]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="relative">
            {/* Заголовок */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-white sm:text-sm">
                  📚 База знаний
                </span>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Не знаете, что выбрать?
                  <span className="block text-[#ff6b35]">Мы поможем разобраться</span>
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Полезные статьи о кондиционерах, окнах и вентиляции. Простым языком объясняем,
                  как сделать правильный выбор и не переплатить.
                </p>
              </div>
              <Link
                to="/baza-znaniy"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-7 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-1 hover:bg-[#e95620] sm:text-base"
              >
                Все статьи
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            {/* Карточки статей */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {previewArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/baza-znaniy/${article.slug}`}
                  className="group flex flex-col rounded-[1.5rem] bg-white p-6 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl sm:rounded-[1.75rem]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl transition group-hover:bg-[#ff6b35]/10">
                      {article.icon}
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="mt-5 flex-1 text-lg font-black leading-6 text-[#1a3a5c]">
                    {article.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ff6b35] transition-all group-hover:gap-3">
                    Читать статью
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}