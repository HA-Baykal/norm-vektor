import { FormEvent, useEffect, useMemo, useState } from "react";

type CalculatorTab = "windows" | "conditioners" | "ventilation" | "drilling";
type PortfolioCategory = "all" | "windows" | "conditioners" | "ventilation" | "drilling";

interface CalculatorState {
  windowsCount: number;
  balcony: boolean;
  conditionerCount: number;
  conditionerMode: "sale-install" | "install" | "service";
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

function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
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
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

      {(!loaded || failed) && !hidePlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-200 px-4 text-center text-slate-500">
          <div className="h-10 w-10 rounded-full border-2 border-dashed border-slate-400" />
          <span className="text-sm font-semibold">Вставьте фото: {path}</span>
          <span className="text-xs">Поддерживаются .jpg, .jpeg, .png</span>
        </div>
      )}
    </div>
  );
}

function AvatarPhoto({ path, initials }: { path: string; initials: string }) {
  const candidates = useMemo(() => candidatePaths(path), [path]);
  const [current, setCurrent] = useState(0);
  const failed = current >= candidates.length;

  if (failed) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1a3a5c] text-sm font-black text-white">
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
      className="h-14 w-14 shrink-0 rounded-full object-cover"
    />
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-lg shadow-slate-900/5 backdrop-blur-xl" : "bg-white/75 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Вектор Комфорта">
          <LogoMark />
          <div className="leading-tight">
            <div className="text-lg font-black tracking-tight text-[#1a3a5c]">Вектор Комфорта</div>
            <div className="text-xs font-medium text-slate-500">Комфорт в каждом направлении</div>
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

        <div className="flex items-center gap-2">
          <a href="tel:+79149146606" className="hidden items-center gap-2 rounded-full bg-[#ff6b35] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#e95620] sm:inline-flex">
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
            <div className="mt-2 grid grid-cols-2 gap-2">
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
    <section id="top" className="relative flex min-h-[760px] items-center overflow-hidden bg-[#10263d] pt-24 text-white">
      <div className="absolute inset-0 opacity-105">
        <PhotoSlot path="images/hero-bg.jpg" hidePlaceholder className="h-full w-full bg-transparent" imageClassName="object-cover" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(16,38,61,0.78)_0%,rgba(26,58,92,0.58)_48%,rgba(16,38,61,0.25)_100%)]" />
      <div className="absolute inset-0 soft-grid" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-3xl reveal">
          
          <div className="mt-130 flex flex-col gap-3 sm:mt-56 sm:flex-row lg:mt-142">
            <a href="#calculator" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-7 py-4 text-base font-black text-white shadow-2xl shadow-orange-500/25 transition hover:-translate-y-1 hover:bg-[#e95620]">
              Рассчитать стоимость
              <LineIcon name="arrow" />
            </a>
            <a href="tel:+79149146606" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-base font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
              Позвонить
              <LineIcon name="phone" />
            </a>
          </div>
        </div>

        <div className="flex items-end justify-start lg:justify-end reveal">
          <div className="max-w-md border-l-4 border-[#ff6b35] pl-6 text-slate-100">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-200">Фон Hero</p>
            <p className="mt-3 text-lg leading-7">Чтобы добавить фото объекта в первый экран, загрузите файл в папку public/images с именем hero-bg.jpg. Путь на сайте: images/hero-bg.jpg.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ end, suffix = "", label, text }: { end?: number; suffix?: string; label: string; text?: string }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

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
    <div className="reveal border-b border-slate-200 py-7 sm:border-b-0 sm:border-r sm:px-8 last:border-0" ref={(node) => {
      if (!node || started) return;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(node);
    }}>
      <div className="text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">{text ?? `${value}${suffix}`}</div>
      <div className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div>
    </div>
  );
}

