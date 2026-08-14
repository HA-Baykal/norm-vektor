import { useState, useEffect } from "react";
import ServicePage from "../components/ServicePage";
import Counters from "../components/Counters";
import Reviews from "../components/Reviews";
import DrillingCalculator from "../components/DrillingCalculator";

export default function Drilling() {
  // Динамические мета-теги и Service микроразметка
  useEffect(() => {
    const titleText = "Алмазное бурение в Иркутске — отверстия 32-250 мм | Вектор Комфорта";
    const descText = "Алмазное бурение в Иркутске от 2 000 ₽/точка. Отверстия 32-250 мм в бетоне и кирпиче. Сухой способ с пылесосом, без пыли и трещин.";
    
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
      "name": "Алмазное бурение в Иркутске",
      "description": "Алмазное бурение отверстий 32-250 мм в бетоне и кирпиче. Сухой способ с пылесосом, без пыли и трещин.",
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
      "serviceType": "Алмазное бурение отверстий",
      "offers": {
        "@type": "Offer",
        "price": "2000",
        "priceCurrency": "RUB",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Услуги алмазного бурения",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Бурение под кондиционер",
              "description": "Отверстия 55-80 мм для трассы кондиционера"
            },
            "price": "3500",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Бурение под бризер",
              "description": "Отверстие 132 мм для приточной вентиляции"
            },
            "price": "4500",
            "priceCurrency": "RUB"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Бурение под трубы",
              "description": "Отверстия 32-250 мм для водоснабжения и канализации"
            },
            "price": "2000",
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
        title="Алмазное бурение"
        ctaLabel="🧮 Рассчитать бурение"
        ctaHref="#calculator"
        tagline="Отверстия 32–250 мм в бетоне, железобетоне и кирпиче. Чисто и точно."
        heroIcon="🔩"
        intro="Алмазное бурение отверстий диаметром от 32 до 250 мм в бетоне, железобетоне, кирпиче. Сухое бурение с пылесосом — для готового ремонта, без пыли и грязи. Мокрое с подачей воды — для чернового ремонта и больших диаметров."
        breadcrumb="Алмазное бурение"
        breadcrumbPath="/almaznoe-burenie"
        advantages={[
          { icon: "🎯", title: "Точность ±1 мм", text: "Ровные цилиндрические отверстия. Никаких сколов, трещин и вибрации" },
          { icon: "🧹", title: "Сухое бурение", text: "С промышленным пылесосом — идеально для чистового ремонта" },
          { icon: "💧", title: "Мокрое бурение", text: "С подачей воды — для больших диаметров и сложных материалов" },
          { icon: "📏", title: "Диаметры 32–250 мм", text: "Под трубы, вентиляцию, кондиционеры, электрику, канализацию" },
        ]}
        services={[
          { icon: "🌬️", title: "Под вентиляцию", text: "Отверстия 100–160 мм для приточных установок, бризеров, рекуператоров." },
          { icon: "❄️", title: "Под кондиционер", text: "Отверстие 55–80 мм для трассы сплит-системы. Чистое и точное." },
          { icon: "🚰", title: "Под трубы", text: "Водоснабжение, отопление, канализация — диаметры от 32 до 250 мм." },
          { icon: "⚡", title: "Под электрику", text: "Подрозетники, кабельные трассы, проходы через стены и перекрытия." },
          { icon: "🧱", title: "Любой материал", text: "Бетон, железобетон, кирпич, блоки, натуральный камень." },
          { icon: "🏠", title: "В жилых помещениях", text: "Сухое бурение с пылесосом — безопасно для готовой отделки." },
        ]}
        process={[
          { step: "01", title: "Заявка", text: "Уточняем диаметр, материал стены, количество отверстий, адрес" },
          { step: "02", title: "Выезд", text: "Приезжаем с оборудованием в согласованное время" },
          { step: "03", title: "Бурение", text: "Разметка, бурение, обеспыливание, уборка рабочей зоны" },
          { step: "04", title: "Сдача", text: "Проверка отверстий, оплата по факту выполнения" },
        ]}
        photosIcon="🔩"
        photosTitle="Примеры выполненных отверстий"
      />
      <Counters />
      <DrillingCalculator />
      <Reviews />
    </>
  );
}
