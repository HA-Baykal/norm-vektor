import { useEffect } from "react";
/**
 * Модальное окно выбора площадки для отзыва.
 * Ведёт пользователя напрямую на форму отзыва в 2ГИС или Яндекс.Картах.
 */
// Прямые ссылки на добавление отзыва
const REVIEW_LINKS = {
  gis: "https://2gis.ru/irkutsk/firm/70000001115497655/tab/reviews/addreview",
  yandex: "https://yandex.ru/maps/org/vektor_komforta/117268889988/reviews/",
};
export default function ReviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Закрытие по Esc + блокировка прокрутки фона
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-2xl sm:rounded-[2rem] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-2xl font-black text-[#1a3a5c] sm:text-3xl">
            Спасибо, что выбрали нас!
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Ваш отзыв очень важен. Выберите удобную площадку — это займёт меньше минуты.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {/* 2ГИС */}
          <a
            href={REVIEW_LINKS.gis}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 transition hover:border-[#26b24b] hover:bg-green-50 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#26b24b] text-lg font-black text-white">
                2ГИС
              </div>
              <div className="text-left">
                <div className="font-black text-[#1a3a5c]">Отзыв в 2ГИС</div>
                <div className="text-xs font-semibold text-slate-500">
                  Рейтинг 5.0 · популярно в Иркутске
                </div>
              </div>
            </div>
            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {/* Яндекс.Карты */}
          <a
            href={REVIEW_LINKS.yandex}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 transition hover:border-[#fc3f1d] hover:bg-red-50 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fc3f1d] text-xl font-black text-white">
                Я
              </div>
              <div className="text-left">
                <div className="font-black text-[#1a3a5c]">Отзыв в Яндекс.Картах</div>
                <div className="text-xs font-semibold text-slate-500">
                  Виден в поиске Яндекса
                </div>
              </div>
            </div>
            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full px-6 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-100"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
