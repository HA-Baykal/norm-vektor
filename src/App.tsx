import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useParams } from "react-router-dom";
import { Header, Footer, MobileBottomBar } from "./components/Navigation";
import {
  HomePage,
  WindowsPage,
  ACPage,
  VentilationPage,
  DrillingPage,
  StandartyPage,
  PortfolioPage,
  ReviewsPage,
  ContactPage,
  BlogPage,
  BlogArticlePage,
} from "./pages/SitePages";
import { SEODashboard } from "./seo/SEODashboard";
import { Search, Bot, Flame, Wrench, BookOpen } from "lucide-react";

/* ---------------- SCROLL TO TOP & DYNAMIC META FOR SEO ---------------- */
function ScrollToTopAndMeta() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Динамическое изменение Title и Description в зависимости от страницы
    const path = location.pathname;
    let title = "Кондиционеры и пластиковые окна в Иркутске — Вектор Комфорта";
    let desc = "Кондиционеры, пластиковые окна VEKA, вентиляция и алмазное бурение в Иркутске. Своё производство окон, монтаж за 1 день, бесплатный замер, гарантия.";

    if (path === "/okna") {
      title = "Пластиковые окна VEKA и остекление балконов в Иркутске от 11 000 ₽/м²";
      desc = "Собственное производство окон VEKA в Иркутске — без посредников! Тёплые окна, остекление балконов, онлайн-калькулятор. Монтаж по ГОСТу, гарантия 5 лет.";
    } else if (path === "/kondicionery") {
      title = "Купить кондиционер в Иркутске с установкой — Каталог 2026 от 16 636 ₽";
      desc = "Сплит-системы и инверторы SHUFT, Ballu, Electrolux, Daikin, Midea. Профессиональный монтаж за 1 день с 100% вакуумированием трассы. ★ 5.0 на 2ГИС.";
    } else if (path === "/ventilyaciya") {
      title = "Вентиляция и бризеры Тион / Vakio в Иркутске от 6 000 ₽";
      desc = "Свежий воздух в квартире и доме с закрытыми окнами! Приточные очистители Ballu ASP-100/200, рекуператоры Vakio. Монтаж без пыли на чистовой ремонт.";
    } else if (path === "/almaznoe-burenie") {
      title = "Алмазное бурение отверстий в бетоне и кирпиче в Иркутске без пыли от 2 000 ₽";
      desc = "Безударное сухое и мокрые алмазное бурение отверстий 32–250 мм под кондиционеры и трубы. Работаем с пылесосом без трещин и сколов. Иркутск +50 км.";
    } else if (path === "/standarty") {
      title = "Стандарты ГОСТ и качество монтажа — Вектор Комфорта Иркутск";
    } else if (path === "/portfolio") {
      title = "Портфолио выполненных работ по остеклению и климату — Иркутск, Ангарск, Шелехов";
    } else if (path === "/otzyvy") {
      title = "Отзывы клиентов о компании Вектор Комфорта — Рейтинг ★ 5.0 2ГИС";
    } else if (path === "/contact") {
      title = "Контакты — Вектор Комфорта Иркутск, Байкальская 202/2 | +7 (914) 914-66-06";
    } else if (path.startsWith("/blog")) {
      title = "База знаний и статьи о выборе окон, кондиционеров и бризеров в Иркутске";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
  }, [location.pathname]);

  return null;
}

/* ---------------- WRAPPERS FOR DYNAMIC ROUTES ---------------- */
function BlogArticleWrapper() {
  const { id } = useParams();
  return <BlogArticlePage id={id || "pvh-vs-aluminum"} />;
}

/* ---------------- MAIN APP ---------------- */
export default function App() {
  const [theme, setTheme] = useState<string>("light");
  const [showSeoDashboard, setShowSeoDashboard] = useState<boolean>(true);
  const [seoTab, setSeoTab] = useState<"guide" | "bots" | "serp" | "audit" | "fixes">("guide");

  useEffect(() => {
    const saved = localStorage.getItem("vk_theme");
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("vk_theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const openDashboard = (tab: "guide" | "bots" | "serp" | "audit" | "fixes") => {
    setSeoTab(tab);
    setShowSeoDashboard(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTopAndMeta />

      {/* TOP FLOATING SEO AUDIT & BOT SIMULATOR TOOLBAR */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b-2 border-[#ff6b35] py-2.5 px-4 shadow-xl relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-black">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff6b35]"></span>
            </span>
            <span className="text-orange-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 shrink-0 inline animate-bounce" /> SEO-Анализатор Яндекса и Google
            </span>
            <span className="hidden lg:inline text-slate-300">
              | Проверка видимости репозитория <code>norm-vektor</code>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                if (showSeoDashboard && seoTab === "guide") {
                  setShowSeoDashboard(false);
                } else {
                  openDashboard("guide");
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-md ${
                showSeoDashboard && seoTab === "guide"
                  ? "bg-[#ff6b35] text-white ring-2 ring-white"
                  : "bg-orange-500 text-white hover:bg-[#e95620] border border-orange-400"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>👶 Инструкция для новичка</span>
            </button>

            <button
              onClick={() => openDashboard("bots")}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm ${
                showSeoDashboard && seoTab === "bots"
                  ? "bg-[#ff6b35] text-white ring-2 ring-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-orange-400" />
              <span>Глазами робота</span>
            </button>

            <button
              onClick={() => openDashboard("serp")}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm ${
                showSeoDashboard && seoTab === "serp"
                  ? "bg-[#ff6b35] text-white ring-2 ring-white"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Выдача в поиске (SERP)</span>
            </button>

            <button
              onClick={() => openDashboard("fixes")}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm ${
                showSeoDashboard && seoTab === "fixes"
                  ? "bg-emerald-600 text-white ring-2 ring-white"
                  : "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white"
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
              <span>Готовый код исправления</span>
            </button>

            {showSeoDashboard && (
              <button
                onClick={() => setShowSeoDashboard(false)}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 font-extrabold text-xs text-white shadow-md transition"
              >
                ✕ Закрыть панель
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SEO DASHBOARD WHEN Toggled */}
      {showSeoDashboard ? (
        <SEODashboard activeTab={seoTab} onClose={() => setShowSeoDashboard(false)} />
      ) : null}

      {/* ORIGINAL VECTOR KOMFORTA WEBSITE (WORD FOR WORD EXACT) */}
      <div className="min-h-screen flex flex-col bg-[#f5f7fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/okna" element={<WindowsPage />} />
            <Route path="/kondicionery" element={<ACPage />} />
            <Route path="/ventilyaciya" element={<VentilationPage />} />
            <Route path="/almaznoe-burenie" element={<DrillingPage />} />
            <Route path="/standarty" element={<StandartyPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/otzyvy" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogArticleWrapper />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        <Footer />
        <MobileBottomBar />
      </div>
    </BrowserRouter>
  );
}
