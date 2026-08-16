import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/okna", label: "Окна" },
  { to: "/kondicionery", label: "Кондиционеры" },
  { to: "/ventilyaciya", label: "Вентиляция" },
  { to: "/almaznoe-burenie", label: "Алмазное бурение" },
  { to: "/baza-znaniy", label: "База знаний" },
  { to: "/standarty", label: "Стандарты Монтажа" },
  { to: "/kontakty", label: "Контакты" },
];

const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const openChat = () => {
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) {
      // @ts-ignore
      window.jivo_api.open();
    } else {
      window.open("https://jivosite.com", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      {/* Top bar */}
      <div className="hidden md:block bg-brand-700 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span aria-hidden>📍</span>
              Иркутск · Ангарск · Шелехов · Хомутово · пригород до 50 км
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden>🕒</span>
              Пн–Сб 9:00–20:00
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+79149146606" className="hover:text-accent-400 transition">+7 (914) 914-66-06</a>
            <a href="tel:+73952669930" className="hover:text-accent-400 transition">66-99-30</a>
            <a href="tel:+79086401166" className="hover:text-accent-400 transition">+7 (908) 640-11-66</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105" />
            <div className="leading-tight">
              <div className="font-extrabold text-lg md:text-xl tracking-tight">
                Вектор <span className="text-accent-500">Комфорта</span>
              </div>
              <div className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Комфорт в каждом направлении
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-brand-700 dark:text-accent-400 bg-brand-50 dark:bg-slate-800"
                      : "text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-accent-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m0-12.728l1.414 1.414M17.95 17.95l1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* НОВОЕ: Кнопка MAX на компьютере */}
            <a
              href={MAX_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a3a5c] hover:bg-[#122943] text-white text-sm font-bold transition shadow-md border border-white/10"
            >
              <span className="w-6 h-6 rounded bg-white text-[#1a3a5c] grid place-items-center text-[10px] font-black leading-none">MAX</span>
              Написать
            </a>

            <a
              href="tel:+79149146606"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shadow-lg shadow-brand-600/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2L8.1 10.6a11 11 0 005.3 5.3l1.22-2.13a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.7 21 3 14.3 3 6V5z" />
              </svg>
              Позвонить
            </a>
            <button
              onClick={openChat}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition shadow-lg shadow-accent-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Написать
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Меню"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium transition ${
                      isActive
                        ? "bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-accent-400"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {/* НОВОЕ: Кнопка MAX в телефоне */}
              <a
                href={MAX_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a3a5c] text-white font-bold"
              >
                <span className="w-6 h-6 rounded bg-white text-[#1a3a5c] grid place-items-center text-[10px] font-black">MAX</span> Написать в MAX — отвечаем 5 мин
              </a>
              <div className="flex gap-2 mt-2">
                <a
                  href="tel:+79149146606"
                  className="flex-1 text-center px-4 py-3 rounded-xl bg-brand-600 text-white font-semibold"
                >
                  📞 Позвонить
                </a>
                <button
                  onClick={openChat}
                  className="flex-1 px-4 py-3 rounded-xl bg-accent-500 text-white font-semibold"
                >
                  💬 Чат
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
