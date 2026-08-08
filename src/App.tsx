import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MetrikaTracker from "./components/MetrikaTracker";
import OtzyvPage from "./pages/OtzyvPage";
const LocalCityPage = lazy(() => import("./pages/LocalCityPage"));
const Home = lazy(() => import("./pages/Home"));
const Windows = lazy(() => import("./pages/Windows"));
const AC = lazy(() => import("./pages/AC"));
const ConditionerPage = lazy(() => import("./pages/ConditionerPage"));
const Ventilation = lazy(() => import("./pages/Ventilation"));
const Drilling = lazy(() => import("./pages/Drilling"));
const StandartyPage = lazy(() => import("./pages/StandartyPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const Contact = lazy(() => import("./pages/Contact"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <MetrikaTracker />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="okna" element={<Windows />} />
            <Route path="okna/:slug" element={<Windows />} />
            <Route path="windows/:slug" element={<Windows />} />
            <Route path="kondicionery" element={<AC />} />
            <Route path="kondicionery/:slug" element={<ConditionerPage />} />
            <Route path="/okna-v-homutovo" element={<LocalCityPage cityKey="homutovo" serviceKey="okna" />} />
            <Route path="/kondicionery-v-homutovo" element={<LocalCityPage cityKey="homutovo" serviceKey="kondicionery" />} />
            <Route path="/okna-v-molodezhnom" element={<LocalCityPage cityKey="molodezhnom" serviceKey="okna" />} />
            <Route path="/kondicionery-v-molodezhnom" element={<LocalCityPage cityKey="molodezhnom" serviceKey="kondicionery" />} />
            <Route path="/okna-v-angarske" element={<LocalCityPage cityKey="angarske" serviceKey="okna" />} />
            <Route path="/kondicionery-v-angarske" element={<LocalCityPage cityKey="angarske" serviceKey="kondicionery" />} />
            <Route path="/okna-v-shelehove" element={<LocalCityPage cityKey="shelehove" serviceKey="okna" />} />
            <Route path="/kondicionery-v-shelehove" element={<LocalCityPage cityKey="shelehove" serviceKey="kondicionery" />} />
            <Route path="ventilyaciya" element={<Ventilation />} />
            <Route path="almaznoe-burenie" element={<Drilling />} />
            <Route path="standarty" element={<StandartyPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="baza-znaniy" element={<BlogPage />} />
            <Route path="baza-znaniy/:slug" element={<BlogArticle />} />
            <Route path="kontakty" element={<Contact />} />
            <Route path="otzyv" element={<OtzyvPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
