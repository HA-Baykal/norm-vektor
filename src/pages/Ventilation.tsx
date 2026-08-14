import { useState, useEffect } from "react";
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
        title="Вентиляция"
        ctaLabel="🧮 Рассчитать вентиляцию"
        ctaHref="#calculator"
        tagline="Бризеры, рекуператоры, приточно-вытяжные системы под ключ"
        heroIcon="💨"
        intro="Системы приточно-вытяжной вентиляции: продажа и монтаж рекуператоров, бризеров, Тион, Vakio. Проектирование, изготовление воздуховодов, монтаж для квартир, домов, производственных помещений, ресторанов и офисов."
        breadcrumb="Вентиляция"
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
      <Counters />
        <VentilationCalculator />
      <Reviews />
    </>
  );
}
