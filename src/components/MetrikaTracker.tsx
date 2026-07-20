import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// ============================================================================
// ОТСЛЕЖИВАНИЕ ПЕРЕХОДОВ ДЛЯ ЯНДЕКС.МЕТРИКИ (SPA)
// Сообщает Метрике о каждой смене страницы (React Router).
// Вставьте <MetrikaTracker /> внутри <BrowserRouter> в App.tsx.
// ============================================================================

// Ваш номер счётчика Яндекс.Метрики
const YM_COUNTER_ID = 110548089;

// Тип для window.ym (чтобы TypeScript не ругался)
declare global {
  interface Window {
    ym?: (id: number, action: string, url?: string, params?: object) => void;
  }
}

export default function MetrikaTracker() {
  const location = useLocation();

  useEffect(() => {
    // При каждой смене адреса отправляем «hit» (просмотр страницы) в Метрику
    if (typeof window.ym === "function") {
      window.ym(YM_COUNTER_ID, "hit", location.pathname + location.search);
    }
  }, [location]);

  return null; // компонент ничего не рисует, только отслеживает
}
