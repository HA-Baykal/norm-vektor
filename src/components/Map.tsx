export default function Map() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-400 text-sm font-semibold mb-3">
            География работ
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Зона обслуживания — до 50 км от Иркутска
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Работаем в Иркутске, Ангарске, Шелехове, Хомутово и пригороде
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Stylized map using Yandex static iframe */}
            <iframe
              title="Зона обслуживания"
              src="https://yandex.ru/map-widget/v1/?ll=104.296873%2C52.286974&z=10&pt=104.296873,52.286974,pm2rdm~104.145000,52.543000,pm2blm~104.098000,52.210000,pm2blm~104.200000,52.340000,pm2blm"
              width="100%"
              height="450"
              frameBorder="0"
              style={{ display: "block" }}
            />
          </div>

          <div className="space-y-4">
            {[
              { city: "Иркутск", icon: "🏙️", note: "Основной офис, выезд в день обращения" },
              { city: "Ангарск", icon: "🏭", note: "~50 км, выезд 1–2 раза в неделю" },
              { city: "Шелехов", icon: "🌲", note: "~20 км, быстрый выезд" },
              { city: "Хомутово", icon: "🏡", note: "~15 км, частый маршрут" },
              { city: "Пригород", icon: "🚐", note: "До 50 км: Смоленщина, Мельниково, Урик и др." },
            ].map((c) => (
              <div
                key={c.city}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-accent-500 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{c.icon}</div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{c.city}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{c.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
