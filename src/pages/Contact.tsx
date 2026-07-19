import Map from "../components/Map";
import QuoteForm from "../components/QuoteForm";

export default function Contact() {
  const openChat = () => {
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) window.jivo_api.open();
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  📞
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Городской номер</div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">66-99-30</div>
                </div>
              </a>

              <button
                onClick={openChat}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 hover:shadow-xl transition group w-full text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-2xl text-white group-hover:scale-110 transition">
                  💬
                </div>
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Онлайн-чат Jivo</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Написать в чат →</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Ответим за 2 минуты</div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-3xl mb-2">🕒</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Режим работы</div>
                  <div className="font-bold text-slate-900 dark:text-white">Пн–Сб 9:00–20:00</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Вс — по договорённости</div>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-3xl mb-2">📍</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">География</div>
                  <div className="font-bold text-slate-900 dark:text-white">Иркутск + 50 км</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ангарск, Шелехов, Хомутово</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-700 to-slate-900 text-white">
                <h3 className="font-bold text-xl mb-2">Наши направления</h3>
                <ul className="space-y-2 text-brand-100">
                  <li>🪟 Окна и остекление — собственное производство</li>
                  <li>❄️ Кондиционеры — продажа, монтаж, сервис, фреон</li>
                  <li>💨 Вентиляция — Тион, Vakio, рекуператоры</li>
                  <li>🔩 Алмазное бурение — 32–250 мм, без пыли</li>
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

      <Map />
    </>
  );
}
