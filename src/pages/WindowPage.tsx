import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { windowsCatalogData, getWindowProductBySlug } from "../data/windowsCatalog";
import QuickBookingModal from "../components/QuickBookingModal";
import QuoteForm from "../components/QuoteForm";
import FAQSection from "../components/FAQSection";
import { useBreadcrumb } from "../utils/useSeo";

export default function WindowPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = getWindowProductBySlug(slug);

  if (!item) return <Navigate to="/okna" />;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Ссылка MAX по вашему техническому заданию
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";

  const handleMaxClick = () => {
    window.open(MAX_LINK, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    const shareData = {
      title: `${item.title} — Вектор Комфорта (Иркутск)`,
      text: `${item.title}. Цена: от ${item.basePrice.toLocaleString("ru-RU")} ₽ ${item.priceUnit}. Собственный цех в Иркутске, монтаж по ГОСТу!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { /* ignore */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(`🔗 Ссылка на страницу "${item.title}" скопирована!`);
      } catch (err) {
        alert(`Ссылка: ${window.location.href}`);
      }
    }
  };

  // Динамическое SEO для Яндекса и Google!
  useEffect(() => {
    const titleText = `${item.title} в Иркутске — цена от ${item.basePrice.toLocaleString("ru-RU")} ₽ | Собственное производство Вектор Комфорта`;
    const descText = `${item.shortDesc} Цена от ${item.basePrice.toLocaleString("ru-RU")} ₽ ${item.priceUnit}. Собственный сборочный цех в Иркутске, гарантия 5 лет, монтаж по ГОСТу с пароизоляцией!`;
    const pageUrl = window.location.href;

    document.title = titleText;

    const updateMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, nameOrProperty);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta("description", descText);
    updateMeta("og:title", titleText, true);
    updateMeta("og:description", descText, true);
    updateMeta("og:image", item.image.startsWith("http") ? item.image : `https://www.vektor-komforta.ru${item.image}`, true);
    updateMeta("og:url", pageUrl, true);

    // Товарная SEO-микроразметка Schema.org/Product для Яндекса и Google
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": item.title,
      "image": item.gallery.map(img => img.startsWith("http") ? img : `https://www.vektor-komforta.ru${img}`),
      "description": descText,
      "sku": `VK-WIN-${item.id}`,
      "brand": { "@type": "Brand", "name": "Вектор Комфорта (VEKA / Alutech)" },
      "offers": {
        "@type": "Offer",
        "url": pageUrl,
        "priceCurrency": "RUB",
        "price": item.basePrice,
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Вектор Комфорта Иркутск" }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "15"
      }
    };

    let scriptTag = document.getElementById("seo-window-schema") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-window-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(productSchema);

    return () => {
      document.title = "Пластиковые окна, кондиционеры и вентиляция в Иркутске — Вектор Комфорта";
      const el = document.getElementById("seo-window-schema");
      if (el) el.remove();
    };
  }, [item]);

  // Хлебные крошки Schema.org (BreadcrumbList) — единый хук useBreadcrumb
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Окна VEKA в Иркутске", path: "/okna" },
    { name: item.title },
  ]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Хлебные крошки */}
      <div className="bg-[#1a3a5c] text-white py-4 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs sm:text-sm font-semibold text-slate-300">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <span>/</span>
          <Link to="/okna" className="hover:text-white transition">Окна VEKA в Иркутске</Link>
          <span>/</span>
          <span className="text-[#ff6b35] font-black">{item.category}</span>
          <span>/</span>
          <span className="text-white font-bold">{item.title}</span>
        </div>
      </div>

      <section className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Левая колонка: Компактное аккуратное фото остекления */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="relative max-w-sm mx-auto h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-lg group">
                <img
                  src={item.gallery[activeImageIdx] || item.image}
                  alt={`${item.title} Иркутск`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ff6b35] px-3.5 py-1 text-xs font-black text-white shadow-md">
                  {item.badge}
                </span>
                <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-xl bg-slate-900/80 text-white font-bold text-xs backdrop-blur-md">
                  📸 Фото {activeImageIdx + 1} из {item.gallery.length}
                </div>
              </div>

              {item.gallery.length > 1 && (
                <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                  {item.gallery.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition bg-slate-100 shadow-sm ${
                        activeImageIdx === idx
                          ? "border-[#ff6b35] ring-2 ring-[#ff6b35]/25 scale-[0.97]"
                          : "border-slate-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Блок доверия и гарантии завода */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs text-slate-600 space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between font-black text-[#1a3a5c] text-sm">
                  <span>Собственное производство в Иркутске</span>
                  <span className="text-emerald-600 shrink-0">✓ Свой цех</span>
                </div>
                <p className="leading-relaxed">
                  Мы изготавливаем окна без посредников на современной автоматизированой линии в Иркутске. Применяем только замкнутое стальное армирование 1.5 мм и немецкий профиль VEKA Класса «А» с гарантией 5 лет.
                </p>
              </div>
            </div>

            {/* Правая колонка: Описание, параметры, цена и кнопки */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">
                    {item.category} — Иркутск и область до 50 км
                  </div>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#1a3a5c] leading-tight">
                    {item.title}
                  </h1>
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-sm text-slate-700 leading-relaxed">
                  {item.shortDesc}
                </div>

                {/* Ключевые преимущества */}
                <div className="space-y-2.5">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Главные преимущества данной системы:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {item.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-bold">
                        <span className="text-emerald-600 font-black text-sm">✓</span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Блок цены и кнопок */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">
                      Ориентировочная стоимость от цеха
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-[#1a3a5c]">
                        от {item.basePrice.toLocaleString("ru-RU")} ₽
                      </span>
                      <span className="text-sm font-bold text-slate-500">
                        / {item.priceUnit}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-600 font-extrabold mt-1">
                      ● Выезд замерщика и расчёт сметы по Иркутску — 0 ₽
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setBookingOpen(true)}
                      className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#ff6b35] hover:bg-[#e95620] active:scale-95 text-white font-black text-base shadow-xl shadow-[#ff6b35]/30 transition text-center shrink-0"
                    >
                      Заказать замер
                    </button>

                    <button
                      type="button"
                      onClick={handleMaxClick}
                      className="w-full sm:w-auto px-6 py-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white font-black text-base shadow-lg transition text-center shrink-0 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🔥</span>
                      <span>MAX</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      title="Поделиться ссылкой"
                      className="w-full sm:w-auto px-5 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm active:scale-95 transition text-center shrink-0 flex items-center justify-center gap-1.5 border border-slate-200/80 shadow-sm"
                    >
                      <span className="text-base">↗️</span>
                      <span>Поделиться</span>
                    </button>
                  </div>
                </div>

                {/* СВЕРНУТЫЕ ПО УМОЛЧАНИЮ ХАРАКТЕРИСТИКИ ПРОФИЛЯ И МОНТАЖА ПО ГОСТ */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => setSpecsOpen(!specsOpen)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 font-black text-base text-[#1a3a5c] hover:bg-slate-100 transition focus:outline-none"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-[#ff6b35] font-extrabold text-lg">📋</span>
                        <span>Характеристики профиля и монтажа по ГОСТ (раскрыть)</span>
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-700 transition ${specsOpen ? "bg-[#ff6b35] text-white border-transparent" : ""}`}>
                        {specsOpen ? "Свернуть ▲" : "Развернуть ▼"}
                      </span>
                    </button>

                    {specsOpen && (
                      <div className="p-6 pt-4 border-t border-slate-200 bg-white space-y-6 text-sm animate-fade-in-up">
                        
                        <div className="space-y-2">
                          <div className="text-xs font-black uppercase text-[#ff6b35] tracking-wider">
                            Технологическое описание конструкции:
                          </div>
                          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                            {item.fullDescription}
                          </p>
                        </div>

                        <div>
                          <p className="font-black text-slate-800 mb-3 text-base">
                            Спецификация и материалы изготовления:
                          </p>
                          <ul className="space-y-2.5 divide-y divide-slate-100 text-sm">
                            {item.specs.map((s, i) => (
                              <li key={i} className="flex justify-between pt-2">
                                <span className="text-slate-500">{s.label}</span>
                                <span className="font-black text-slate-800 text-right max-w-[220px] sm:max-w-none">{s.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#1a3a5c] text-white text-xs space-y-2">
                          <div className="font-extrabold text-amber-400 text-sm">🛡️ Стандарты монтажа «Вектор Комфорта» в Иркутске:</div>
                          <div className="leading-relaxed">
                            Мы устанавливаем окна строго по ГОСТ 30971-2012 с использованием пароизоляционных лент и монтажных пластиковых клиньев (вместо деревянных брусков, которые гниют со временем). Вы получаете официальный договор, чистовую уборку и 5 лет гарантии!
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-semibold">
                  <Link to="/okna" className="hover:text-[#ff6b35] transition flex items-center gap-1">
                    <span>← Вернутся назад к разделу окон</span>
                  </Link>
                  <a href="tel:+79149146606" className="hover:text-[#1a3a5c] transition font-bold text-slate-600">
                    Т.: +7 (914) 914-66-06
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Другие категории остекления */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35]">Производство в Иркутске</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#1a3a5c]">Другие решения по остеклению</h2>
            </div>
            <Link to="/okna" className="text-sm font-black text-[#ff6b35] hover:underline">
              Смотреть все виды конструкций →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {windowsCatalogData.filter(w => w.id !== item.id).slice(0, 3).map((w) => (
              <Link
                key={w.id}
                to={`/okna/${w.slug}`}
                className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-2xl transition duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img src={w.image} alt={w.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white shadow">
                    {w.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-black uppercase text-[#ff6b35]">{w.category}</span>
                  <h3 className="mt-1 text-lg font-black text-[#1a3a5c] group-hover:text-[#ff6b35] transition leading-snug">{w.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {w.shortDesc}
                  </p>
                  <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Цена от цеха</span>
                      <span className="text-lg font-black text-[#1a3a5c]">от {w.basePrice.toLocaleString("ru-RU")} ₽ / {w.priceUnit}</span>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-[#1a3a5c] text-white text-xs font-black group-hover:bg-[#ff6b35] transition">
                      Характеристики →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <QuoteForm
            title={`Заказать расчёт на: ${item.title}`}
            subtitle="Бесплатный выезд инженера по Иркутску, Ангарску, Шелехову и Хомутово. Посчитаем точную стоимость в день обращения!"
            serviceDefault={`Остекление: ${item.title}`}
          />
        </div>
      </section>

      <FAQSection />

      <QuickBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={`Заявка на расчёт окон: ${item.title}`}
        calcDetails={`Ориентировочно от ${item.basePrice.toLocaleString("ru-RU")} ₽ / ${item.priceUnit}. Требуется выезд замерщика на объект.`}
      />
    </div>
  );
}
