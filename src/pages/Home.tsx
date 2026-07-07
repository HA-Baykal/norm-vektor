import { Link } from "react-router-dom";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import Map from "../components/Map";
import CTABanner from "../components/CTABanner";
import QuoteForm from "../components/QuoteForm";

const directions = [
  {
    to: "/okna",
    icon: "🪟",
    title: "Окна и остекление",
    desc: "Изготовление и монтаж ПВХ и алюминиевых конструкций: окна, двери, балконы, лоджии, витражи, стеклянные перегородки. Собственное производство. Регулировка, ремонт, замена стеклопакетов.",
    accent: "from-brand-500 to-brand-700",
    tags: ["ПВХ", "Алюминий", "Балконы", "Витражи"],
  },
  {
    to: "/kondicionery",
    icon: "❄️",
    title: "Кондиционеры",
    desc: "Продажа большого выбора моделей и профессиональный монтаж. Устанавливаем кондиционеры в квартирах, домах, магазинах, офисах и коммерческих зданиях. Обслуживаем, чистим и заправляем фреон.",
    accent: "from-cyan-500 to-blue-600",
    tags: ["Монтаж", "Чистка", "Фреон", "Гарантия"],
  },
  {
    to: "/ventilyaciya",
    icon: "💨",
    title: "Вентиляция",
    desc: "Системы приточно-вытяжной вентиляции: продажа и монтаж рекуператоров, бризеров, Тион, Vakio. Проектирование, изготовление воздуховодов, монтаж для квартир, домов, производств, ресторанов.",
    accent: "from-emerald-500 to-teal-700",
    tags: ["Тион", "Vakio", "Бризеры", "Проект"],
  },
  {
    to: "/almaznoe-burenie",
    icon: "🔩",
    title: "Алмазное бурение",
    desc: "Сверление отверстий от 32 до 250 мм в бетоне, железобетоне, кирпиче. Сухое бурение с пылесосом (для готового ремонта) и мокрое с подачей воды (для чернового).",
    accent: "from-accent-500 to-rose-600",
    tags: ["32–250 мм", "Сухое", "Мокрое", "Без пыли"],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.3),transparent_50%)]" />
        {/* Сетка-фон */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              Работаем в Иркутске и пригороде до 50 км
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
              Вектор <span className="text-accent-400">Комфорта</span>
              <span className="block text-2xl md:text-3xl mt-3 font-bold text-brand-100">
                Комфорт в каждом направлении
              </span>
            </h1>
            <p className="text-lg text-brand-100 mb-8 max-w-xl">
              Четыре направления — одно решение. Окна, кондиционеры, вентиляция и алмазное бурение. Собственное производство, профессиональный монтаж, гарантия до 5 лет.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+79149146606"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition shadow-xl shadow-accent-500/30"
              >
                📞 +7 (914) 914-66-06
              </a>
              <a
                href="tel:+73952669930"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold transition"
              >
                📞 66-99-30
              </a>
            </div>

            {/* Преимущества-пилюли */}
            <div className="mt-10 flex flex-wrap gap-2">
              {["Собственное производство", "Опыт 15+ лет", "Гарантия 5 лет", "Выезд в день обращения"].map((b) => (
                <span key={b} className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-sm text-brand-50 border border-white/10">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Форма справа */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <QuoteForm
              title="Бесплатная консультация"
              subtitle="Перезвоним в течение 15 минут и рассчитаем стоимость"
            />
          </div>
        </div>
      </section>

      {/* 4 направления */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-400 text-sm font-semibold mb-3">
              Наши направления
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Четыре направления — одно решение
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              Объединили смежные услуги, чтобы вы получили комплексный результат и одного надёжного подрядчика
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {directions.map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${d.accent} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${d.accent} flex items-center justify-center text-4xl shadow-lg`}>
                      {d.icon}
                    </div>
                    <div className="text-brand-600 dark:text-accent-400 group-hover:translate-x-1 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{d.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">{d.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Счётчики */}
      <Counters />

      {/* Почему мы */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
              Почему выбирают <span className="text-accent-500">нас</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏭", title: "Собственное производство", text: "Изготавливаем конструкции сами — без наценок посредников" },
              { icon: "👷", title: "Свои монтажные бригады", text: "Проверенные специалисты со стажем от 7 лет, без субподряда" },
              { icon: "🛡️", title: "Гарантия до 5 лет", text: "На конструкции и работы. Сервисное обслуживание после монтажа" },
              { icon: "⚡", title: "Сроки и точность", text: "Замер — в день обращения. Монтаж — в согласованную дату" },
              { icon: "💰", title: "Честная смета", text: "Подбираем решение под задачу и бюджет, без навязанных работ" },
              { icon: "🚐", title: "Выезд до 50 км", text: "Иркутск, Ангарск, Шелехов, Хомутово и пригород" },
              { icon: "🧹", title: "Чистота после работ", text: "Убираем за собой, вывозим мусор, защищаем отделку" },
              { icon: "📋", title: "Договор и чек", text: "Работаем официально. Все работы — по договору с гарантией" },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-brand-300 dark:hover:border-accent-500 transition"
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <Reviews />

      {/* CTA */}
      <CTABanner />

      {/* Карта */}
      <Map />
    </>
  );
}
