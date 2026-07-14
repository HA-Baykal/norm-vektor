import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import BrandsCatalog from "./components/BrandsCatalog";
import DoubleGisWidget from "./components/DoubleGisWidget";  // ← добавьте эту строку
import ReviewModal from "./components/ReviewModal";

type CalculatorTab = "windows" | "conditioners" | "ventilation" | "drilling";
type PortfolioCategory = "all" | "windows" | "conditioners" | "ventilation" | "drilling";
type ConditionerArea = 20 | 30 | 40;

interface CalculatorState {
  windowType: "single" | "double" | "triple" | "balcony";
  windowsQuantity: number;
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
  { href: "#brands", label: "Бренды" },
  { href: "#portfolio", label: "Портфолио" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

const services = [
  {
    title: "Пластиковые окна",
    image: "images/service-windows.jpg",
    text: "Пластиковые окна в Иркутске от собственного производства. Профиль VEKA, фурнитура MACO с микропроветриванием. Обычные и панорамные окна ПВХ, остекление балконов и лоджий, крашеные окна и ламинация, двери, витражи, перегородки. Срок изготовления до 14 рабочих дней.",
    points: ["Собственное производство", "Профиль VEKA + MACO", "Гарантия на окна 3 года"],
  },
  {
    title: "Кондиционеры",
    image: "images/service-conditioner.jpg",
    text: "Кондиционеры в Иркутске: продажа и установка кондиционера за 1 день. Подберём кондиционер под площадь для квартиры, дома, офиса и коммерции. Обслуживание, чистка и заправка фреона. Гарантия от завода от 3 до 5 лет.",
    points: ["Купить и установить за 1 день", "Большой выбор моделей", "Сервис, чистка, фреон"],
  },
  {
    title: "Вентиляция",
    image: "images/service-ventilation.jpg",
    text: "Приточная и вытяжная вентиляция в Иркутске под ключ. Проектирование, монтаж воздуховодов, приточно-вытяжные системы, рекуператоры и бризеры Тион, Vakio для квартир, домов, кафе и офисов.",
    points: ["Проектирование", "Приточная и вытяжная", "Квартиры и бизнес"],
  },
  {
    title: "Алмазное бурение",
    image: "images/service-drilling.jpg",
    text: "Алмазное бурение отверстий в Иркутске в бетоне, железобетоне и кирпиче. Диаметр от 32 до 250 мм. Сухое бурение с пылесосом без пыли и мокрое с подачей воды — аккуратно, без трещин и сколов.",
    points: ["Без трещин и пыли", "Сухое и мокрое", "Под трубы и вентиляцию"],
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

const windowTypes = [
  { key: "single", label: "Одностворчатое", price: 7995 },
  { key: "double", label: "Двухстворчатое", price: 19255 },
  { key: "triple", label: "Трёхстворчатое", price: 22534 },
  { key: "balcony", label: "Балконная группа", price: 27642 },
] as const;

type WindowType = (typeof windowTypes)[number]["key"];

const windowSpecs = [
  "Профиль VEKA 62 мм, 4 камеры",
  "Фурнитура MACO с микропроветриванием",
  "Одна створка поворотно-откидная",
  "Стеклопакет 2-камерный энергосберегающий",
];

const conditionerPriceByArea: Record<ConditionerArea, { base: number; inverter: number }> = {
  20: { base: 42950, inverter: 10000 },
  30: { base: 46500, inverter: 8000 },
  40: { base: 55000, inverter: 7000 },
};

const portfolioFilters: Array<{ key: PortfolioCategory; label: string }> = [
  { key: "all", label: "Все" },
  { key: "windows", label: "Окна" },
  { key: "conditioners", label: "Кондиционеры" },
  { key: "ventilation", label: "Вентиляция" },
  { key: "drilling", label: "Бурение" },
];

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
    </svg>
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
          <a href="tel:+79149146606" className="text-sm font-bold text-[#1a3a5c] transition hover:text-[#ff6b35]">+7 (914) 914-66-06</a>
          <span className="h-4 w-px bg-slate-300" />
          <a href="tel:+73952669930" className="text-sm font-bold text-[#1a3a5c] transition hover:text-[#ff6b35]">66-99-30</a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a href="tel:+79149146606" className="hidden items-center gap-2 rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#e95620] md:inline-flex">
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
              <a href="tel:+79149146606" className="rounded-2xl bg-[#1a3a5c] px-4 py-3 text-center text-sm font-bold text-white">+7 (914) 914-66-06</a>
              <a href="tel:+73952669930" className="rounded-2xl bg-[#ff6b35] px-4 py-3 text-center text-sm font-bold text-white">66-99-30</a>
            </div>
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
          className="h-full w-full bg-transparent"
          imageClassName="object-cover object-left sm:object-center"
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
            href="tel:+79149146606"
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

function CountUp({ end, suffix = "", label, text }: { end?: number; suffix?: string; label: string; text?: string }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || started) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || end === undefined) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(end / 36));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        window.clearInterval(timer);
      }
      setValue(current);
    }, 28);
    return () => window.clearInterval(timer);
  }, [end, started]);

  return (
    <div ref={nodeRef} className="reveal border-b border-slate-200 px-4 py-6 text-center sm:border-b-0 sm:border-r sm:px-8 sm:py-7 last:border-0">
      <div className="text-3xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">{text ?? `${value}${suffix}`}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-sm sm:tracking-[0.18em]">{label}</div>
    </div>
  );
}

