import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import Reveal from "../components/Reveal";
import { MAX_LINK, PHONE_MAIN, WHATSAPP_LINK } from "../data/contacts";
import QuickBookingModal from "../components/QuickBookingModal";
import { useState } from "react";

// Страница «Производство и команда»: экскурсия по цеху, этапы работы, люди.
//
// TODO (через заказчика): заменить заглушки на реальные фото —
// цех и оборудование, бригады за работой, портреты команды.
// Сейчас часть слотов — честные заглушки «фото скоро», часть — реальные
// фото процессов с подписями. Никаких чужих стоковых фото.

type Stage = { num: string; title: string; text: string };

const STAGES: Stage[] = [
  { num: "01", title: "Заявка и замер", text: "Оставляете заявку — инженер приезжает с образцами профиля, замеряет проём и считает точную смету. Выезд по Иркутску и пригороду — 0 ₽." },
  { num: "02", title: "Производство", text: "Конструкции собираются на заказ: окна — на профиле VEKA с фурнитурой MACO, воздуховоды для вентиляции — из оцинкованной стали на собственном производстве." },
  { num: "03", title: "Монтаж по ГОСТу", text: "Пластиковые клинья, многослойная пена, паро-влагоизоляция шва — по ГОСТ 30971. Для кондиционеров — обязательное вакуумирование трассы." },
  { num: "04", title: "Сдача и гарантия", text: "Показываем и проверяем каждый узел, убираем за собой. Гарантия на конструкции — до 5 лет, на монтаж — по договору. Сервис и обслуживание после установки." },
];

type PhotoSlot = { src?: string; caption: string; note?: string };

const PHOTOS: PhotoSlot[] = [
  { caption: "Собственное производство воздуховодов" },
  { src: "images/ventilation/vent-1.webp", caption: "Монтаж приточно-вытяжной вентиляции" },
  { caption: "Сборка оконных конструкций" },
  { src: "images/windows/window-3.webp", caption: "Монтаж окон VEKA — бригада на объекте" },
  { src: "images/drilling/drill-2.webp", caption: "Алмазное бурение под трассу — чисто и без пыли" },
  { caption: "Склад профиля и фурнитуры" },
];

type Member = { name: string; role: string; text: string; color: string };

const TEAM: Member[] = [
  { name: "Руководитель", role: "Основатель компании", text: "Принимает заказы, контролирует качество каждого объекта и держит связь с клиентом от замера до сдачи.", color: "#ff6b35" },
  { name: "Инженер-замерщик", role: "Замеры и расчёты", text: "Выезжает с образцами, замеряет проёмы и считает точную стоимость — без «сюрпризов» после замера.", color: "#229ED9" },
  { name: "Бригада монтажа окон", role: "Окна и остекление", text: "Ставит конструкции по ГОСТу: клинья, пена в несколько слоёв, паро-влагозащита шва.", color: "#16a34a" },
  { name: "Бригада кондиционеров и вентиляции", role: "Климат", text: "Монтаж трасс, вакуумирование, пуско-наладка, изготовление и монтаж воздуховодов.", color: "#1a3a5c" },
  { name: "Сервисная служба", role: "Обслуживание", text: "Чистка и заправка кондиционеров, гарантийные выезды, обслуживание после установки.", color: "#9333ea" },
  { name: "Офис-менеджер", role: "Заявки и документы", text: "Отвечает за 5 минут в MAX и WhatsApp, согласует время замера и оформляет документы.", color: "#f59e0b" },
];

export default function ProductionPage() {
  useSeo(
    "Производство и команда — Вектор Комфорта, Иркутск",
    "Собственное производство компании Вектор Комфорта: изготовление оконных конструкций и воздуховодов в Иркутске. Команда монтажников, этапы работы, контроль качества, гарантия до 5 лет."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Производство", path: "/proizvodstvo" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / Производство
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Наше производство и команда
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Мы не перекупщики: свои материалы, свои монтажные бригады и свой склад. Приезжайте посмотреть,
            как собираются ваши окна и воздуховоды — или начните с экскурсии ниже.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Записаться на замер
            </button>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 px-8 py-4 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Спросить в WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Цех в фото */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Экскурсия по цеху
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              Как это выглядит изнутри
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTOS.map((p, i) => (
              <Reveal key={p.caption} delay={i * 60}>
                <figure className="overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm sm:rounded-[2rem]">
                  {p.src ? (
                    <img src={p.src} alt={p.caption} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[4/3] w-full place-items-center border-2 border-dashed border-slate-300 bg-slate-50">
                      <div className="text-center px-4">
                        <div className="text-3xl">📷</div>
                        <div className="mt-2 text-xs font-bold text-slate-400">Фото готовится — скоро здесь будет цех</div>
                      </div>
                    </div>
                  )}
                  <figcaption className="bg-white px-4 py-3 text-xs font-bold text-slate-600 sm:text-sm">{p.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Хотите приехать в цех и посмотреть лично? Позвоните: <a href={`tel:${PHONE_MAIN}`} className="font-bold text-slate-600 underline">+7 (914) 914-66-06</a>
          </p>
        </div>
      </section>

      {/* Этапы */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Как мы работаем
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              От заявки до гарантии — 4 шага
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s, i) => (
              <Reveal key={s.num} delay={i * 80} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-7">
                  <div className="text-3xl font-black text-[#ff6b35]">{s.num}</div>
                  <h3 className="mt-3 text-lg font-black text-[#1a3a5c]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Команда
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              Люди, которые это делают
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Небольшая команда, где каждый отвечает за свой участок. Без субподрядчиков «с улицы» —
              на объект приезжают наши проверенные бригады.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m, i) => (
              <Reveal key={m.role} delay={i * 60} className="h-full">
                <div className="flex h-full gap-4 rounded-[1.5rem] bg-slate-50 p-5 sm:rounded-[2rem] sm:p-6">
                  <div
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-xl font-black text-white"
                    style={{ background: m.color }}
                    aria-hidden
                  >
                    {m.role.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#1a3a5c] sm:text-base">{m.name}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#ff6b35]">{m.role}</div>
                    <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{m.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Фотографии команды добавим после согласования с ребятами — не публикуем людей без разрешения.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Убедитесь лично</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Запишитесь на бесплатный замер — инженер приедет с образцами профиля и рассчитает смету на месте.
            Или приезжайте к нам в цех: покажем производство и материалы.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Вызвать замерщика — 0 ₽
            </button>
            <a href={`tel:${PHONE_MAIN}`} className="rounded-full bg-white/10 px-8 py-4 text-sm font-black ring-1 ring-white/20 transition hover:bg-white/20">
              📞 +7 (914) 914-66-06
            </a>
            <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-8 py-4 text-sm font-black ring-1 ring-white/20 transition hover:bg-white/20">
              Написать в MAX
            </a>
          </div>
        </div>
      </section>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Замер — экскурсия по производству"
      />
    </div>
  );
}
