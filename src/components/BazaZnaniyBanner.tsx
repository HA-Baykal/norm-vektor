import { Link } from "react-router-dom";
// ============================================================================
// БЛОК "БАЗА ЗНАНИЙ" для главной страницы
// Показывает превью статей со ссылкой на раздел /baza-znaniy
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
    <section className="bg-slate-50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              База знаний
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:text-4xl">
              Полезные статьи для правильного выбора
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Помогаем разобраться в кондиционерах, окнах и вентиляции — чтобы вы сделали
              грамотный выбор и не переплатили.
            </p>
          </div>
          <Link
            to="/baza-znaniy"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#122943]"
          >
            Все статьи
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        {/* Карточки статей */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {previewArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/baza-znaniy/${article.slug}`}
              className="group flex flex-col rounded-[1.5rem] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                  {article.icon}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {article.category}
                </span>
              </div>
              <h3 className="mt-5 flex-1 text-lg font-black leading-6 text-[#1a3a5c]">{article.title}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ff6b35] transition-all group-hover:gap-3">
                Читать
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}