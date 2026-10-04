import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import { MAX_LINK, TELEGRAM_LINK, WHATSAPP_LINK } from "../data/contacts";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const navItems: { to: string; label: string; mobileLabel?: string }[] = [
  { to: "/", label: "Главная" },
  { to: "/okna", label: "Окна" },
  { to: "/kondicionery", label: "Кондиционеры" },
  { to: "/ventilyaciya", label: "Вентиляция" },
  { to: "/almaznoe-burenie", label: "Алмазное бурение" },
  { to: "/interier", label: "Interier", mobileLabel: "Interier — дизайн интерьера по фото" },
  { to: "/baza-znaniy", label: "База знаний" },
  { to: "/standarty", label: "Стандарты Монтажа" },
  { to: "/kontakty", label: "Контакты" },
];

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const openChat = () => {
    // Показываем виджет Jivo (CSS прячет его, пока на body нет класса jivo-open)
    document.body.classList.add("jivo-open");
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

          {/* Desktop nav: с xl; на ноутбуках 1024–1279 хватает бургер-меню */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                title={item.mobileLabel || item.label}
                className={({ isActive }) =>
                  `px-2.5 py-2 text-[13px] font-medium rounded-lg transition-colors ${
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
          <div className="flex items-center gap-1.5">
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

            {/* Мессенджеры на компьютере: WhatsApp и Telegram всегда под рукой */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в WhatsApp"
              title="Написать в WhatsApp"
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#25D366] hover:bg-[#1fb457] text-white transition shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в Telegram"
              title="Написать в Telegram"
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#229ED9] hover:bg-[#1d8dc4] text-white transition shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>

            {/* Кнопка MAX на компьютере */}
            <a
              href={MAX_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a3a5c] hover:bg-[#122943] text-white text-sm font-bold transition shadow-md border border-white/10"
            >
              <span className="w-6 h-6 rounded bg-white text-[#1a3a5c] grid place-items-center text-[10px] font-black leading-none">MAX</span>
              Написать
            </a>

            <a
              href="tel:+79149146606"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition shadow-lg shadow-brand-600/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2L8.1 10.6a11 11 0 005.3 5.3l1.22-2.13a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.7 21 3 14.3 3 6V5z" />
              </svg>
              Позвонить
            </a>
            <button
              onClick={openChat}
              aria-label="Открыть онлайн-чат"
              title="Онлайн-чат"
              className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent-500 hover:bg-accent-600 text-white transition shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
          <nav className="xl:hidden py-4 border-t border-slate-200 dark:border-slate-800">
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
                  {item.mobileLabel || item.label}
                </NavLink>
              ))}
              {/* Мессенджеры в телефоне */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-bold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Написать в WhatsApp
              </a>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#229ED9] text-white font-bold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Написать в Telegram
              </a>
              <a
                href={MAX_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1a3a5c] text-white font-bold"
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
