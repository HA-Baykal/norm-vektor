import { useMemo, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";
import SendQuoteButtons from "./SendQuoteButtons";

// Онлайн-конструктор окна: человек собирает окно по частям (размер, створки,
// цвет профиля, стеклопакет, ручка, допы) и сразу видит, как оно выглядит
// и сколько стоит. Цены — те же ориентиры, что в WindowCalculator:
// профиль 11 000 ₽/м², монтаж 2 400 ₽, откосы и подоконник 1 400 ₽/м,
// доставка 3 000 ₽. Наценки за ламинацию и стеклопакеты — средние по рынку,
// перед публикацией сверить с прайсом.

const PRICE_WINDOW_M2 = 11000;
const PRICE_INSTALL_PER_WINDOW = 2400;
const PRICE_SLOPES_AND_SILL_PER_M = 1400;
const PRICE_DELIVERY = 3000;
const PRICE_MOSQUITO = 2000;

const MIN_WIDTH = 400;
const MAX_WIDTH = 3000;
const MIN_HEIGHT = 400;
const MAX_HEIGHT = 2400;

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

type ProfileColor = {
  id: string;
  name: string;
  frame: string;
  frameDark: string;
  /** Наценка за ламинацию/цвет, множитель к цене профиля. */
  mult: number;
};

const PROFILE_COLORS: ProfileColor[] = [
  { id: "white", name: "Белый", frame: "#f8fafc", frameDark: "#cbd5e1", mult: 1 },
  { id: "gray", name: "Серый", frame: "#a8b1bb", frameDark: "#7c8794", mult: 1.06 },
  { id: "golden", name: "Золотой дуб", frame: "#c1954f", frameDark: "#96703a", mult: 1.08 },
  { id: "walnut", name: "Тёмный орех", frame: "#6d4c31", frameDark: "#523823", mult: 1.1 },
  { id: "anthracite", name: "Антрацит", frame: "#454c55", frameDark: "#2f343b", mult: 1.12 },
];

type Glazing = {
  id: string;
  name: string;
  hint: string;
  pricePerM2: number;
  tint: string;
};

const GLAZINGS: Glazing[] = [
  { id: "double", name: "Двухкамерный", hint: "Базовый, 32 мм", pricePerM2: 0, tint: "rgba(186,214,248,0.55)" },
  { id: "energy", name: "Энергосберегающий", hint: "Теплее на 30%, меньше конденсата", pricePerM2: 800, tint: "rgba(148,197,253,0.6)" },
  { id: "multi", name: "Мультифункциональный", hint: "Летом не печёт, зимой держит тепло", pricePerM2: 1400, tint: "rgba(125,211,252,0.65)" },
  { id: "tinted", name: "Тонированный", hint: "Для солнечной стороны", pricePerM2: 1800, tint: "rgba(51,65,85,0.55)" },
];

type HandleColor = { id: string; name: string; color: string };
const HANDLES: HandleColor[] = [
  { id: "white", name: "Белая", color: "#f1f5f9" },
  { id: "silver", name: "Серебро", color: "#cbd5e1" },
  { id: "bronze", name: "Бронза", color: "#9a6a33" },
  { id: "black", name: "Чёрная", color: "#1e293b" },
];

// Створки: колонка = вертикальные части. Для балконного блока левая колонка —
// дверь (шире), правая — окно.
type Panel = { openable: boolean; handleSide?: "left" | "right" };
type LayoutTemplate = { id: string; name: string; columns: Panel[][]; door?: boolean };

const LAYOUTS: LayoutTemplate[] = [
  { id: "fixed", name: "Глухое", columns: [[{ openable: false }]] },
  { id: "single", name: "Одна створка", columns: [[{ openable: true, handleSide: "left" }]] },
  {
    id: "sash-fixed",
    name: "Створка + глухое",
    columns: [[{ openable: true, handleSide: "right" }], [{ openable: false }]],
  },
  {
    id: "two-sashes",
    name: "Две створки",
    columns: [[{ openable: true, handleSide: "right" }], [{ openable: true, handleSide: "left" }]],
  },
  {
    id: "three",
    name: "Глухое + створка + глухое",
    columns: [[{ openable: false }], [{ openable: true, handleSide: "left" }], [{ openable: false }]],
  },
  {
    id: "balcony",
    name: "Балконный блок",
    door: true,
    columns: [[{ openable: true, handleSide: "right" }], [{ openable: true, handleSide: "left" }]],
  },
];

function autoLayout(width: number): string {
  if (width <= 1000) return "single";
  if (width <= 1500) return "sash-fixed";
  return "three";
}

export default function WindowConfigurator() {
  const [layoutId, setLayoutId] = useState("auto");
  const [width, setWidth] = useState(1300);
  const [height, setHeight] = useState(1400);
  const [profileId, setProfileId] = useState("white");
  const [glazingId, setGlazingId] = useState("energy");
  const [handleId, setHandleId] = useState("silver");
  const [mosquito, setMosquito] = useState(false);
  const [sill, setSill] = useState(true);
  const [install, setInstall] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const layout = useMemo(() => {
    const id = layoutId === "auto" ? autoLayout(width) : layoutId;
    return LAYOUTS.find((l) => l.id === id) || LAYOUTS[1];
  }, [layoutId, width]);
  const profile = PROFILE_COLORS.find((p) => p.id === profileId) || PROFILE_COLORS[0];
  const glazing = GLAZINGS.find((g) => g.id === glazingId) || GLAZINGS[0];
  const handle = HANDLES.find((h) => h.id === handleId) || HANDLES[1];

  const calc = useMemo(() => {
    const areaM2 = (width / 1000) * (height / 1000);
    const perimeterM = (2 * (width + height)) / 1000;
    const windowPrice = areaM2 * PRICE_WINDOW_M2 * profile.mult + areaM2 * glazing.pricePerM2;
    const installPrice = install ? PRICE_INSTALL_PER_WINDOW : 0;
    const slopesPrice = sill ? perimeterM * PRICE_SLOPES_AND_SILL_PER_M : 0;
    const mosquitoPrice = mosquito ? PRICE_MOSQUITO : 0;
    const onePiece = windowPrice + installPrice + slopesPrice + mosquitoPrice;
    const total = onePiece * quantity + (delivery ? PRICE_DELIVERY : 0);
    return { areaM2, windowPrice, installPrice, slopesPrice, mosquitoPrice, onePiece, total };
  }, [width, height, profile, glazing, install, sill, mosquito, delivery, quantity]);

  const calcDetails = `Конструктор: ${width}×${height} мм (${calc.areaM2.toFixed(2)} м²), ${layout.name}, профиль «${profile.name}», стеклопакет «${glazing.name}», ручка «${handle.name}», москитная сетка: ${mosquito ? "да" : "нет"}, подоконник и откосы: ${sill ? "да" : "нет"}, монтаж: ${install ? "да" : "нет"}, кол-во: ${quantity} шт., ориентир цены: ${formatRub(calc.total)}`;

  // --- Геометрия SVG. Канва 340×390, окно вписывается в 280×300. ---
  const VX = 44;
  const VY = 30;
  const MAX_W = 270;
  const MAX_H = 300;
  const scale = Math.min(MAX_W / width, MAX_H / height);
  const winW = width * scale;
  const winH = height * scale;
  const winX = VX + (MAX_W - winW) / 2;
  const winY = VY + (MAX_H - winH) / 2;
  const frameT = Math.max(5, Math.min(11, winW * 0.05));
  const mullionT = Math.max(4, frameT * 0.8);
  const innerX = winX + frameT;
  const innerY = winY + frameT;
  const innerW = winW - frameT * 2;
  const innerH = winH - frameT * 2;

  const columns = layout.columns;
  const doorRatio = layout.door ? 0.55 : 1 / columns.length;
  const colWidths = columns.map((_, i) => (layout.door && i === 0 ? innerW * doorRatio : innerW * (1 - (layout.door ? doorRatio : 0)) / (layout.door ? columns.length - 1 : columns.length)));

  let cursorX = innerX;
  const panels = columns.map((col, ci) => {
    const colW = colWidths[ci];
    const x = cursorX;
    cursorX += colW + (ci < columns.length - 1 ? mullionT : 0);
    return col.map((panel, pi) => {
      // Пока в шаблонах по одной части на колонку — высота всей колонки.
      const y = innerY;
      const h = innerH;
      return { panel, x, y, w: colW, h, key: `${ci}-${pi}` };
    });
  }).flat();

  const glassPad = Math.max(3, frameT * 0.45);

  return (
    <section id="konstruktor" className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Конструктор
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Соберите своё окно за минуту
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Выбирайте створки, цвет профиля, стеклопакет и ручку — картинка и цена обновляются сразу.
            Готовую конфигурацию можно отправить нам в один клик.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-10">
          {/* Превью */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
              <svg viewBox="0 0 340 390" className="mx-auto w-full max-w-[380px]" role="img" aria-label={`Окно ${width} на ${height} мм`}>
                <defs>
                  <linearGradient id="wc-glass" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={glazing.tint} />
                    <stop offset="55%" stopColor={glazing.tint} stopOpacity="0.75" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
                  </linearGradient>
                  <pattern id="wc-mosquito" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M0 0h5v5" fill="none" stroke="#64748b" strokeWidth="0.7" />
                  </pattern>
                </defs>

                {/* Подоконник */}
                {sill && (
                  <rect
                    x={winX - 12}
                    y={winY + winH}
                    width={winW + 24}
                    height={7}
                    rx={2}
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                )}

                {/* Коробка */}
                <rect x={winX} y={winY} width={winW} height={winH} rx={2.5} fill={profile.frame} stroke={profile.frameDark} strokeWidth="1.6" />

                {/* Створки и стёкла */}
                {panels.map(({ panel, x, y, w, h, key }) => (
                  <g key={key}>
                    <rect x={x} y={y} width={w} height={h} fill={profile.frame} stroke={profile.frameDark} strokeWidth="1.1" />
                    <rect
                      x={x + glassPad}
                      y={y + glassPad}
                      width={Math.max(2, w - glassPad * 2)}
                      height={Math.max(2, h - glassPad * 2)}
                      fill="url(#wc-glass)"
                      stroke={profile.frameDark}
                      strokeWidth="0.8"
                    />
                    {/* Блик */}
                    <polygon
                      points={`${x + glassPad + (w - glassPad * 2) * 0.15},${y + h - glassPad} ${x + glassPad + (w - glassPad * 2) * 0.55},${y + glassPad} ${x + glassPad + (w - glassPad * 2) * 0.72},${y + glassPad} ${x + glassPad + (w - glassPad * 2) * 0.32},${y + h - glassPad}`}
                      fill="rgba(255,255,255,0.35)"
                    />
                    {mosquito && panel.openable && (
                      <rect
                        x={x + glassPad}
                        y={y + glassPad}
                        width={Math.max(2, w - glassPad * 2)}
                        height={Math.max(2, h - glassPad * 2)}
                        fill="url(#wc-mosquito)"
                        opacity="0.5"
                      />
                    )}
                    {/* Ручка */}
                    {panel.openable && (
                      <rect
                        x={panel.handleSide === "left" ? x + glassPad - 2.5 : x + w - glassPad - 0.5}
                        y={y + h * (layout.door ? 0.52 : 0.5)}
                        width={3}
                        height={Math.max(10, h * 0.12)}
                        rx={1.5}
                        fill={handle.color}
                        stroke="#334155"
                        strokeWidth="0.7"
                      />
                    )}
                  </g>
                ))}

                {/* Размеры */}
                <g stroke="#94a3b8" strokeWidth="1" fill="none">
                  <line x1={winX} y1={VY - 12} x2={winX + winW} y2={VY - 12} />
                  <line x1={winX} y1={VY - 16} x2={winX} y2={VY - 8} />
                  <line x1={winX + winW} y1={VY - 16} x2={winX + winW} y2={VY - 8} />
                  <line x1={VX - 14} y1={winY} x2={VX - 14} y2={winY + winH} />
                  <line x1={VX - 18} y1={winY} x2={VX - 10} y2={winY} />
                  <line x1={VX - 18} y1={winY + winH} x2={VX - 10} y2={winY + winH} />
                </g>
                <text x={winX + winW / 2} y={VY - 18} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
                  {width} мм
                </text>
                <text
                  x={VX - 22}
                  y={winY + winH / 2}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#334155"
                  transform={`rotate(-90 ${VX - 22} ${winY + winH / 2})`}
                >
                  {height} мм
                </text>
              </svg>

              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <span>Профиль: <b className="text-slate-700">{profile.name}</b></span>
                <span>Стеклопакет: <b className="text-slate-700">{glazing.name}</b></span>
                <span>Ручка: <b className="text-slate-700">{handle.name}</b></span>
              </div>
            </div>
          </div>

          {/* Настройки */}
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Створки</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[{ id: "auto", name: "Подобрать по размеру" }, ...LAYOUTS].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLayoutId(l.id)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                        layoutId === l.id ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500" htmlFor="wc-width">
                    Ширина, мм
                  </label>
                  <input
                    id="wc-width"
                    type="number"
                    min={MIN_WIDTH}
                    max={MAX_WIDTH}
                    step={50}
                    value={width}
                    onChange={(e) => setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Number(e.target.value) || MIN_WIDTH)))}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                  <input
                    type="range"
                    min={MIN_WIDTH}
                    max={MAX_WIDTH}
                    step={50}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="mt-2 w-full accent-[#ff6b35]"
                    aria-label="Ширина"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500" htmlFor="wc-height">
                    Высота, мм
                  </label>
                  <input
                    id="wc-height"
                    type="number"
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    step={50}
                    value={height}
                    onChange={(e) => setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Number(e.target.value) || MIN_HEIGHT)))}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                  <input
                    type="range"
                    min={MIN_HEIGHT}
                    max={MAX_HEIGHT}
                    step={50}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="mt-2 w-full accent-[#ff6b35]"
                    aria-label="Высота"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Цвет профиля</div>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {PROFILE_COLORS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfileId(p.id)}
                      title={p.name}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition ${
                        profileId === p.id ? "border-[#ff6b35] bg-orange-50 text-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="h-4 w-4 rounded-full border border-slate-300" style={{ background: p.frame }} />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Стеклопакет</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {GLAZINGS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGlazingId(g.id)}
                      className={`rounded-xl border-2 p-3 text-left transition ${
                        glazingId === g.id ? "border-[#ff6b35] bg-orange-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-sm font-extrabold text-slate-800">{g.name}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{g.hint}</div>
                      {g.pricePerM2 > 0 && (
                        <div className="mt-1 text-[11px] font-bold text-[#ff6b35]">+{g.pricePerM2} ₽/м²</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Ручка</div>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {HANDLES.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHandleId(h.id)}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition ${
                        handleId === h.id ? "border-[#ff6b35] bg-orange-50 text-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="h-4 w-1.5 rounded-full border border-slate-300" style={{ background: h.color }} />
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {[
                  { on: mosquito, set: setMosquito, label: `Москитная сетка (${formatRub(PRICE_MOSQUITO)})` },
                  { on: sill, set: setSill, label: "Подоконник и откосы" },
                  { on: install, set: setInstall, label: `Монтаж по ГОСТу (${formatRub(PRICE_INSTALL_PER_WINDOW)})` },
                  { on: delivery, set: setDelivery, label: `Доставка (${formatRub(PRICE_DELIVERY)})` },
                ].map((o) => (
                  <label key={o.label} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={o.on}
                      onChange={(e) => o.set(e.target.checked)}
                      className="h-4 w-4 accent-[#ff6b35]"
                    />
                    {o.label}
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">Количество окон</span>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-lg bg-white font-black text-slate-700 shadow-sm" aria-label="Меньше">
                    −
                  </button>
                  <span className="w-8 text-center text-lg font-black text-slate-800">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(30, q + 1))} className="h-9 w-9 rounded-lg bg-white font-black text-slate-700 shadow-sm" aria-label="Больше">
                    +
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-[#1a3a5c] p-5 text-white">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-slate-300">Ориентировочная стоимость</span>
                  <span className="text-3xl font-black text-[#ff6b35]">{formatRub(calc.total)}</span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-slate-300">
                  <li className="flex justify-between"><span>Конструкция ({calc.areaM2.toFixed(2)} м²)</span><span>{formatRub(calc.windowPrice)}</span></li>
                  {calc.installPrice > 0 && <li className="flex justify-between"><span>Монтаж</span><span>{formatRub(calc.installPrice)}</span></li>}
                  {calc.slopesPrice > 0 && <li className="flex justify-between"><span>Подоконник и откосы</span><span>{formatRub(calc.slopesPrice)}</span></li>}
                  {calc.mosquitoPrice > 0 && <li className="flex justify-between"><span>Москитная сетка</span><span>{formatRub(calc.mosquitoPrice)}</span></li>}
                </ul>
                <p className="mt-3 text-[11px] leading-snug text-slate-400">
                  Расчёт ориентировочный. Точную цену назовёт замерщик — выезд бесплатный.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full rounded-xl bg-[#ff6b35] py-3.5 text-sm font-black text-white transition hover:bg-[#e95620]"
                >
                  Вызвать замерщика с этой конфигурацией
                </button>
              </div>

              <SendQuoteButtons quoteText={`Здравствуйте! Собрал окно в конструкторе на сайте: ${calcDetails}`} />
            </div>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Замер — окно из конструктора"
        calcDetails={calcDetails}
      />
    </section>
  );
}
