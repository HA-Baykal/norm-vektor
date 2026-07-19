import { useMemo, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";

const PRICE_WINDOW_M2 = 11000;
const PRICE_INSTALL_M2 = 2100;
const PRICE_SLOPES_SILL_MM = 1900;
const PRICE_DELIVERY = 3000;

const MIN_WIDTH = 400;
const MAX_WIDTH = 3000;
const MIN_HEIGHT = 400;
const MAX_HEIGHT = 2100;

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

type WindowKind = "single" | "double" | "triple";

function getWindowKind(width: number): WindowKind {
  if (width <= 1000) return "single";
  if (width <= 1500) return "double";
  return "triple";
}

const kindLabels: Record<WindowKind, string> = {
  single: "Одностворчатое (1 створка поворотно-откидная)",
  double: "Двухчастное (створка + глухое стекло)",
  triple: "Трёхчастное (глухое + створка + глухое)",
};

export default function WindowCalculator() {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(1400);
  const [quantity, setQuantity] = useState(1);
  const [withInstall, setWithInstall] = useState(true);
  const [withSlopesSill, setWithSlopesSill] = useState(true);
  const [withDelivery, setWithDelivery] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const kind = getWindowKind(width);

  const calc = useMemo(() => {
    const areaM2 = (width / 1000) * (height / 1000);
    const perimeterM = (2 * (width + height)) / 1000;

    const windowPrice = areaM2 * PRICE_WINDOW_M2;
    const installPrice = withInstall ? areaM2 * PRICE_INSTALL_M2 : 0;
    const slopesSillPrice = withSlopesSill ? perimeterM * PRICE_SLOPES_SILL_MM : 0;

    const onePiece = windowPrice + installPrice + slopesSillPrice;
    const total = onePiece * quantity + (withDelivery ? PRICE_DELIVERY : 0);

    return { areaM2, perimeterM, windowPrice, installPrice, slopesSillPrice, onePiece, total };
  }, [width, height, quantity, withInstall, withSlopesSill, withDelivery]);

  const calcDetailsText = `Размер: ${width}×${height} мм (${calc.areaM2.toFixed(2)} м²), Кол-во: ${quantity} шт., Монтаж: ${withInstall ? "Да" : "Нет"}, Откосы/Подоконник: ${withSlopesSill ? "Да" : "Нет"}, Сумма: ${formatRub(calc.total)}`;

  return (
    <section id="calculator" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Калькулятор
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Онлайн-расчёт стоимости окна
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Введите размеры — калькулятор покажет, как будет выглядеть окно, и рассчитает стоимость. Тип окна подбирается автоматически по ширине.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
            <SizeField
              label="Ширина"
              unit="мм"
              value={width}
              min={MIN_WIDTH}
              max={MAX_WIDTH}
              step={10}
              onChange={setWidth}
            />
            <SizeField
              label="Высота"
              unit="мм"
              value={height}
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              step={10}
              onChange={setHeight}
              hint="Максимальная высота — 2100 мм"
            />
            <SizeField
              label="Количество"
              unit="шт."
              value={quantity}
              min={1}
              max={12}
              step={1}
              onChange={setQuantity}
              inputWidth="w-12"
            />

            <div className="space-y-3">
              <CheckOption
                label="Монтаж окна"
                sub={`${formatRub(PRICE_INSTALL_M2)} за м²`}
                checked={withInstall}
                onChange={setWithInstall}
              />
              <CheckOption
                label="Откосы + подоконник"
                sub={`${formatRub(PRICE_SLOPES_SILL_MM)} за пог. м`}
                checked={withSlopesSill}
                onChange={setWithSlopesSill}
              />
              <CheckOption
                label="Доставка"
                sub={formatRub(PRICE_DELIVERY)}
                checked={withDelivery}
                onChange={setWithDelivery}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
              <div className="mb-4 flex items-center justify-center rounded-2xl bg-white p-6">
                <WindowDrawing width={width} height={height} kind={kind} />
              </div>
              <div className="text-center text-sm font-bold text-slate-600">{kindLabels[kind]}</div>
              <div className="mt-1 text-center text-xs text-slate-400">
                {width} × {height} мм · {calc.areaM2.toFixed(2)} м²
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[#1a3a5c] p-5 text-white shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] sm:p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Итого</div>
              <div className="mt-2 text-3xl font-black sm:text-4xl">{formatRub(calc.total)}</div>
              <div className="mt-1 text-xs text-slate-300">
                {quantity > 1 ? `за ${quantity} шт.` : "за 1 окно"}
              </div>

              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-200">
                <li className="flex justify-between">
                  <span>Окно ({calc.areaM2.toFixed(2)} м²)</span>
                  <span className="font-bold">{formatRub(calc.windowPrice)}</span>
                </li>
                {withInstall && (
                  <li className="flex justify-between">
                    <span>Монтаж окна</span>
                    <span className="font-bold">{formatRub(calc.installPrice)}</span>
                  </li>
                )}
                {withSlopesSill && (
                  <li className="flex justify-between">
                    <span>Откосы + подоконник</span>
                    <span className="font-bold">{formatRub(calc.slopesSillPrice)}</span>
                  </li>
                )}
                <li className="flex justify-between border-t border-white/10 pt-2">
                  <span>Одно окно под ключ</span>
                  <span className="font-bold">{formatRub(calc.onePiece)}</span>
                </li>
                {withDelivery && (
                  <li className="flex justify-between">
                    <span>Доставка</span>
                    <span className="font-bold">{formatRub(PRICE_DELIVERY)}</span>
                  </li>
                )}
              </ul>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
              >
                Отправить этот расчёт менеджеру
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Предварительный расчёт. Точную цену назовём после бесплатного замера.
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Расчет пластикового окна"
        calcDetails={calcDetailsText}
      />
    </section>
  );
}

function SizeField({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  hint,
  inputWidth = "w-16",
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
  inputWidth?: string;
}) {
  const [text, setText] = useState(String(value));

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
          <input
            type="number"
            inputMode="numeric"
            data-size-input={label}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              const num = Number(e.target.value);
              if (e.target.value !== "" && !Number.isNaN(num) && num >= min && num <= max) {
                onChange(num);
              }
            }}
            onBlur={(e) => {
              const fixed = clamp(Number(e.target.value), min, max);
              onChange(fixed);
              setText(String(fixed));
            }}
            className={`${inputWidth} rounded-full px-2 py-1 text-right text-sm font-black text-[#1a3a5c] outline-none`}
          />
          <span className="pr-2 text-sm font-black text-[#1a3a5c]">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const num = Number(e.target.value);
          onChange(num);
          setText(String(num));
        }}
        className="h-2 w-full cursor-pointer accent-[#ff6b35]"
      />
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function CheckOption({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-bold text-slate-700">
        {label}
        <span className="block text-xs font-semibold text-slate-400">{sub}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-[#ff6b35]"
      />
    </label>
  );
}

function WindowDrawing({ width, height, kind }: { width: number; height: number; kind: WindowKind }) {
  const frame = "#1a3a5c";
  const frameInner = "#2d587b";
  const glass = "#dbeafe";
  const glassShine = "#eff6ff";
  const handle = "#ff6b35";
  const dashed = "#ff6b35";

  const maxW = 300;
  const maxH = 320;
  const ratio = Math.min(maxW / width, maxH / height);
  const w = Math.max(width * ratio, 80);
  const h = Math.max(height * ratio, 80);

  const stroke = 8;

  const Sash = ({ x, sw }: { x: number; sw: number }) => (
    <>
      <rect x={x + 4} y={4} width={sw - 8} height={h - 8} fill={glass} stroke={frameInner} strokeWidth={3} />
      <path d={`M${x + 8} 8 L${x + sw - 8} 8 L${x + sw / 2} ${h - 8} Z`} fill="none" stroke={dashed} strokeWidth={2} strokeDasharray="6 4" />
      <rect x={x + sw - 12} y={h / 2 - 12} width={5} height={24} rx={2} fill={handle} />
    </>
  );

  const Fixed = ({ x, fw }: { x: number; fw: number }) => (
    <>
      <rect x={x + 4} y={4} width={fw - 8} height={h - 8} fill={glass} stroke={frameInner} strokeWidth={3} />
      <path d={`M${x + 10} 10 L${x + fw / 2} 10 L${x + 10} ${h / 2} Z`} fill={glassShine} opacity="0.7" />
    </>
  );

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="max-w-full">
      <rect x={0} y={0} width={w} height={h} rx={4} fill="white" stroke={frame} strokeWidth={stroke} />

      {kind === "single" && <Sash x={0} sw={w} />}

      {kind === "double" && (
        <>
          <Sash x={0} sw={w / 2} />
          <rect x={w / 2 - 3} y={0} width={6} height={h} fill={frame} />
          <Fixed x={w / 2} fw={w / 2} />
        </>
      )}

      {kind === "triple" && (
        <>
          <Fixed x={0} fw={w / 3} />
          <rect x={w / 3 - 3} y={0} width={6} height={h} fill={frame} />
          <Sash x={w / 3} sw={w / 3} />
          <rect x={(2 * w) / 3 - 3} y={0} width={6} height={h} fill={frame} />
          <Fixed x={(2 * w) / 3} fw={w / 3} />
        </>
      )}
    </svg>
  );
}