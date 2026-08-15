import { useEffect } from "react";
import { Link } from "react-router-dom";
import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import CatalogConditioners from "../components/CatalogConditioners";
import Reviews from "../components/Reviews";


export default function AC() {
    // Динамические мета-теги и Service микроразметка
  useEffect(() => {
    const titleText = "Кондиционеры в Иркутске — купить с установкой | Вектор Комфорта";
    const descText = "Кондиционеры в Иркутске от 16 636 ₽. Инверторные и обычные сплит-системы Ballu, Electrolux, Royal Thermo, Daikin. Монтаж за 1 день, гарантия 3-5 лет.";
    
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
      "name": "Установка кондиционеров в Иркутске",
      "description": "Продажа и монтаж кондиционеров в Иркутске. Инверторные и обычные сплит-системы. Гарантия 3-5 лет.",
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
      "serviceType": "Продажа и монтаж кондиционеров",
      "offers": {
        "@type": "Offer",
        "price": "16636",
        "priceCurrency": "RUB",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Каталог кондиционеров",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Инверторные кондиционеры",
              "description": "Экономия электричества до 30-40%, тихая работа, срок службы 12-15 лет"
            },
            "price": "27900",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Обычные кондиционеры (on/off)",
              "description": "Доступные сплит-системы для дачи и редкого использования"
            },
            "price": "16636",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Полупромышленные кондиционеры",
              "description": "Кассетные, канальные, мульти-сплит системы для офисов и магазинов"
            },
            "price": "64728",
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
        title="Кондиционеры в Иркутске — купить с монтажом от 16 636 ₽"
        ctaLabel="🛒 Каталог моделей"
        ctaHref="#catalog"
        tagline="Продажа, профессиональный монтаж за 1 день, обслуживание, чистка и заправка фреона"
        heroIcon="❄️"
        intro="Продажа большого выбора моделей кондиционеров и профессиональный монтаж. Монтируем в квартирах, домах, магазинах, офисах и коммерческих зданиях. Выполняем обслуживание, чистку, диагностику и заправку фреона."
        breadcrumb="Кондиционеры в Иркутске"
        breadcrumbPath="/kondicionery"
        advantages={[
          { icon: "🏅", title: "Подбор модели", text: "Поможем выбрать кондиционер по площади, уровню шума, бюджету и режимам работы" },
          { icon: "📦", title: "Большой выбор", text: "Настенные, кассетные, канальные, мульти-сплит, VRF/VRV. Под любой бюджет" },
          { icon: "⚡", title: "Монтаж за 1 день", text: "Стандартная установка — за 3–4 часа. Сложные объекты — по согласованию" },
          { icon: "🔧", title: "Сервис и обслуживание", text: "Чистка, антибактериальная обработка, диагностика и заправка фреона" },
        ]}
        services={[
          { icon: "🏠", title: "Кондиционеры в квартиру", text: "Настенные инверторные сплит-системы. Тихая работа, экономия энергии." },
          { icon: "🏡", title: "Кондиционеры в частный дом", text: "Мульти-сплит системы на несколько комнат, канальные решения." },
          { icon: "🏬", title: "Магазины и офисы", text: "Кассетные и канальные кондиционеры, подпотолочные модели." },
          { icon: "🏢", title: "Коммерческие объекты", text: "Полупромышленные системы, VRF/VRV, чиллеры. Проектирование и монтаж." },
          { icon: "🛠️", title: "Монтаж и установка", text: "Штробление, прокладка трассы, вакуумирование, пуско-наладка." },
          { icon: "🧼", title: "Сервис и чистка", text: "Регулярное обслуживание, заправка фреоном, антибактериальная обработка." },
        ]}
        process={[
          { step: "01", title: "Консультация", text: "Подберём модель под площадь, бюджет и особенности помещения" },
          { step: "02", title: "Осмотр объекта", text: "Выезд инженера, выбор места установки, согласование трассы" },
          { step: "03", title: "Поставка", text: "Доставка оборудования со склада в Иркутске" },
          { step: "04", title: "Монтаж и пуск", text: "Установка, проверка, инструктаж по эксплуатации" },
        ]}
        photosIcon="❄️"
        photosTitle="Установленные кондиционеры"
      />
      <section className="bg-white py-10 sm:py-14 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c]">Кондиционеры в Иркутске — купить с установкой от 16 636 ₽</h2>
          <div className="mt-6 grid lg:grid-cols-3 gap-6 text-sm leading-7 text-slate-700">
            <div className="space-y-3">
                            <p><strong>Купить кондиционер в Иркутске</strong> в «Вектор Комфорта» — большой выбор <strong>Daikin, Ballu, Electrolux, Royal Thermo, Midea, Kentatsu, Bosch, Toshiba</strong> на складе в Иркутске. Инверторные сплит-системы с Wi-Fi и умным домом, стандартные — дешевле для дачи. Цена — <strong>от 16 636 ₽</strong>, инвертор — от 27 900 ₽. <strong>Монтаж за 1 день за 3–4 часа</strong> с вакуумированием трассы, гарантия 3–5 лет.</p>
              <p>Подбор по площади: <strong>07 до 20 м², 09 до 25 м², 12 до 35 м², 18 до 50 м², 24 до 60 м²</strong>. На солнечную сторону, панорамные окна, высокие потолки — берём запас.</p>
            </div>
            <div className="space-y-3">
              <p><strong>Что входит в монтаж за 1 день:</strong> трасса до 3 м, кронштейны, вакуумирование, пуско-наладка, инструктаж. Штроба, доп. трасса — по замеру. География: <strong>Иркутск, Ангарск, Шелехов, Хомутово, Молодёжный</strong> — выезд 0 ₽ до 50 км. Гарантия 3–5 лет на оборудование, 1 год на монтаж.</p>
              <p><strong>Каталог 70 моделей</strong> — в наличии на складе Иркутск. Фильтр по мощности, бренду, инвертор, уровень шума 22 дБ.</p>
            </div>
            <div className="space-y-3">
              <p><strong>Сервис:</strong> чистка, антибактериальная обработка, диагностика, заправка фреоном R32/R410. Работаем в квартирах, домах, магазинах, офисах, ТРЦ и на производстве. VRF/VRV, кассетные, канальные — под ключ.</p>
              <p>Бесплатный замер и подбор за 15 минут. Звоните +7 (914) 914-66-06 или пишите в MAX — отвечаем за 5 минут. Рассрочка.</p>
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
            <h3 className="font-black text-[#1a3a5c]">Цены на монтаж кондиционера в Иркутске</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Стандартный монтаж под ключ с вакуумированием. Доп. трасса, штроба и зимний комплект — по замеру.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-[#1a3a5c]">
                    <th className="py-2 pr-4 font-black">Мощность</th>
                    <th className="py-2 pr-4 font-black">Площадь</th>
                    <th className="py-2 font-black">Монтаж</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">07–09 (2.5 кВт)</td>
                    <td className="py-2.5 pr-4">до 25 м²</td>
                    <td className="py-2.5 font-semibold">от 18 400 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">12 (3.5 кВт)</td>
                    <td className="py-2.5 pr-4">до 35 м²</td>
                    <td className="py-2.5 font-semibold">от 18 400 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4 font-semibold">18–24 (5–7 кВт)</td>
                    <td className="py-2.5 pr-4">до 60 м²</td>
                    <td className="py-2.5 font-semibold">от 20 100 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">Трасса, доп. метр</td>
                    <td className="py-2.5 pr-4">—</td>
                    <td className="py-2.5 font-semibold">от 2 500 ₽</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 pr-4">Зимний комплект</td>
                    <td className="py-2.5 pr-4">—</td>
                    <td className="py-2.5 font-semibold">по замеру</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4">Демонтаж старого кондиционера</td>
                    <td className="py-2.5 pr-4">—</td>
                    <td className="py-2.5 font-semibold">от 2 000 ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Что входит в монтаж: трасса 3 м, кронштейны, вакуумирование, пуско-наладка, инструктаж, гарантия 1 год на работы.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
            <h3 className="font-black text-[#1a3a5c]">Частые вопросы про кондиционеры в Иркутске</h3>
            <div className="mt-3 grid sm:grid-cols-2 gap-4 text-xs leading-6 text-slate-700">
                <div><strong>Сколько стоит установка?</strong> 07–12 от 18 400 ₽, 18–24 от 20 100 ₽ под ключ — трасса 3 м и вакуумирование.</div>
                <div><strong>Инвертор или обычный?</strong> В квартиру на каждый день — инвертор (тише на 40%, экономит свет). На дачу эпизодически — обычный дешевле.</div>
                <div><strong>Что выбрать на 35 м²?</strong> Берите 12 (3.5 кВт) — поищите фильтр «до 35 м²» в каталоге.</div>
                <div><strong>Быстрый монтаж?</strong> Да, за 3–4 часа, с пылесосом без пыли, гарантия по договору.</div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-black text-[#1a3a5c] mb-3">Смотрите также</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/montazh-kondicionerov" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Монтаж кондиционеров — от 18 400 ₽ →</Link>
            <Link to="/servis-kondicionerov" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Сервис и чистка кондиционеров — от 3 000 ₽ →</Link>
            <Link to="/almaznoe-burenie" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Алмазное бурение →</Link>
          </div>
        </div>
      </section>
        <CatalogConditioners />
      <Counters />
      <Reviews />
    </>
  );
}
