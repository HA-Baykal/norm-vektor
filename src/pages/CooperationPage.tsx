import { useState } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import Reveal from "../components/Reveal";
import QuickBookingModal from "../components/QuickBookingModal";
import { MAX_LINK, PHONE_MAIN, WHATSAPP_LINK } from "../data/contacts";

// Страница для B2B-партнёров: застройщики, дизайнеры интерьера, ремонтные
// и отделочные бригады, риелторы. Заявка уходит тем же путём, что и замер —
// через QuickBookingModal → /api/leads → Telegram.

type Partner = { icon: string; title: string; text: string };

const PARTNERS: Partner[] = [
  {
    icon: "🏗️",
    title: "Застройщикам и подрядчикам",
    text: "Остекление новостроек и коммерческих объектов: окна, витражи, входные группы. Собственное производство и монтажные бригады — сроки не сорвём. Работаем по договору с отсрочкой платежа.",
  },
  {
    icon: "🎨",
    title: "Дизайнерам интерьера",
    text: "Подберём конструкцию под ваш проект: ламинация профиля под цвет интерьера, скрытые двери-невидимки, панорамное остекление, вентиляция с скрытой разводкой. Партнёрская скидка до 15%, ваш клиент остаётся вашим.",
  },
  {
    icon: "🔨",
    title: "Ремонтным и отделочным бригадам",
    text: "Окна, кондиционеры, вентиляция и алмазное бурение — один подрядчик на весь объект. Вашим клиентам чисто и в срок, вам — агентское вознаграждение за каждого приведённого заказчика.",
  },
  {
    icon: "🏠",
    title: "Риелторам и агентствам",
    text: "Поможем вашему клиенту с окнами и климатом после покупки квартиры. Быстрый замер, честная смета, аккуратный монтаж — вы забираете процент, клиент остаётся доволен сделкой.",
  },
];

type Term = { title: string; text: string };

const TERMS: Term[] = [
  { title: "Официальный договор и документы", text: "Работаем с ИП/ООО по договору, закрывающие документы — в срок. Для застройщиков — поэтапная оплата." },
  { title: "Партнёрское вознаграждение", text: "Агентское вознаграждение или скидка для вашего клиента — на выбор. Условия фиксируем в партнёрском соглашении." },
  { title: "Своё производство и бригады", text: "Окна, конструкции и воздуховоды делаем сами, на объект приезжают наши монтажники — качество не отдаём на субподряд." },
  { title: "Персональный менеджер", text: "Один контакт на все вопросы: замер, смета, сроки, гарантия. Отвечаем в MAX и WhatsApp в течение 5 минут." },
  { title: "Соблюдение сроков", text: "Сроки фиксируем в договоре. Окна — обычно 5-10 рабочих дней от замера, кондиционер — 1 день, вентиляция — от проекта." },
  { title: "Гарантия до 5 лет", text: "Гарантия на конструкции и монтаж по договору. Сервисное обслуживание после сдачи — не бросаем ни объект, ни партнёра." },
];

export default function CooperationPage() {
  useSeo(
    "Сотрудничество — застройщикам и дизайнерам | Вектор Комфорта, Иркутск",
    "Партнёрство для застройщиков, дизайнеров интерьера, ремонтных бригад и риелторов в Иркутске: окна, кондиционеры, вентиляция и алмазное бурение по договору. Партнёрское вознаграждение, собственное производство, гарантия до 5 лет."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Сотрудничество", path: "/sotrudnichestvo" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Шапка */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / Сотрудничество
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Партнёрам: застройщикам, дизайнерам, бригадам
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            «Вектор Комфорта» — один подрядчик на все работы с окнами и климатом. Берём объект целиком:
            окна, кондиционеры, вентиляция, алмазное бурение. Вы получаете вознаграждение — клиент получает
            результат в срок.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Обсудить сотрудничество
            </button>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 px-8 py-4 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Кому подойдёт */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Кому это выгодно
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              С кем мы работаем
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PARTNERS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-slate-50 p-6 shadow-sm sm:rounded-[2rem] sm:p-8">
                  <div className="text-3xl">{p.icon}</div>
                  <h3 className="mt-3 text-lg font-black text-[#1a3a5c] sm:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Условия */}
      <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Условия
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              Что вы получаете
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TERMS.map((t, i) => (
              <Reveal key={t.title} delay={i * 60} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem]">
                  <h3 className="text-base font-black text-[#1a3a5c]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Как начать */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
              Как начать
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
              Три шага до первого объекта
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { num: "01", title: "Созвонимся", text: "Обсуждаем ваши объекты и объёмы, договариваемся об условиях и вознаграждении." },
              { num: "02", title: "Пробный объект", text: "Берём один объект по партнёрским условиям — вы оцениваете сроки и качество на деле." },
              { num: "03", title: "Долгое партнёрство", text: "Фиксируем условия соглашением и работаем на постоянной основе. Ваш менеджер — всегда на связи." },
            ].map((s, i) => (
              <Reveal key={s.num} delay={i * 80} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-slate-50 p-6 shadow-sm sm:rounded-[2rem] sm:p-7">
                  <div className="text-3xl font-black text-[#ff6b35]">{s.num}</div>
                  <h3 className="mt-3 text-lg font-black text-[#1a3a5c]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Обсудим ваш ближайший объект?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Оставьте заявку — перезвоним в течение 15 минут, назовём условия и сроки. Или напишите сами:
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Оставить заявку
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
        serviceName="Сотрудничество (B2B) — застройщик/дизайнер/бригада"
      />
    </div>
  );
}