function Counters() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
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
    <section id="services" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl reveal">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Услуги</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Комплексные работы для комфорта и инженерии</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Подберём решение, рассчитаем смету и выполним монтаж с гарантией. Фото в карточках можно заменить своими файлами в папке images.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {services.map((service, index) => (
            <article key={service.title} className="reveal group overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10" style={{ transitionDelay: `${index * 70}ms` }}>
              <PhotoSlot path={service.image} className="aspect-[4/3]" />
              <div className="p-6">
                <h3 className="text-xl font-black text-[#1a3a5c]">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.text}</p>
                <ul className="mt-5 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-[#ff6b35]" />
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
    windowsCount: 3,
    balcony: false,
    conditionerCount: 1,
    conditionerMode: "sale-install",
    rooms: 2,
    ventType: "brizer",
    holes: 2,
    diameter: 132,
    dryMethod: true,
  });

  const estimate = useMemo(() => {
    if (tab === "windows") return calc.windowsCount * 18000 + (calc.balcony ? 42000 : 0);
    if (tab === "conditioners") {
      const price = calc.conditionerMode === "sale-install" ? 46000 : calc.conditionerMode === "install" ? 16000 : 4500;
      return calc.conditionerCount * price;
    }
    if (tab === "ventilation") {
      const typePrice = calc.ventType === "brizer" ? 38000 : calc.ventType === "recuperator" ? 52000 : 125000;
      return typePrice + calc.rooms * 6500;
    }
    const diameterPrice = calc.diameter <= 80 ? 1300 : calc.diameter <= 132 ? 2200 : calc.diameter <= 160 ? 2900 : 4800;
    return calc.holes * (diameterPrice + (calc.dryMethod ? 700 : 0));
  }, [calc, tab]);

  const requestLead = () => {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="calculator" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="reveal">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Калькулятор</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Предварительный расчёт стоимости</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Стоимость меняется в реальном времени. Итоговая цена зависит от замера, материала, сложности монтажа и выбранного оборудования.</p>
            <div className="mt-8 rounded-[2rem] bg-[#1a3a5c] p-7 text-white shadow-2xl shadow-slate-900/15">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-orange-200">Ориентир</div>
              <div className="mt-3 text-4xl font-black sm:text-5xl">{formatRub(estimate)}</div>
              <p className="mt-4 text-sm leading-6 text-slate-200">Это быстрый расчёт для понимания бюджета. Точную смету подготовим после уточнения деталей.</p>
              <button type="button" onClick={requestLead} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620] sm:w-auto">
                Оставить заявку
                <LineIcon name="arrow" />
              </button>
            </div>
          </div>

          <div className="reveal rounded-[2rem] bg-slate-50 p-4 shadow-xl shadow-slate-900/5 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(calculatorLabels) as CalculatorTab[]).map((key) => (
                <button key={key} type="button" onClick={() => setTab(key)} className={`rounded-2xl px-4 py-3 text-sm font-black transition ${tab === key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                  {calculatorLabels[key]}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-7">
              {tab === "windows" && (
                <>
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
                      { value: "install", label: "Только монтаж" },
                      { value: "service", label: "Обслуживание / чистка / фреон" },
                    ]}
                    onChange={(value) => setCalc({ ...calc, conditionerMode: value as CalculatorState["conditionerMode"] })}
                  />
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

function RangeField({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#1a3a5c] shadow-sm">{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full cursor-pointer accent-[#ff6b35]" />
    </label>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-[#ff6b35]" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100">
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
    <section id="portfolio" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl reveal">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Портфолио</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Галерея работ с готовыми путями для фото</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Замените файлы в public/images/portfolio, и изображения появятся на сайте автоматически.</p>
          </div>
          <div className="reveal flex flex-wrap gap-2">
            {portfolioFilters.map((item) => (
              <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`rounded-full px-5 py-3 text-sm font-black transition ${filter === item.key ? "bg-[#1a3a5c] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <button key={item.path} type="button" onClick={() => setSelected(item)} className="reveal group overflow-hidden rounded-[1.75rem] bg-white text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10" style={{ transitionDelay: `${index * 45}ms` }}>
              <PhotoSlot path={item.path} className="aspect-[4/3]" />
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <h3 className="font-black text-[#1a3a5c]">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.path}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ff6b35] transition group-hover:bg-[#ff6b35] group-hover:text-white">
                  <LineIcon name="arrow" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <PhotoSlot path={selected.path} label={selected.title} className="aspect-[16/10]" />
            <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-2xl font-black text-[#1a3a5c]">{selected.title}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selected.path}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full bg-[#1a3a5c] px-6 py-3 text-sm font-black text-white transition hover:bg-[#122943]">
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
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl reveal">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Почему мы</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Надёжный подрядчик для инженерных работ</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, index) => (
            <article key={item.title} className="reveal rounded-[1.75rem] border border-slate-200 bg-white p-7 transition hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5" style={{ transitionDelay: `${index * 60}ms` }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#ff6b35]">
                <LineIcon name={item.icon} />
              </div>
              <h3 className="mt-6 text-xl font-black text-[#1a3a5c]">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [active, setActive] = useState(0);
  const review = reviews[active];
  const initials = review.name.split(" ").map((part) => part[0]).join("").slice(0, 2);

  const next = () => setActive((value) => (value + 1) % reviews.length);
  const prev = () => setActive((value) => (value - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="bg-[#1a3a5c] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="reveal">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-200">Отзывы клиентов</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Нам доверяют дома и бизнес</h2>
            <p className="mt-5 text-lg leading-8 text-slate-200">Фото клиентов можно добавить в public/images/clients. Если фото нет, показываются инициалы.</p>
            <button type="button" onClick={openJivoChat} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620]">
              Оставить отзыв
              <LineIcon name="chat" />
            </button>
          </div>

          <div className="reveal rounded-[2rem] bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/25 sm:p-8">
            <div className="flex items-center gap-4">
              <AvatarPhoto path={review.photo} initials={initials} />
              <div>
                <h3 className="text-xl font-black text-[#1a3a5c]">{review.name}</h3>
                <p className="text-sm font-semibold text-slate-500">{review.city} · {review.service}</p>
              </div>
            </div>
            <blockquote className="mt-8 text-xl font-semibold leading-9 text-slate-700">«{review.text}»</blockquote>
            <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {reviews.map((item, index) => (
                  <button key={item.name} type="button" onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-[#ff6b35]" : "w-2.5 bg-slate-300"}`} aria-label={`Отзыв ${index + 1}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prev} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#1a3a5c] transition hover:bg-slate-50">Назад</button>
                <button type="button" onClick={next} className="rounded-full bg-[#1a3a5c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#122943]">Далее</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section id="map" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl reveal">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Карта</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Зона обслуживания до 50 км</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Работаем в Иркутске, Ангарске, Шелехове, Хомутово и пригороде.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/5">
            <iframe title="Карта зоны обслуживания Вектор Комфорта" src="https://yandex.ru/map-widget/v1/?ll=104.296873%2C52.286974&z=10&pt=104.296873,52.286974,pm2rdm~104.145000,52.543000,pm2blm~104.098000,52.210000,pm2blm~104.200000,52.340000,pm2blm" width="100%" height="460" frameBorder="0" />
          </div>
          <div className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Иркутск", "основная зона выезда"],
              ["Ангарск", "до 50 км"],
              ["Шелехов", "быстрый выезд"],
              ["Хомутово", "частый маршрут"],
              ["Пригород", "по согласованию"],
            ].map(([city, text]) => (
              <div key={city} className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <div className="text-lg font-black text-[#1a3a5c]">{city}</div>
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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col justify-between gap-6 rounded-[2rem] bg-[#1a3a5c] p-8 text-white shadow-2xl shadow-slate-900/15 md:flex-row md:items-center md:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-200">Онлайн-чат Jivo</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Напишите нам в чат</h2>
            <p className="mt-3 max-w-2xl text-slate-200">Ответим на вопрос, подскажем по услуге и поможем оставить заявку без CRM и лишних сервисов.</p>
          </div>
          <button type="button" onClick={openJivoChat} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff6b35] px-7 py-4 text-sm font-black text-white transition hover:bg-[#e95620]">
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
    <section id="contacts" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="reveal">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ff6b35]">Контакты</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#1a3a5c] sm:text-5xl">Оставьте заявку или позвоните</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Перезвоним, уточним задачу и подготовим предварительный расчёт. Заявка также передаётся в Jivo-чат, если виджет уже загружен.</p>
          <div className="mt-8 space-y-3">
            <a href="tel:+79149146606" className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 font-black text-[#1a3a5c] transition hover:bg-orange-50 hover:text-[#ff6b35]"><LineIcon name="phone" /> +7 (914) 914-66-06</a>
            <a href="tel:+73952669930" className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 font-black text-[#1a3a5c] transition hover:bg-orange-50 hover:text-[#ff6b35]"><LineIcon name="phone" /> 66-99-30</a>
          </div>
          <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-slate-700">
            <h3 className="text-xl font-black text-[#1a3a5c]">Города</h3>
            <p className="mt-3 leading-7">Иркутск, Ангарск, Шелехов, Хомутово и пригород до 50 км. Режим работы: ежедневно с 9:00 до 20:00, срочные выезды по договорённости.</p>
          </div>
        </div>

        <form onSubmit={submit} className="reveal rounded-[2rem] bg-slate-50 p-5 shadow-xl shadow-slate-900/5 sm:p-8">
          {status === "sent" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
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
                <span className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-slate-500">Выбор услуги</span>
                <select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100">
                  <option>Окна и остекление</option>
                  <option>Кондиционеры</option>
                  <option>Вентиляция</option>
                  <option>Алмазное бурение</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-slate-500">Сообщение</span>
                <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Опишите задачу, объект или удобное время звонка" rows={5} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 font-medium text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600">
                <input type="checkbox" required checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} className="mt-1 h-4 w-4 accent-[#ff6b35]" />
                <span>Согласен на обработку персональных данных. reCAPTCHA v3 поддерживается: добавьте site key в meta-тег recaptcha-site-key.</span>
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
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100" />
    </label>
  );
}

function Footer() {
  return (
    <footer className="bg-[#10263d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="text-lg font-black">Вектор Комфорта</div>
              <div className="text-xs font-semibold text-slate-300">Комфорт в каждом направлении</div>
            </div>
          </div>
          <p className="mt-5 max-w-md leading-7 text-slate-300">Окна, кондиционеры, вентиляция и алмазное бурение для Иркутска, Ангарска, Шелехова, Хомутово и пригорода до 50 км.</p>
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
      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">© {new Date().getFullYear()} Вектор Комфорта. Все права защищены.</div>
    </footer>
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <Counters />
        <ServicesSection />
        <Calculator />
        <Portfolio />
        <Advantages />
        <Reviews />
        <MapSection />
        <ChatSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
