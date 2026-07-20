import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Windows from "./pages/Windows";
import AC from "./pages/AC";
import Ventilation from "./pages/Ventilation";
import Drilling from "./pages/Drilling";
import StandartyPage from "./pages/StandartyPage";
import PortfolioPage from "./pages/PortfolioPage";
import Contact from "./pages/Contact";
import BlogPage from "./pages/BlogPage";
import BlogArticle from "./pages/BlogArticle";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="okna" element={<Windows />} />
          <Route path="kondicionery" element={<AC />} />
          <Route path="ventilyaciya" element={<Ventilation />} />
          <Route path="almaznoe-burenie" element={<Drilling />} />
          <Route path="standarty" element={<StandartyPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="kontakty" element={<Contact />} />
          <Route path="/baza-znaniy" element={<BlogPage />} />
          <Route path="/baza-znaniy/:slug" element={<BlogArticle />} />
          <Route path="/kontakty" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}