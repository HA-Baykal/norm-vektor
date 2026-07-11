import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type CalculatorTab = "windows" | "conditioners" | "ventilation" | "drilling";
type PortfolioCategory = "all" | "windows" | "conditioners" | "ventilation" | "drilling";
type ConditionerArea = 20 | 30 | 40;
type WindowType = "single" | "double" | "triple" | "balcony";

interface CalculatorState {
  windowsCount: number;
  windowType: WindowType;
  balcony: boolean;
  conditionerCount: number;
  conditionerMode: "sale-install" | "install" | "service";
  conditionerArea: ConditionerArea;
  conditionerInverter: boolean;
  rooms: number;
  ventType: "brizer" | "recuperator" | "duct";
  holes: number;
  diameter: 80 | 132 | 160 | 250;
  dryMethod: boolean;
}

declare global {
  interface Window {
    jivo_api?: {
      open?: () => void;
      setCustomData?: (data: Array<{ title: string; content: string }>) => void;
    };
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const navItems = [
  { href: "#services", label: "Услуги" },
  { href: "#calculator", label: "Калькулятор" },
  { href: "#partners", label: "Партнёры" },
  { href: "#faq", label: "FAQ" },
  { href: "#portfolio", label: "Портфолио" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

const services = [
  {
    title: "Окна и остекление",
    image: "images/service-windows.jpg",
    text: "ПВХ и алюминий, окна, двери, балконы, лоджии, витражи, стеклянные перегородки. Регулировка, ремонт, обслуживание.",
    points: ["Собственное производство", "Монтаж по ГОСТ", "Замена стеклопакетов"],
  },
  {
    title: "Кондиционеры",
    image: "images/service-conditioner.jpg",
    text: "Продажа, профессиональный монтаж, обслуживание, чистка и заправка фреона для квартир, домов, офисов и коммерческих зданий.",
    points: ["Большой выбор моделей", "Монтаж за 1 день", "Сервис и чистка"],
  },
  {
    title: "Вентиляция",
    image: "images/service-ventilation.jpg",
    text: "Приточно-вытяжные системы, рекуператоры, бризеры, Тион, Vakio. Проектирование, воздуховоды и монтаж под ключ.",
    points: ["Проектирование", "Воздуховоды", "Квартиры и бизнес"],
  },
  {
    title: "Алмазное бурение",
    image: "images/service-drilling.jpg",
    text: "Отверстия 32-250 мм в бетоне, железобетоне и кирпиче. Сухое бурение с пылесосом и мокрое с подачей воды.",
    points: ["Без трещин", "Сухое и мокрое", "Под трубы и вентиляцию"],
  },
];

const portfolioItems = [
  { category: "windows", path: "images/portfolio/okna-1.jpg", title: "Остекление балкона" },
  { category: "windows", path: "images/portfolio/okna-2.jpg", title: "ПВХ окна в квартире" },
  { category: "windows", path: "images/portfolio/okna-3.jpg", title: "Алюминиевые конструкции" },
  { category: "conditioners", path: "images/portfolio/cond-1.jpg", title: "Монтаж сплит-системы" },
  { category: "conditioners", path: "images/portfolio/cond-2.jpg", title: "Кондиционер в офисе" },
  { category: "conditioners", path: "images/portfolio/cond-3.jpg", title: "Сервис кондиционера" },
  { category: "ventilation", path: "images/portfolio/vent-1.jpg", title: "Бризер в квартире" },
  { category: "ventilation", path: "images/portfolio/vent-2.jpg", title: "Вентиляция ресторана" },
  { category: "ventilation", path: "images/portfolio/vent-3.jpg", title: "Воздуховоды на объекте" },
  { category: "drilling", path: "images/portfolio/bur-1.jpg", title: "Отверстие под вентиляцию" },
  { category: "drilling", path: "images/portfolio/bur-2.jpg", title: "Сухое бурение" },
  { category: "drilling", path: "images/portfolio/bur-3.jpg", title: "Бурение под трубы" },
] as const;

const reviews = [
  {
    name: "Александр М.",
    city: "Иркутск",
    service: "Остекление лоджии",
    text: "Заказали тёплое остекление лоджии. Замер сделали в день обращения, монтаж прошёл аккуратно, все откосы и стыки ровные. После работ убрали мусор.",
    photo: "images/clients/client-1.jpg",
  },
  {
    name: "Екатерина В.",
    city: "Ангарск",
    service: "Кондиционер",
    text: "Помогли выбрать кондиционер под комнату и бюджет. Установили быстро, трассу сделали аккуратно. Через сезон заказывали чистку, всё работает отлично.",
    photo: "images/clients/client-2.jpg",
  },
  {
    name: "Дмитрий К.",
    city: "Шелехов",
    service: "Бризер",
    text: "Поставили бризер в спальню. Воздуха стало заметно больше, окна теперь можно не открывать. Специалисты объяснили, как менять фильтры.",
    photo: "images/clients/client-3.jpg",
  },
  {
    name: "Ольга С.",
    city: "Иркутск",
    service: "Алмазное бурение",
    text: "Нужно было сделать отверстие под вентиляцию после ремонта. Бурили сухим способом с пылесосом, пыли практически не было.",
    photo: "images/clients/client-4.jpg",
  },
  {
    name: "Игорь П.",
    city: "Хомутово",
    service: "Окна в доме",
    text: "Поставили окна в частном доме. Понравилось, что производство своё, сроки понятные, цена после замера не изменилась.",
    photo: "images/clients/client-5.jpg",
  },
  {
    name: "Марина Т.",
    city: "Иркутск",
    service: "Вентиляция кафе",
    text: "Сделали проект и монтаж вентиляции для кафе. Учли кухню, зал и подсобные помещения. Система работает тихо, запахов в зале нет.",
    photo: "images/clients/client-6.jpg",
  },
];

const advantages = [
  { title: "Один подрядчик", text: "Закрываем сразу четыре направления для квартиры, дома или бизнеса.", icon: "layers" },
  { title: "Свой монтаж", text: "Работают постоянные бригады, которые отвечают за результат.", icon: "tools" },
  { title: "Чистая работа", text: "Защищаем отделку, используем пылесос при бурении, убираем за собой.", icon: "spark" },
  { title: "Понятная смета", text: "Объясняем состав работ до старта и фиксируем договорённости.", icon: "doc" },
  { title: "Гарантия", text: "Даём гарантию на монтаж, оборудование и выполненные работы.", icon: "shield" },
  { title: "Выезд до 50 км", text: "Иркутск, Ангарск, Шелехов, Хомутово и пригород.", icon: "map" },
];

const calculatorLabels: Record<CalculatorTab, string> = {
  windows: "Окна",
  conditioners: "Кондиционеры",
  ventilation: "Вентиляция",
  drilling: "Бурение",
};

const conditionerPriceByArea: Record<ConditionerArea, { base: number; inverter: number }> = {
  20: { base: 42950, inverter: 10000 },
  30: { base: 46500, inverter: 8000 },
  40: { base: 55000, inverter: 7000 },
};

const windowTypes: Array<{
  key: WindowType;
  label: string;
  price: number;
  description: string;
  sashes: number;
}> = [
  {
    key: "single",
    label: "Одностворчатое",
    price: 7995,
    description: "600×1000 мм, 1 поворотно-откидная створка",
    sashes: 1,
  },
  {
    key: "double",
    label: "Двухстворчатое",
    price: 19255,
    description: "1500×1500 мм, глухая + поворотно-откидная",
    sashes: 2,
  },
  {
    key: "triple",
    label: "Трёхстворчатое",
    price: 22534,
    description: "1800×1500 мм, глухая + пов.-отк. + глухая",
    sashes: 3,
  },
  {
    key: "balcony",
    label: "Балконная группа",
    price: 27642,
    description: "Окно 1500×1500 + Дверь 900×2100 мм",
    sashes: 2,
  },
];

const portfolioFilters: Array<{ key: PortfolioCategory; label: string }> = [
  { key: "all", label: "Все" },
  { key: "windows", label: "Окна" },
  { key: "conditioners", label: "Кондиционеры" },
  { key: "ventilation", label: "Вентиляция" },
  { key: "drilling", label: "Бурение" },
];

const partnerBrands = [
  { name: "Ballu", logo: "images/brands/ballu.svg" },
  { name: "Electrolux", logo: "images/brands/electrolux.svg" },
  { name: "Haier", logo: "images/brands/haier.svg" },
  { name: "Daikin", logo: "images/brands/daikin.svg" },
  { name: "Mitsubishi", logo: "images/brands/mitsubishi.svg" },
  { name: "Royal Clima", logo: "images/brands/royal-clima.svg" },
  { name: "Rehau", logo: "images/brands/rehau.svg" },
  { name: "Veka", logo: "images/brands/veka.svg" },
  { name: "Тион", logo: "images/brands/tion.svg" },
  { name: "Vakio", logo: "images/brands/vakio.svg" },
];

const faqItems = [
  {
    question: "Сколько стоит выезд замерщика?",
    answer: "Выезд замерщика бесплатный при условии заказа услуг. Если вы отказываетесь от заказа после замера — стоимость выезда 1000 ₽.",
  },
  {
    question: "Какая гарантия на ваши работы?",
    answer: "Мы даём гарантию до 5 лет на монтаж и оборудование. Гарантийный срок зависит от типа работ и указывается в договоре.",
  },
  {
    question: "Вы работаете только в Иркутске?",
    answer: "Нет, мы работаем в Иркутске, Ангарске, Шелехове, Хомутово и пригороде до 50 км. Выезд в область обсуждается индивидуально.",
  },
  {
    question: "Можно ли оплатить картой?",
    answer: "Да, мы принимаем оплату наличными, банковской картой и безналичным расчётом для юридических лиц.",
  },
  {
    question: "Сколько времени занимает монтаж кондиционера?",
    answer: "Стандартный монтаж сплит-системы занимает 3-4 часа. В сложных случаях (высотные работы, длинная трасса) — до 8 часов.",
  },
  {
    question: "Делаете ли вы сервисное обслуживание?",
    answer: "Да, мы обслуживаем кондиционеры любых брендов: чистка, заправка фреоном, диагностика, ремонт.",
  },
];

const notificationMessages = [
  "Ирина, Иркутск — заказала расчёт кондиционера",
  "Алексей, Ангарск — оставил заявку на окна",
  "Мария, Шелехов — запросила бурение",
  "Дмитрий, Хомутово — заказал вентиляцию",
  "Ольга, Иркутск — оставила заявку на замер",
];

const PHONE_MAIN = "+79149146606";
const PHONE_CITY = "66-99-30";
const WHATSAPP_PHONE = "79247116610";
const MAX_APP_URL = "https://max.ru/u/f9LHodD0cOI5ldFKekwE_KM4jdDm8tReQpj7iGpqPxHBgROGT5syyP8nDwY";

function candidatePaths(path: string) {
  const match = path.match(/^(.*)\.(jpg|jpeg|png)$/i);
  if (!match) return [path];
  const base = match[1];
  return Array.from(new Set([path, `${base}.jpg`, `${base}.jpeg`, `${base}.png`]));
}

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} руб.`;
}

function getRecaptchaSiteKey() {
  return document.querySelector<HTMLMetaElement>('meta[name="recaptcha-site-key"]')?.content.trim() ?? "";
}

async function requestRecaptchaToken(action: string) {
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey || !window.grecaptcha) return "";
  await new Promise<void>((resolve) => window.grecaptcha?.ready(() => resolve()));
  return window.grecaptcha.execute(siteKey, { action });
}

function openJivoChat() {
  if (window.jivo_api?.open) {
    window.jivo_api.open();
    return;
  }
  document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
}

function openWhatsApp() {
  const message = "Здравствуйте! Интересуют ваши услуги. Можно получить консультацию?";
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
}

function openMaxApp() {
  window.open(MAX_APP_URL, "_blank");
}

function LogoMark({ className = "h-10 w-10 sm:h-11 sm:w-11" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="42" height="42" rx="12" fill="#1a3a5c" />
      <rect x="11" y="11" width="26" height="26" rx="4" stroke="white" strokeWidth="2" />
      <path d="M24 11v26M11 24h26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 34 34 14" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 14h7v7" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LineIcon({ name }: { name: string }) {
  const common = "stroke-current";
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "layers" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="m12 3 8 4.5-8 4.5-8-4.5L12 3Zm-8 9 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />}
      {name === "tools" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5 17 4l3 3-2.5 2.5M6 18l8.5-8.5m-7-4.5 3 3M4 7l3-3 13 13-3 3L4 7Z" />}
      {name === "spark" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />}
      {name === "doc" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l4 4v14H7V3Zm7 0v5h5M9.5 12h5M9.5 16h7" />}
      {name === "shield" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v5c0 4.5-2.7 7.8-7 10-4.3-2.2-7-5.5-7-10V6l7-3Zm-3 9 2 2 4-4" />}
      {name === "map" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 18 4 21V6l5-3 6 3 5-3v15l-5 3-6-3Zm0-15v15m6-12v15" />}
      {name === "phone" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2 4.1 1.4V20c0 .6-.4 1-1 1C9.9 21 3 14.1 3 5.5c0-.6.4-1 1-1h3.4l1.4 4.1-2.2 2.2Z" />}
      {name === "chat" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v11H8l-4 4V5Zm5 5h.01M12 10h.01M15 10h.01" />}
      {name === "arrow" && <path className={common} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />}
      {name === "whatsapp" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a9.5 9.5 0 1 1-9.5-9.5c1.8 0 3.5.5 5 1.4l2.8-.7-.7 2.7a9.4 9.4 0 0 1 2.4 6.1ZM8 9c0 2.5 2 5.5 5 7 1 .5 2 .5 2.5 0l1-1c.5-.5.5-1.5 0-2l-1.5-1.5c-.5-.5-1.5-.5-2 0l-1 1c-.5.5-1.5.5-2 0Z" />}
      {name === "up" && <path className={common} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7 7-7 7 7" />}
      {name === "max" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
      {name === "check" && <path className={common} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />}
    </svg>
  );
}

// ============================================================================
// 📢 ВАЖНО: Здесь можно заменить SVG на реальное фото!
// ============================================================================
// Где менять картинки:
// 1. Откройте папку: public/images/calculator/
// 2. Положите туда фото: balcony-group.jpg (реальное фото балконной группы)
// 3. В коде ниже найдите строку с комментарием "📸 ЗАМЕНИТЬ НА ФОТО"
// 4. Раскомментируйте <img> и закомментируйте <svg>
// ============================================================================

function WindowDiagram({ type }: { type: WindowType }) {
  //  ЗАМЕНИТЬ НА ФОТО: Раскомментируйте строку ниже и положите фото в public/images/calculator/balcony-group.jpg
  // const balconyPhoto = "/images/calculator/balcony-group.jpg";
  
  return (
    <div className="relative h-64 w-full rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200">
      {type === "balcony" ? (
        // ======================================================================
        //  БАЛКОННАЯ ГРУППА - SVG СХЕМА (можно заменить на фото выше)
        // ======================================================================
        <div className="h-full w-full">
          <svg viewBox="0 0 240 180" className="h-full w-full">
            {/* Внешняя рама */}
            <rect x="10" y="10" width="220" height="160" fill="none" stroke="#1a3a5c" strokeWidth="4" />
            
            {/* Импост между окном и дверью */}
            <line x1="100" y1="10" x2="100" y2="170" stroke="#1a3a5c" strokeWidth="4" />
            
            {/* ОКНО СЛЕВА - 1500×1500 мм (квадратное) */}
            <rect x="14" y="14" width="82" height="152" fill="#e0f2fe" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Горизонтальный импост окна (посередине) */}
            <line x1="14" y1="90" x2="96" y2="90" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Вертикальный импост окна (посередине) */}
            <line x1="55" y1="14" x2="55" y2="166" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Ручка окна */}
            <ellipse cx="92" cy="90" rx="3" ry="5" fill="#1a3a5c" />
            
            {/* Подпись ОКНО */}
            <text x="55" y="182" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">Окно 1500×1500</text>
            
            {/* ДВЕРЬ СПРАВА - 900×2100 мм (высокая) */}
            {/* Визуально показываем что дверь выше - выходит за пределы окна */}
            <rect x="104" y="14" width="122" height="152" fill="#e0f2fe" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Горизонтальная перекладина двери (на уровне окна) */}
            <line x1="104" y1="50" x2="226" y2="50" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Вертикальный импост двери */}
            <line x1="165" y1="14" x2="165" y2="166" stroke="#1a3a5c" strokeWidth="2" />
            
            {/* Ручка двери (ниже чем у окна) */}
            <ellipse cx="112" cy="110" rx="3" ry="5" fill="#1a3a5c" />
            
            {/* Замочная скважина двери */}
            <circle cx="112" cy="125" r="2" fill="#1a3a5c" />
            
            {/* Стрелка высоты двери */}
            <line x1="235" y1="14" x2="235" y2="166" stroke="#ff6b35" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="245" y="95" textAnchor="middle" className="text-xs fill-[#ff6b35] font-bold">2100</text>
            
            {/* Подпись ДВЕРЬ */}
            <text x="165" y="182" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">Дверь 900×2100</text>
            
            {/* Маркер стрелки */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b35" />
              </marker>
            </defs>
          </svg>
          
          {/* Размеры под схемой */}
          <div className="mt-2 flex justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"> Окно + Дверь</span>
          </div>
        </div>
      ) : (
        // ======================================================================
        // ОБЫЧНЫЕ ОКНА (одностворчатое, двухстворчатое, трёхстворчатое)
        // ======================================================================
        <svg viewBox="0 0 220 160" className="h-full w-full">
          <rect x="10" y="10" width="200" height="140" fill="none" stroke="#1a3a5c" strokeWidth="4" />
          
          {type === "single" && (
            <>
              <rect x="14" y="14" width="192" height="132" fill="#e0f2fe" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="14" y1="80" x2="206" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="110" y1="14" x2="110" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <ellipse cx="195" cy="80" rx="4" ry="6" fill="#1a3a5c" />
              <text x="110" y="158" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">600 × 1000 мм</text>
            </>
          )}
          
          {type === "double" && (
            <>
              <line x1="110" y1="10" x2="110" y2="150" stroke="#1a3a5c" strokeWidth="4" />
              <rect x="14" y="14" width="92" height="132" fill="#f1f5f9" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="14" y1="80" x2="106" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="60" y1="14" x2="60" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <rect x="114" y="14" width="92" height="132" fill="#e0f2fe" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="114" y1="80" x2="206" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="160" y1="14" x2="160" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <ellipse cx="200" cy="80" rx="4" ry="6" fill="#1a3a5c" />
              <text x="60" y="158" textAnchor="middle" className="text-xs fill-slate-400 font-semibold">Глухая</text>
              <text x="160" y="158" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">Пов.-отк.</text>
            </>
          )}
          
          {type === "triple" && (
            <>
              <line x1="70" y1="10" x2="70" y2="150" stroke="#1a3a5c" strokeWidth="4" />
              <line x1="150" y1="10" x2="150" y2="150" stroke="#1a3a5c" strokeWidth="4" />
              <rect x="14" y="14" width="52" height="132" fill="#f1f5f9" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="14" y1="80" x2="66" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="40" y1="14" x2="40" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <rect x="74" y="14" width="72" height="132" fill="#e0f2fe" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="74" y1="80" x2="146" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="110" y1="14" x2="110" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <ellipse cx="140" cy="80" rx="4" ry="6" fill="#1a3a5c" />
              <rect x="154" y="14" width="52" height="132" fill="#f1f5f9" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="154" y1="80" x2="206" y2="80" stroke="#1a3a5c" strokeWidth="2" />
              <line x1="180" y1="14" x2="180" y2="146" stroke="#1a3a5c" strokeWidth="2" />
              <text x="40" y="158" textAnchor="middle" className="text-xs fill-slate-400 font-semibold">Глухая</text>
              <text x="110" y="158" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">Пов.-отк.</text>
              <text x="180" y="158" textAnchor="middle" className="text-xs fill-slate-400 font-semibold">Глухая</text>
            </>
          )}
        </svg>
      )}
    </div>
  );
}

function PhotoSlot({
  path,
  label,
  className = "",
  imageClassName = "",
  hidePlaceholder = false,
}: {
  path: string;
  label?: string;
  className?: string;
  imageClassName?: string;
  hidePlaceholder?: boolean;
}) {
  const candidates = useMemo(() => candidatePaths(path), [path]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(0);
    setLoaded(false);
  }, [path]);

  const failed = current >= candidates.length;

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {!failed && (
        <img
          key={candidates[current]}
          src={candidates[current]}
          alt={label ?? path}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setCurrent((value) => value + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${imageClassName}`}
        />
      )}

      {(!loaded || failed) && !hidePlaceholder && <div className="absolute inset-0 bg-slate-200" />}
    </div>
  );
}

