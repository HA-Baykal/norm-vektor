import { Link } from "react-router-dom";
import QuoteForm from "./QuoteForm";
import { useBreadcrumb, useFaqSchema } from "../utils/useSeo";

interface ServicePageProps {
  title: string;
  tagline: string;
  heroIcon: string;
  intro: string;
  advantages: { icon: string; title: string; text: string }[];
  services: { icon: string; title: string; text: string }[];
  process: { step: string; title: string; text: string }[];
  breadcrumb: string;
  /** Путь страницы для JSON-LD BreadcrumbList, например "/kondicionery" */
  breadcrumbPath?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Иконка блока с фотографиями работ (оставлено для совместимости страниц услуг) */
  photosIcon?: string;
  /** Заголовок блока с фотографиями работ (оставлено для совместимости страниц услуг) */
  photosTitle?: string;
  /**
   * «Короткий ответ» для ИИ-поиска: 200–450 знаков с ценой, сроком и гео.
   * Данные — src/data/aiAnswers.ts (тот же текст уходит в серверный HTML).
   */
  shortAnswer?: string;
  /** Цифры под коротким ответом: цена, срок, гарантия, география. */
  facts?: { label: string; value: string }[];
  /**
   * Пары «вопрос → ответ». Если переданы — рендерится видимый блок
   * «Частые вопросы» и JSON-LD FAQPage. Если у страницы уже есть свой блок
   * вопросов, faq не передаём: страница сама вызывает useFaqSchema().
   */
  faq?: { q: string; a: string }[];
  /** Дата сверки цифр, показывается под коротким ответом. */
  answerUpdated?: string;
}

export default function ServicePage({
  title,
  tagline,
  heroIcon,
  intro,
  advantages,
  services,
  process,
  breadcrumb,
  breadcrumbPath,
  ctaLabel,
  ctaHref,
  shortAnswer,
  facts,
  faq,
  answerUpdated,
}: ServicePageProps) {
  // JSON-LD хлебные крошки (Schema.org BreadcrumbList) — P2-3 SEO-аудита
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: breadcrumb, path: breadcrumbPath },
  ]);

  // JSON-LD FAQPage — только когда вопросы реально видны на странице
  useFaqSchema(faq);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.25),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="text-sm font-semibold text-accent-400 mb-3">
              <Link to="/" className="hover:underline">Главная</Link> / {breadcrumb}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              {title}
            </h1>
            <p className="text-xl text-brand-100 mb-6">{tagline}</p>
            <p className="text-brand-100/90 mb-8 max-w-xl">{intro}</p>
            <div className="flex flex-wrap gap-3">
              {ctaLabel && (
                  <a
                      href={ctaHref ?? "#catalog"}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition shadow-lg"
                  >
                    {ctaLabel}
                  </a>
              )}
              <a
                  href="tel:+79149146606"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold transition"
              >
                📞 +7 (914) 914-66-06
              </a>
              <a
                  href="tel:+73952669930"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold transition"
              >
                📞 66-99-30
              </a>
              <a
                  href="tel:+79086401166"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold transition"
              >
                📞 +7 (908) 640-11-66
              </a>
              {/* Перелинковка услуга → контакты: адрес, почта и MAX на одной странице */}
              <Link
                  to="/kontakty"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/30 hover:border-white text-white font-semibold transition"
              >
                Контакты и адрес →
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-accent-500/30 rounded-full blur-3xl animate-pulse"/>
              <div
                  className="relative w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center text-[12rem]">
                {heroIcon}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Короткий ответ для ИИ-поиска и людей: цена, срок, гарантия, гео.
          Тот же текст уходит краулеру в серверном HTML (api/page.ts). */}
      {shortAnswer && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
              <p className="text-xs font-black uppercase tracking-widest text-[#ff6b35]">
                Короткий ответ
              </p>
              <p className="mt-2 text-base sm:text-lg leading-8 text-slate-800">{shortAnswer}</p>
              {facts && facts.length > 0 && (
                <dl className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {facts.map((f) => (
                    <div key={f.label} className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        {f.label}
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-[#1a3a5c]">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {answerUpdated && (
                <p className="mt-4 text-xs text-slate-500">
                  Цены и сроки актуальны на{" "}
                  {new Date(answerUpdated).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  . Точную смету называем после бесплатного замера.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Преимущества */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-brand-400 dark:hover:border-accent-500 transition"
              >
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Услуги */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Что мы делаем
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-3xl mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Этапы работы */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
            Как мы работаем
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-extrabold text-brand-600/20 dark:text-accent-500/20 mb-2">
                  {p.step}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Частые вопросы: видимый блок + JSON-LD FAQPage (useFaqSchema выше).
          Страницы, у которых уже есть свой блок вопросов, faq не передают. */}
      {faq && faq.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
              Частые вопросы
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <div
                  key={item.q}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.q}</h3>
                  <p className="mt-2 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-400">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA с формой */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-700 to-slate-900 text-white shadow-2xl">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Получите расчёт стоимости</h2>
              <p className="text-brand-100 mb-6">
                Оставьте имя и телефон — перезвоним в течение 15 минут, ответим на вопросы и подберём оптимальное решение.
              </p>
              <ul className="space-y-2 text-brand-100">
                <li>✓ Бесплатный замер и консультация</li>
                <li>✓ Расчёт за 15 минут</li>
                <li>✓ Гарантия до 5 лет</li>
                <li>✓ Работаем в Иркутске и пригороде</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-2">
              <QuoteForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}