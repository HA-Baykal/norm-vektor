import { Link } from "react-router-dom";
import { useState } from "react";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import Map from "../components/Map";
import CTABanner from "../components/CTABanner";
import BrandsCatalog from "../components/BrandsCatalog";
import VideoGallery from "../components/VideoGallery";
import FAQSection from "../components/FAQSection";
import QuickBookingModal from "../components/QuickBookingModal";
import MobileBottomBar from "../components/MobileBottomBar";
import BazaZnaniyBanner from "../components/BazaZnaniyBanner";
import GeoLinksBlock from "../components/GeoLinksBlock";
import { useSeo } from "../utils/useSeo";

const directions = [
  {
    to: "/okna",
    icon: "🪟",
    title: "Окна и остекление",
    price: "от 11 000 ₽/м²",
    desc: "Изготовление и монтаж ПВХ профиля VEKA и алюминиевых систем. Собственный цех в Иркутске. Гарантия 5 лет.",
    accent: "from-blue-600 to-indigo-700",
    badge: "Собственный цех",
    tags: ["Профиль VEKA", "Фурнитура MACO", "Балконы под ключ"],
  },
  {
    to: "/kondicionery",
    icon: "❄️",
    title: "Кондиционеры",
    price: "от 17 351 ₽",
    desc: "Продажа, профессиональный монтаж, заправка фреоном и ТО. Инверторные модели с умным домом и низкой шумностью.",
    accent: "from-cyan-500 to-blue-600",
    badge: "Монтаж 1 день",
    tags: ["Ballu, Electrolux", "Умный дом", "Сервис и фреон"],
  },
  {
    to: "/ventilyaciya",
    icon: "💨",
    title: "Вентиляция и бризеры",
    price: "от 6 000 ₽",
    desc: "Приточно-вытяжные системы, бризеры Тион и Vakio. Очистка воздуха, рекуперация тепла для домов и бизнеса.",
    accent: "from-emerald-500 to-teal-700",
    badge: "Партнёр Тион & Vakio",
    tags: ["Бризеры Тион", "Vakio", "Проектирование"],
  },
  {
    to: "/almaznoe-burenie",
    icon: "🔩",
    title: "Алмазное бурение",
    price: "от 2 000 ₽/точка",
    desc: "Бурение отверстий 32–250 мм в бетоне и кирпиче. Сухой способ с пылесосом — без грязи и трещин на чистовом ремонте.",
    accent: "from-orange-500 to-rose-600",
    badge: "Без пыли",
    tags: ["32–250 мм", "Сухое бурение", "Точность ±1мм"],
  },
];

const quickTabs = [
  {
    id: "okna",
    title: "Пластиковые окна",
    price: "от 11 000 ₽/м²",
    features: ["Профиль VEKA с замкнутым армированием", "Фурнитура MACO с микропроветриванием", "Монтаж строго по ГОСТу"],
    href: "/okna",
    btnText: "Рассчитать окно онлайн",
  },
  {
    id: "ac",
    title: "Кондиционеры",
    price: "от 17 351 ₽",
    features: ["Бесплатный замер и подбор под площадь", "Стандартный монтаж за 3-4 часа", "Гарантия на оборудование до 5 лет"],
    href: "/kondicionery",
    btnText: "Каталог моделей",
  },
  {
    id: "vent",
    title: "Вентиляция и Бризеры",
    price: "от 6 000 ₽",
    features: ["Свежий воздух с закрытыми окнами", "Защита от уличного шума и пыли", "Многоступенчатая HEPA-фильтрация"],
    href: "/ventilyaciya",
    btnText: "Калькулятор вентиляции",
  },
  {
    id: "drilling",
    title: "Алмазное бурение",
    price: "от 2 000 ₽/точка",
    features: ["Безударная технология без вибраций", "Сухой способ с пылесосом (для чистовой)", "Диаметры от 32 до 250 мм"],
    href: "/almaznoe-burenie",
    btnText: "Рассчитать бурение",
  },
];

