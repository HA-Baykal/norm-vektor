
import { useState } from "react";
import { Link } from "react-router-dom";
import blogIndexData from "../data/blogIndexData";
import { useSeo, useBreadcrumb } from "../utils/useSeo";

// ============================================================================
// БАЗА ЗНАНИЙ — список статей
// Карточки автоматически генерируются из articleContent в BlogArticle.tsx
// при запуске Vite. Чтобы добавить статью, добавьте запись в articleContent.
// ============================================================================
function formatRussianDate(dateStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  if (!year || !month || !day) return dateStr;
  return `${day} ${months[month - 1]} ${year}`;
}

export const articles = blogIndexData;

export default function BlogPage() {
  useSeo(
    "База знаний — окна, кондиционеры и вентиляция | Вектор Комфорта, Иркутск",
    "Полезные статьи о выборе кондиционера по площади, пластиковых окнах VEKA, бризерах и рекуператорах, монтаже вентиляции. Простые советы от компании Вектор Комфорта, Иркутск."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "База знаний", path: "/baza-znaniy" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Получаем уникальные категории
  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];

  // Фильтруем статьи по категории
  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / База знаний
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">База знаний</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Полезные статьи о кондиционерах, окнах и вентиляции. Помогаем разобраться, чтобы вы
            сделали правильный выбор и не переплатили.
          </p>
        </div>
      </section>

      {/* Фильтр по категориям */}
      <section className="bg-white border-b border-slate-200 px-4 py-6 sm:px-6 lg:px-8 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-2">Категория:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-black transition ${
                  selectedCategory === cat
                    ? "bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "Все статьи" : cat}
                {cat !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({articles.filter((a) => a.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Список статей */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-black text-slate-700">Статьи не найдены</h2>
              <p className="mt-2 text-slate-500">Попробуйте выбрать другую категорию</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm font-bold text-slate-500">
                Найдено статей: {filteredArticles.length}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/baza-znaniy/${article.slug}`}
                    className="group flex flex-col rounded-[1.5rem] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                        {article.icon}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                        {article.category}
                      </span>
                    </div>
                    <h2 className="mt-5 text-lg font-black leading-6 text-[#1a3a5c] sm:text-xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                        {article.date && <span>📅 {formatRussianDate(article.date)}</span>}
                        <span>⏱ {article.readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-black text-[#ff6b35] transition-all group-hover:gap-3">
                        Читать
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          
          {/* CTA */}
          <div className="mt-14 rounded-[1.5rem] bg-[#1a3a5c] p-8 text-center text-white sm:rounded-[2rem] sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">Остались вопросы?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Позвоните — бесплатно проконсультируем и подберём решение под вашу задачу.
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
    </div>
  );
}
