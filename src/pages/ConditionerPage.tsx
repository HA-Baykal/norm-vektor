import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import { conditioners, formatRub, INSTALL_PRICE } from "../components/CatalogConditioners";
import { getOfficialSpecification, getOfficialPhotosForModel, getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";
import QuickBookingModal from "../components/QuickBookingModal";
import FAQSection from "../components/FAQSection";

export default function ConditionerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const decodedSlug = decodeURIComponent(slug || "");

  // Находим оригинальную модель кондиционера по красивому названию или ID
  const item = conditioners.find((c) => 
    c.id.toString() === slug ||
    getModelUrlSlug(c).toLowerCase() === decodedSlug.toLowerCase() ||
    c.name.toLowerCase() === decodedSlug.toLowerCase() ||
    c.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug.toLowerCase()
  ) || conditioners[0];

  if (!item) return <Navigate to="/kondicionery" />;

  // Читаем BTU из URL-ссылки (например ?btu=12000), если он там есть и такой вариант существует у модели
  const btuFromUrl = parseInt(searchParams.get("btu") || "0", 10);
  const initialBtu = item.variants.some((v) => v.btu === btuFromUrl) ? btuFromUrl : item.variants[0].btu;

  const [selectedBtu, setSelectedBtu] = useState(initialBtu);
  const [withInstall, setWithInstall] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Синхронизируем состояние при смене URL или переходе между моделями
  useEffect(() => {
    const currentParam = parseInt(searchParams.get("btu") || "0", 10);
    if (item.variants.some((v) => v.btu === currentParam)) {
      setSelectedBtu(currentParam);
    } else if (!item.variants.some((v) => v.btu === selectedBtu)) {
      setSelectedBtu(item.variants[0].btu);
    }
  }, [item, searchParams]);

  // При клике на кнопку мощности сразу обновляем адресную строку браузера (?btu=12000)
  const handleSelectBtu = (newBtu: number) => {
    setSelectedBtu(newBtu);
    setSearchParams({ btu: newBtu.toString() }, { replace: true });
  };

  // Изначально свернутый блок характеристик и полного описания
  const [specsOpen, setSpecsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const variant = item.variants.find((v) => v.btu === selectedBtu) ?? item.variants[0];
  const isCassette = item.type === "Полупромышленный";
  const totalPrice = variant.price + (withInstall && !isCassette ? INSTALL_PRICE : 0);
  const discount = variant.oldPrice ? variant.oldPrice - variant.price : 0;

  // Генерируем полный профессиональный техпаспорт с баз Русклимат и Даичи
  const officialSpecs = getOfficialSpecification(item, selectedBtu);

  // Получаем уникальные официальные фотографии конкретной серии без дублирования исходного фото!
  const allImages = getOfficialPhotosForModel(item);
  const coverPhoto = getMainCoverPhoto(item);

  // Динамический сброс SEO-заголовков и метатегов под ТОЧНУЮ ВЫБРАННУЮ МОЩНОСТЬ И ЦЕНУ!
  useEffect(() => {
    const variantPrice = variant.price;
    const titleText = `${item.brand} ${item.name} (${selectedBtu} BTU, до ${variant.area} м²) — цена со склада ${formatRub(variantPrice)} | Вектор Комфорта`;
    const descText = `${item.type} сплит-система ${item.name} (${selectedBtu} BTU, площадь до ${variant.area} м²) по цене ${formatRub(variantPrice)} со склада в Иркутске. Уровень шума: ${officialSpecs.minNoise}, гарантия завода до 5 лет. Профессиональный монтаж без пыли!`;
    const fullUrl = window.location.href;

    // 1. Меняем заголовок в браузере (для вкладок, закладок, поисковиков Яндекс и Google)
    document.title = titleText;

    // 2. Функция для обновления или создания meta тегов
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
    updateMeta("og:image", coverPhoto.startsWith("http") ? coverPhoto : `https://www.vektor-komforta.ru/${coverPhoto}`, true);
    updateMeta("og:url", fullUrl, true);

    // 3. Товарная микроразметка Schema.org для Яндекса и Google (с точной ценой за выбранный BTU)
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": `${item.brand} ${item.name} (${selectedBtu} BTU)`,
      "image": allImages,
      "description": descText,
      "sku": `VK-${item.id}-${selectedBtu}`,
      "brand": {
        "@type": "Brand",
        "name": item.brand
      },
      "offers": {
        "@type": "Offer",
        "url": fullUrl,
        "priceCurrency": "RUB",
        "price": variantPrice,
        "priceValidUntil": "2026-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Вектор Комфорта Иркутск"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "12"
      }
    };

    let scriptTag = document.getElementById("seo-product-schema") as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-product-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(productSchema);

    // При уходе со страницы возвращаем исходный заголовок и удаляем схему товара
    return () => {
      document.title = "Кондиционеры и пластиковые окна в Иркутске — Вектор Комфорта";
      const el = document.getElementById("seo-product-schema");
      if (el) el.remove();
    };
  }, [item, officialSpecs, coverPhoto, allImages]);

  // Ссылка MAX по вашему техническому заданию
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";

  const handleMaxClick = () => {
    window.open(MAX_LINK, "_blank", "noopener,noreferrer");
  };

  // Функция для кнопки "Поделиться" — вызывает системное меню мессенджеров на телефоне и ПК
  const handleShare = async () => {
    const shareData = {
      title: `${item.brand} ${item.name} (${selectedBtu} BTU)`,
      text: `Сплит-система ${item.name} (${selectedBtu} BTU, площадь до ${variant.area} м²) по цене со склада: ${formatRub(variant.price)}. Вектор Комфорта Иркутск`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Действие Поделиться отменено");
      }
    } else {
      // Надежная защита для старых ПК без меню поделиться: копируем ссылку и показываем уведомление
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(`🔗 Ссылка на модель ${item.name} скопирована! Теперь вы можете вставить и отправить её в любой чат.`);
      } catch (err) {
        alert(`Ваша ссылка для копирования:\n${window.location.href}`);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Шапка с навигационными ссылками */}
      <div className="bg-[#1a3a5c] text-white py-4 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs sm:text-sm font-semibold text-slate-300">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <span>/</span>
          <Link to="/kondicionery" className="hover:text-white transition">Каталог кондиционеров в Иркутске</Link>
          <span>/</span>
          <span className="text-[#ff6b35] font-black">{item.brand}</span>
          <span>/</span>
          <span className="text-white font-bold">{item.name}</span>
        </div>
      </div>

      <section className="py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Левая колонка: Компактное фото модели с официальных сайтов (не перекрывает характеристики) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="relative max-w-sm mx-auto h-64 sm:h-72 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg p-4 flex items-center justify-center">
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                  {item.badge && (
                    <span className="rounded-full bg-[#ff6b35] px-3 py-1 text-[11px] font-black text-white shadow-sm w-fit">
                      {item.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="rounded-full bg-green-600 px-3 py-1 text-[11px] font-black text-white shadow-sm w-fit">
                      −{formatRub(discount)}
                    </span>
                  )}
                </div>
                {item.smartHome && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-[#1a3a5c] px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                    🎙️ Умный дом
                  </span>
                )}
                <img
                  src={allImages[activeImageIdx] || allImages[0]}
                  alt={`${item.brand} ${item.name}`}
                  className="w-full h-full object-contain transition duration-300"
                  loading="eager"
                />
              </div>

              {/* Миниатюры официальных ракурсов модели */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition bg-white p-1 shadow-sm flex items-center justify-center ${
                        activeImageIdx === idx
                          ? "border-[#ff6b35] ring-2 ring-[#ff6b35]/25"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Текст про гарантию по вашим точным указаниям */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-xs text-slate-600 space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-between font-black text-[#1a3a5c] text-xs sm:text-sm">
                  <span>Официальный партнер Русклимат и Daichi</span>
                  <span className="text-emerald-600 shrink-0 ml-1">✓ В наличии</span>
                </div>
                <p className="leading-relaxed">
                  Мы работаем со складами официальных дистрибьюторов в Иркутске. На всю климатическую технику предоставляется гарантия завода, а наш монтаж сопровождает эту гарантию на весь период гарантии сплит-системы.
                </p>
              </div>
            </div>

            {/* Правая колонка: Выбор мощности, расчёт цены, кнопка MAX и характеристики */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">
                    {item.type} кондиционер
                  </div>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-black text-[#1a3a5c] leading-tight">
                    {item.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span>🌍 Страна: {item.country}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-extrabold">🔇 Шум: {officialSpecs.minNoise}</span>
                    <span>•</span>
                    <span className="text-blue-600">⚡ {officialSpecs.energyClass}</span>
                  </p>
                </div>

                {/* Выбор мощности (BTU) */}
                <div>
                  <div className="mb-2.5 text-xs font-black uppercase tracking-wider text-slate-500">
                    Выберите мощность и площадь:
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {item.variants.map((v) => (
                      <button
                        key={v.btu}
                        type="button"
                        onClick={() => handleSelectBtu(v.btu)}
                        className={`rounded-2xl px-4 py-3 text-xs sm:text-sm font-black transition-all shadow-sm flex flex-col items-center gap-0.5 ${
                          selectedBtu === v.btu
                            ? "bg-[#1a3a5c] text-white ring-2 ring-[#ff6b35]"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span className="text-base">{v.btu.toLocaleString("ru-RU")} BTU</span>
                        <span className={`text-[10px] font-semibold ${selectedBtu === v.btu ? "text-slate-300" : "text-slate-500"}`}>
                          до {v.area} м² ({v.cooling})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Краткая спецификация выбранной мощности */}
                <div className="grid grid-cols-3 gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Площадь комнаты</span>
                    <strong className="text-[#1a3a5c] text-sm font-black">до {variant.area} м²</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Охлаждение</span>
                    <strong className="text-slate-800 text-sm font-black">{variant.cooling}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Обогрев зимой</span>
                    <strong className="text-slate-800 text-sm font-black">{variant.heating}</strong>
                  </div>
                </div>

                {/* Чекбокс стандартного монтажа */}
                {isCassette ? (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold text-slate-700">
                    📐 Монтаж полупромышленных сплит-систем рассчитывается индивидуально после осмотра объекта в Иркутске
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 hover:border-[#ff6b35] transition">
                    <div>
                      <span className="text-sm font-black text-[#1a3a5c] block">
                        + Стандартный монтаж под ключ
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 block mt-0.5">
                        Стоимость установки: {formatRub(INSTALL_PRICE)}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={withInstall}
                      onChange={(e) => setWithInstall(e.target.checked)}
                      className="h-6 w-6 shrink-0 accent-[#ff6b35] rounded cursor-pointer"
                    />
                  </label>
                )}

                {/* Цена со склада, кнопка Заказать и кнопка MAX (вместо WhatsApp) */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">
                      {isCassette ? "Цена оборудования со склада" : withInstall ? "Кондиционер + установка" : "Цена кондиционера со склада"}
                    </div>
                    <div className="flex items-end gap-3 mt-1">
                      <div className="text-3xl sm:text-4xl font-black text-[#1a3a5c]">
                        {formatRub(totalPrice)}
                      </div>
                      {variant.oldPrice && !withInstall && (
                        <div className="mb-1 text-sm font-bold text-slate-400 line-through">
                          {formatRub(variant.oldPrice)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setBookingOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#ff6b35] hover:bg-[#e95620] active:scale-95 text-white font-black text-base shadow-xl shadow-[#ff6b35]/30 transition text-center shrink-0"
                    >
                      Заказать
                    </button>

                    <button
                      type="button"
                      onClick={handleMaxClick}
                      className="w-full sm:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white font-black text-base shadow-lg transition text-center shrink-0 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">🔥</span>
                      <span>MAX</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      title="Отправить ссылку в WhatsApp, Telegram или скопировать"
                      className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm active:scale-95 transition text-center shrink-0 flex items-center justify-center gap-2 border border-slate-200/80 shadow-sm"
                    >
                      <span className="text-base">↗️</span>
                      <span>Поделиться</span>
                    </button>
                  </div>
                </div>

                {/* СВЕРНУТЫЙ ПО УМОЛЧАНИЮ БЛОК: ХАРАКТЕРИСТИКИ И ОПИСАНИЕ С ОФ. САЙТОВ */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => setSpecsOpen(!specsOpen)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 font-black text-base text-[#1a3a5c] hover:bg-slate-100 transition focus:outline-none"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-[#ff6b35] font-extrabold text-lg">📋</span>
                        <span>Характеристики и техпаспорт (нажмите для раскрытия)</span>
                      </span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-300 text-slate-700 transition ${specsOpen ? "bg-[#ff6b35] text-white border-transparent" : ""}`}>
                        {specsOpen ? "Свернуть ▲" : "Развернуть ▼"}
                      </span>
                    </button>

                    {specsOpen && (
                      <div className="p-6 pt-4 border-t border-slate-200 bg-white space-y-6 text-sm animate-fade-in-up">
                        
                        {/* Официальное описание с каталогов Русклимат / Даичи */}
                        <div className="space-y-2">
                          <div className="text-xs font-black uppercase text-[#ff6b35] tracking-wider">
                            Обзор модели (Дилерский каталог {officialSpecs.distributor})
                          </div>
                          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                            {officialSpecs.fullDescription}
                          </p>
                        </div>

                        {/* Подробная таблица технических параметров по техпаспорту */}
                        <div>
                          <p className="font-black text-slate-800 mb-3 text-base">
                            Технический паспорт кондиционера {item.name}:
                          </p>
                          <ul className="space-y-2 divide-y divide-slate-100 text-sm">
                            <li className="flex justify-between pt-1"><span className="text-slate-500">Производитель и база</span><span className="font-black text-slate-800 text-right">{item.brand} ({officialSpecs.distributor})</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Рекомендуемая площадь помещения</span><span className="font-black text-slate-800">до {variant.area} м²</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Тип и марка компрессора</span><span className="font-black text-blue-700 text-right max-w-[200px] sm:max-w-none truncate">{officialSpecs.compressorBrand}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Мощность охлаждения / обогрева</span><span className="font-black text-slate-800">{variant.cooling} / {variant.heating}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Индекс мощности в BTU</span><span className="font-black text-[#ff6b35]">{selectedBtu.toLocaleString("ru-RU")} BTU</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Уровень шума внутреннего блока</span><span className="font-black text-emerald-600">{officialSpecs.minNoise}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Класс энергоэффективности</span><span className="font-black text-slate-800">{officialSpecs.energyClass}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Хладагент (Тип фреона)</span><span className="font-black text-slate-800">{officialSpecs.refrigerant} (вес: {officialSpecs.freonWeight})</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Диаметр труб медной трассы</span><span className="font-black text-slate-800">{officialSpecs.pipes}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Поддерживаемый климат в помещении</span><span className="font-black text-slate-800">{officialSpecs.indoorTempRange}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Рабочий диапазон на обогрев зимой</span><span className="font-black text-slate-800">{officialSpecs.winterRange}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Уровень шума внешнего блока</span><span className="font-black text-slate-800">{officialSpecs.maxOutdoorNoise}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Допустимое напряжение питания</span><span className="font-black text-slate-800">{officialSpecs.voltageRange}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Срок службы оборудования</span><span className="font-black text-slate-800">{officialSpecs.serviceLife}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Страна сборки завода-изготовителя</span><span className="font-black text-slate-800">{item.country}</span></li>
                            <li className="flex justify-between pt-2"><span className="text-slate-500">Гарантия на оборудование и монтаж</span><span className="font-black text-[#1a3a5c]">{officialSpecs.warrantyYears}</span></li>
                          </ul>
                        </div>

                        {/* Полный перечень функционала */}
                        <div>
                          <p className="font-black text-slate-800 mb-3 text-base">
                            Особенности и встроенный функционал:
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2.5">
                            {officialSpecs.officialFeatures.map((f, i) => (
                              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 text-slate-800 text-xs font-bold border border-slate-100">
                                <span className="text-[#ff6b35] font-black text-sm">✓</span>
                                <span className="leading-snug">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#1a3a5c] text-white text-xs space-y-1">
                          <div className="font-extrabold text-amber-400">💡 Сервис «Вектор Комфорта» в Иркутске:</div>
                          <div>Мы работаем со складами официальных дистрибьюторов в Иркутске. На всю климатическую технику предоставляется гарантия завода, а наш монтаж сопровождает эту гарантию на весь период гарантии сплит-системы.</div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-400 font-semibold">
                  <Link to="/kondicionery" className="hover:text-[#ff6b35] transition flex items-center gap-1">
                    <span>← Вернутся ко всем кондиционерам в каталоге</span>
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

      {/* Другие модели в наличии в Иркутске */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35]">Рекомендации</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#1a3a5c]">Другие модели в наличии в Иркутске</h2>
            </div>
            <Link to="/kondicionery" className="text-sm font-black text-[#ff6b35] hover:underline">
              Смотреть весь каталог →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {conditioners.filter(c => c.id !== item.id).slice(0, 3).map((c) => {
              const v = c.variants[0];
              const cDiscount = v.oldPrice ? v.oldPrice - v.price : 0;
              return (
                <Link
                  key={c.id}
                  to={`/kondicionery/${getModelUrlSlug(c)}`}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-2xl transition duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white p-2 flex items-center justify-center border-b border-slate-100">
                    {c.badge && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white shadow">
                        {c.badge}
                      </span>
                    )}
                    {cDiscount > 0 && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white shadow">
                        −{formatRub(cDiscount)}
                      </span>
                    )}
                    <img src={getMainCoverPhoto(c)} alt={c.name} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-black uppercase text-[#ff6b35]">{c.brand}</span>
                    <h3 className="mt-1 text-lg font-black text-[#1a3a5c] group-hover:text-[#ff6b35] transition">{c.name}</h3>
                    <p className="mt-2 text-xs text-slate-500 font-semibold">
                      до {v.area} м² • Шум: {c.noise} • {c.type}
                    </p>
                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Цена со склада</span>
                        <span className="text-xl font-black text-[#1a3a5c]">{formatRub(v.price)}</span>
                      </div>
                      <span className="px-4 py-2 rounded-full bg-[#1a3a5c] text-white text-xs font-black group-hover:bg-[#ff6b35] transition">
                        Характеристики →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FAQSection />

      <QuickBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={`Заказ сплит-системы: ${item.brand} ${item.name}`}
        calcDetails={`Выбранная мощность: ${selectedBtu} BTU (до ${variant.area} м²), Стандартный монтаж: ${withInstall ? "Да (+18 000 ₽)" : "Нет"}, Итог: ${formatRub(totalPrice)}`}
      />
    </div>
  );
}
