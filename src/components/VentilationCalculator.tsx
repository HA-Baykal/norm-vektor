import { useMemo, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";

type VentProduct = {
  id: string;
  name: string;
  pricePerPoint: number;
  byQuote?: boolean;
  short: string;
  specs: string[];
  badge?: string;
};

const products: VentProduct[] = [
  {
    id: "asp100",
    name: "Ballu OneAir ASP-100",
    pricePerPoint: 39000,
    badge: "Хит",
    short:
      "Приточный очиститель воздуха для помещений до 40 м². Подаёт свежий очищенный воздух с улицы без открывания окон.",
    specs: [
      "Производительность до 125 м³/час",
      "Площадь до 40 м² (до 4 человек)",
      "Фильтрация: префильтр + HEPA H13",
      "Уровень шума 19–47 дБ, 7 скоростей",
      "Управление с телефона, Алиса и Маруся",
      "Подогрев воздуха (опция), работа до −40 °C",
    ],
  },
  {
    id: "asp200",
    name: "Ballu OneAir ASP-200",
    pricePerPoint: 62000,
    short:
      "Более мощный приточный очиститель для больших помещений и семьи. Повышенная производительность и очистка воздуха.",
    specs: [
      "Повышенная производительность воздуха",
      "Для больших комнат и семьи",
      "Многоступенчатая фильтрация HEPA",
      "Подогрев входящего воздуха",
      "Управление с телефона и голосом",
      "Тихая работа, ночной режим",
    ],
  },
  {
    id: "vakio-base",
    name: "Vakio Recuperator Base",
    pricePerPoint: 35000,
    short:
      "Приточно-вытяжная установка с рекуперацией тепла. Экономит на отоплении: греет входящий воздух теплом выходящего.",
    specs: [
      "Производительность до 120 м³/час",
      "Площадь до 30 м²",
      "Рекуперация тепла, КПД до 80%",
      "Работа при температуре до −47 °C",
      "Фильтрация класса F6",
      "Уровень шума 20–40 дБ",
    ],
  },
  {
    id: "kiv125",
    name: "Приточный клапан КИВ-125",
    pricePerPoint: 6000,
    short:
      "Простой и недорогой приточный клапан для естественного притока свежего воздуха. Экономичное решение без электричества.",
    specs: [
      "Естественный приток свежего воздуха",
      "Не требует электричества",
      "Фильтр от пыли и насекомых",
      "Утеплённый корпус, защита от холода",
      "Незаметный монтаж в стену",
      "Самое доступное решение",
    ],
  },
  {
    id: "duct-exhaust",
    name: "Вытяжная вентиляция воздуховодами",
    pricePerPoint: 0,
    byQuote: true,
    badge: "Под ключ",
    short:
      "Проектирование и монтаж вытяжной системы с разводкой воздуховодов по потолку и подключением в вентиляционную шахту. Индивидуальное решение для квартир, домов, кафе и коммерческих помещений.",
    specs: [
      "Разводка воздуховодов по потолку в шахту",
      "Индивидуальный проект под ваше помещение",
      "Скрытый монтаж за подвесным потолком",
      "Подбор диаметров и мощности вытяжки",
      "Решение для кухонь, санузлов, кафе и офисов",
      "Стоимость — после бесплатного замера",
    ],
  },
];

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export default function VentilationCalculator() {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const [points, setPoints] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const product = products.find((p) => p.id === selectedId) ?? products[0];
  const total = useMemo(() => product.pricePerPoint * points, [product, points]);

  const calcDetailsText = product.byQuote
    ? `Модель: ${product.name} (Индивидуальный проект воздуховодов)`
    : `Модель: ${product.name}, Точек: ${points} шт., Итого: ${formatRub(total)}`;

  return (
    <section id="calculator" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Калькулятор
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Расчёт стоимости вентиляции
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Выберите оборудование и количество точек установки. Цена указана с монтажом. При выборе устройства вы увидите его описание и характеристики.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Выберите оборудование</div>
            <div className="space-y-3">
              {products.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    selectedId === p.id
                      ? "border-[#ff6b35] bg-orange-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#1a3a5c]">{p.name}</span>
                      {p.badge && (
                        <span className="rounded-full bg-[#ff6b35] px-2 py-0.5 text-[10px] font-black text-white">
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">
                      {p.byQuote ? "Цена по замеру" : `${formatRub(p.pricePerPoint)} за точку`}
                    </div>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selectedId === p.id ? "border-[#ff6b35] bg-[#ff6b35]" : "border-slate-300"
                    }`}
                  >
                    {selectedId === p.id && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              ))}
            </div>

            {!product.byQuote && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Количество точек</span>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#1a3a5c] shadow-sm">
                    {points} шт.
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer accent-[#ff6b35]"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[1.5rem] bg-slate-50 p-5 shadow-sm sm:rounded-[2rem] sm:p-7">
              <h3 className="text-xl font-black text-[#1a3a5c]">{product.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{product.short}</p>
              <ul className="mt-4 space-y-2">
                {product.specs.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6b35]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] bg-[#1a3a5c] p-5 text-white shadow-2xl shadow-slate-900/15 sm:rounded-[2rem] sm:p-7">
              {product.byQuote ? (
                <>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Стоимость</div>
                  <div className="mt-2 text-2xl font-black sm:text-3xl">Рассчитывается по замеру</div>
                  <div className="mt-2 text-sm text-slate-300">
                    Цена зависит от длины воздуховодов, количества точек и сложности разводки. Замер и консультация — бесплатно.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200">Итого с установкой</div>
                  <div className="mt-2 text-3xl font-black sm:text-4xl">{formatRub(total)}</div>
                  <div className="mt-1 text-xs text-slate-300">
                    {product.name} · {points} {points === 1 ? "точка" : "точек"}
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
              >
                {product.byQuote ? "Заказать бесплатный замер" : "Отправить расчёт менеджеру"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Предварительный расчёт. Точную цену назовём после бесплатного выезда.
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceName="Расчет системы вентиляции"
        calcDetails={calcDetailsText}
      />
    </section>
  );
}