function Counters() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <CountUp end={10} suffix="+" label="лет опыта" />
        <CountUp end={500} suffix="+" label="проектов" />
        <CountUp text="4" label="направления" />
        <CountUp text="24/7" label="выезд" />
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Услуги" title="Кондиционеры, окна, вентиляция и бурение в Иркутске" text="Четыре направления в одной команде. Подберём решение, рассчитаем стоимость и выполним монтаж с гарантией. Бесплатный выезд и замер." /> 

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {services.map((service, index) => (
            <article key={service.title} className="reveal group overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10 sm:rounded-[2rem]" style={{ transitionDelay: `${index * 70}ms` }}>
              <PhotoSlot path={service.image} className="aspect-[4/3]" />
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-black text-[#1a3a5c] sm:text-xl">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.text}</p>
                <ul className="mt-5 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff6b35]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Calculator() {
  const [tab, setTab] = useState<CalculatorTab>("windows");
  const [calc, setCalc] = useState<CalculatorState>({
    windowType: "double",
    windowsQuantity: 1,
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
      const selected = windowTypes.find((item) => item.key === calc.windowType);
      return (selected?.price ?? 0) * calc.windowsQuantity;
    }

    if (tab === "conditioners") {
      const areaPrice = conditionerPriceByArea[calc.conditionerArea];
      const saleAndInstallPrice = areaPrice.base + (calc.conditionerInverter ? areaPrice.inverter : 0);
      const installOnlyPrice = 18000;
      const servicePrice = 5500;
      const price = calc.conditionerMode === "sale-install" ? saleAndInstallPrice : calc.conditionerMode === "install" ? installOnlyPrice : servicePrice;
      return calc.conditionerCount * price;
    }

    if (tab === "ventilation") {
      const typePrice = calc.ventType === "brizer" ? 38000 : calc.ventType === "recuperator" ? 52000 : 125000;
      return typePrice + calc.rooms * 6500;
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
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-center rounded-xl bg-slate-50 p-4">
                      <WindowShape type={calc.windowType} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {windowTypes.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCalc({ ...calc, windowType: item.key as WindowType })}
                          className={`rounded-xl px-3 py-3 text-xs font-black leading-5 transition sm:text-sm ${
                            calc.windowType === item.key
                              ? "bg-[#1a3a5c] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {item.label}
                          <span className="mt-1 block text-[11px] font-bold opacity-80">
                            {formatRub(item.price)}
                          </span>
                        </button>
                      ))}
                    </div>

                    <ul className="mt-4 space-y-1.5">
                      {windowSpecs.map((spec) => (
                        <li key={spec} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b35]" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <RangeField
                    label="Количество"
                    value={calc.windowsQuantity}
                    min={1}
                    max={12}
                    suffix="шт."
                    onChange={(value) => setCalc({ ...calc, windowsQuantity: value })}
                  />
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
                      { value: "install", label: "Только монтаж" },
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

function WindowShape({ type }: { type: WindowType }) {
  const frame = "#1a3a5c";
  const frameInner = "#2d587b";
  const glass = "#dbeafe";
  const glassShine = "#eff6ff";
  const handle = "#ff6b35";
  const dashed = "#ff6b35";
  const panel = "#e2e8f0";
  const className = "h-40 w-full sm:h-48";

  if (type === "single") {
    return (
      <svg viewBox="0 0 600 1000" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
        <rect x="0" y="0" width="600" height="1000" rx="6" fill="white" stroke={frame} strokeWidth="50" />
        <rect x="50" y="50" width="500" height="900" rx="3" fill="none" stroke={frameInner} strokeWidth="4" />
        <rect x="70" y="70" width="460" height="860" fill={glass} />
        <rect x="70" y="70" width="460" height="860" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M100 100 L200 100 L100 250 Z" fill={glassShine} opacity="0.7" />
        <path d="M110 110 L490 110 L300 890 Z" fill="none" stroke={dashed} strokeWidth="4" strokeDasharray="16 10" strokeLinejoin="round" />
        <rect x="498" y="470" width="10" height="70" rx="3" fill={handle} />
        <rect x="480" y="500" width="20" height="10" rx="2" fill={handle} />
      </svg>
    );
  }

  if (type === "double") {
    return (
      <svg viewBox="0 0 1500 1500" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
        <rect x="0" y="0" width="1500" height="1500" rx="6" fill="white" stroke={frame} strokeWidth="50" />
        <rect x="50" y="50" width="1400" height="1400" rx="3" fill="none" stroke={frameInner} strokeWidth="4" />
        <rect x="735" y="50" width="30" height="1400" fill={frame} />
        <rect x="70" y="70" width="650" height="1360" fill={glass} />
        <rect x="70" y="70" width="650" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M100 100 L250 100 L100 300 Z" fill={glassShine} opacity="0.7" />
        <rect x="780" y="70" width="650" height="1360" fill={glass} />
        <rect x="780" y="70" width="650" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M810 100 L960 100 L810 300 Z" fill={glassShine} opacity="0.7" />
        <path d="M820 110 L1390 110 L1105 1390 Z" fill="none" stroke={dashed} strokeWidth="5" strokeDasharray="20 12" strokeLinejoin="round" />
        <rect x="788" y="710" width="10" height="80" rx="3" fill={handle} />
        <rect x="770" y="745" width="20" height="10" rx="2" fill={handle} />
      </svg>
    );
  }

  if (type === "triple") {
    return (
      <svg viewBox="0 0 1800 1500" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
        <rect x="0" y="0" width="1800" height="1500" rx="6" fill="white" stroke={frame} strokeWidth="50" />
        <rect x="50" y="50" width="1700" height="1400" rx="3" fill="none" stroke={frameInner} strokeWidth="4" />
        <rect x="585" y="50" width="30" height="1400" fill={frame} />
        <rect x="1185" y="50" width="30" height="1400" fill={frame} />
        <rect x="70" y="70" width="500" height="1360" fill={glass} />
        <rect x="70" y="70" width="500" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M100 100 L220 100 L100 260 Z" fill={glassShine} opacity="0.7" />
        <rect x="630" y="70" width="540" height="1360" fill={glass} />
        <rect x="630" y="70" width="540" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M660 100 L780 100 L660 260 Z" fill={glassShine} opacity="0.7" />
        <path d="M670 110 L1130 110 L900 1390 Z" fill="none" stroke={dashed} strokeWidth="5" strokeDasharray="20 12" strokeLinejoin="round" />
        <rect x="638" y="710" width="10" height="80" rx="3" fill={handle} />
        <rect x="620" y="745" width="20" height="10" rx="2" fill={handle} />
        <rect x="1230" y="70" width="500" height="1360" fill={glass} />
        <rect x="1230" y="70" width="500" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
        <path d="M1260 100 L1380 100 L1260 260 Z" fill={glassShine} opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 2300 2200" preserveAspectRatio="xMidYMid meet" className={className} aria-hidden="true">
      {/* Пол / подоконник снизу */}
      <rect x="0" y="2100" width="2300" height="100" fill="#cbd5e1" />

      {/* ===== ДВЕРЬ слева 700×2100 ===== */}
      {/* Рама двери */}
      <rect x="0" y="0" width="700" height="2100" rx="6" fill="white" stroke={frame} strokeWidth="50" />
      <rect x="50" y="50" width="600" height="2000" rx="3" fill="none" stroke={frameInner} strokeWidth="4" />
      {/* Горизонтальный импост двери (снизу сендвич-панель 700мм) */}
      <rect x="50" y="1380" width="600" height="30" fill={frame} />
      {/* Верхнее стекло двери */}
      <rect x="70" y="70" width="560" height="1300" fill={glass} />
      <rect x="70" y="70" width="560" height="1300" fill="none" stroke={frameInner} strokeWidth="3" />
      <path d="M100 100 L230 100 L100 290 Z" fill={glassShine} opacity="0.7" />
      {/* Нижняя сендвич-панель двери */}
      <rect x="70" y="1420" width="560" height="610" fill={panel} />
      <rect x="70" y="1420" width="560" height="610" fill="none" stroke={frameInner} strokeWidth="3" />
      {/* Ручка двери */}
      <rect x="618" y="1000" width="10" height="110" rx="3" fill={handle} />
      <rect x="600" y="1050" width="20" height="10" rx="2" fill={handle} />

      {/* ===== ОКНО справа 1500×1500 (верх на уровне верха двери) ===== */}
      {/* Рама окна */}
      <rect x="800" y="0" width="1500" height="1500" rx="6" fill="white" stroke={frame} strokeWidth="50" />
      <rect x="850" y="50" width="1400" height="1400" rx="3" fill="none" stroke={frameInner} strokeWidth="4" />
      {/* Вертикальный импост окна посередине */}
      <rect x="1535" y="50" width="30" height="1400" fill={frame} />
      {/* Левая створка окна — глухая */}
      <rect x="870" y="70" width="650" height="1360" fill={glass} />
      <rect x="870" y="70" width="650" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
      <path d="M900 100 L1050 100 L900 300 Z" fill={glassShine} opacity="0.7" />
      {/* Правая створка окна — поворотно-откидная */}
      <rect x="1580" y="70" width="650" height="1360" fill={glass} />
      <rect x="1580" y="70" width="650" height="1360" fill="none" stroke={frameInner} strokeWidth="3" />
      <path d="M1610 100 L1760 100 L1610 300 Z" fill={glassShine} opacity="0.7" />
      <path d="M1620 110 L2190 110 L1905 1390 Z" fill="none" stroke={dashed} strokeWidth="5" strokeDasharray="20 12" strokeLinejoin="round" />
      {/* Ручка окна */}
      <rect x="1588" y="710" width="10" height="80" rx="3" fill={handle} />
      <rect x="1570" y="745" width="20" height="10" rx="2" fill={handle} />

      {/* ===== Подоконник под окном ===== */}
      <rect x="780" y="1500" width="1540" height="40" fill={frame} />
      {/* Простенок под окном (серая стена) */}
      <rect x="800" y="1540" width="1500" height="560" fill={panel} />
      <rect x="800" y="1540" width="1500" height="560" fill="none" stroke={frameInner} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

function RangeField({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">{label}</span>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#1a3a5c] shadow-sm">{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-[#ff6b35]" />
    </label>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-bold leading-6 text-slate-700 sm:text-base">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#ff6b35]" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 sm:text-base">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function Portfolio() {
  const [filter, setFilter] = useState<PortfolioCategory>("all");
  const [selected, setSelected] = useState<(typeof portfolioItems)[number] | null>(null);
  const filtered = filter === "all" ? portfolioItems : portfolioItems.filter((item) => item.category === filter);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <section id="portfolio" className="bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-8">
          <div className="max-w-3xl reveal">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Портфолио</p>
          </div>
          <div className="reveal flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {portfolioFilters.map((item) => (
              <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition ${filter === item.key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <button key={item.path} type="button" onClick={() => setSelected(item)} className="reveal group overflow-hidden rounded-[1.5rem] bg-white text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 sm:rounded-[1.75rem]" style={{ transitionDelay: `${index * 45}ms` }}>
              <PhotoSlot path={item.path} className="aspect-[4/3]" />
              <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
                <h3 className="text-sm font-black text-[#1a3a5c] sm:text-base">{item.title}</h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ff6b35] transition group-hover:bg-[#ff6b35] group-hover:text-white sm:h-10 sm:w-10">
                  <LineIcon name="arrow" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/80 px-3 pb-6 pt-20 backdrop-blur-sm sm:px-4 sm:pt-28" onClick={() => setSelected(null)}>
          <div className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
            <PhotoSlot path={selected.path} label={selected.title} className="aspect-[4/3] sm:aspect-[16/10]" />
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <h3 className="text-xl font-black text-[#1a3a5c] sm:text-2xl">{selected.title}</h3>
              <button type="button" onClick={() => setSelected(null)} className="w-full rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#122943] sm:w-auto">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Advantages() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Почему мы" title="Надёжный подрядчик для инженерных работ" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {advantages.map((item, index) => (
            <article key={item.title} className="reveal rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5 sm:rounded-[1.75rem] sm:p-7" style={{ transitionDelay: `${index * 60}ms` }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#ff6b35] sm:h-14 sm:w-14">
                <LineIcon name={item.icon} />
              </div>
              <h3 className="mt-5 text-lg font-black text-[#1a3a5c] sm:mt-6 sm:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);   // ← добавьте эту строку
  const review = reviews[active];
  const initials = review.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  const next = () => setActive((value) => (value + 1) % reviews.length);
  const prev = () => setActive((value) => (value - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="bg-[#1a3a5c] py-14 text-white sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-10">
          <div className="reveal">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200 sm:text-sm sm:tracking-[0.2em]">Отзывы клиентов</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">Нам доверяют дома и бизнес</h2>
            <button type="button" onClick={() => setReviewOpen(true)} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620] sm:mt-8 sm:w-auto">
              Оставить отзыв
              <LineIcon name="chat" />
            </button>
          </div>
          <div className="reveal rounded-[1.5rem] bg-white p-5 text-slate-900 shadow-2xl shadow-slate-950/25 sm:rounded-[2rem] sm:p-8">
            <div className="flex items-center gap-4">
              <AvatarPhoto path={review.photo} initials={initials} />
              <div>
                <h3 className="text-lg font-black text-[#1a3a5c] sm:text-xl">{review.name}</h3>
                <p className="text-sm font-semibold text-slate-500">{review.city} · {review.service}</p>
              </div>
            </div>
            <blockquote className="mt-6 text-base font-semibold leading-7 text-slate-700 sm:mt-8 sm:text-xl sm:leading-9">«{review.text}»</blockquote>
            <div className="mt-6 flex flex-col justify-between gap-4 sm:mt-8 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {reviews.map((item, index) => (
                  <button key={item.name} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-[#ff6b35]" : "w-2.5 bg-slate-300"}`} aria-label={`Отзыв ${index + 1}`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button type="button" onClick={prev} className="w-full rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#1a3a5c] transition hover:bg-slate-50 sm:w-auto">Назад</button>
                <button type="button" onClick={next} className="w-full rounded-full bg-[#1a3a5c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#122943] sm:w-auto">Далее</button>
              </div>
            </div>
          </div>
        </div>
      </div>
              {/* Виджет 2ГИС с рейтингом и отзывами */}
        <div className="mt-10 sm:mt-14">
          <div className="mb-6 text-center reveal">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200 sm:text-sm">
              Наш рейтинг на 2ГИС
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Реальные отзывы клиентов
            </h3>
          </div>
          <div className="mx-auto max-w-xl reveal">
            <DoubleGisWidget />
          </div>
        </div>
      <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </section>
  );
}


function MapSection() {
  return (
    <section id="map" className="bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Карта" title="Зона обслуживания до 50 км" text="Работаем в Иркутске, Молодежном, Пивоварихе, Ангарске, Шелехове, Хомутово и пригороде." />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5 sm:rounded-[2rem]">
            <iframe
              title="Карта зоны обслуживания Вектор Комфорта"
              src={
                "https://yandex.ru/map-widget/v1/?ll=104.296873%2C52.286974&z=10&pt=" +
                "104.296873,52.286974,pm2rdm~" +
                "104.145000,52.543000,pm2blm~" +
                "104.098000,52.210000,pm2blm~" +
                "104.200000,52.340000,pm2blm~" +
                "104.452778,52.272222,pm2blm~" +
                "104.415000,52.228610,pm2rdm"
              }
              className="h-[340px] w-full sm:h-[460px]"
              frameBorder="0"
            />
          </div>

          <div className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Иркутск", "основная зона выезда"],
              ["Молодёжный", "выезд по маршруту"],
              ["Пивовариха", "выезд по маршруту"],
              ["Ангарск", "до 50 км"],
              ["Шелехов", "быстрый выезд"],
              ["Хомутово", "частый маршрут"],
              ["Пригород", "по согласованию"],
            ].map(([city, text]) => (
              <div key={city} className="rounded-2xl bg-white p-4 shadow-lg shadow-slate-900/5 sm:p-5">
                <div className="text-base font-black text-[#1a3a5c] sm:text-lg">{city}</div>
                <div className="mt-1 text-sm font-semibold text-slate-500">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col justify-between gap-6 rounded-[1.5rem] bg-[#1a3a5c] p-5 text-white shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] sm:p-8 md:flex-row md:items-center md:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-200 sm:text-sm sm:tracking-[0.2em]">Онлайн-чат Jivo</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-4xl">Напишите нам в чат</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">Ответим на вопрос, подскажем по услуге и поможем оставить заявку без CRM и лишних сервисов.</p>
          </div>
          <button type="button" onClick={openJivoChat} className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-7 py-4 text-sm font-black text-white transition hover:bg-[#e95620] sm:w-auto">
            Написать в чат
            <LineIcon name="chat" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [form, setForm] = useState({ name: "", phone: "", service: "Окна и остекление", message: "", consent: true });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestRecaptchaToken("lead_form");
    window.jivo_api?.setCustomData?.([
      { title: "Имя", content: form.name },
      { title: "Телефон", content: form.phone },
      { title: "Услуга", content: form.service },
      { title: "Сообщение", content: form.message || "Не указано" },
    ]);
    setStatus("sent");
    window.jivo_api?.open?.();
  };

  return (
    <section id="contacts" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8">
        <div className="reveal">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Контакты</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">Оставьте заявку или позвоните</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">Перезвоним, уточним задачу и подготовим предварительный расчёт.</p>
          <div className="mt-6 space-y-3 sm:mt-8">
            <a href="tel:+79149146606" className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-black text-[#1a3a5c] transition hover:bg-orange-50 hover:text-[#ff6b35] sm:gap-4 sm:p-5 sm:text-base"><LineIcon name="phone" /> +7 (914) 914-66-06</a>
            <a href="tel:+73952669930" className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-black text-[#1a3a5c] transition hover:bg-orange-50 hover:text-[#ff6b35] sm:gap-4 sm:p-5 sm:text-base"><LineIcon name="phone" /> 66-99-30</a>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href="https://wa.me/79247116610"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3 text-sm font-black text-white transition hover:bg-[#1ebd5c]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOI5ldFKekwE_KM4jdDm8tReQpj7iGpqPxHBgROGT5syyP8nDwY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#005BFF] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0049d6]"
            >
              MAX
            </a>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 text-slate-700 sm:mt-8 sm:rounded-[2rem] sm:p-6">
            <h3 className="text-lg font-black text-[#1a3a5c] sm:text-xl">Города</h3>
            <p className="mt-3 text-sm leading-7 sm:text-base">Иркутск, Ангарск, Шелехов, Хомутово и пригород до 50 км. Режим работы: ежедневно с 9:00 до 20:00, срочные выезды по договорённости.</p>
          </div>
        </div>

        <form onSubmit={submit} className="reveal rounded-[1.5rem] bg-slate-50 p-4 shadow-xl shadow-slate-900/5 sm:rounded-[2rem] sm:p-8">
          {status === "sent" ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center sm:min-h-[420px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-[#ff6b35]">
                <LineIcon name="doc" />
              </div>
              <h3 className="mt-6 text-2xl font-black text-[#1a3a5c]">Заявка подготовлена</h3>
              <p className="mt-3 max-w-md text-slate-600">Мы получили данные на странице. Если Jivo-чат загрузился, он откроется автоматически для продолжения диалога.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-7 rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white">Отправить ещё одну</button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Имя" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="Ваше имя" required />
              <Input label="Телефон" type="tel" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} placeholder="+7 (___) ___-__-__" required />
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">Выбор услуги</span>
                <select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 sm:text-base">
                  <option>Окна и остекление</option>
                  <option>Кондиционеры</option>
                  <option>Вентиляция</option>
                  <option>Алмазное бурение</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">Сообщение</span>
                <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Опишите задачу, объект или удобное время звонка" rows={5} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 sm:text-base" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600">
                <input type="checkbox" required checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-1 h-4 w-4 shrink-0 accent-[#ff6b35]" />
                <span>Согласен на обработку персональных данных.</span>
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-7 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e95620]">
                Отправить заявку
                <LineIcon name="arrow" />
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 sm:text-base" />
    </label>
  );
}

function Footer() {
  return (
    <footer className="bg-[#10263d] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-10 lg:px-8 lg:py-12">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="text-lg font-black">Вектор Комфорта</div>
              <div className="text-xs font-semibold text-slate-300">Комфорт в каждом направлении</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">Окна, кондиционеры, вентиляция и алмазное бурение для Иркутска, Ангарска, Шелехова, Хомутово и пригорода до 50 км.</p>
        </div>
        <div>
          <h3 className="font-black">Навигация</h3>
          <div className="mt-4 grid gap-2">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-slate-300 transition hover:text-[#ff6b35]">{item.label}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black">Контакты</h3>
          <div className="mt-4 grid gap-2 text-slate-300">
            <a href="tel:+79149146606" className="transition hover:text-[#ff6b35]">+7 (914) 914-66-06</a>
            <a href="tel:+73952669930" className="transition hover:text-[#ff6b35]">66-99-30</a>
            <span>Ежедневно 9:00-20:00</span>
            <span>Иркутск и пригород до 50 км</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-slate-400">© {new Date().getFullYear()} Вектор Комфорта. Все права защищены.</div>
    </footer>
  );
}

function FloatingMessengers() {
  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:left-6">
      <a
        href="https://wa.me/79247116610"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-600/30 transition hover:-translate-y-1 hover:bg-[#1ebd5c] sm:h-14 sm:w-14"
      >
        <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <a
        href="https://max.ru/u/f9LHodD0cOI5ldFKekwE_KM4jdDm8tReQpj7iGpqPxHBgROGT5syyP8nDwY"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в MAX"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#005BFF] text-white shadow-xl shadow-blue-600/30 transition hover:-translate-y-1 hover:bg-[#0049d6] sm:h-14 sm:w-14"
      >
        <span className="text-xs font-black tracking-tight sm:text-sm">MAX</span>
      </a>
    </div>
  );
}

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
        <Calculator />
        <BrandsCatalog />
        <Portfolio />
        <Advantages />
        <Reviews />
        <MapSection />
        <ChatSection />
        <ContactForm />
      </main>
      <Footer />
      <FloatingMessengers />
    </div>
  );
}
