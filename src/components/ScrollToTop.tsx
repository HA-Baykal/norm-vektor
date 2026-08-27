import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Отключаем встроенное восстановление скролла браузера — управляем позицией сами.
// Иначе браузер «дёргает» страницу в SPA и при возврате назад кидает наверх.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Ключ, под которым храним позицию скролла конкретной записи истории браузера
const posKey = (locationKey: string) => `scroll_pos:${locationKey}`;

// Компонент выполняет 3 важнейшие задачи:
// 1. Запоминает позицию прокрутки каждой страницы в истории браузера
// 2. При нажатии «назад/вперёд» возвращает пользователя ровно туда, где он был
//    (при обычном переходе по ссылке — наверх новой страницы)
// 3. Показывает удобную плавающую кнопку "↑ Наверх" при прокрутке страницы вниз
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [visible, setVisible] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);

  // Восстановление / сброс прокрутки при каждой смене страницы
  useLayoutEffect(() => {
    // Возврат кнопкой «назад» или «вперёд» — восстанавливаем сохранённую позицию
    if (navigationType === "POP") {
      const saved = sessionStorage.getItem(posKey(location.key));
      if (saved !== null) {
        const target = parseInt(saved, 10) || 0;
        let attempts = 0;
        let raf = 0;

        // Контент (карточки, фото) может дорисовываться — пробуем несколько кадров,
        // пока страница не станет достаточно высокой для нужной позиции
        const tryRestore = () => {
          window.scrollTo({ top: target, left: 0, behavior: "instant" });
          const achieved = Math.abs(window.scrollY - target) <= 2;
          if (!achieved && attempts++ < 60) {
            raf = requestAnimationFrame(tryRestore);
          }
        };

        tryRestore();
        prevPathnameRef.current = location.pathname;
        return () => cancelAnimationFrame(raf);
      }
    }

    // query-only изменения внутри той же страницы (brand, area и другие фильтры через search params)
    // и REPLACE-навигация внутри той же страницы не должны сбрасывать скролл.
    if (prevPathnameRef.current !== null && prevPathnameRef.current === location.pathname) {
      // Переход по якорю (#catalog) должен продолжать работать даже внутри той же страницы
      if (location.hash) {
        const id = location.hash.slice(1);
        let attempts = 0;
        let raf = 0;

        const tryAnchor = () => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" });
          } else if (attempts++ < 30) {
            raf = requestAnimationFrame(tryAnchor);
          }
        };

        tryAnchor();
        prevPathnameRef.current = location.pathname;
        return () => cancelAnimationFrame(raf);
      }

      // Тот же pathname без якоря — сохраняем текущую позицию скролла
      prevPathnameRef.current = location.pathname;
      return;
    }

    // Явная проверка REPLACE внутри той же страницы (на случай если prevPathnameRef ещё не установлен)
    if (navigationType === "REPLACE" && prevPathnameRef.current === location.pathname) {
      if (location.hash) {
        const id = location.hash.slice(1);
        let attempts = 0;
        let raf = 0;

        const tryAnchor = () => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" });
          } else if (attempts++ < 30) {
            raf = requestAnimationFrame(tryAnchor);
          }
        };

        tryAnchor();
        prevPathnameRef.current = location.pathname;
        return () => cancelAnimationFrame(raf);
      }

      prevPathnameRef.current = location.pathname;
      return;
    }

    // Переход по внутренней ссылке «Вернуться в каталог» с открытой карточки:
    // каталог сам плавно подведёт к последней просмотренной карточке
    const hasScrollTarget = sessionStorage.getItem("catalog_last_card_id");
    if (hasScrollTarget && (location.pathname === "/kondicionery" || location.pathname === "/")) {
      prevPathnameRef.current = location.pathname;
      return;
    }

    // Переход по ссылке с якорем (например /kondicionery#catalog) — ведём к якорю
    if (location.hash) {
      const id = location.hash.slice(1);
      let attempts = 0;
      let raf = 0;

      const tryAnchor = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
        } else if (attempts++ < 30) {
          raf = requestAnimationFrame(tryAnchor);
        }
      };

      tryAnchor();
      prevPathnameRef.current = location.pathname;
      return () => cancelAnimationFrame(raf);
    }

    // Обычный переход на другую страницу — начинаем с самого верха
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    prevPathnameRef.current = location.pathname;
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  // Постоянно запоминаем позицию прокрутки текущей записи истории (надёжно, включая pagehide)
  useEffect(() => {
    const key = posKey(location.key);
    let raf = 0;

    const save = () => {
      raf = 0;
      try {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      } catch {
        /* sessionStorage может быть недоступен (приватный режим) — просто пропускаем */
      }
    };

    const saveSync = () => {
      try {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      } catch {
        /* ignore */
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveSync);
    save();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveSync);
      // Финальное синхронное сохранение для этой записи истории
      try {
        sessionStorage.setItem(key, String(Math.round(window.scrollY)));
      } catch {
        /* ignore */
      }
    };
  }, [location.key]);

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
