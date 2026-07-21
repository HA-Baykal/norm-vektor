import { Link } from "react-router-dom";

// ============================================================================
// СТРАНИЦА "ОСТАВИТЬ ОТЗЫВ"
// Клиент переходит по QR-коду и выбирает площадку для отзыва.
// Ссылки ведут напрямую на страницы отзывов компании.
// ============================================================================

// Площадки для отзывов. Проверьте/замените ссылки на свои реальные.
const platforms = [
  {
    name: "Яндекс.Карты",
    desc: "Отзыв виден в поиске Яндекса и на Картах",
    color: "#fc3f1d",
    letter: "Я",
    url: "https://yandex.ru/maps/org/vektor_komforta/117268889988/reviews/",
  },
  {
    name: "2ГИС",
    desc: "Рейтинг 5.0 — популярно в Иркутске",
    color: "#26b24b",
    letter: "2ГИС",
    url: "https://2gis.ru/irkutsk/firm/70000001115497655/tab/reviews/addreview",
  },
  {
    name: "Zoon",
    desc: "Каталог компаний и услуг",
    color: "#5b6ee1",
    letter: "Z",
    url: "https://zoon.ru/",
  },
  {
    name: "Flamp",
    desc: "Отзывы о компаниях",
    color: "#ff8a00",
    letter: "F",
    url: "https://irkutsk.flamp.ru/firm/vektor_komforta_torgovo_montazhnaya_kompaniya-70000001115497655",
  },
];

export default function OtzyvPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / Оставить отзыв
          </div>
          <div className="mt-6 text-6xl">⭐</div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Спасибо, что выбрали нас!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Ваш отзыв очень важен для нас и помогает другим клиентам сделать правильный выбор.
            Выберите удобную площадку — это займёт меньше минуты.
          </p>
        </div>
      </section>

      {/* Площадки */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6b35] hover:shadow-xl sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.letter}
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-black text-[#1a3a5c]">{p.name}</div>
                    <div className="text-sm font-semibold text-slate-500">{p.desc}</div>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ff6b35] transition group-hover:bg-[#ff6b35] group-hover:text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Не нашли свою площадку или есть вопрос?{" "}
            <a href="tel:+79149146606" className="font-black text-[#ff6b35] hover:underline">
              Позвоните нам
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
