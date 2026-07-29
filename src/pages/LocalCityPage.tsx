import { Link } from "react-router-dom";
import { useState } from "react";
import QuickBookingModal from "../components/QuickBookingModal";

interface LocalCityPageProps {
  cityKey: string;
  serviceKey: "okna" | "kondicionery";
}

const CITIES: Record<string, { name: string; in: string; from: string; about: string }> = {
  homutovo: { name: "Хомутово", in: "в Хомутово", from: "15 км от Иркутска", about: "посёлок Хомутово — частый маршрут наших монтажников, выезд в день обращения" },
  molodezhnom: { name: "Молодёжный", in: "в посёлке Молодёжный", from: "20 км от Иркутска", about: "посёлок Молодёжный Иркутского района — выезжаем регулярно" },
  angarske: { name: "Ангарск", in: "в Ангарске", from: "50 км от Иркутска", about: "Ангарск — выезд 1–2 раза в неделю, работаем по предварительной заявке" },
  shelehove: { name: "Шелехов", in: "в Шелехове", from: "20 км от Иркутска", about: "Шелехов — быстрый выезд, монтаж в день обращения" },
};

const SERVICES: Record<string, {
  title: string; titleGen: string; icon: string; price: string; brands: string;
  intro: string; advantages: { icon: string; title: string; text: string }[];
  features: string[];
}> = {
  okna: {
    title: "Пластиковые окна", titleGen: "пластиковых окон", icon: "🪟",
    price: "от 11 000 ₽/м²", brands: "VEKA, MACO",
    intro: "Производство и монтаж пластиковых окон с собственным цехом в Иркутске. Немецкий профиль VEKA, фурнитура MACO, монтаж по ГОСТу.",
    advantages: [
      { icon: "🏭", title: "Собственное производство", text: "Изготавливаем окна сами — без посредников и накруток. Контролируем каждый этап." },
      { icon: "🛡️", title: "Профиль VEKA + MACO", text: "Немецкий профиль с замкнутым армированием и фурнитурой MACO с микропроветриванием." },
      { icon: "📐", title: "Монтаж по ГОСТу", text: "Пароизоляция шва, установка на клинья — окна служат десятилетиями без продувания." },
      { icon: "✅", title: "Гарантия 5 лет", text: "3 года на окна, 1 год на монтаж. Документы и гарантийный талон." },
    ],
    features: ["Окна ПВХ (одно-, двух-, трёхстворчатые)", "Остекление балконов и лоджий под ключ", "Панорамные окна и алюминиевое остекление", "Крашеные окна и ламинация под дерево", "Балконные двери ПВХ", "Стеклянные перегородки и витражи"],
  },
  kondicionery: {
    title: "Кондиционеры", titleGen: "кондиционеров", icon: "❄️",
    price: "от 16 636 ₽", brands: "Daikin, Ballu, Electrolux, Midea, Kentatsu",
    intro: "Продажа и монтаж кондиционеров. Инверторные и стандартные сплит-системы с гарантией до 5 лет. Монтаж за 1 день.",
    advantages: [
      { icon: "⚡", title: "Монтаж за 1 день", text: "Продажа и стандартный монтаж кондиционера — за один визит." },
      { icon: "🤖", title: "Инвертор + умный дом", text: "Тихие инверторные модели с управлением со смартфона и Wi-Fi." },
      { icon: "🌀", title: "Вакуумирование", text: "Обязательное вакуумирование магистрали — сохраняем заводскую гарантию." },
      { icon: "🛡️", title: "Гарантия до 5 лет", text: "Заводская гарантия 3–5 лет + год на монтажные работы." },
    ],
    features: ["Подбор мощности под площадь (20–70 м²)", "Инверторные и стандартные сплит-системы", "Монтаж стандарт и премиум", "Заправка фреоном и сервис", "Демонтаж старого кондиционера", "Зимний комплект для обогрева"],
  },
};

