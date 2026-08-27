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

  // Последняя ИСТИННАЯ позиция скролла текущей страницы.
  // Обновляется синхронно слушателем scroll, пока страница реально открыта.
  // Нельзя в cleanup при переходе читать window.scrollY напрямую: на этот момент
  // React уже сменил DOM на новую страницу (карточка короче каталога, либо
  // Suspense-fallback на 100vh), и браузер стягивает scrollY к высоте новой
  // страницы — мы бы сохранили 0 вместо реальной позиции каталога.
  const lastScrollYRef = useRef(0);

  useLayoutEffect(() => {
    const key = location.key;
    return () => {
      try {
        // Ключ — старый (страницы, с которой уходим), позиция — из рефа:
        // это то, где страница была на самом деле до смены контента.
        sessionStorage.setItem(posKey(key), String(Math.round(lastScrollYRef.current)));
      } catch {}
    };
  }, [location.key]);

  useLayoutEffect(() => {
    if (navigationType === "POP") {
      const saved = sessionStorage.getItem(posKey(location.key));
      if (saved !== null) {
        const target = parseInt(saved, 10) || 0;
        let attempts = 0;
        let raf = 0;
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

  useEffect(() => {
    const key = posKey(location.key);
    let raf = 0;
    lastScrollYRef.current = window.scrollY;
    const save = () => {
      raf = 0;
      lastScrollYRef.current = window.scrollY;
      try { sessionStorage.setItem(key, String(Math.round(window.scrollY))); } catch {}
    };
    const saveSync = () => {
      lastScrollYRef.current = window.scrollY;
      try { sessionStorage.setItem(key, String(Math.round(window.scrollY))); } catch {}
    };
    const onScroll = () => {
      lastScrollYRef.current = window.scrollY;
      if (!raf) raf = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveSync);
    save();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveSync);
    };
  }, [location.key]);

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
