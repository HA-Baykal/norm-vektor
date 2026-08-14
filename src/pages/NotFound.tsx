import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSeo } from "../utils/useSeo";
const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";
export default function NotFound() {
  useSeo("Страница не найдена (404) — Вектор Комфорта, Иркутск", "Ошибка 404: страница не найдена. Перейдите на главную — окна, кондиционеры и вентиляция в Иркутске от компании Вектор Комфорта.");

  // Не индексируем битые URL: поисковик должен получать 404/noindex, а не дубль главной
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.querySelectorAll('meta[name="robots"][content="noindex"]').forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">
          Ошибка 404 — страница не найдена
        </div>
        <div className="mt-6 text-7xl sm:text-8xl font-black text-[#1a3a5c] leading-none">404</div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Такой страницы нет — но мы рядом
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Вы ошиблись адресом или товар переехал. Выберите раздел ниже — мы покажем актуальные товары, цены и акции.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link to="/" className="px-6 py-3 rounded-full bg-[#1a3a5c] text-white font-black text-sm hover:bg-[#122943]">На главную</Link>
          <Link to="/kondicionery" className="px-6 py-3 rounded-full bg-white border border-slate-200 font-bold text-sm hover:bg-slate-50">Кондиционеры</Link>
          <Link to="/okna" className="px-6 py-3 rounded-full bg-white border border-slate-200 font-bold text-sm hover:bg-slate-50">Окна</Link>
          <Link to="/kontakty" className="px-6 py-3 rounded-full bg-white border border-slate-200 font-bold text-sm hover:bg-slate-50">Контакты</Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href="tel:+79149146606" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff6b35] text-white font-black text-sm hover:bg-[#e95620]">📞 +7 (914) 914-66-06</a>
          <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1a3a5c] text-white font-black text-sm hover:bg-[#122943]"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[9px] font-black">MAX</span> Написать в MAX</a>
        </div>
        <div className="mt-8 text-xs text-slate-400">Подсказка: проверьте адрес или перейдите в каталог — там подбор по площади и цены от 16 636 ₽</div>
      </div>
    </div>
  );
}
