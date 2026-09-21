import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COOKIE_BANNER_TEXT, LEGAL_PATHS } from "../data/legal";

// Уведомление о cookies и Яндекс.Метрике. Показывается один раз,
// факт ознакомления хранится в localStorage.
const KEY = "vk_cookie_ok";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* приватный режим — просто не показываем повторно */ }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* noop */ }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Уведомление об использовании cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 md:p-4 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto rounded-2xl bg-slate-900/95 text-slate-200 backdrop-blur border border-white/10 shadow-2xl px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center gap-3 text-xs md:text-sm">
        <p className="flex-1 leading-snug">
          🍪 {COOKIE_BANNER_TEXT}{" "}
          <Link to={LEGAL_PATHS.policy} className="underline text-accent-400 hover:text-accent-500">политикой конфиденциальности</Link>.
        </p>
        <button onClick={accept} className="shrink-0 px-4 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e95620] text-white font-bold transition">
          Понятно
        </button>
      </div>
    </div>
  );
}
