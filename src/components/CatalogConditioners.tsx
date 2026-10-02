import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigationType } from "react-router-dom";
import QuickBookingModal from "./QuickBookingModal";
import { getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";
import { useCompare } from "../utils/useCompare";

// Данные каталога лежат в src/data/conditioners.ts — оттуда же их берёт
// сборка: серверная база Vercel и карта сайта. Здесь только реэкспорт, чтобы
// остальные модули продолжали импортировать привычные имена.
import { INSTALL_PRICE, conditioners } from "../data/conditioners";
import type { Conditioner, PowerVariant } from "../data/conditioners";

export { INSTALL_PRICE, conditioners };
export type { Conditioner, PowerVariant };

export const AREA_TO_BTU: Record<string, number> = {
  "20": 7000, "25": 9000, "35": 12000, "50": 18000,
  "60": 24000, "80": 30000, "100": 36000, "140": 48000, "180": 60000,
};

export function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}
// Автоматически генерирует описание и особенности модели по её данным
export function getDescription(item: Conditioner): { intro: string; features: string[] } {
  const isMobile = item.type === "Мобильный";
  const isInverter = item.type === "Инверторный";
  const isCassette = item.type === "Полупромышленный";

  let intro = "";
  if (isMobile) {
    intro = `${item.name} — мобильный кондиционер-моноблок ${item.brand}. Его можно перемещать между комнатами и сразу подключать к обычной розетке 220 В. Стационарный монтаж не требуется.`;
  } else if (isCassette) {
    intro = `${item.name} — полупромышленная кассетная сплит-система ${item.brand}. Идеально подходит для офисов, магазинов, кафе и просторных помещений. Равномерно распределяет воздух по всем направлениям благодаря потолочному расположению.`;
  } else if (isInverter) {
    intro = `${item.name} — инверторная сплит-система ${item.brand}. Плавно регулирует мощность, поддерживая ровную температуру без перепадов. Экономит до 40% электроэнергии, работает тихо и служит дольше обычных моделей.`;
  } else {
    intro = `${item.name} — надёжная сплит-система ${item.brand} для дома, квартиры и офиса. Простое и доступное решение для охлаждения и обогрева помещения с хорошим соотношением цена-качество.`;
  }

  const features: string[] = [];
  features.push(isMobile ? "Охлаждение без наружного блока" : "Режимы охлаждения и обогрева");
  if (isMobile) {
    features.push("Стационарный монтаж не требуется");
    features.push("Подключение к обычной розетке 220 В");
    features.push("Колёсики для перемещения между комнатами");
  } else if (isInverter) {
    features.push("Инверторный компрессор — экономия электроэнергии");
    features.push("Тихая работа без резких включений");
    features.push("Плавное поддержание температуры");
    features.push("Работа на обогрев при низких температурах");
  } else {
    features.push("Проверенная технология, доступная цена");
    features.push("Простое управление с пульта");
  }
  if (item.smartHome) {
    features.push("Управление со смартфона и через умный дом (Алиса, Маруся)");
  }
  if (isCassette) {
    features.push("Потолочный монтаж, равномерный обдув 360°");
    features.push("Для коммерческих и больших помещений");
  }
  features.push("Режимы: авто, осушение, вентиляция, сон");
  features.push("Многоступенчатая фильтрация воздуха");
  features.push("Ночной режим для комфортного сна");
  features.push("Авторестарт после отключения электричества");
  features.push(isMobile ? "Официальная гарантия производителя" : "Официальная гарантия и профессиональный монтаж");

  return { intro, features };
}

export const ITEMS_PER_PAGE = 12;

