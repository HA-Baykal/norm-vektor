import { Link } from "react-router-dom";
import Map from "../components/Map";
import QuoteForm from "../components/QuoteForm";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import { TELEGRAM_LINK, WHATSAPP_LINK } from "../data/contacts";

// Тот же профиль MAX, что в шапке, футере и форме заявки.
const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";
// Адрес офиса: ссылка на карточку организации в Яндекс Картах (та же, что в sameAs).
const YANDEX_MAPS_LINK = "https://yandex.ru/maps/org/vektor_komforta/117268889988/";

// Основные направления — видимые внутренние ссылки со страницы контактов.
const SERVICE_LINKS: { to: string; icon: string; title: string; note: string }[] = [
  { to: "/okna", icon: "🪟", title: "Окна и остекление", note: "изготовление на заказ, профиль VEKA" },
  { to: "/kondicionery", icon: "❄️", title: "Кондиционеры", note: "продажа, монтаж, сервис, заправка фреоном" },
  { to: "/ventilyaciya", icon: "💨", title: "Вентиляция", note: "Тион, Vakio, рекуператоры, проекты" },
  { to: "/almaznoe-burenie", icon: "🔩", title: "Алмазное бурение", note: "отверстия 32–250 мм, без пыли" },
];

export default function Contact() {
  useSeo(
    "Контакты — Вектор Комфорта в Иркутске | Окна, кондиционеры, вентиляция",
    "Контакты компании Вектор Комфорта в Иркутске: ☎ +7 (914) 914-66-06, +7 (3952) 66-99-30. Окна, кондиционеры, вентиляция и алмазное бурение. Пн–Сб 9:00–20:00, выезд по Иркутску и пригороду до 50 км."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Контакты", path: "/kontakty" },
  ]);
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
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.2),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Контакты</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto">
            Свяжитесь удобным способом — работаем без выходных в Иркутске и пригороде
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <a
                  href="tel:+79149146606"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  📞
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Основной телефон</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">+7 (914) 914-66-06</div>
                </div>
              </a>

              <a
                  href="tel:+73952669930"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  📞
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Городской номер</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">66-99-30</div>
                </div>
              </a>
              <a
                  href="tel:+79086401166"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  📞
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Основной номер</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">+7 (908) 640-11-66</div>
                </div>
              </a>

              {/* E-mail: виден в HTML без открытия модалок (контактный сигнал NAP) */}
              <a
                  href="mailto:montaj138@mail.ru"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  ✉️
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Электронная почта</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white break-all">montaj138@mail.ru</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Ответим в течение рабочего дня</div>
                </div>
              </a>

              {/* MAX: мессенджер компании, та же ссылка, что в шапке и футере */}
              <a
                  href={MAX_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-[#1a3a5c] flex items-center justify-center text-white group-hover:scale-110 transition">
                  <span className="w-8 h-8 rounded bg-white text-[#1a3a5c] grid place-items-center text-[11px] font-black">MAX</span>
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Мессенджер MAX</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Написать в MAX →</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Отвечаем за 5 минут, можно прислать фото объекта</div>
                </div>
              </a>

              {/* WhatsApp: отдельный номер владельца */}
              <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">WhatsApp</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Написать в WhatsApp →</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Можно прислать фото объекта и размеры</div>
                </div>
              </a>

              {/* Telegram: тот же основной номер, что в шапке и футере */}
              <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-[#229ED9] flex items-center justify-center text-white group-hover:scale-110 transition">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Telegram</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Написать в Telegram →</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Откроется чат с номером компании</div>
                </div>
              </a>

              <button
                  onClick={openChat}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group w-full text-left"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  💬
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Онлайн-чат Jivo</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Написать в чат →</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Ответим быстро, без звонков</div>
                </div>
              </button>

              {/* Адрес офиса: виден в HTML, ссылка ведёт на карточку в Яндекс Картах */}
              <a
                  href={YANDEX_MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group"
              >
                <div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Адрес офиса и производства</div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    Иркутск, Байкальская улица, 202/2, цокольный этаж
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    664075 · показать на Яндекс Картах →
                  </div>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-4">
                <div
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-3xl mb-2">🕒</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Режим работы</div>
                  <div className="font-bold text-slate-900 dark:text-white">Пн–Сб 9:00–20:00</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Вс — по договорённости</div>
                </div>
                <div
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-3xl mb-2">📍</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">География</div>
                  <div className="font-bold text-slate-900 dark:text-white">Иркутск + 50 км</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ангарск, Шелехов, Хомутово</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-700 to-slate-900 text-white">
                <h2 className="font-bold text-xl mb-1">Наши направления</h2>
                <p className="text-sm text-brand-100/80 mb-4">
                  По каждому направлению — замер, расчёт и монтаж. Выберите раздел, чтобы посмотреть цены и работы.
                </p>
                <ul className="space-y-2">
                  {SERVICE_LINKS.map((s) => (
                    <li key={s.to}>
                      <Link
                        to={s.to}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 bg-white/10 hover:bg-white/20 transition text-brand-100"
                      >
                        <span aria-hidden className="text-lg leading-none mt-0.5">{s.icon}</span>
                        <span>
                          <span className="block font-bold text-white">{s.title} →</span>
                          <span className="block text-xs text-brand-100/80">{s.note}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <QuoteForm
                  title="Быстрая заявка"
                  subtitle="Перезвоним в течение 15 минут и бесплатно проконсультируем"
              />
            </div>
          </div>
        </div>
      </section>

      <Map/>
    </>
  );
}
