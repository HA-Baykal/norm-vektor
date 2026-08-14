import { useState, useEffect } from "react";
import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import WindowCalculator from "../components/WindowCalculator";
import WindowsGallery from "../components/WindowsGallery";

export default function Windows() {
    // Динамические мета-теги и Service микроразметка
  useEffect(() => {
    const titleText = "Пластиковые окна VEKA в Иркутске — купить с монтажом | Вектор Комфорта";
    const descText = "Пластиковые окна VEKA в Иркутске от 11 000 ₽/м². Собственное производство, монтаж по ГОСТу, гарантия 5 лет. Бесплатный замер.";
    
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
      "name": "Пластиковые окна VEKA в Иркутске",
      "description": "Производство и монтаж пластиковых окон VEKA в Иркутске. Собственное производство, монтаж по ГОСТу, гарантия 5 лет.",
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
      "serviceType": "Производство и монтаж пластиковых окон",
      "offers": {
        "@type": "Offer",
        "price": "11000",
        "priceCurrency": "RUB",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Каталог окон VEKA",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Окна VEKA EuroLine 58",
              "description": "3 камеры, 58 мм, эконом-вариант"
            },
            "price": "11000",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Окна VEKA SoftLine 70",
              "description": "5 камер, 70 мм, оптимально для Иркутска"
            },
            "price": "14000",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Окна VEKA SoftLine 82",
              "description": "7 камер, 82 мм, премиум"
            },
            "price": "18000",
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
title="Пластиковые окна ПВХ в Иркутске — купить с установкой"
ctaLabel="🧮 Расчёт окна онлайн"
ctaHref="#calculator"
tagline="Собственное производство. Монтаж по ГОСТу. Гарантия 5 лет. Цена от 11 000 ₽/м²"
heroIcon="🪟"
intro="Изготавливаем и устанавливаем ПВХ и алюминиевые конструкции любой сложности: окна, двери, балконы, лоджии, витражи, стеклянные перегородки. Регулируем, ремонтируем, меняем стеклопакеты."
breadcrumb="Пластиковые окна ПВХ в Иркутске"
advantages={[
{ icon: "🏭", title: "Свой цех", text: "Производство в Иркутске — контроль качества и сроки от 5 рабочих дней" },
{ icon: "👷", title: "Опытные монтажники", text: "Бригады со стажем от 7 лет. Монтаж строго по ГОСТ 30971-2012" },
{ icon: "🧰", title: "Профиль и фурнитура", text: "Работаем с профилем Veka,. Фурнитура Wink Haus, Maco, Geviss" },
{ icon: "🛡️", title: "Гарантия 5 лет", text: "На профиль, стеклопакет и монтажные работы. Постгарантийный сервис" },
]}
services={[
{ icon: "🪟", title: "Пластиковые окна ПВХ", text: "Окна в квартиру, дом, офис. Одно-, двух-, трёхкамерные стеклопакеты, энергосбережение, шумоизоляция." },
{ icon: "🏢", title: "Алюминиевые конструкции", text: "Тёплый и холодный алюминий для фасадов, входных групп, офисов, торговых центров." },
{ icon: "🏠", title: "Остекление балконов и лоджий", text: "Под ключ: остекление, крыша, отделка, утепление. Раздвижные и распашные системы." },
{ icon: "🚪", title: "Входные и межкомнатные двери", text: "ПВХ и алюминиевые двери для дома, магазина, офиса. Замки, доводчики, ручки." },
{ icon: "✨", title: "Витражи и перегородки", text: "Стеклянные перегородки для офисов и торговых центров. Декоративные витражи." },
{ icon: "🔧", title: "Регулировка и ремонт", text: "Регулировка створок, замена уплотнителей, стеклопакетов, ручек, фурнитуры." },
]}
process={[
{ step: "01", title: "Заявка", text: "Оставьте телефон — перезвоним за 15 минут, уточним детали" },
{ step: "02", title: "Замер", text: "Бесплатный выезд замерщика в удобное время" },
{ step: "03", title: "Производство", text: "Изготовление на собственном цехе от 5 дней" },
{ step: "04", title: "Монтаж", text: "Установка по ГОСТу, уборка, сдача по акту" },
]}
photosIcon="🪟"
photosTitle="Наши работы по остеклению"
/>
<section className="bg-white py-10 sm:py-14 border-t border-slate-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c]">Пластиковые окна в Иркутске — цена, VEKA, монтаж по ГОСТу</h2>
    <div className="mt-6 grid lg:grid-cols-3 gap-6 text-sm leading-7 text-slate-700">
      <div className="space-y-3">
        <p><strong>Пластиковые окна в Иркутске</strong> от «Вектор Комфорта» — собственное производство, немецкий профиль <strong>VEKA Softline / WHS 70 мм, 4–5 камер</strong>, замкнутое армирование 1.5 мм, фурнитура <strong>MACO с микропроветриванием</strong>. Цена — <strong>от 11 000 ₽/м²</strong>, балкон под ключ — от 38 000 ₽. Изготовление 5–7 дней, монтаж за 1 день.</p>
        <p>Делаем: одно-, двух-, трёхстворчатые окна, панорамные системы, алюминиевое остекление, крашеные окна RAL 9005, ламинацию золотой дуб/махагон, остекление балконов и лоджий под ключ с утеплением, входные и межкомнатные двери ПВХ и алюминий, витражи и перегородки.</p>
      </div>
      <div className="space-y-3">
        <p><strong>Почему наш монтаж стоит дороже дешёвых:</strong> ставим на пластиковые клинья (не бруски), шов — три слоя: пена + пароизоляция изнутри + паропроницаемая лента снаружи по ГОСТ 30971, откосы — тёплый сэндвич 10 мм, подоконник — глянцевый. Исключаем продувание и плесень на десятилетия. Бригады — стаж от 7 лет.</p>
        <p><strong>Стеклопакет для Сибири:</strong> двухкамерный 40 мм с мультифункциональным Solar и аргоном, сопротивление 0.78 м²·°C/Вт (класс А+). Шумоизоляция до 38–42 дБ — улица не слышна. Зимой тепло, летом не жарко.</p>
      </div>
      <div className="space-y-3">
        <p><strong>География:</strong> Иркутск, Ангарск, Шелехов, Хомутово, Молодёжный, Маркова, Грановщина, Карлук, Смоленщина — выезд замерщика 0 ₽ до 50 км. Пн–Сб 9:00–20:00. Замер — 30 минут, расчёт — 15 минут.</p>
        <p><strong>Гарантия:</strong> 5 лет на профиль, стеклопакет и монтаж по договору. Постгарантийный сервис: регулировка, замена уплотнителей и стеклопакетов. Рассрочка. Звоните +7 (914) 914-66-06 или пишите в MAX — отвечаем за 5 минут.</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <a href="tel:+79149146606" className="px-5 py-2.5 rounded-full bg-[#ff6b35] text-white font-black text-xs hover:bg-[#e95620]">📞 Позвонить</a>
          <a href="https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-[#1a3a5c] text-white font-black text-xs border border-white/10"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[8px] font-black mr-1">MAX</span> Написать в MAX</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
        <h3 className="font-black text-[#1a3a5c]">Цены на монтаж окон в Иркутске</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">Стоимость под ключ с материалами и работой. Точная цена — после бесплатного замера, выезд 0 ₽ до 50 км.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[#1a3a5c]">
                <th className="py-2 pr-4 font-black">Работа</th>
                <th className="py-2 font-black">Цена</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4">Монтаж пластикового окна</td>
                <td className="py-2.5 font-semibold">от 2 400 ₽/шт</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4">Балконный блок с подоконником и отливом</td>
                <td className="py-2.5 font-semibold">от 3 700 ₽</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4">Откосы (сэндвич / ПВХ)</td>
                <td className="py-2.5 font-semibold">от 500 ₽/п.м</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4">Подоконник</td>
                <td className="py-2.5 font-semibold">от 700 ₽/п.м</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 pr-4">Отлив</td>
                <td className="py-2.5 font-semibold">от 200 ₽/п.м</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Демонтаж старого окна</td>
                <td className="py-2.5 font-semibold text-[#ff6b35]">0 ₽ при заказе</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
        <h3 className="font-black text-[#1a3a5c]">Частые вопросы про окна в Иркутске</h3>
        <div className="mt-3 grid sm:grid-cols-2 gap-4 text-xs leading-6 text-slate-700">
          <div><strong>Сколько стоят окна VEKA?</strong> От 11 000 ₽/м². Окно 1300×1400 с монтажем — от 14 900 ₽ под ключ после замера.</div>
          <div><strong>За сколько делаете?</strong> 5–7 дней на своём цехе, ламинация +3 дня. Монтаж — 1 день с уборкой.</div>
          <div><strong>Чем VEKA лучше?</strong> Класс А, стенка 3 мм, глянец из первичного ПВХ не желтеет 25 лет, замкнутое армирование не ведёт створку.</div>
          <div><strong>Делаете в деревянном доме?</strong> Да, с обсадой (окосячкой), учётом усадки и гидроизоляцией.</div>
        </div>
      </div>
    </div>
  </div>
</section>
<WindowsGallery />
<Counters />
<WindowCalculator />
<Reviews />
</>
);
}
