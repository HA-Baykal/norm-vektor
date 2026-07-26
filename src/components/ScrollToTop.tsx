import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Компонент выполняет 2 важнейшие задачи: 
// 1. При открытии любой страницы моментально сбрасывает скролл на самый верх
// 2. Показывает удобную плавающую кнопку "↑ Наверх" при прокрутке страницы вниз
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Сброс прокрутки вверх при каждом переходе между страницами или карточками
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Отслеживание прокрутки вниз для появления кнопки
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      title="Вернуться в начало"
      className="fixed bottom-6 right-5 z-[70] flex h-13 w-13 items-center justify-center rounded-2xl bg-[#ff6b35] text-white shadow-2xl shadow-[#ff6b35]/40 transition duration-200 hover:-translate-y-1 hover:bg-[#e95620] active:scale-90 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 border border-white/20 group"
    >
      <div className="flex flex-col items-center">
        <span className="text-xl font-black leading-none group-hover:-translate-y-0.5 transition-transform">↑</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Наверх</span>
      </div>
    </button>
  );
}
