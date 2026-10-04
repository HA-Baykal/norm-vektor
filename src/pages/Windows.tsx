import { useEffect } from "react";
import { Link } from "react-router-dom";
import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import WindowConfigurator from "../components/WindowConfigurator";
import WindowsGallery from "../components/WindowsGallery";
import { AI_ANSWERS } from "../data/aiAnswers";
import { useFaqSchema } from "../utils/useSeo";

const OKNA = AI_ANSWERS["/okna"];

export default function Windows() {
  // FAQPage: вопросы видимого блока ниже — тот же массив, что уходит в разметку
  useFaqSchema(OKNA.faq);

    // Динамические мета-теги и Service микроразметка
  useEffect(() => {
    const titleText = "Пластиковые окна VEKA в Иркутске — купить с монтажом | Вектор Комфорта";
    const descText = "Пластиковые окна VEKA в Иркутске от 7 000 ₽/м² со скидкой. Изготовление на заказ, монтаж по ГОСТу, гарантия 5 лет. Бесплатный замер.";
    
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
      // @id совпадает с серверной разметкой (api/page.ts) — поисковик
      // склеивает клиентскую и серверную схему в одну сущность
      "@id": "https://www.vektor-komforta.ru/okna#service",
      "name": "Пластиковые окна VEKA в Иркутске",
      "description": "Изготовление на заказ и монтаж пластиковых окон VEKA в Иркутске. монтаж по ГОСТу, гарантия 5 лет.",
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
        "price": "7000",
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
      document.title = "Пластиковые окна, кондиционеры и вентиляция в Иркутске";
      const el = document.getElementById("seo-service-schema");
      if (el) el.remove();
    };
  }, []);
