import { useMemo, useRef, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";
import SendQuoteButtons from "./SendQuoteButtons";

// Конструктор «Соберите своё окно». Цены — ориентировочные, откалиброваны
// по программе расчёта цеха (октябрь 2026): расхождение по проверенным
// позициям до ~400 ₽. Скидка за объём применяется к изделию и работам:
// 1 изделие — 32%, 2 — 35%, 3–4 — 37%, от 5 — до 40%. Доставка в скидку
// не входит.

// --- коэффициенты модели, ₽ ---
const P_PER = 1052.62; // рама: за пог. м периметра
const A_PER = 7200.19; // стекло и сборка: за м²
const SASH0 = 6048.98; // створка поворотно-откидная: база
const SASH1 = 5717.73; // + за пог. м ширины створки
const SASH_P_DELTA = 620; // поворотная створка дешевле поворотно-откидной
const IMPOST = 2700; // импост: за штуку
const DOOR_BALK = 10608.82; // балконная дверь (створка со стеклом и сэндвичем)
const BALK_CONN = 2900; // соединитель балконного блока
const K72 = 1.31; // профиль 5 камер (W-72) дороже 4 камер
const PAN_M2 = 11550; // панорамное остекление: за м²
const GRANATA = 11061.48; // усиленный соединитель «граната», 3 м
const ENTR_A = 47244.33; // входная дверь: база
const ENTR_B = 37526.67; // входная дверь: за м²

const PRICE_INSTALL_M2 = 2400; // монтаж окна за м²
const PRICE_INSTALL_LOGGIA_M2 = 3000; // монтаж сборной лоджии за м²
const PRICE_SLOPES_M = 1400; // откосы с работой и подоконник: за пог. м
const PRICE_DEMOUNT_M2 = 1400; // демонтаж: за м²
const PRICE_OTLIV_M = 717.91; // водоотлив с работой: за пог. м
const PRICE_MOSQUITO = 2000; // москитная сетка: за штуку
const PRICE_DELIVERY = 4000; // доставка по городу: за заказ

type Series = "w60" | "w72";
type Kind = "window" | "balcony" | "entrance" | "panorama" | "loggia";
type GlassId = "plain" | "energy" | "multi" | "multi-energy";
type PanelKind = "po" | "p" | "lite" | "door";
type LayoutId = "sash" | "sash-lite" | "lite-sash" | "two" | "three";

const GLASS_ADD: Record<Series, Record<GlassId, number>> = {
  w60: { plain: 0, energy: 493.43, multi: 602.57, "multi-energy": 1095.99 },
  w72: { plain: 0, energy: 511.14, multi: 614.44, "multi-energy": 1596.2 },
};

const KINDS: { id: Kind; name: string; icon: string; hint: string }[] = [
  { id: "window", name: "Окно", icon: "🪟", hint: "В комнату, кухню, офис" },
  { id: "balcony", name: "Балконный блок", icon: "🚪", hint: "Окно с балконной дверью" },
  { id: "entrance", name: "Входная дверь", icon: "🏠", hint: "ПВХ-дверь на вход" },
  { id: "panorama", name: "Панорама", icon: "🌇", hint: "Большое окно на 8 стёкол" },
  { id: "loggia", name: "Лоджия сборная", icon: "🧩", hint: "Две части и граната между ними" },
];

const LAYOUTS: { id: LayoutId; name: string }[] = [
  { id: "sash", name: "Одна створка" },
  { id: "sash-lite", name: "Створка + глухое" },
  { id: "lite-sash", name: "Глухое + створка" },
  { id: "two", name: "Две створки" },
  { id: "three", name: "Глухое + створка + глухое" },
];

const GLASS: { id: GlassId; name: string; hint: string }[] = [
  { id: "plain", name: "Обычный", hint: "Двухкамерный, 32 мм" },
  { id: "energy", name: "Энергосберегающий", hint: "Теплее, меньше конденсата" },
  { id: "multi", name: "Мультифункциональный", hint: "Держит тепло, не пускает жару" },
  { id: "multi-energy", name: "Мульти + энерго", hint: "Максимум тепла и тишины" },
];

type ColorOption = {
  id: string;
  name: string;
  chip: string;
  frame: string;
  frameDark: string;
  colorKind: "white" | "lam" | "paint";
};

const COLORS: ColorOption[] = [
  { id: "white", name: "Белый", chip: "#f8fafc", frame: "#f1f5f9", frameDark: "#cbd5e1", colorKind: "white" },
  { id: "golden-oak", name: "Золотой дуб", chip: "#c1954f", frame: "#c1954f", frameDark: "#96703a", colorKind: "lam" },
  { id: "walnut", name: "Тёмный орех", chip: "#6d4c31", frame: "#6d4c31", frameDark: "#523823", colorKind: "lam" },
  { id: "anthracite-lam", name: "Антрацит", chip: "#454c55", frame: "#454c55", frameDark: "#2f343b", colorKind: "lam" },
  { id: "ral-7016", name: "RAL 7016", chip: "#383e42", frame: "#3a4045", frameDark: "#23272b", colorKind: "paint" },
  { id: "ral-9005", name: "RAL 9005", chip: "#0e0e10", frame: "#17181a", frameDark: "#000000", colorKind: "paint" },
  { id: "ral-8017", name: "RAL 8017", chip: "#45322e", frame: "#4a3733", frameDark: "#2c201d", colorKind: "paint" },
];

const LIMITS: Record<Kind, { minW: number; maxW: number; minH: number; maxH: number; defW: number; defH: number }> = {
  window: { minW: 400, maxW: 2600, minH: 400, maxH: 2100, defW: 1300, defH: 1400 },
  balcony: { minW: 1200, maxW: 3000, minH: 1900, maxH: 2400, defW: 2000, defH: 2100 },
  entrance: { minW: 700, maxW: 2000, minH: 1900, maxH: 2200, defW: 900, defH: 2000 },
  panorama: { minW: 1500, maxW: 3000, minH: 1500, maxH: 3000, defW: 3000, defH: 3000 },
  loggia: { minW: 2000, maxW: 4200, minH: 1500, maxH: 3000, defW: 3000, defH: 3000 },
};

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

function discountRate(count: number) {
  if (count >= 5) return 40;
  if (count >= 3) return 37;
  if (count >= 2) return 35;
  return 32;
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

// Части окна по схеме: ширина проёма каждой части, мм.
function windowPanels(layout: LayoutId, width: number): { kind: PanelKind; w: number }[] {
  const half = width / 2 - 43.5;
  switch (layout) {
    case "sash":
      return [{ kind: "po", w: width - 64 }];
    case "sash-lite":
      return [{ kind: "po", w: half }, { kind: "lite", w: half }];
    case "lite-sash":
      return [{ kind: "lite", w: half }, { kind: "po", w: half }];
    case "two":
      return [{ kind: "p", w: half }, { kind: "po", w: half }];
    case "three":
      return [
        { kind: "lite", w: width / 3 - 43.5 },
        { kind: "po", w: width / 3 - 23 },
        { kind: "lite", w: width / 3 - 43.5 },
      ];
    default:
      return [{ kind: "po", w: width - 64 }];
  }
}

// Наценка за цвет профиля: по периметру, ₽.
function colorAdd(opt: ColorOption, perimeter: number, twoSides: boolean) {
  if (opt.colorKind === "white") return 0;
  const lam2 = 5694.11 + 3119.73 * perimeter;
  if (opt.colorKind === "lam") return twoSides ? lam2 : 2472.15 + 1346.08 * perimeter;
  return twoSides ? 1.0216 * lam2 : 1368.18 + 857.75 * perimeter;
}

type Position = { id: number; title: string; subtitle: string; priceNoDisc: number; qty: number };

export default function WindowConfigurator() {
  const [kind, setKind] = useState<Kind>("window");
  const [series, setSeries] = useState<Series>("w60");
  const [layout, setLayout] = useState<LayoutId>("sash-lite");
  const [glassId, setGlassId] = useState<GlassId>("energy");
  const [colorId, setColorId] = useState("white");
  const [twoSides, setTwoSides] = useState(false);
  const [width, setWidth] = useState(1300);
  const [height, setHeight] = useState(1400);
  const [entrLeaves, setEntrLeaves] = useState(1);
  const [install, setInstall] = useState(true);
  const [slopes, setSlopes] = useState(true);
  const [demount, setDemount] = useState(false);
  const [otliv, setOtliv] = useState(true);
  const [mosquito, setMosquito] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [positions, setPositions] = useState<Position[]>([]);
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const nextId = useRef(1);

  const color = COLORS.find((c) => c.id === colorId) || COLORS[0];
  const glass = GLASS.find((g) => g.id === glassId) || GLASS[0];
  const limits = LIMITS[kind];
  const isWindowLike = kind === "window" || kind === "balcony";

  function switchKind(next: Kind) {
    setKind(next);
    const l = LIMITS[next];
    setWidth(l.defW);
    setHeight(l.defH);
    if (next === "entrance" || next === "panorama" || next === "loggia") setSeries("w72");
    if (next === "entrance" || next === "panorama" || next === "loggia") setLayout("sash");
  }

  const effSeries: Series = kind === "window" || kind === "balcony" ? series : "w72";
  const seriesName = effSeries === "w72" ? "5 камер" : "4 камеры";
  const layoutName = LAYOUTS.find((l) => l.id === layout)?.name || "";

  const calc = useMemo(() => {
    const perimeter = (2 * (width + height)) / 1000;
    const area = (width / 1000) * (height / 1000);
    const baseOf = (w: number, h: number) => ((2 * (w + h)) / 1000) * P_PER + ((w / 1000) * (h / 1000)) * A_PER;
    const glassAdd = GLASS_ADD[effSeries][glassId];

    let product = 0;
    let glassM2 = 0;

    if (kind === "window") {
      const panels = windowPanels(layout, width);
      let sashes = 0;
      for (const p of panels) {
        if (p.kind === "po") sashes += SASH0 + (SASH1 * p.w) / 1000;
        else if (p.kind === "p") sashes += SASH0 + (SASH1 * p.w) / 1000 - SASH_P_DELTA;
      }
      const imposts = Math.max(0, panels.length - 1) * IMPOST;
      product = (baseOf(width, height) + sashes + imposts) * (effSeries === "w72" ? K72 : 1);
      glassM2 = panels.reduce((s, p) => s + (Math.max(0, p.w - 23.5) / 1000) * ((height - 88) / 1000), 0);
    } else if (kind === "balcony") {
      product =
        (baseOf(700, 2100) + DOOR_BALK + baseOf(width - 700, height - 700) + BALK_CONN) *
        (effSeries === "w72" ? K72 : 1);
      glassM2 = (Math.max(0, width - 700 - 87.5) / 1000) * (Math.max(0, height - 788) / 1000);
    } else if (kind === "entrance") {
      product = ENTR_A + ENTR_B * area;
    } else if (kind === "panorama") {
      product = PAN_M2 * area;
      glassM2 = 0.85 * area;
    } else {
      product = 2 * PAN_M2 * ((width / 2 / 1000) * (height / 1000)) + GRANATA;
      glassM2 = 0.85 * area;
    }

    const glassRub = glassAdd * glassM2;
    const colorRub = colorAdd(color, perimeter, twoSides);

    const installRub = install ? (kind === "loggia" ? PRICE_INSTALL_LOGGIA_M2 : PRICE_INSTALL_M2) * area : 0;
    const slopesRub = slopes && isWindowLike ? PRICE_SLOPES_M * perimeter : 0;
    const demountRub = demount && kind !== "panorama" && kind !== "loggia" ? PRICE_DEMOUNT_M2 * area : 0;
    const otlivRub = otliv && kind !== "entrance" ? PRICE_OTLIV_M * (width / 1000) : 0;
    const mosquitoRub = mosquito && isWindowLike ? PRICE_MOSQUITO : 0;

    const onePrice = product + glassRub + colorRub + installRub + slopesRub + demountRub + otlivRub + mosquitoRub;
    return {
      perimeter,
      area,
      product,
      glassRub,
      colorRub,
      installRub,
      slopesRub,
      demountRub,
      otlivRub,
      mosquitoRub,
      onePrice,
      total: onePrice * quantity,
    };
  }, [kind, layout, width, height, effSeries, glassId, color, twoSides, install, slopes, demount, otliv, mosquito, quantity, isWindowLike]);

  const totals = useMemo(() => {
    const count = positions.reduce((s, p) => s + p.qty, 0);
    const rate = discountRate(count);
    const goods = positions.reduce((s, p) => s + p.priceNoDisc * p.qty, 0);
    const discounted = goods * (1 - rate / 100);
    return { count, rate, goods, discounted, total: discounted + (delivery ? PRICE_DELIVERY : 0) };
  }, [positions, delivery]);

  const kindName = KINDS.find((k) => k.id === kind)?.name || "Окно";

  function positionTitle() {
    return `${kindName} ${width}×${height} мм`;
  }

  function positionSubtitle() {
    const bits: string[] = [];
    if (kind === "window") bits.push(layoutName);
    if (kind === "entrance") bits.push(entrLeaves === 2 ? "две створки" : "одна створка");
    if (kind !== "entrance") bits.push(seriesName);
    if (kind !== "entrance") bits.push(`стеклопакет: ${glass.name.toLowerCase()}`);
    bits.push(color.colorKind === "white" ? "белый" : `${color.name}${twoSides ? " (2 стороны)" : ""}`);
    if (install) bits.push("монтаж");
    if (slopes && isWindowLike) bits.push("откосы и подоконник");
    if (demount && kind !== "panorama" && kind !== "loggia") bits.push("демонтаж");
    if (otliv && kind !== "entrance") bits.push("отлив");
    if (mosquito && isWindowLike) bits.push("москитная сетка");
    return bits.join(", ");
  }

  function addPosition() {
    setPositions((prev) => [
      ...prev,
      { id: nextId.current++, title: positionTitle(), subtitle: positionSubtitle(), priceNoDisc: calc.onePrice, qty: quantity },
    ]);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function removePosition(id: number) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  const quoteText = positions.length
    ? `Здравствуйте! Расчёт из конструктора: ${positions
        .map((p, i) => `${i + 1}) ${p.title}, ${p.subtitle} — ${p.qty} шт.`)
        .join("; ")}. Ориентировочная стоимость ${formatRub(totals.total)}${delivery ? " (доставка включена)" : ""}`
    : `Здравствуйте! Расчёт из конструктора: ${positionTitle()} (${positionSubtitle()}), ${quantity} шт. Ориентировочная стоимость ${formatRub(calc.total)}`;

  const calcDetails = positions.length
    ? `Позиции: ${positions.map((p, i) => `${i + 1}) ${p.title} — ${p.qty} шт. (${p.subtitle})`).join("; ")}. Скидка ${totals.rate}%. Ориентировочно: ${formatRub(totals.total)}${delivery ? ", доставка включена" : ""}`
    : `${positionTitle()} (${positionSubtitle()}), ${quantity} шт. Площадь ${calc.area.toFixed(2)} м². Ориентировочно: ${formatRub(calc.total)}`;

  // --- отрисовка схемы ---
  const MAX_W = 270;
  const MAX_H = 300;
  const scale = Math.min(MAX_W / width, MAX_H / height);
  const winW = width * scale;
  const winH = height * scale;
  const winX = 44 + (MAX_W - winW) / 2;
  const winY = 30 + (MAX_H - winH) / 2;
  const S = (mm: number) => mm * scale;
  const X = (mm: number) => winX + mm * scale;
  const Y = (mm: number) => winY + mm * scale;
  const frameT = Math.max(5, Math.min(11, winW * 0.05));
  const glassPad = Math.max(3, frameT * 0.45);

  const drawParts = useMemo(() => {
    type DrawPart = { kind: PanelKind; x: number; y: number; w: number; h: number };
    const parts: DrawPart[] = [];
    if (kind === "window") {
      let x = 32;
      const panels = windowPanels(layout, width);
      panels.forEach((p, i) => {
        parts.push({ kind: p.kind, x, y: 32, w: Math.max(0, p.w), h: height - 64 });
        x += p.w + (i < panels.length - 1 ? 23 : 0);
      });
    } else if (kind === "balcony") {
      parts.push({ kind: "lite", x: 32, y: 32, w: Math.max(0, width - 700 - 64), h: Math.max(0, height - 700 - 64) });
      parts.push({ kind: "door", x: width - 700 + 32, y: 32, w: 700 - 64, h: height - 64 });
    } else if (kind === "entrance") {
      const leaf = (width - 64 - (entrLeaves - 1) * 23) / entrLeaves;
      for (let i = 0; i < entrLeaves; i++) {
        parts.push({ kind: "door", x: 32 + i * (leaf + 23), y: 32, w: leaf, h: height - 64 });
      }
    } else if (kind === "panorama") {
      const colW = (width - 64 - 3 * 23) / 4;
      const rowH = (height - 64 - 23) / 2;
      for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 2; r++) {
          parts.push({ kind: "lite", x: 32 + c * (colW + 23), y: 32 + r * (rowH + 23), w: colW, h: rowH });
        }
      }
    } else {
      const half = (width - 30) / 2;
      const colW = (half - 64 - 23) / 2;
      const rowH = (height - 64 - 23) / 2;
      for (let hIdx = 0; hIdx < 2; hIdx++) {
        const baseX = hIdx === 0 ? 32 : half + 30 + 32;
        for (let c = 0; c < 2; c++) {
          for (let r = 0; r < 2; r++) {
            parts.push({ kind: "lite", x: baseX + c * (colW + 23), y: 32 + r * (rowH + 23), w: colW, h: rowH });
          }
        }
      }
    }
    return parts;
  }, [kind, layout, width, height, entrLeaves]);

  const glassFill = glassId === "plain" ? "rgba(186,214,248,0.55)" : "rgba(148,197,253,0.6)";

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
            Выбирайте размер, створки, стеклопакет и цвет — стоимость считается сразу. Можно посчитать
            несколько позиций: добавьте окно в расчёт и собирайте следующее.
          </p>
        </div>

        {/* Тип изделия */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => switchKind(k.id)}
              title={k.hint}
              className={`rounded-2xl border-2 px-4 py-2.5 text-left transition ${
                kind === k.id ? "border-[#ff6b35] bg-orange-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-sm font-extrabold text-slate-800">
                {k.icon} {k.name}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{k.hint}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Превью */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
              <svg viewBox="0 0 340 390" className="mx-auto w-full max-w-[380px]" role="img" aria-label={`${kindName} ${width} на ${height} мм`}>
                {/* Подоконник */}
                {slopes && isWindowLike && (
                  <rect x={winX - 12} y={winY + winH} width={winW + 24} height={7} rx={2} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
                )}
                {/* Коробка */}
                <rect x={winX} y={winY} width={winW} height={winH} rx={2.5} fill={color.frame} stroke={color.frameDark} strokeWidth="1.6" />

                {/* Граната между частями лоджии */}
                {kind === "loggia" && (
                  <rect x={X(32 + (width - 30) / 2)} y={Y(20)} width={S(30)} height={S(height - 40)} fill={color.frameDark} />
                )}

                {/* Части */}
                {drawParts.map((p, i) => {
                  const gx = X(p.x);
                  const gy = Y(p.y);
                  const gw = S(p.w);
                  const gh = S(p.h);
                  const openable = p.kind === "po" || p.kind === "p";
                  const handleAtCenter = p.x + p.w / 2 < width / 2;
                  const handleX = handleAtCenter ? gx + gw - glassPad - 1 : gx + glassPad - 2.5;
                  const isDoor = p.kind === "door";
                  const glassH = isDoor ? gh * 0.55 : gh;
                  return (
                    <g key={i}>
                      <rect x={gx} y={gy} width={gw} height={gh} fill={color.frame} stroke={color.frameDark} strokeWidth="1.1" />
                      <rect
                        x={gx + glassPad}
                        y={gy + glassPad}
                        width={Math.max(2, gw - glassPad * 2)}
                        height={Math.max(2, glassH - glassPad)}
                        fill={glassFill}
                        stroke={color.frameDark}
                        strokeWidth="0.8"
                      />
                      {isDoor && (
                        <rect
                          x={gx + glassPad}
                          y={gy + glassH}
                          width={Math.max(2, gw - glassPad * 2)}
                          height={Math.max(2, gh - glassH - glassPad)}
                          fill={color.colorKind === "white" ? "#dbe2ea" : color.frameDark}
                          opacity="0.85"
                        />
                      )}
                      {/* Блик */}
                      <polygon
                        points={`${gx + glassPad + (gw - glassPad * 2) * 0.15},${gy + glassH - glassPad} ${gx + glassPad + (gw - glassPad * 2) * 0.55},${gy + glassPad} ${gx + glassPad + (gw - glassPad * 2) * 0.72},${gy + glassPad} ${gx + glassPad + (gw - glassPad * 2) * 0.32},${gy + glassH - glassPad}`}
                        fill="rgba(255,255,255,0.3)"
                      />
                      {openable && (
                        <path
                          d={`M${gx + glassPad + 2} ${gy + glassPad + 2} L${gx + gw / 2} ${gy + glassH / 2} M${gx + glassPad + 2} ${gy + glassH * 0.35} L${gx + gw / 2} ${gy + glassH / 2}`}
                          stroke={color.colorKind === "white" ? "#94a3b8" : "#e2e8f0"}
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          fill="none"
                        />
                      )}
                      {(openable || isDoor) && (
                        <rect
                          x={handleX}
                          y={gy + gh * (isDoor ? 0.5 : 0.48)}
                          width={3}
                          height={Math.max(10, gh * 0.12)}
                          rx={1.5}
                          fill="#cbd5e1"
                          stroke="#475569"
                          strokeWidth="0.7"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Размеры */}
                <g stroke="#94a3b8" strokeWidth="1" fill="none">
                  <line x1={winX} y1={18} x2={winX + winW} y2={18} />
                  <line x1={winX} y1={14} x2={winX} y2={22} />
                  <line x1={winX + winW} y1={14} x2={winX + winW} y2={22} />
                  <line x1={30} y1={winY} x2={30} y2={winY + winH} />
                  <line x1={26} y1={winY} x2={34} y2={winY} />
                  <line x1={26} y1={winY + winH} x2={34} y2={winY + winH} />
                </g>
                <text x={winX + winW / 2} y={12} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
                  {width} мм
                </text>
                <text
                  x={22}
                  y={winY + winH / 2}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#334155"
                  transform={`rotate(-90 22 ${winY + winH / 2})`}
                >
                  {height} мм
                </text>
              </svg>

              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                <span>Схема: <b className="text-slate-700">{kind === "window" ? layoutName : kindName}</b></span>
                <span>Профиль: <b className="text-slate-700">{kind === "entrance" ? "5 камер" : seriesName}</b></span>
                <span>Стеклопакет: <b className="text-slate-700">{kind === "entrance" ? "по проекту" : glass.name}</b></span>
                <span>Цвет: <b className="text-slate-700">{color.name}{twoSides && color.colorKind !== "white" ? " (2 стороны)" : ""}</b></span>
              </div>
              <p className="mt-3 text-center text-[11px] leading-snug text-slate-400">
                Схема условная. Точные размеры и состав замерщик зафиксирует на объекте.
              </p>
            </div>
          </div>

          {/* Настройки */}
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
            <div className="space-y-6">
              {kind === "window" && (
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Схема окна</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LAYOUTS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLayout(l.id)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          layout === l.id ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {kind === "entrance" && (
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Створки двери</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { v: 1, name: "Одна створка" },
                      { v: 2, name: "Две створки (штульповая)" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setEntrLeaves(o.v)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                          entrLeaves === o.v ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {o.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500" htmlFor="wc-width">
                    Ширина, мм
                  </label>
                  <input
                    id="wc-width"
                    type="number"
                    min={limits.minW}
                    max={limits.maxW}
                    step={50}
                    value={width}
                    onChange={(e) => setWidth(clamp(Number(e.target.value), limits.minW, limits.maxW))}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                  <input
                    type="range"
                    min={limits.minW}
                    max={limits.maxW}
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
                    min={limits.minH}
                    max={limits.maxH}
                    step={50}
                    value={height}
                    onChange={(e) => setHeight(clamp(Number(e.target.value), limits.minH, limits.maxH))}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  />
                  <input
                    type="range"
                    min={limits.minH}
                    max={limits.maxH}
                    step={50}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="mt-2 w-full accent-[#ff6b35]"
                    aria-label="Высота"
                  />
                </div>
              </div>

              {(kind === "window" || kind === "balcony") && (
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Профиль</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { v: "w60" as Series, name: "4 камеры", hint: "Стандарт" },
                      { v: "w72" as Series, name: "5 камер", hint: "Теплее и тише" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setSeries(o.v)}
                        className={`rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition ${
                          series === o.v ? "border-[#ff6b35] bg-orange-50 text-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {o.name} <span className="font-semibold text-slate-400">· {o.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {kind !== "entrance" && (
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Стеклопакет</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {GLASS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGlassId(g.id)}
                        className={`rounded-xl border-2 p-3 text-left transition ${
                          glassId === g.id ? "border-[#ff6b35] bg-orange-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-sm font-extrabold text-slate-800">{g.name}</div>
                        <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{g.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-500">Цвет профиля</div>
                <div className="mt-2 flex flex-wrap gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorId(c.id)}
                      title={c.name}
                      className={`flex items-center gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition ${
                        colorId === c.id ? "border-[#ff6b35] bg-orange-50 text-slate-800" : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="h-4 w-4 rounded border border-slate-300" style={{ background: c.chip }} />
                      {c.name}
                    </button>
                  ))}
                </div>
                {color.colorKind !== "white" && (
                  <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={twoSides}
                      onChange={(e) => setTwoSides(e.target.checked)}
                      className="h-4 w-4 accent-[#ff6b35]"
                    />
                    Окрасить с двух сторон (снаружи и изнутри)
                  </label>
                )}
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                  <input type="checkbox" checked={install} onChange={(e) => setInstall(e.target.checked)} className="h-4 w-4 accent-[#ff6b35]" />
                  {kind === "loggia" ? (
                    <>Монтаж сборной лоджии <span className="font-normal text-slate-400">· {PRICE_INSTALL_LOGGIA_M2} ₽/м²</span></>
                  ) : (
                    <>Монтаж по ГОСТу <span className="font-normal text-slate-400">· {PRICE_INSTALL_M2} ₽/м²</span></>
                  )}
                </label>
                {isWindowLike && (
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                    <input type="checkbox" checked={slopes} onChange={(e) => setSlopes(e.target.checked)} className="h-4 w-4 accent-[#ff6b35]" />
                    Откосы и подоконник <span className="font-normal text-slate-400">· {PRICE_SLOPES_M} ₽/пог. м</span>
                  </label>
                )}
                {kind !== "panorama" && kind !== "loggia" && (
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                    <input type="checkbox" checked={demount} onChange={(e) => setDemount(e.target.checked)} className="h-4 w-4 accent-[#ff6b35]" />
                    Демонтаж старого <span className="font-normal text-slate-400">· {PRICE_DEMOUNT_M2} ₽/м²</span>
                  </label>
                )}
                {kind !== "entrance" && (
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                    <input type="checkbox" checked={otliv} onChange={(e) => setOtliv(e.target.checked)} className="h-4 w-4 accent-[#ff6b35]" />
                    Отлив снаружи <span className="font-normal text-slate-400">· {PRICE_OTLIV_M} ₽/пог. м</span>
                  </label>
                )}
                {isWindowLike && (
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                    <input type="checkbox" checked={mosquito} onChange={(e) => setMosquito(e.target.checked)} className="h-4 w-4 accent-[#ff6b35]" />
                    Москитная сетка <span className="font-normal text-slate-400">· {PRICE_MOSQUITO} ₽</span>
                  </label>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-bold text-slate-600">Количество, шт.</span>
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

              {/* Цена текущей позиции */}
              <div className="rounded-2xl bg-[#1a3a5c] p-5 text-white">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-300">Ориентировочная стоимость</span>
                  <span className="text-3xl font-black text-[#ff6b35]">{formatRub(calc.total)}</span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-slate-300">
                  <li className="flex justify-between">
                    <span>Конструкция ({calc.area.toFixed(2)} м²{quantity > 1 ? ` × ${quantity}` : ""})</span>
                    <span>{formatRub(calc.product * quantity)}</span>
                  </li>
                  {calc.glassRub > 0 && (
                    <li className="flex justify-between">
                      <span>Стеклопакет «{glass.name}»</span>
                      <span>{formatRub(calc.glassRub * quantity)}</span>
                    </li>
                  )}
                  {calc.colorRub > 0 && (
                    <li className="flex justify-between">
                      <span>Цвет «{color.name}»{twoSides ? ", 2 стороны" : ""}</span>
                      <span>{formatRub(calc.colorRub * quantity)}</span>
                    </li>
                  )}
                  {calc.installRub > 0 && (
                    <li className="flex justify-between">
                      <span>Монтаж</span>
                      <span>{formatRub(calc.installRub * quantity)}</span>
                    </li>
                  )}
                  {calc.slopesRub > 0 && (
                    <li className="flex justify-between">
                      <span>Откосы и подоконник</span>
                      <span>{formatRub(calc.slopesRub * quantity)}</span>
                    </li>
                  )}
                  {calc.demountRub > 0 && (
                    <li className="flex justify-between">
                      <span>Демонтаж</span>
                      <span>{formatRub(calc.demountRub * quantity)}</span>
                    </li>
                  )}
                  {calc.otlivRub > 0 && (
                    <li className="flex justify-between">
                      <span>Отлив</span>
                      <span>{formatRub(calc.otlivRub * quantity)}</span>
                    </li>
                  )}
                  {calc.mosquitoRub > 0 && (
                    <li className="flex justify-between">
                      <span>Москитная сетка</span>
                      <span>{formatRub(calc.mosquitoRub * quantity)}</span>
                    </li>
                  )}
                </ul>
                <p className="mt-3 text-[11px] leading-snug text-slate-400">
                  Расчёт ориентировочный, без скидки за объём. Точную цену назовёт замерщик — выезд бесплатный.
                </p>
                <button
                  type="button"
                  onClick={addPosition}
                  className="mt-4 w-full rounded-xl bg-[#ff6b35] py-3.5 text-sm font-black text-white transition hover:bg-[#e95620]"
                >
                  Добавить позицию в расчёт
                </button>
                {added && (
                  <p className="mt-2 text-center text-xs font-bold text-emerald-300">Позиция добавлена — смотрите итог ниже ↓</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Расчёт: позиции и итог */}
        <div className="mt-8 rounded-[1.5rem] bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-black text-[#1a3a5c] sm:text-2xl">
              Ваш расчёт{positions.length > 0 ? ` — ${totals.count} шт.` : ""}
            </h3>
            {positions.length > 0 && (
              <button
                type="button"
                onClick={() => setPositions([])}
                className="text-xs font-bold text-slate-400 underline decoration-dotted hover:text-[#ff6b35]"
              >
                Очистить всё
              </button>
            )}
          </div>

          {positions.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Пока пусто. Соберите изделие справа и нажмите «Добавить позицию в расчёт» — позиции
              сложатся в общий итог со скидкой. Если считать нечего, ничего добавлять не нужно: просто
              оставьте заявку, и мы рассчитаем сами.
            </p>
          ) : (
            <>
              <ul className="mt-4 divide-y divide-slate-100">
                {positions.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-800">{p.title}</div>
                      <div className="mt-0.5 text-xs leading-snug text-slate-500">
                        {p.qty} шт. · {p.subtitle}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePosition(p.id)}
                        className="mt-1 text-[11px] font-bold text-slate-400 underline decoration-dotted hover:text-red-500"
                      >
                        Удалить позицию
                      </button>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-slate-400 line-through">{formatRub(p.priceNoDisc * p.qty)}</div>
                      <div className="text-base font-black text-[#1a3a5c]">
                        {formatRub(p.priceNoDisc * p.qty * (1 - totals.rate / 100))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={delivery}
                  onChange={(e) => setDelivery(e.target.checked)}
                  className="h-4 w-4 accent-[#ff6b35]"
                />
                Добавить доставку по городу — {formatRub(PRICE_DELIVERY)} <span className="font-normal text-slate-400">(в скидку не входит)</span>
              </label>

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-500">
                    {totals.count} шт. без скидки
                  </span>
                  <span className="text-sm font-bold text-slate-400 line-through">{formatRub(totals.goods)}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-500">
                    Скидка {totals.rate}%
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    −{formatRub(totals.goods - totals.discounted)}
                  </span>
                </div>
                {delivery && (
                  <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-500">Доставка</span>
                    <span className="text-sm font-bold text-slate-600">{formatRub(PRICE_DELIVERY)}</span>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 border-t border-slate-200 pt-3">
                  <span className="text-sm font-black uppercase tracking-wide text-[#1a3a5c]">
                    Ориентировочная стоимость
                  </span>
                  <span className="text-2xl font-black text-[#ff6b35] sm:text-3xl">{formatRub(totals.total)}</span>
                </div>
                <p className="mt-3 text-[11px] leading-snug text-slate-400">
                  Скидка растёт с объёмом: 32% за одно изделие, 35% за два, 37% за 3–4, до 40% от 5 изделий.
                  Итог ориентировочный — точную цену зафиксируем после бесплатного замера.
                </p>
              </div>
            </>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-[#ff6b35] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Отправить расчёт менеджеру
            </button>
            <div className="flex items-center">
              <SendQuoteButtons quoteText={quoteText} />
            </div>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Расчёт из конструктора окон"
        calcDetails={calcDetails}
      />
    </section>
  );
}
