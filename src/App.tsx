import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MetrikaTracker from "./components/MetrikaTracker";
import OtzyvPage from "./pages/OtzyvPage";

// Ленивая загрузка страниц — каждая грузится только при переходе на неё
const Home = lazy(() => import("./pages/Home"));
const Windows = lazy(() => import("./pages/Windows"));
const AC = lazy(() => import("./pages/AC"));
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
      <MetrikaTracker />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="okna" element={<Windows />} />
            <Route path="kondicionery" element={<AC />} />
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