return (
<>
  <ServicePage
title="Пластиковые окна ПВХ в Иркутске — купить с установкой"
ctaLabel="🧮 Расчёт окна онлайн"
ctaHref="#konstruktor"
tagline="Изготовление на заказ. Монтаж по ГОСТу. Гарантия 5 лет. Цена от 7 000 ₽/м² со скидкой"
heroIcon="🪟"
intro="Изготавливаем и устанавливаем ПВХ и алюминиевые конструкции любой сложности: окна, двери, балконы, лоджии, витражи, стеклянные перегородки. Регулируем, ремонтируем, меняем стеклопакеты."
breadcrumb="Пластиковые окна ПВХ в Иркутске"
breadcrumbPath="/okna"
advantages={[
{ icon: "🏭", title: "Свой цех", text: "Производство в Иркутске — контроль качества и сроки от 5 рабочих дней" },
{ icon: "👷", title: "Опытные монтажники", text: "Бригады со стажем от 7 лет. Монтаж строго по ГОСТ 30971-2012" },
{ icon: "🧰", title: "Профиль и фурнитура", text: "Работаем с профилем VEKA. Фурнитура Winkhaus, MACO, Geviss" },
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
        shortAnswer={OKNA.shortAnswer}
        facts={OKNA.facts}
        answerUpdated={OKNA.updated}
/>
<section className="bg-white py-10 sm:py-14 border-t border-slate-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-3xl font-black text-[#1a3a5c]">Пластиковые окна в Иркутске — цена, VEKA, монтаж по ГОСТу</h2>
    <div className="mt-6 grid lg:grid-cols-3 gap-6 text-sm leading-7 text-slate-700">
      <div className="space-y-3">
        <p><strong>Пластиковые окна в Иркутске</strong> от «Вектор Комфорта» изготавливаются на заказ. В зависимости от выбранной системы доступны профили VEKA и фурнитура MACO. Цена конструкции начинается от <strong>7 000 ₽/м² со скидкой</strong>; монтаж считается отдельно. Точные профиль, стеклопакет, фурнитуру, сроки и состав работ фиксируем в предложении после замера.</p>
        <p>Делаем: одно-, двух-, трёхстворчатые окна, панорамные системы, алюминиевое остекление, крашеные окна RAL 9005, ламинацию золотой дуб/махагон, остекление балконов и лоджий под ключ с утеплением, входные и межкомнатные двери ПВХ и алюминий, витражи и перегородки.</p>
      </div>
      <div className="space-y-3">
        <p><strong>Что важно в монтаже:</strong> в смете и договоре должны быть указаны способ крепления рамы, подготовка проёма, материалы монтажного шва и отделочные работы. Состав узла подбирают под стену и условия объекта; корректный монтаж снижает риск проблем, но не может гарантировать отсутствие конденсата при любых условиях помещения.</p>
        <p><strong>Стеклопакет подбираем по задаче:</strong> доступны варианты с разными формулами и покрытиями. Теплоизоляция и защита от шума зависят от конкретного стеклопакета и всего оконного блока, а также от примыкания к стене. Перед заказом запросите спецификацию с характеристиками выбранной конструкции.</p>
      </div>
      <div className="space-y-3">
        <p><strong>География:</strong> Иркутск, Ангарск, Шелехов, Хомутово, Молодёжный, Маркова, Грановщина, Карлук, Смоленщина — выезд замерщика 0 ₽ до 50 км. Пн–Сб 9:00–20:00. Замер — 30 минут, расчёт — 15 минут.</p>
        <p><strong>Гарантия:</strong> 5 лет на оконную конструкцию и 1 год на монтажные работы согласно опубликованным условиям. Доступен постгарантийный сервис: регулировка, замена уплотнителей и стеклопакетов. Условия рассрочки уточняйте при оформлении заказа.</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <a href="tel:+79149146606" className="px-5 py-2.5 rounded-full bg-[#ff6b35] text-white font-black text-xs hover:bg-[#e95620]">📞 Позвонить</a>
          <a href="https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-[#1a3a5c] text-white font-black text-xs border border-white/10"><span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[8px] font-black mr-1">MAX</span> Написать в MAX</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
        <h3 className="font-black text-[#1a3a5c]">Как рассчитывается стоимость окна</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Опубликованная стартовая цена оконной конструкции — от 7 000 ₽/м² со скидкой. Монтаж считается по площади — от 2 400 ₽/м²; монтаж сборной лоджии — 3 000 ₽/м². Подоконник, отлив, откосы, доставка, демонтаж и нестандартная комплектация могут влиять на итоговую смету.</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">Рассчитайте предварительную стоимость в конструкторе и уточните состав предложения после замера: стартовые цены по отдельным работам не равны цене окна под ключ.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="#konstruktor" className="inline-flex rounded-full bg-[#ff6b35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e95620]">Рассчитать предварительную стоимость</a>
          <Link to="/montazh-okon" className="inline-flex rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-[#1a3a5c] hover:border-[#ff6b35]">Цены и состав монтажа</Link>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6">
        <h3 className="font-black text-[#1a3a5c]">Частые вопросы про окна в Иркутске</h3>
        <div className="mt-3 grid sm:grid-cols-2 gap-4 text-xs leading-6 text-slate-700">
          {OKNA.faq.map((item) => (
            <div key={item.q}><strong>{item.q}</strong> {item.a}</div>
          ))}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h3 className="font-black text-[#1a3a5c] mb-3">Смотрите также</h3>
      <div className="flex flex-wrap gap-2">
        <Link to="/montazh-okon" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Монтаж окон ПВХ — от 2 400 ₽/м² →</Link>
        <Link to="/osteklenie-balkonov" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Остекление балконов — от 38 000 ₽ →</Link>
        <Link to="/standarty" className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-[#1a3a5c] hover:border-[#ff6b35] hover:text-[#ff6b35] transition">Стандарты монтажа по ГОСТ →</Link>
      </div>
    </div>
  </div>
</section>
<WindowsGallery />
<Counters />
<WindowConfigurator />
<Reviews />
</>
);
}
