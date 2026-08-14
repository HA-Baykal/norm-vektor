
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../utils/useSeo";

// ============================================================================
// БАЗА ЗНАНИЙ — список статей
// Как добавить статью: добавьте объект в массив articles + создайте текст
// статьи в объекте articleContent (см. файл BlogArticle).
// ============================================================================
export const articles = [
  {
    slug: "kak-vybrat-konditsioner-po-ploshchadi",
    title: "Как выбрать кондиционер по площади помещения",
    excerpt:
      "Разбираем, какая мощность нужна для комнаты 20, 30 или 40 м², что означают цифры 07, 09, 12 и как не переплатить за лишнее.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "invertornyy-ili-obychnyy-konditsioner",
    title: "Инверторный или обычный кондиционер — что выбрать",
    excerpt:
      "Честное сравнение: чем отличается инвертор от обычной сплит-системы, что экономичнее, тише и когда переплата оправдана.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
  slug: "okna-veka-vs-rehau-chto-luchshe-dlya-irkutska",
  title: "Окна VEKA vs Rehau: что лучше для Иркутска? Честное сравнение от производителя",
  excerpt: "Выбор между VEKA и Rehau — это выбор между двумя лучшими немецкими профилями для пластиковых окон. Разберём по пунктам, что лучше для сурового климата Иркутска.",
  category: "Окна",
  icon: "🪟",
  readTime: "8 мин",
},
  {
    slug: "kakie-plastikovye-okna-vybrat",
    title: "Какие пластиковые окна выбрать для квартиры в Иркутске",
    excerpt:
      "Профиль, камеры, стеклопакет, фурнитура — на что реально смотреть при выборе окон в наших климатических условиях.",
    category: "Окна",
    icon: "🪟",
    readTime: "7 мин",
  },
  {
    slug: "pochemu-ventilyatsiya-stoit-dorogo",
    title: "Почему правильная вентиляция стоит дорого: разбираем по компонентам",
    excerpt:
      "Разбираем, из чего складывается стоимость вентиляции: оборудование, материалы, монтаж. Почему нельзя сделать дёшево и качественно — честный технический разбор от профессиональных монтажников.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "10 мин",
  },
  {
    slug: "zachem-nuzhna-ventilyatsiya",
    title: "Зачем нужна вентиляция в квартире и как она работает",
    excerpt:
      "Почему пластиковые окна «запирают» воздух, что такое бризер и рекуператор, и как обеспечить свежий воздух без сквозняков.",
    category: "Вентиляция",
    icon: "🌬️",
    readTime: "6 мин",
  },
  {
    slug: "mozhno-li-zabolet-ot-konditsionera",
    title: "Можно ли заболеть от кондиционера: развенчиваем главный миф с техническим разбором",
    excerpt:
      "Почему люди болеют от кондиционера: грязные фильтры, закрытые окна, неправильная температура. Технические причины и как этого избежать — честный разбор от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "8 мин",
  },
    {
    slug: "invertornyy-konditsioner-stoit-li-pereplachivat",
    title: "Инверторный кондиционер: за что вы переплачиваете 15 000 ₽ и окупается ли это",
    excerpt:
      "Разбираем с расчётами: экономия электричества, срок службы компрессора, уровень шума. Когда инвертор окупается, а когда лучше взять обычный — честный разбор от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "9 мин",
  },
  {
    slug: "skolko-stoit-ustanovka-konditsionera-irkutsk",
    title: "Сколько стоит установить кондиционер в Иркутске",
    excerpt:
      "Из чего складывается цена на кондиционер и монтаж, сколько стоит оборудование и работы, и от чего зависит итоговая сумма.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "skolko-stoyat-plastikovye-okna-irkutsk",
    title: "Сколько стоят пластиковые окна в Иркутске",
    excerpt:
      "Разбираем цену окон по составляющим: конструкция, профиль, стеклопакет, монтаж, откосы. Пример расчёта окна под ключ.",
    category: "Окна",
    icon: "🪟",
    readTime: "5 мин",
  },
    {
    slug: "brizer-ili-rekuperator-chto-vybrat",
    title: "Бризер или рекуператор: что выбрать для квартиры в Иркутске — техническое сравнение",
    excerpt:
      "Разбираем с расчётами: КПД рекуперации, экономия на отоплении, окупаемость. Когда бризер лучше, а когда рекуператор — честный разбор от профессиональных монтажников.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "9 мин",
  },
  {
    slug: "pochemu-poteyut-plastikovye-okna",
    title: "Почему потеют пластиковые окна и что делать",
    excerpt:
      "Главные причины конденсата на окнах, что можно исправить самому и когда проблему решает только вентиляция.",
    category: "Окна",
    icon: "🪟",
    readTime: "6 мин",
  },
  {
    slug: "nuzhno-li-obsluzhivat-konditsioner",
    title: "Нужно ли обслуживать кондиционер и как часто",
    excerpt:
      "Зачем нужно ТО кондиционера, что в него входит, как часто проводить и по каким признакам понять, что пора на обслуживание.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "top-10-konditsionerov-irkutsk-2026",
    title: "ТОП-10 кондиционеров для квартиры в Иркутске 2026: экспертный рейтинг с техническим разбором",
    excerpt:
      "Разбираем не только цены, но и техническую начинку: компрессоры, теплообменники, электронику. Сравниваем Axioma и Midea, Ballu и Daikin — честный рейтинг от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "10 мин",
  },
];

export default function BlogPage() {
  useSeo(
    "База знаний — окна, кондиционеры и вентиляция | Вектор Комфорта, Иркутск",
    "Полезные статьи о выборе кондиционера по площади, пластиковых окнах VEKA, бризерах и рекуператорах, монтаже вентиляции. Простые советы от компании Вектор Комфорта, Иркутск."
  );
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
                      <span className="text-xs font-semibold text-slate-400">⏱ {article.readTime}</span>
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