export default function CatalogConditioners() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация фильтров из URL search params или sessionStorage
  const initialPage = parseInt(searchParams.get("page") || sessionStorage.getItem("catalog_last_page") || "1", 10) || 1;
  const initialBrand = searchParams.get("brand") || "all";
  const initialArea = searchParams.get("area") || "all";
  const initialType = searchParams.get("type") || "all";
  const initialSmart = searchParams.get("smart") || "all";
  const initialSort = searchParams.get("sort") || "default";
  const initialSearch = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [area, setArea] = useState<string>(initialArea);
  const [type, setType] = useState<string>(initialType);
  const [smart, setSmart] = useState<string>(initialSmart);
  const [sort, setSort] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [orderServiceName, setOrderServiceName] = useState("Заказ кондиционера");
  const [orderCalcDetails, setOrderCalcDetails] = useState("");
  const compare = useCompare();

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(conditioners.map((c) => c.brand)))],
    []
  );

  const minPrice = (c: Conditioner) => Math.min(...c.variants.map((v) => v.price));

  const filtered = useMemo(() => {
    let result = conditioners.filter((c) => {
      const okSearch = search.trim() === "" || c.name.toLowerCase().includes(search.toLowerCase().trim()) || c.brand.toLowerCase().includes(search.toLowerCase().trim());
      const okBrand = brand === "all" || c.brand === brand;
      const okType = type === "all" || c.type === type;
      const okSmart = smart === "all" || (smart === "yes" ? c.smartHome : !c.smartHome);
      const okArea = area === "all" || c.variants.some((v) => v.btu === AREA_TO_BTU[area]);
      return okSearch && okBrand && okType && okSmart && okArea;
    });
    if (sort === "price-asc") result = [...result].sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "price-desc") result = [...result].sort((a, b) => minPrice(b) - minPrice(a));
    return result;
  }, [search, brand, area, type, smart, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Синхронизация фильтров и страницы в URL
  const updateUrlParams = (newPage: number, newBrand = brand, newArea = area, newType = type, newSmart = smart, newSort = sort, newSearch = search) => {
    const params: Record<string, string> = {};
    if (newPage > 1) params.page = String(newPage);
    if (newBrand !== "all") params.brand = newBrand;
    if (newArea !== "all") params.area = newArea;
    if (newType !== "all") params.type = newType;
    if (newSmart !== "all") params.smart = newSmart;
    if (newSort !== "default") params.sort = newSort;
    if (newSearch.trim() !== "") params.q = newSearch.trim();

    setSearchParams(params, { replace: true });
    sessionStorage.setItem("catalog_last_page", String(newPage));
  };

  const handleFilterChange = (setter: (val: string) => void, paramName: string, value: string) => {
    setter(value);
    setCurrentPage(1);
    const updated = {
      brand: paramName === "brand" ? value : brand,
      area: paramName === "area" ? value : area,
      type: paramName === "type" ? value : type,
      smart: paramName === "smart" ? value : smart,
      sort: paramName === "sort" ? value : sort,
      search: paramName === "search" ? value : search,
    };
    updateUrlParams(1, updated.brand, updated.area, updated.type, updated.smart, updated.sort, updated.search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page);
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Возврат к последней просмотренной карточке:
  // - при POP (назад/вперёд) только подсвечиваем карточку и не скроллим страницу (скролл восстанавливает ScrollToTop);
  // - при обычном возврате в каталог по ссылке — плавно подводим к карточке;
  // - catalog_last_card_id не удаляем раньше времени, пока карточка реально не появилась в DOM;
  // - эффект зависит от актуальных данных каталога.
  const navigationType = useNavigationType();
  useEffect(() => {
    const targetCardId = sessionStorage.getItem("catalog_last_card_id");
    if (!targetCardId) return;

    const isPop = navigationType === "POP";
    let rafId = 0;
    let attempts = 0;
    let highlightTimer: number | undefined;
    let initialTimer: number | undefined;

    const tryFind = () => {
      const el = document.getElementById(`card-${targetCardId}`);
      if (el) {
        if (!isPop) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        el.classList.add("ring-4", "ring-[#ff6b35]", "ring-offset-4");
        highlightTimer = window.setTimeout(() => {
          el.classList.remove("ring-4", "ring-[#ff6b35]", "ring-offset-4");
        }, 2500);
        sessionStorage.removeItem("catalog_last_card_id");
      } else if (attempts++ < 60) {
        rafId = requestAnimationFrame(tryFind);
      }
    };

    initialTimer = window.setTimeout(tryFind, 80);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (highlightTimer) clearTimeout(highlightTimer);
    };
  }, [filtered, navigationType]);

  const visible = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  const handleOrderCard = (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => {
    const variant = item.variants.find((v) => v.btu === btu) || item.variants[0];
    const isMobile = item.type === "Мобильный";
    const isInstallOnRequest = item.type === "Полупромышленный" || item.type === "Промышленный";
    const installPart = isMobile
      ? ""
      : isInstallOnRequest
        ? ", Монтаж: рассчитывается после осмотра объекта"
        : `, Монтаж (+18 000 ₽): ${withInstall ? "Да" : "Нет"}`;
    const details = `Модель: ${item.name} (${item.brand}), Мощность: ${btu} BTU (до ${variant.area} м²)${installPart}, Итоговая цена: ${formatRub(totalPrice)}`;

    setOrderServiceName(`Заказ кондиционера: ${item.name}`);
    setOrderCalcDetails(details);
    setBookingModalOpen(true);
  };

  const handleCardClick = (cardId: number) => {
    sessionStorage.setItem("catalog_last_card_id", String(cardId));
    sessionStorage.setItem("catalog_last_page", String(safeCurrentPage));
    if (window.scrollY > 0) {
      sessionStorage.setItem("catalog_scroll_pos", String(Math.round(window.scrollY)));
    }
  };

  const selectClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100";

  return (
    <section id="catalog" className="bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Каталог</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">Каталог кондиционеров в Иркутске</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Выберите модель по названию, бренду или площади помещения. Стоимость стандартного монтажа под ключ можно отметить галочкой.</p>
        </div>

        <div className="mt-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(setSearch, "search", e.target.value)}
              placeholder="🔍 Быстрый поиск по названию или бренду..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold shadow-sm focus:outline-none focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 pr-10"
            />
            {search && (
              <button
                onClick={() => handleFilterChange(setSearch, "search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-[1.5rem] bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Бренд</span>
            <select value={brand} onChange={(e) => handleFilterChange(setBrand, "brand", e.target.value)} className={selectClass}>
              {brands.map((b) => (<option key={b} value={b}>{b === "all" ? "Все бренды" : b}</option>))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Площадь</span>
            <select value={area} onChange={(e) => handleFilterChange(setArea, "area", e.target.value)} className={selectClass}>
              <option value="all">Любая площадь</option>
              <option value="20">до 20 м²</option>
              <option value="25">до 25 м²</option>
              <option value="35">до 35 м²</option>
              <option value="50">до 50 м²</option>
              <option value="60">до 60 м²</option>
              <option value="80">до 80 м²</option>
              <option value="100">до 100 м²</option>
              <option value="140">до 140 м²</option>
              <option value="180">до 180 м²</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Тип</span>
            <select value={type} onChange={(e) => handleFilterChange(setType, "type", e.target.value)} className={selectClass}>
              <option value="all">Все типы</option>
              <option value="Инверторный">Инверторный</option>
              <option value="Обычный">Обычный</option>
              <option value="Полупромышленный">Полупромышленные (кассетные)</option>
              <option value="Мобильный">Мобильные кондиционеры</option>
              <option value="Промышленный">Промышленные (моноблоки)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Умный дом</span>
            <select value={smart} onChange={(e) => handleFilterChange(setSmart, "smart", e.target.value)} className={selectClass}>
              <option value="all">Не важно</option>
              <option value="yes">С умным домом</option>
              <option value="no">Без умного дома</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Сортировка</span>
            <select value={sort} onChange={(e) => handleFilterChange(setSort, "sort", e.target.value)} className={selectClass}>
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-slate-500">
          <div>Найдено моделей: <span className="text-slate-800 font-black">{filtered.length}</span></div>
          {filtered.length > 0 && (
            <div className="text-xs text-slate-400 font-semibold">
              Показаны {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} из {filtered.length}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] bg-white p-10 text-center text-slate-500 shadow-sm">
            По выбранным фильтрам ничего не найдено.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visible.map((c) => (
                <ConditionerCard
                  key={c.id + "-" + area}
                  item={c}
                  areaFilter={area}
                  onOrder={handleOrderCard}
                  isCompared={compare.isSelected(c.id)}
                  onToggleCompare={compare.toggle}
                  onCardNavigate={handleCardClick}
                />
              ))}
            </div>

            {/* Классическая нумерованная пагинация страниц */}
            <CatalogPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {compare.ids.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-slate-200 bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.15)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff6b35] text-xs font-black text-white">{compare.ids.length}</span>
              <span className="text-sm font-black text-[#1a3a5c]">Выбрано для сравнения</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {compare.selected.map((c) => (
                <span key={c.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <span className="max-w-[10rem] truncate">{c.name}</span>
                  <button type="button" onClick={() => compare.toggle(c.id)} className="text-slate-400 transition hover:text-red-500" aria-label={`Убрать ${c.name} из сравнения`}>✕</button>
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={compare.clear} className="rounded-full px-4 py-2.5 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                Очистить
              </button>
              <Link to="/sravnenie" className="rounded-full bg-[#1a3a5c] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[#122943]">
                Сравнить →
              </Link>
            </div>
          </div>
        </div>
      )}

      <QuickBookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        serviceName={orderServiceName}
        calcDetails={orderCalcDetails}
      />
    </section>
  );
}

/**
 * Компонент классической нумерованной постраничной навигации
 */
function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Пагинация каталога" className="mt-12 flex flex-col items-center justify-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Кнопка Назад */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-black transition sm:px-5 sm:py-3 sm:text-sm ${
            currentPage === 1
              ? "cursor-not-allowed bg-slate-100 text-slate-300"
              : "bg-white text-[#1a3a5c] shadow-sm ring-1 ring-slate-200 hover:bg-[#1a3a5c] hover:text-white active:scale-95"
          }`}
          aria-label="Предыдущая страница"
        >
          <span className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Назад</span>
        </button>

        {/* Номера страниц */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                …
              </span>
            );
          }
          const pageNum = Number(p);
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[2.5rem] h-10 sm:min-w-[3rem] sm:h-12 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center px-2 ${
                isActive
                  ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30 scale-105 ring-2 ring-[#ff6b35]"
                  : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[#1a3a5c] active:scale-95"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Кнопка Вперед */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-black transition sm:px-5 sm:py-3 sm:text-sm ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-slate-100 text-slate-300"
              : "bg-white text-[#1a3a5c] shadow-sm ring-1 ring-slate-200 hover:bg-[#1a3a5c] hover:text-white active:scale-95"
          }`}
          aria-label="Следующая страница"
        >
          <span className="hidden sm:inline">Вперед</span>
          <span className="text-base leading-none">→</span>
        </button>
      </div>

      <div className="text-xs font-bold text-slate-500">
        Страница <span className="text-slate-800 font-black">{currentPage}</span> из <span className="text-slate-800 font-black">{totalPages}</span>
      </div>
    </nav>
  );
}

function ConditionerCard({
  item,
  areaFilter,
  onOrder,
  isCompared,
  onToggleCompare,
  onCardNavigate,
}: {
  item: Conditioner;
  areaFilter: string;
  onOrder: (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => void;
  isCompared: boolean;
  onToggleCompare: (id: number) => void;
  onCardNavigate?: (id: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [selectedBtu, setSelectedBtu] = useState(() => {
    if (areaFilter !== "all" && AREA_TO_BTU[areaFilter]) {
      const wanted = AREA_TO_BTU[areaFilter];
      if (item.variants.some((v) => v.btu === wanted)) return wanted;
    }
    return item.variants[0].btu;
  });
  const [withInstall, setWithInstall] = useState(false);
  const variant = item.variants.find((v) => v.btu === selectedBtu) ?? item.variants[0];
  const discount = variant.oldPrice ? variant.oldPrice - variant.price : 0;
  const isMobile = item.type === "Мобильный";
  const isInstallOnRequest = item.type === "Полупромышленный" || item.type === "Промышленный";
  const totalPrice = variant.price + (withInstall && !isMobile && !isInstallOnRequest ? INSTALL_PRICE : 0);

  const cardLink = `/kondicionery/${getModelUrlSlug(item)}`;

  return (
    <article
      id={`card-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] transition-all"
    >
      <Link
        to={cardLink}
        onClick={() => onCardNavigate && onCardNavigate(item.id)}
        className="relative aspect-[4/3] overflow-hidden bg-slate-100 block group-hover:opacity-95 transition"
      >
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {item.badge && (<span className="rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white">{item.badge}</span>)}
          {discount > 0 && (<span className="rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white">−{formatRub(discount)}</span>)}
        </div>
        {item.smartHome && (<span className="absolute right-3 top-3 z-10 rounded-full bg-[#1a3a5c] px-3 py-1 text-xs font-black text-white">🎙️ Умный дом</span>)}
        {!imgError ? (
          <img src={getMainCoverPhoto(item)} alt={item.name} loading="lazy" onError={() => setImgError(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <div className="text-5xl">❄️</div>
            <div className="mt-2 text-xs font-semibold">Фото скоро</div>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">{item.brand}</div>
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-[#1a3a5c]">
            <input type="checkbox" checked={isCompared} onChange={() => onToggleCompare(item.id)} className="h-4 w-4 shrink-0 accent-[#ff6b35]" />
            Сравнить
          </label>
        </div>
        <Link
          to={cardLink}
          onClick={() => onCardNavigate && onCardNavigate(item.id)}
          className="block group-hover:text-[#ff6b35] transition"
        >
          <h3 className="mt-1 text-lg font-black text-[#1a3a5c] hover:text-[#ff6b35] transition">{item.name}</h3>
        </Link>
        <div className="mt-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Мощность (BTU)</div>
          <div className="flex flex-wrap gap-2">
            {item.variants.map((v) => (
              <button key={v.btu} type="button" onClick={() => setSelectedBtu(v.btu)} className={`rounded-xl px-3 py-2 text-xs font-black transition ${selectedBtu === v.btu ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {v.btu.toLocaleString("ru-RU")}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Площадь</span><span className="font-bold text-slate-800">до {variant.area} м²</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Охлаждение</span><span className="font-bold text-slate-800">{variant.cooling}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Обогрев</span><span className="font-bold text-slate-800">{variant.heating}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Уровень шума</span><span className="font-bold text-slate-800">{item.noise}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Тип</span><span className="font-bold text-slate-800">{item.type}</span></li>
          <li className="flex items-center justify-between"><span>Страна</span><span className="font-bold text-slate-800">{item.country}</span></li>
        </ul>
        {isMobile ? null : isInstallOnRequest ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
            Монтаж рассчитывается после осмотра объекта
          </div>
        ) : (
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
            <span className="text-sm font-bold text-slate-700">+ Стандартный монтаж<span className="block text-xs font-semibold text-slate-400">{formatRub(INSTALL_PRICE)}</span></span>
            <input type="checkbox" checked={withInstall} onChange={(e) => setWithInstall(e.target.checked)} className="h-5 w-5 shrink-0 accent-[#ff6b35]" />
          </label>
        )}
        <div className="mt-auto pt-5">
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-[#1a3a5c]">{formatRub(totalPrice)}</div>
            {variant.oldPrice && !withInstall && (<div className="mb-1 text-sm font-bold text-slate-400 line-through">{formatRub(variant.oldPrice)}</div>)}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {isInstallOnRequest ? "цена оборудования" : isMobile ? "цена кондиционера (монтаж не требуется)" : withInstall ? "кондиционер + монтаж" : "цена кондиционера"}
          </div>
          <Link
            to={cardLink}
            onClick={() => onCardNavigate && onCardNavigate(item.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1a3a5c] px-6 py-2.5 text-sm font-black text-[#1a3a5c] transition hover:bg-[#1a3a5c] hover:text-white"
          >
            Подробнее и фото
          </Link>
          <button
            type="button"
            onClick={() => onOrder(item, selectedBtu, withInstall, totalPrice)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            Заказать
          </button>
        </div>
      </div>
    </article>
  );
}
