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
const ServiceSubPage = lazy(() => import("./pages/ServiceSubPage"));
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
            <Route path="/okna-v-solnechnom" element={<LocalCityPage cityKey="solnechnom" serviceKey="okna" />} />
            <Route path="/kondicionery-v-solnechnom" element={<LocalCityPage cityKey="solnechnom" serviceKey="kondicionery" />} />
            <Route path="/okna-v-pervomaiskom" element={<LocalCityPage cityKey="pervomaiskom" serviceKey="okna" />} />
            <Route path="/kondicionery-v-pervomaiskom" element={<LocalCityPage cityKey="pervomaiskom" serviceKey="kondicionery" />} />
            <Route path="/okna-v-novolenino" element={<LocalCityPage cityKey="novolenino" serviceKey="okna" />} />
            <Route path="/kondicionery-v-novolenino" element={<LocalCityPage cityKey="novolenino" serviceKey="kondicionery" />} />
            <Route path="/okna-v-yubileynom" element={<LocalCityPage cityKey="yubileyny" serviceKey="okna" />} />
            <Route path="/kondicionery-v-yubileynom" element={<LocalCityPage cityKey="yubileyny" serviceKey="kondicionery" />} />
            <Route path="/okna-v-akademgorodke" element={<LocalCityPage cityKey="akademgorodok" serviceKey="okna" />} />
            <Route path="/kondicionery-v-akademgorodke" element={<LocalCityPage cityKey="akademgorodok" serviceKey="kondicionery" />} />
            <Route path="/okna-v-raduzhnom" element={<LocalCityPage cityKey="raduzhny" serviceKey="okna" />} />
            <Route path="/kondicionery-v-raduzhnom" element={<LocalCityPage cityKey="raduzhny" serviceKey="kondicionery" />} />
            <Route path="/okna-v-universitetskom" element={<LocalCityPage cityKey="universitetsky" serviceKey="okna" />} />
            <Route path="/kondicionery-v-universitetskom" element={<LocalCityPage cityKey="universitetsky" serviceKey="kondicionery" />} />
            <Route path="/okna-na-baikalskom-trakte" element={<LocalCityPage cityKey="baikalsky" serviceKey="okna" />} />
            <Route path="/kondicionery-na-baikalskom-trakte" element={<LocalCityPage cityKey="baikalsky" serviceKey="kondicionery" />} />
            <Route path="/okna-na-golooustnenskom-trakte" element={<LocalCityPage cityKey="golooustnensky" serviceKey="okna" />} />
            <Route path="/kondicionery-na-golooustnenskom-trakte" element={<LocalCityPage cityKey="golooustnensky" serviceKey="kondicionery" />} />
            <Route path="/okna-v-pivovarikhe" element={<LocalCityPage cityKey="pivovarikha" serviceKey="okna" />} />
            <Route path="/kondicionery-v-pivovarikhe" element={<LocalCityPage cityKey="pivovarikha" serviceKey="kondicionery" />} />
            <Route path="/okna-v-urike" element={<LocalCityPage cityKey="urik" serviceKey="okna" />} />
            <Route path="/kondicionery-v-urike" element={<LocalCityPage cityKey="urik" serviceKey="kondicionery" />} />
            <Route path="/okna-v-stolbovo" element={<LocalCityPage cityKey="stolbovo" serviceKey="okna" />} />
            <Route path="/kondicionery-v-stolbovo" element={<LocalCityPage cityKey="stolbovo" serviceKey="kondicionery" />} />
            <Route path="/okna-v-listvyanke" element={<LocalCityPage cityKey="listvyanka" serviceKey="okna" />} />
            <Route path="/kondicionery-v-listvyanke" element={<LocalCityPage cityKey="listvyanka" serviceKey="kondicionery" />} />
            {/* Гео-страницы вентиляции (17 локаций) */}
            <Route path="/ventilyaciya-v-homutovo" element={<LocalCityPage cityKey="homutovo" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-molodezhnom" element={<LocalCityPage cityKey="molodezhnom" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-angarske" element={<LocalCityPage cityKey="angarske" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-shelehove" element={<LocalCityPage cityKey="shelehove" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-solnechnom" element={<LocalCityPage cityKey="solnechnom" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-pervomaiskom" element={<LocalCityPage cityKey="pervomaiskom" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-novolenino" element={<LocalCityPage cityKey="novolenino" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-yubileynom" element={<LocalCityPage cityKey="yubileyny" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-akademgorodke" element={<LocalCityPage cityKey="akademgorodok" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-raduzhnom" element={<LocalCityPage cityKey="raduzhny" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-universitetskom" element={<LocalCityPage cityKey="universitetsky" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-na-baikalskom-trakte" element={<LocalCityPage cityKey="baikalsky" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-na-golooustnenskom-trakte" element={<LocalCityPage cityKey="golooustnensky" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-pivovarikhe" element={<LocalCityPage cityKey="pivovarikha" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-urike" element={<LocalCityPage cityKey="urik" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-stolbovo" element={<LocalCityPage cityKey="stolbovo" serviceKey="ventilyaciya" />} />
            <Route path="/ventilyaciya-v-listvyanke" element={<LocalCityPage cityKey="listvyanka" serviceKey="ventilyaciya" />} />
            {/* Гео-страницы алмазного бурения (17 локаций) */}
            <Route path="/almaznoe-burenie-v-homutovo" element={<LocalCityPage cityKey="homutovo" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-molodezhnom" element={<LocalCityPage cityKey="molodezhnom" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-angarske" element={<LocalCityPage cityKey="angarske" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-shelehove" element={<LocalCityPage cityKey="shelehove" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-solnechnom" element={<LocalCityPage cityKey="solnechnom" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-pervomaiskom" element={<LocalCityPage cityKey="pervomaiskom" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-novolenino" element={<LocalCityPage cityKey="novolenino" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-yubileynom" element={<LocalCityPage cityKey="yubileyny" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-akademgorodke" element={<LocalCityPage cityKey="akademgorodok" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-raduzhnom" element={<LocalCityPage cityKey="raduzhny" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-universitetskom" element={<LocalCityPage cityKey="universitetsky" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-na-baikalskom-trakte" element={<LocalCityPage cityKey="baikalsky" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-na-golooustnenskom-trakte" element={<LocalCityPage cityKey="golooustnensky" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-pivovarikhe" element={<LocalCityPage cityKey="pivovarikha" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-urike" element={<LocalCityPage cityKey="urik" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-stolbovo" element={<LocalCityPage cityKey="stolbovo" serviceKey="almaznoe-burenie" />} />
            <Route path="/almaznoe-burenie-v-listvyanke" element={<LocalCityPage cityKey="listvyanka" serviceKey="almaznoe-burenie" />} />
            {/* Посадочные страницы под-услуг (SEO) */}
            <Route path="montazh-kondicionerov" element={<ServiceSubPage pageKey="montazh-kondicionerov" />} />
            <Route path="montazh-okon" element={<ServiceSubPage pageKey="montazh-okon" />} />
            <Route path="servis-kondicionerov" element={<ServiceSubPage pageKey="servis-kondicionerov" />} />
            <Route path="osteklenie-balkonov" element={<ServiceSubPage pageKey="osteklenie-balkonov" />} />
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
