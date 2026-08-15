import { useEffect } from "react";
import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import VentilationCalculator from "../components/VentilationCalculator";

export default function Ventilation() {
    // Динамические мета-теги и Service микроразметка
  useEffect(() => {
    const titleText = "Вентиляция в Иркутске — бризеры и рекуператоры | Вектор Комфорта";
    const descText = "Вентиляция в Иркутске от 6 000 ₽. Бризеры Тион, рекуператоры Vakio, приточно-вытяжные системы. Монтаж под ключ, гарантия 2 года.";
    
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
    updateMeta("og:url", window.location.href, true);
    updateMeta("og:type", "website", true);
    
    // Добавляем Service микроразметку Schema.org
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Вентиляция в Иркутске",
      "description": "Приточно-вытяжная вентиляция, бризеры Тион и Vakio, рекуператоры. Монтаж под ключ, гарантия 2 года.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Вектор Комфорта",
        "url": "https://www.vektor-komforta.ru",
        "telephone": "+7-3952-66-99-30",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Байкальская улица, 202/2, цокольный этаж",
          "addressLocality": "Иркутск",
          "addressRegion": "Иркутская область",
          "postalCode": "664075",
          "addressCountry": "RU"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Иркутск"
      },
      "serviceType": "Приточно-вытяжная вентиляция",
      "offers": {
        "@type": "Offer",
        "price": "6000",
        "priceCurrency": "RUB",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Каталог вентиляции",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Бризеры Тион",
              "description": "Приточная вентиляция с HEPA-фильтрами, подогрев воздуха"
            },
            "price": "39000",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Рекуператоры Vakio",
              "description": "Приточно-вытяжная вентиляция с рекуперацией тепла (КПД 80%)"
            },
            "price": "35000",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Приточные клапаны КИВ-125",
              "description": "Естественный приток свежего воздуха, не требует электричества"
            },
            "price": "6000",
            "priceCurrency": "RUB"
          }
        ]
      }
    };
    
    let scriptTag = document.getElementById("seo-service-schema") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-service-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(serviceSchema);
    
    return () => {
      document.title = "Пластиковые окна, кондиционеры и вентиляция в Иркутске — Вектор Комфорта";
      const el = document.getElementById("seo-service-schema");
      if (el) el.remove();
    };
  }, []);
  return (
    <>
      <ServicePage
        title="Вентиляция в Иркутске — монтаж под ключ от 6 000 ₽"
        ctaLabel="🧮 Рассчитать вентиляцию"
        ctaHref="#calculator"
        tagline="Бризеры Тион, рекуператоры Vakio, приточно-вытяжные системы. Гарантия 2 года"
        heroIcon="💨"
        intro="Системы приточно-вытяжной вентиляции: продажа и монтаж рекуператоров, бризеров, Тион, Vakio. Проектирование, изготовление воздуховодов, монтаж для квартир, домов, производственных помещений, ресторанов и офисов."
        breadcrumb="Вентиляция в Иркутске"
        breadcrumbPath="/ventilyaciya"
        advantages={[
          { icon: "🎯", title: "Проектирование", text: "Расчёт воздухообмена по нормам, подбор оборудования под объект" },
          { icon: "🏭", title: "Своё производство воздуховодов", text: "Изготавливаем воздуховоды под размеры объекта — точная подгонка" },
          { icon: "🔌", title: "Тион и Vakio", text: "Официальный партнёр. Бризеры с очисткой воздуха и рекуператоры" },
          { icon: "📐", title: "Под ключ", text: "От проекта до пуско-наладки. Сдаём систему, готовую к эксплуатации" },
        ]}
        services={[
          { icon: "🌬️", title: "Бризеры Тион", text: "Приточная вентиляция с многоступенчатой очисткой от пыли, аллергенов, запахов." },
          { icon: "🔄", title: "Рекуператоры Vakio", text: "Приточно-вытяжная вентиляция с рекуперацией тепла. Экономия на отоплении до 80%." },
          { icon: "🏠", title: "Вентиляция в квартире", text: "Приток свежего воздуха без открывания окон. Тихая работа, компактные решения." },
          { icon: "🏡", title: "Вентиляция в частном доме", text: "Комплексные системы: приток, вытяжка, рекуперация, автоматика." },
          { icon: "🍽️", title: "Рестораны и кафе", text: "Вытяжки над горячим цехом, приток в зал, соблюдение норм СЭС." },
          { icon: "🏭", title: "Производства и офисы", text: "Промышленная вентиляция, воздуховоды, аспирация, дымоудаление." },
        ]}
        process={[
          { step: "01", title: "Обследование", text: "Оценим объект, замеры, определение потребности в воздухообмене" },
          { step: "02", title: "Проект", text: "Разработаем схему, подберём оборудование, рассчитаем смету" },
          { step: "03", title: "Производство", text: "Изготовление воздуховодов под объект на собственном производстве" },
          { step: "04", title: "Монтаж и наладка", text: "Установка, балансировка, проверка, инструктаж по эксплуатации" },
        ]}
        photosIcon="💨"
        photosTitle="Реализованные проекты вентиляции"
      />
      <section className="bg-white py-10 sm:py-14 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c]">Вентиляция в Иркутске — бризеры Тион, рекуператоры Vakio, приточно-вытяжные системы под ключ</h2>
          <div className="mt-6 grid lg:grid-cols-3 gap-6 text-sm leading-7 text-slate-700">
            <div className="space-y-3">
              <p><strong>Вентиляция в Иркутске</strong> от «Вектор Комфорта» — это свежий воздух круглый год без открывания окон. Ставим <strong>бризеры Тион</strong> с многоступенчатой очисткой (HEPA, фотокаталитический фильтр), <strong>рекуператоры Vakio</strong> с КПД до 80% и полноценные <strong>приточно-вытяжные системы</strong> с проектированием и пуско-наладкой. Цена — <strong>от 6 000 ₽</strong> за приточный клапан КИВ-125, бризер — от 39 000 ₽, рекуператор — от 35 000 ₽.</p>
              <p>Работаем в квартирах, частных домах, офисах, ресторанах и на производстве. Воздуховоды изготавливаем на собственном производстве в Иркутске — точная подгонка под объект, минимум стыков и шума.</p>
            </div>
            <div className="space-y-3">
              <p><strong>Монтаж вентиляции в Иркутске — цена:</strong> установка приточного клапана КИВ-125 — <strong>от 6 000 ₽</strong>; монтаж бризера — <strong>от 9 000 ₽</strong> с прокладкой трассы; рекуператор Vakio — <strong>от 12 000 ₽</strong>; монтаж приточной установки и воздуховодов — по проекту.</p>
              <p>Что входит в монтаж: алмазное бурение без пыли, герметизация стыков, утепление холодных участков, балансировка системы, инструктаж. <strong>Гарантия 2 года</strong> на работы по договору.</p>
              <p><strong>География:</strong> Иркутск, Ангарск, Шелехов, Хомутово, Молодёжный и пригород — выезд 0 ₽ до 50 км. Замер и расчёт — за 15 минут. Срок монтажа — 1 день.</p>
            </div>
            <div className="space-y-3">
              <p><strong>Сроки и сервис:</strong> подберём систему под площадь и нормы воздухообмена (30 м³/ч на человека). Обслуживание — замена фильтров, чистка и антибактериальная обработка. Официальный партнёр <strong>Тион</strong> и <strong>Vakio</strong>.</p>
              <p>Звоните +7 (914) 914-66-06 или пишите в MAX — отвечаем за 5 минут. Рассрочка.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href="tel:+79149146606" className="px-5 py-2.5 rounded-full bg-[#ff6b35] text-white font-black text-xs hover:bg-[#e95620]">📞 Позвонить</a>
                <a href="https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-[#1a3a5c] text-white font-black text-xs border border-white/10"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[8px] font-black mr-1">MAX</span> Написать в MAX</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
            <h3 className="font-black text-[#1a3a5c]">Цены на монтаж вентиляции в Иркутске</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Стоимость монтажных работ. Оборудование считается отдельно, точная смета — после бесплатного выезда инженера (0 ₽ до 50 км).</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[#1a3a5c]">
                    <th className="py-2 pr-4 font-black">Работа</th>
                    <th className="py-2 pr-4 font-black">Что входит</th>
                    <th className="py-2 font-black">Цена</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">Монтаж приточного клапана КИВ-125</td>
                    <td className="py-2.5 pr-4 text-slate-500">алмазное бурение, утепление канала</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 6 000 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">Монтаж бризера (Тион и аналоги)</td>
                    <td className="py-2.5 pr-4 text-slate-500">бурение, подключение, пуск</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 9 000 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">Монтаж рекуператора Vakio</td>
                    <td className="py-2.5 pr-4 text-slate-500">бурение, монтаж, наладка</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 12 000 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">Установка вытяжного вентилятора</td>
                    <td className="py-2.5 pr-4 text-slate-500">санузел, кухня</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 800 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">Установка обратного клапана</td>
                    <td className="py-2.5 pr-4 text-slate-500">защита от запахов из шахты</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 290 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">Монтаж воздуховода</td>
                    <td className="py-2.5 pr-4 text-slate-500">крепёж, герметизация стыков</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 1 200 ₽/п.м</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4">Проектирование системы вентиляции</td>
                    <td className="py-2.5 pr-4 text-slate-500">расчёт воздухообмена, схема, смета</td>
                    <td className="py-2.5 font-semibold whitespace-nowrap">от 10 000 ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              В монтаж входит: алмазное бурение без пыли, герметизация и утепление стыков, балансировка системы, пуско-наладка, инструктаж и гарантия 2 года на работы.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="tel:+79149146606" className="px-5 py-2.5 rounded-full bg-[#ff6b35] text-white font-black text-xs hover:bg-[#e95620]">📞 +7 (914) 914-66-06</a>
              <a href="#calculator" className="px-5 py-2.5 rounded-full bg-[#1a3a5c] text-white font-black text-xs border border-white/10">🧮 Рассчитать вентиляцию</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
            <h3 className="font-black text-[#1a3a5c]">Частые вопросы про вентиляцию в Иркутске</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-4 text-xs leading-6 text-slate-700">
              <div><strong>Сколько стоит установка бризера?</strong> Монтаж бризера — от 9 000 ₽ вместе с алмазным бурением. Сам бризер — от 39 000 ₽.</div>
              <div><strong>Чем бризер отличается от кондиционера?</strong> Бризер подаёт свежий воздух с улицы с очисткой и подогревом, а кондиционер только охлаждает/нагревает воздух в помещении.</div>
              <div><strong>Поможет ли вентиляция от конденсата на окнах?</strong> Да, именно недостаток вентиляции — главная причина конденсата и плесени на окнах. Приток свежего воздуха решает проблему.</div>
              <div><strong>За сколько делаете монтаж?</strong> Монтаж КИВ-125 или бризера — 1 день. Приточно-вытяжную систему — от 2–3 дней по проекту.</div>
            </div>
          </div>
        </div>
      </section>
      <Counters />
        <VentilationCalculator />
      <Reviews />
    </>
  );
}
