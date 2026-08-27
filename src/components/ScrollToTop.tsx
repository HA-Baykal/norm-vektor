import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}
const posKey = (locationKey: string) => `scroll_pos:${locationKey}`;

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [visible, setVisible] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);

  // Последняя истинная позиция скролла текущей страницы
  const lastScrollYRef = useRef(0);
  const isNavigatingRef = useRef(false);

  // Pre-save cleanup при смене ключа/страницы: сохраняем истинную позицию,
  // только если она > 0 (не затираем нулем при стягивании DOM браузером)
  useLayoutEffect(() => {
    const key = location.key;
    const pathname = location.pathname;
    return () => {
      try {
        const y = Math.round(lastScrollYRef.current);
        if (y > 0) {
          sessionStorage.setItem(posKey(key), String(y));
          if (pathname === "/kondicionery" || pathname === "/") {
            sessionStorage.setItem("catalog_scroll_pos", String(y));
          }
        }
      } catch {}
    };
  }, [location.key, location.pathname]);

  // Восстановление позиции при POP или скролл наверх при PUSH
  useLayoutEffect(() => {
    if (navigationType === "POP") {
      let saved = sessionStorage.getItem(posKey(location.key));
      if (!saved || saved === "0") {
        if (location.pathname === "/kondicionery" || location.pathname === "/") {
          saved = sessionStorage.getItem("catalog_scroll_pos");
        }
      }
      const target = saved !== null ? (parseInt(saved, 10) || 0) : 0;
      const targetCardId = sessionStorage.getItem("catalog_last_card_id");

      if (target > 0 || targetCardId) {
        let attempts = 0;
        let raf = 0;
        let timer1: any = null;
        let timer2: any = null;
        let timer3: any = null;

        const tryRestore = () => {
          let scrollTarget = target;
          // Если точная позиция в пикселях была 0, но есть ID карточки — находим её в DOM
          if (scrollTarget <= 0 && targetCardId) {
            const cardEl = document.getElementById(`card-${targetCardId}`);
            if (cardEl) {
              const rect = cardEl.getBoundingClientRect();
              scrollTarget = Math.max(0, Math.round(rect.top + window.scrollY - 120));
            }
          }

          if (scrollTarget > 0) {
            const html = document.documentElement;
            const prevBehavior = html.style.scrollBehavior;
            html.style.scrollBehavior = "auto";
            window.scrollTo({ top: scrollTarget, left: 0, behavior: "instant" });
            html.style.scrollBehavior = prevBehavior;

            const achieved = Math.abs(window.scrollY - scrollTarget) <= 2;
            if (!achieved && attempts++ < 90) {
              raf = requestAnimationFrame(tryRestore);
            } else {
              lastScrollYRef.current = window.scrollY;
            }
          } else if (attempts++ < 90) {
            raf = requestAnimationFrame(tryRestore);
          }
        };

        tryRestore();
        timer1 = setTimeout(tryRestore, 50);
        timer2 = setTimeout(tryRestore, 150);
        timer3 = setTimeout(tryRestore, 300);

        prevPathnameRef.current = location.pathname;
        return () => {
          cancelAnimationFrame(raf);
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
    if (prevPathnameRef.current !== null && prevPathnameRef.current === location.pathname) {
      if (location.hash) {
        const id = location.hash.slice(1);
        let attempts = 0;
        let raf = 0;
        const tryAnchor = () => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
          else if (attempts++ < 30) raf = requestAnimationFrame(tryAnchor);
        };
        tryAnchor();
        prevPathnameRef.current = location.pathname;
        return () => cancelAnimationFrame(raf);
      }
      prevPathnameRef.current = location.pathname;
      return;
    }
    if (navigationType === "REPLACE" && prevPathnameRef.current === location.pathname) {
      if (location.hash) {
        const id = location.hash.slice(1);
        let attempts = 0;
        let raf = 0;
        const tryAnchor = () => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
          else if (attempts++ < 30) raf = requestAnimationFrame(tryAnchor);
        };
        tryAnchor();
        prevPathnameRef.current = location.pathname;
        return () => cancelAnimationFrame(raf);
      }
      prevPathnameRef.current = location.pathname;
      return;
    }
    const hasScrollTarget = sessionStorage.getItem("catalog_last_card_id");
    if (hasScrollTarget && (location.pathname === "/kondicionery" || location.pathname === "/")) {
      prevPathnameRef.current = location.pathname;
      return;
    }
    if (location.hash) {
      const id = location.hash.slice(1);
      let attempts = 0;
      let raf = 0;
      const tryAnchor = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        else if (attempts++ < 30) raf = requestAnimationFrame(tryAnchor);
      };
      tryAnchor();
      prevPathnameRef.current = location.pathname;
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    prevPathnameRef.current = location.pathname;
  }, [location.key, location.pathname, location.search, location.hash, navigationType]);

  // Слушатель скролла и кликов по ссылкам
  useEffect(() => {
    isNavigatingRef.current = false;
    const key = posKey(location.key);
    const pathname = location.pathname;
    let raf = 0;

    if (window.scrollY > 0) {
      lastScrollYRef.current = window.scrollY;
    }

    const save = () => {
      raf = 0;
      if (isNavigatingRef.current) return;
      const y = window.scrollY;
      if (y > 0) {
        lastScrollYRef.current = y;
        try {
          sessionStorage.setItem(key, String(Math.round(y)));
          if (pathname === "/kondicionery" || pathname === "/") {
            sessionStorage.setItem("catalog_scroll_pos", String(Math.round(y)));
          }
        } catch {}
      }
    };

    const onScroll = () => {
      if (isNavigatingRef.current) return;
      const y = window.scrollY;
      if (y > 0) {
        lastScrollYRef.current = y;
        if (!raf) raf = requestAnimationFrame(save);
      }
    };

    // При клике на карточку или ссылку фиксируем истинный скролл до любых смен DOM React'ом
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.("a") || el?.closest?.("button")) {
        const y = window.scrollY;
        if (y > 0) {
          lastScrollYRef.current = y;
          try {
            sessionStorage.setItem(key, String(Math.round(y)));
            if (pathname === "/kondicionery" || pathname === "/") {
              sessionStorage.setItem("catalog_scroll_pos", String(Math.round(y)));
            }
          } catch {}
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
    window.addEventListener("pagehide", save);

    return () => {
      isNavigatingRef.current = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pagehide", save);
    };
  }, [location.key, location.pathname]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Наверх" title="Вернуться в начало" className="fixed bottom-6 right-5 z-[70] flex h-13 w-13 items-center justify-center rounded-2xl bg-[#ff6b35] text-white shadow-2xl shadow-[#ff6b35]/40 transition duration-200 hover:-translate-y-1 hover:bg-[#e95620] active:scale-90 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 border border-white/20 group">
      <div className="flex flex-col items-center">
        <span className="text-xl font-black leading-none group-hover:-translate-y-0.5 transition-transform">↑</span>
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Наверх</span>
      </div>
    </button>
  );
}