function AvatarPhoto({ path, initials }: { path: string; initials: string }) {
  const candidates = useMemo(() => candidatePaths(path), [path]);
  const [current, setCurrent] = useState(0);
  const failed = current >= candidates.length;

  if (failed) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a3a5c] text-sm font-black text-white sm:h-14 sm:w-14">
        {initials}
      </div>
    );
  }

  return (
    <img
      key={candidates[current]}
      src={candidates[current]}
      alt={initials}
      loading="lazy"
      onError={() => setCurrent((value) => value + 1)}
      className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
    />
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-3xl reveal">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">{text}</p>}
    </div>
  );
}

function NotificationToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const showNotification = () => {
      const randomMessage = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
      setMessage(randomMessage);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const timer = setTimeout(showNotification, 8000);
    const interval = setInterval(showNotification, 25000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-28 left-4 z-40 max-w-xs animate-fade-in-up rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/20 border border-slate-200 sm:bottom-32">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{message}</p>
          <p className="mt-1 text-xs text-slate-500">Только что</p>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-28 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a3a5c] text-white shadow-lg shadow-slate-900/20 transition hover:bg-[#244b73] sm:bottom-36 sm:h-14 sm:w-14"
      aria-label="Наверх"
    >
      <LineIcon name="up" />
    </button>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl" : "bg-white/80 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-20 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Вектор Комфорта">
          <LogoMark className="h-9 w-9 sm:h-11 sm:w-11" />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-black tracking-tight text-[#1a3a5c] sm:text-lg">Вектор Комфорта</div>
            <div className="hidden text-xs font-medium text-slate-500 sm:block">Комфорт в каждом направлении</div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-[#1a3a5c]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a href={`tel:${PHONE_MAIN}`} className="text-sm font-bold text-[#1a3a5c] transition hover:text-[#ff6b35]">+7 (914) 914-66-06</a>
          <span className="h-4 w-px bg-slate-300" />
          <a href={`tel:${PHONE_CITY}`} className="text-sm font-bold text-[#1a3a5c] transition hover:text-[#ff6b35]">66-99-30</a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a href={`tel:${PHONE_MAIN}`} className="hidden items-center gap-2 rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#e95620] md:inline-flex">
            <LineIcon name="phone" />
            Позвонить
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-full border border-slate-200 p-3 text-[#1a3a5c] lg:hidden"
            aria-label="Открыть меню"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100">
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a href={`tel:${PHONE_MAIN}`} className="rounded-2xl bg-[#1a3a5c] px-4 py-3 text-center text-sm font-bold text-white">+7 (914) 914-66-06</a>
              <a href={`tel:${PHONE_CITY}`} className="rounded-2xl bg-[#ff6b35] px-4 py-3 text-center text-sm font-bold text-white">66-99-30</a>
            </div>
            <button onClick={() => { openWhatsApp(); setMobileOpen(false); }} className="mt-2 rounded-2xl bg-[#25D366] px-4 py-3 text-center text-sm font-bold text-white">
              💬 Написать в WhatsApp
            </button>
            <button onClick={() => { openMaxApp(); setMobileOpen(false); }} className="mt-2 rounded-2xl bg-[#0066FF] px-4 py-3 text-center text-sm font-bold text-white">
              📱 Max Приложение
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[560px] items-end overflow-hidden bg-[#10263d] pt-16 text-white sm:min-h-[650px] sm:pt-20 lg:min-h-[760px] lg:pt-24"
    >
      <div className="absolute inset-0 opacity-100">
        <PhotoSlot
          path="images/hero-bg.jpg"
          hidePlaceholder
          className="h-full w-full bg-transparent p-6 sm:p-0"
          imageClassName="object-contain object-top sm:object-cover sm:object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,38,61,0.45)_0%,rgba(26,58,92,0.28)_48%,rgba(16,38,61,0.14)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href="#calculator"
            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-5 py-4 text-sm font-black text-white shadow-2xl shadow-orange-500/25 transition hover:-translate-y-1 hover:bg-[#e95620] sm:w-auto sm:px-7 sm:text-base"
          >
            Рассчитать стоимость
            <LineIcon name="arrow" />
          </a>
          <a
            href={`tel:${PHONE_MAIN}`}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20 sm:w-auto sm:px-7 sm:text-base"
          >
            Позвонить
            <LineIcon name="phone" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ... (остальные компоненты CountUp, Counters, ServicesSection и т.д. остаются без изменений)
// Для краткости я не включаю их здесь, но они должны быть в полном коде

function Calculator() {
  const [tab, setTab] = useState<CalculatorTab>("windows");
  const [calc, setCalc] = useState<CalculatorState>({
    windowsCount: 3,
    windowType: "double",
    balcony: false,
    conditionerCount: 1,
    conditionerMode: "sale-install",
    conditionerArea: 20,
    conditionerInverter: false,
    rooms: 2,
    ventType: "brizer",
    holes: 2,
    diameter: 132,
    dryMethod: true,
  });

  const estimate = useMemo(() => {
    if (tab === "windows") {
      const windowTypeData = windowTypes.find(w => w.key === calc.windowType);
      const basePrice = windowTypeData?.price || 0;
      return calc.windowsCount * basePrice + (calc.balcony ? 52000 : 0);
    }

    if (tab === "conditioners") {
      const areaPrice = conditionerPriceByArea[calc.conditionerArea];
      const saleAndInstallPrice = areaPrice.base + (calc.conditionerInverter ? areaPrice.inverter : 0);
      const installOnlyPrice = 22000;
      const servicePrice = 5500;
      const price = calc.conditionerMode === "sale-install" ? saleAndInstallPrice : calc.conditionerMode === "install" ? installOnlyPrice : servicePrice;
      return calc.conditionerCount * price;
    }

    if (tab === "ventilation") {
      const typePrice = calc.ventType === "brizer" ? 19390 : calc.ventType === "recuperator" ? 33900 : 125000;
      return typePrice + calc.rooms * 19390;
    }

    const diameterPrice = calc.diameter <= 80 ? 2000 : calc.diameter <= 132 ? 2500 : calc.diameter <= 160 ? 2900 : 4800;
    return calc.holes * (diameterPrice + (calc.dryMethod ? 700 : 0));
  }, [calc, tab]);

  const requestLead = () => {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="calculator" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
          <div className="reveal">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Калькулятор</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">Предварительный расчёт стоимости</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">Стоимость меняется в реальном времени. Итоговая цена зависит от замера, материала, сложности монтажа и выбранного оборудования.</p>
            <div className="mt-6 rounded-[1.5rem] bg-[#1a3a5c] p-5 text-white shadow-2xl shadow-slate-900/15 sm:mt-8 sm:rounded-[2rem] sm:p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200 sm:text-sm sm:tracking-[0.2em]">Ориентир</div>
              <div className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">{formatRub(estimate)}</div>
              <p className="mt-4 text-sm leading-6 text-slate-200">Это быстрый расчёт для понимания бюджета. Точную смету подготовим после уточнения деталей.</p>
              <button type="button" onClick={requestLead} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620] sm:w-auto">
                Оставить заявку
                <LineIcon name="arrow" />
              </button>
            </div>
          </div>

          <div className="reveal rounded-[1.5rem] bg-slate-50 p-4 shadow-xl shadow-slate-900/5 sm:rounded-[2rem] sm:p-6">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
              {(Object.keys(calculatorLabels) as CalculatorTab[]).map((key) => (
                <button key={key} type="button" onClick={() => setTab(key)} className={`min-w-[145px] rounded-2xl px-4 py-3 text-sm font-black transition sm:min-w-0 ${tab === key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                  {calculatorLabels[key]}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-6 sm:mt-8 sm:space-y-7">
              {tab === "windows" && (
                <>
                  <div>
                    <span className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">Тип окна</span>
                    <div className="grid grid-cols-2 gap-3">
                      {windowTypes.map((windowType) => (
                        <button
                          key={windowType.key}
                          type="button"
                          onClick={() => setCalc({ ...calc, windowType: windowType.key })}
                          className={`rounded-2xl border-2 p-4 text-left transition ${
                            calc.windowType === windowType.key
                              ? "border-[#ff6b35] bg-orange-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="text-sm font-bold text-slate-900">{windowType.label}</div>
                          <div className="mt-1 text-xs text-slate-500">{windowType.description}</div>
                          <div className="mt-2 text-lg font-black text-[#ff6b35]">{formatRub(windowType.price)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <WindowDiagram type={calc.windowType} />

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em] mb-3">Характеристики профиля VEKA</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <LineIcon name="check" />
                        <span>Профиль <strong>VEKA 62 мм</strong>, 4-камерный</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <LineIcon name="check" />
                        <span>Фурнитура <strong>MACO</strong> с микропроветриванием</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <LineIcon name="check" />
                        <span>Все створки <strong>поворотно-откидные</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <LineIcon name="check" />
                        <span>Энергосберегающий стеклопакет</span>
                      </div>
                    </div>
                  </div>

                  <RangeField label="Количество окон" value={calc.windowsCount} min={1} max={12} suffix="шт." onChange={(value) => setCalc({ ...calc, windowsCount: value })} />
                  <ToggleField label="Добавить остекление балкона или лоджии" checked={calc.balcony} onChange={(value) => setCalc({ ...calc, balcony: value })} />
                </>
              )}

              {tab === "conditioners" && (
                <>
                  <RangeField label="Количество кондиционеров" value={calc.conditionerCount} min={1} max={8} suffix="шт." onChange={(value) => setCalc({ ...calc, conditionerCount: value })} />
                  <SelectField
                    label="Тип работы"
                    value={calc.conditionerMode}
                    options={[
                      { value: "sale-install", label: "Продажа + монтаж" },
                      { value: "install", label: "Монтаж вашего кондиционера + обслуживание" },
                      { value: "service", label: "Обслуживание / чистка / фреон" },
                    ]}
                    onChange={(value) => setCalc({ ...calc, conditionerMode: value as CalculatorState["conditionerMode"] })}
                  />

                  {calc.conditionerMode === "sale-install" && (
                    <>
                      <SelectField
                        label="Площадь помещения"
                        value={String(calc.conditionerArea)}
                        options={[
                          { value: "20", label: "До 20 кв.м" },
                          { value: "30", label: "До 30 кв.м" },
                          { value: "40", label: "До 40 кв.м" },
                        ]}
                        onChange={(value) => setCalc({ ...calc, conditionerArea: Number(value) as ConditionerArea })}
                      />
                      <ToggleField
                        label={`Инверторная технология +${formatRub(conditionerPriceByArea[calc.conditionerArea].inverter)}`}
                        checked={calc.conditionerInverter}
                        onChange={(value) => setCalc({ ...calc, conditionerInverter: value })}
                      />
                    </>
                  )}
                </>
              )}

              {tab === "ventilation" && (
                <>
                  <RangeField label="Количество помещений" value={calc.rooms} min={1} max={12} suffix="пом." onChange={(value) => setCalc({ ...calc, rooms: value })} />
                  <SelectField
                    label="Тип системы"
                    value={calc.ventType}
                    options={[
                      { value: "brizer", label: "Бризер" },
                      { value: "recuperator", label: "Рекуператор" },
                      { value: "duct", label: "Приточно-вытяжная система" },
                    ]}
                    onChange={(value) => setCalc({ ...calc, ventType: value as CalculatorState["ventType"] })}
                  />
                </>
              )}

              {tab === "drilling" && (
                <>
                  <RangeField label="Количество отверстий" value={calc.holes} min={1} max={20} suffix="шт." onChange={(value) => setCalc({ ...calc, holes: value })} />
                  <SelectField
                    label="Диаметр"
                    value={String(calc.diameter)}
                    options={[
                      { value: "80", label: "80 мм" },
                      { value: "132", label: "132 мм" },
                      { value: "160", label: "160 мм" },
                      { value: "250", label: "250 мм" },
                    ]}
                    onChange={(value) => setCalc({ ...calc, diameter: Number(value) as CalculatorState["diameter"] })}
                  />
                  <ToggleField label="Сухое бурение с пылесосом" checked={calc.dryMethod} onChange={(value) => setCalc({ ...calc, dryMethod: value })} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ... (остальные компоненты Portfolio, Advantages, Reviews, MapSection, ChatSection, ContactForm, Footer)
// ... (App export)

export default function App() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.16 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const siteKey = getRecaptchaSiteKey();
    if (!siteKey || document.querySelector("script[data-recaptcha-v3]")) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaV3 = "true";
    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <Counters />
        <ServicesSection />
        <PartnersSection />
        <Calculator />
        <FAQSection />
        <Portfolio />
        <Advantages />
        <Reviews />
        <MapSection />
        <ChatSection />
        <ContactForm />
      </main>
      <Footer />
      <NotificationToast />
      <ScrollToTop />
    </div>
  );
}