export default function LocalCityPage({ cityKey, serviceKey }: LocalCityPageProps) {
  const city = CITIES[cityKey];
  const service = SERVICES[serviceKey];
  const [bookingOpen, setBookingOpen] = useState(false);

  if (!city || !service) return null;



  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="mb-3 text-sm font-semibold text-accent-400">
            <Link to="/" className="hover:underline">Главная</Link> / {city.name}
          </div>
          <div className="text-6xl mb-4">{service.icon}</div>
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">{service.title} {city.in}</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">{service.intro} {city.about}.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setBookingOpen(true)} className="rounded-2xl bg-[#ff6b35] px-7 py-4 text-base font-extrabold transition hover:bg-[#e95620]">
              📐 Бесплатный замер 0 ₽
            </button>
            <a href="tel:+79149146606" className="rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold backdrop-blur transition hover:bg-white/20">
              📞 +7 (914) 914-66-06
            </a>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-sm">
            📍 {city.name} ({city.from}) · выезд бесплатно
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-3 text-center text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
            Почему выбирают нас {city.in}
          </h2>
          <p className="mb-10 text-center text-slate-600 dark:text-slate-400">
            {city.name} — {city.from}. Выезжаем {city.in} бесплатно для замера и монтажа.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.advantages.map((a) => (
              <div key={a.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 text-4xl">{a.icon}</div>
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{a.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Цены и услуги */}
      <section className="bg-slate-50 py-14 dark:bg-slate-900/50 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="rounded-2xl bg-[#1a3a5c] p-6 text-white shadow-xl">
                <div className="text-xs uppercase tracking-wider text-orange-200">Цена {city.in}</div>
                <div className="mt-2 text-4xl font-black">{service.price}</div>
                <div className="mt-1 text-sm text-slate-300">Бренды: {service.brands}. Бесплатный замер {city.in}.</div>
                <button onClick={() => setBookingOpen(true)} className="mt-5 w-full rounded-xl bg-[#ff6b35] px-5 py-3.5 text-sm font-black transition hover:bg-[#e95620]">
                  Рассчитать стоимость
                </button>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Что мы делаем {city.in}</h3>
              <ul className="grid gap-2">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-500">
                Работаем {city.in} и пригороде. Гарантия, документы, монтаж по ГОСТу. Компания «Вектор Комфорта» — официальный дилер Русклимат и Daichi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Как работаем */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">Как мы работаем {city.in}</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: "01", title: "Заявка", text: `Звоните или оставьте заявку — перезвоним за 15 минут.` },
              { step: "02", title: "Замер 0 ₽", text: `Бесплатно выезжаем ${city.in} для замера и консультации.` },
              { step: "03", title: "Монтаж", text: `Устанавливаем ${service.titleGen.toLowerCase()} быстро и аккуратно.` },
              { step: "04", title: "Гарантия", text: "Даём документы и гарантию. Сервис и поддержка." },
            ].map((p) => (
              <div key={p.step}>
                <div className="mb-2 text-5xl font-extrabold text-brand-600/20 dark:text-accent-500/20">{p.step}</div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-slate-900 p-8 text-center text-white shadow-2xl md:p-12">
            <h2 className="mb-4 text-2xl font-extrabold md:text-3xl">{service.title} {city.in} — заказать</h2>
            <p className="mb-6 text-brand-100">
              Бесплатный выезд замерщика {city.in}. Перезвоним за 15 минут и рассчитаем стоимость.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setBookingOpen(true)} className="rounded-xl bg-[#ff6b35] px-7 py-4 text-base font-extrabold transition hover:bg-[#e95620]">
                📐 Вызвать замерщика
              </button>
              <a href="tel:+79149146606" className="rounded-xl border-2 border-white/30 px-7 py-4 text-base font-bold transition hover:border-white">
                📞 +7 (914) 914-66-06
              </a>
            </div>
          </div>
        </div>
      </section>

      <QuickBookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} serviceName={`${service.title} ${city.in}`} />
    </>
  );
}
