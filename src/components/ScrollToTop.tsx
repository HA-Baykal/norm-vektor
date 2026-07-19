import { useEffect, useState } from "react";
// Кнопка "Наверх" — появляется при прокрутке вниз, возвращает в начало страницы
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
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
      className="fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a3a5c] text-white shadow-xl shadow-slate-900/30 transition hover:-translate-y-1 hover:bg-[#122943] sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