const standardHighlights = [
  {
    icon: "🪟",
    tag: "Окна",
    title: "Замкнутое армирование VEKA & Пароизоляция",
    text: "Используем немецкий профиль VEKA со стальным замкнутым контуром. Устанавливаем на пластиковые клинья (не бруски), а монтажный шов обязательно закрываем паро-влагоизоляцией.",
  },
  {
    icon: "❄️",
    tag: "Климат",
    title: "Обязательное вакуумирование магистрали",
    text: "Удаляем 100% воздуха и влаги из медных трубок перед запуском фреона. Это защищает компрессор от сгорания и сохраняет заводскую гарантию.",
  },
  {
    icon: "🌬️",
    tag: "Вентиляция",
    title: "Герметизация стыков & Расчёт воздухообмена",
    text: "Рассчитываем реальный объём воздуха, а не ставим «на глаз». Проклеиваем каждый стык воздуховодов, исключая потери давления и лишний шум.",
  },
  {
    icon: "🔩",
    tag: "Бурение",
    title: "Безударное сухое сверление с пылесосом",
    text: "Бурим алмазными коронками без ударов и вибраций. Готовый чистовой ремонт остается сухим и не повреждается.",
  },
];

export default function Home() {
  useSeo(
    "Пластиковые окна, кондиционеры и вентиляция в Иркутске — Вектор Комфорта",
    "Вектор Комфорта в Иркутске: производство и монтаж пластиковых окон VEKA, продажа и установка кондиционеров, вентиляция и бризеры, алмазное бурение. Гарантия до 5 лет, бесплатный замер, работаем в пригороде до 50 км."
  );
  const [activeTab, setActiveTab] = useState("okna");
  const [bookingOpen, setBookingOpen] = useState(false);
  const activeTabData = quickTabs.find((t) => t.id === activeTab) || quickTabs[0];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm font-semibold text-slate-200">
              <span className="text-amber-400">★ 5.0</span> | Рейтинг на 2ГИС
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs sm:text-sm font-semibold text-orange-400">
              📍 Иркутск, Ангарск, Шелехов + 50 км
            </span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                Окна, кондиционеры и вентиляция{" "}
                <span className="text-[#ff6b35] block mt-1">
                  в Иркутске — под ключ
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                4 экспертных направления с собственным производством в Иркутске. Изготавливаем окна VEKA, устанавливаем кондиционеры, вентиляцию и производим бурение под ключ с гарантией до 5 лет.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setBookingOpen(true)}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#ff6b35] hover:bg-[#e95620] text-white font-extrabold text-base transition"
                >
                  📐 Вызвать замерщика 0 ₽
                </button>
                <a
                  href="tel:+79149146606"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-base transition"
                >
                  📞 +7 (914) 914-66-06
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
                <div className="text-xs font-bold uppercase tracking-widest text-[#ff6b35] mb-2">
                  Быстрый подбор
                </div>
                <h3 className="text-xl font-extrabold text-white mb-6">
                  Выберите услугу под вашу задачу
                </h3>

                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                  {quickTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition ${
                        activeTab === t.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.title.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm text-slate-400 font-medium">{activeTabData.title}</span>
                    <span className="text-xl font-extrabold text-[#ff6b35]">{activeTabData.price}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {activeTabData.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b35]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={activeTabData.href}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white transition"
                  >
                    {activeTabData.btnText} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 НАПРАВЛЕНИЯ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              Четыре направления — единый стандарт качества
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {directions.map((d) => (
              <Link
                key={d.to}
                to={d.to}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 hover:shadow-2xl transition duration-300"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a3a5c] flex items-center justify-center text-4xl text-white">
                      {d.icon}
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300">
                      {d.badge}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {d.title}
                    </h3>
                    <span className="text-sm font-extrabold text-[#ff6b35]">{d.price}</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {d.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-[#1a3a5c] dark:text-amber-400">
                  Подробнее об услуге <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* СТАНДАРТЫ МОНТАЖА */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase mb-3">
                Бескомпромиссное качество
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white">
                Наши стандарты монтажа
              </h2>
            </div>
            <Link
              to="/standarty"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
            >
              Полные стандарты монтажа →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardHighlights.map((sh) => (
              <div
                key={sh.title}
                className="p-6 rounded-3xl bg-slate-800 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{sh.icon}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-xs font-bold text-slate-300">
                    {sh.tag}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  {sh.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {sh.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <BazaZnaniyBanner />
      <VideoGallery />
      <BrandsCatalog />
      <Counters />
      <Reviews />
      <FAQSection />
      <CTABanner />

      <GeoLinksBlock />

      <Map />

      <QuickBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <MobileBottomBar onOpenBooking={() => setBookingOpen(true)} />
    </>
  );
}