import { useMemo, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function pricePerPoint(count: number): number {
  if (count <= 1) return 4500;
  if (count === 2) return 4000;
  if (count === 3) return 3500;
  if (count <= 10) return 3000;
  if (count <= 20) return 2500;
  return 2000;
}

export default function DrillingCalculator() {
  const [points, setPoints] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const perPoint = useMemo(() => pricePerPoint(points), [points]);
  const total = perPoint * points;

  const calcDetailsText = `Алмазное бурение: ${points} шт. (${formatRub(perPoint)}/шт.), Итого: ${formatRub(total)}`;

  return (
    <section id="calculator" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Калькулятор
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Расчёт стоимости алмазного бурения
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Укажите количество отверстий — чем больше точек, тем дешевле каждое. Бурим в бетоне, железобетоне и кирпиче под трубы, вентиляцию и кондиционеры.
          </p>
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-slate-50 p-6 shadow-sm sm:rounded-[2rem] sm:p-8 lg:mt-10">
          <h3 className="text-xl font-black text-[#1a3a5c] sm:text-2xl">Что такое алмазное бурение и для чего оно нужно</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Алмазное бурение — это безударный способ создания идеально ровных круглых отверстий в бетоне,
            железобетоне и кирпиче с помощью коронки с алмазным напылением. В отличие от перфоратора,
            бурение проходит без ударов, вибрации и трещин — конструкция стены остаётся целой.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#ff6b35]">Где применяется</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {[
                  "Отверстия под кондиционеры (трасса на улицу)",
                  "Проходы под вентиляцию и вытяжку",
                  "Ввод труб водоснабжения и канализации",
                  "Прокладка электрокабелей и коммуникаций",
                  "Отверстия в перекрытиях между этажами",
                  "Проёмы под приточные клапаны и бризеры",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b35]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-[#ff6b35]">Преимущества метода</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {[
                  "Идеально ровные края — без доработки",
                  "Без трещин и сколов на стене",
                  "Минимум пыли и шума",
                  "Точный диаметр от 32 до 250 мм",
                  "Работа с армированным бетоном",
                  "Быстро — экономит время ремонта",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b35]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600 sm:p-5">
            <span className="font-black text-[#1a3a5c]">Сухое и мокрое бурение.</span> Сухой способ с
            промышленным пылесосом — почти без пыли, идеально для уже готового ремонта. Мокрый способ с
            подачей воды — для сверхтвёрдых материалов и больших диаметров, обеспечивает охлаждение коронки.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Количество отверстий</span>
              <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={points}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setPoints(Number.isNaN(n) || n < 1 ? 1 : Math.min(n, 100));
                  }}
                  className="w-14 rounded-full px-2 py-1 text-right text-sm font-black text-[#1a3a5c] outline-none"
                />
                <span className="pr-2 text-sm font-black text-[#1a3a5c]">шт.</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={Math.min(points, 30)}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-[#ff6b35]"
            />

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">Цена за отверстие</div>
              <ul className="space-y-2 text-sm">
                {[
                  ["1 отверстие", "4 500 ₽", points === 1],
                  ["2 отверстия", "4 000 ₽", points === 2],
                  ["3 отверстия", "3 500 ₽", points === 3],
                  ["4–10 отверстий", "3 000 ₽", points >= 4 && points <= 10],
                  ["11–20 отверстий", "2 500 ₽", points >= 11 && points <= 20],
                  ["больше 20", "2 000 ₽", points > 20],
                ].map(([label, price, active]) => (
                  <li
                    key={label as string}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                      active ? "bg-orange-50 font-black text-[#1a3a5c]" : "text-slate-600"
                    }`}
                  >
                    <span>{label}</span>
                    <span className={active ? "text-[#ff6b35]" : ""}>{price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
              <div className="flex items-center justify-center rounded-2xl bg-white p-8">
                <div className="text-center">
                  <div className="text-7xl">🕳️</div>
                  <div className="mt-4 text-4xl font-black text-[#1a3a5c]">{points}</div>
                  <div className="text-sm font-semibold text-slate-500">
                    {points === 1 ? "отверстие" : "отверстий"}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm font-bold text-slate-600">
                Цена за отверстие: {formatRub(perPoint)}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-[#1a3a5c] p-5 text-white shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] sm:p-7">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Итого</div>
              <div className="mt-2 text-3xl font-black sm:text-4xl">{formatRub(total)}</div>
              <div className="mt-1 text-xs text-slate-300">
                {points} × {formatRub(perPoint)}
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
              >
                Отправить расчёт на замер
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Предварительный расчёт. Точную цену назовём после уточнения диаметра и материала стен.
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Расчет алмазного бурения"
        calcDetails={calcDetailsText}
      />
    </section>
  );
}