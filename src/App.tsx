import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MetrikaTracker from "./components/MetrikaTracker";
import OtzyvPage from "./pages/OtzyvPage";
function ScrollToTopAndMeta() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

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
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
  }, [location.pathname]);

  return null;
}

// Ленивая загрузка страниц — каждая грузится только при переходе на неё
const Home = lazy(() => import("./pages/Home"));
const Windows = lazy(() => import("./pages/Windows"));
const WindowPage = lazy(() => import("./pages/WindowPage"));
const AC = lazy(() => import("./pages/AC"));
const ConditionerPage = lazy(() => import("./pages/ConditionerPage"));
const Ventilation = lazy(() => import("./pages/Ventilation"));
const Drilling = lazy(() => import("./pages/Drilling"));
const StandartyPage = lazy(() => import("./pages/StandartyPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const Contact = lazy(() => import("./pages/Contact"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopAndMeta />
      <MetrikaTracker />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="okna" element={<Windows />} />
            <Route path="okna/:slug" element={<WindowPage />} />
            <Route path="windows/:slug" element={<WindowPage />} />
            <Route path="kondicionery" element={<AC />} />
            <Route path="kondicionery/:slug" element={<ConditionerPage />} />
            <Route path="ventilyaciya" element={<Ventilation />} />
            <Route path="almaznoe-burenie" element={<Drilling />} />
            <Route path="standarty" element={<StandartyPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="baza-znaniy" element={<BlogPage />} />
            <Route path="baza-znaniy/:slug" element={<BlogArticle />} />
            <Route path="kontakty" element={<Contact />} />
            <Route path="otzyv" element={<OtzyvPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
