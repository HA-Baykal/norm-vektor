import { useState } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import { useCompare } from "../utils/useCompare";
import {
  formatRub,
  INSTALL_PRICE,
  type Conditioner,
} from "../components/CatalogConditioners";
import { getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";

// Минимальный вариант мощности (первый в списке — минимальный BTU)
const getVariant = (c: Conditioner) => c.variants[0];

type CompareRow = {
  label: string;
  values: (string | number)[];
};

export default function ComparePage() {
  useSeo(
    "Сравнение кондиционеров — характеристики, цены | Вектор Комфорта, Иркутск",
    "Сравните выбранные кондиционеры по характеристикам: площадь, мощность BTU, охлаждение, обогрев, уровень шума, умный дом и цена с монтажом. До 4 моделей одновременно."
  );
  useBreadcrumb([{ name: "Сравнение кондиционеров", path: "/sravnenie" }]);

  const { selected, toggle, clear } = useCompare();
  const [onlyDiff, setOnlyDiff] = useState(true);

  if (selected.length === 0) {
    return (
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="text-6xl">⚖️</div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-[#1a3a5c] sm:text-4xl">Сравнение кондиционеров</h1>
          <p className="mt-4 text-lg font-bold text-slate-600">Нет моделей для сравнения</p>
          <p className="mt-2 text-base leading-7 text-slate-500">
            Отметьте галочку «Сравнить» на карточках кондиционеров в каталоге — сюда можно добавить до 4 моделей.
          </p>
          <Link
            to="/kondicionery#catalog"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            Перейти в каталог →
          </Link>
        </div>
      </section>
    );
  }

  const rows: CompareRow[] = [
    { label: "Бренд", values: selected.map((c) => c.brand) },
    { label: "Модель", values: selected.map((c) => c.name) },
    { label: "Тип", values: selected.map((c) => c.type) },
    { label: "Площадь", values: selected.map((c) => `до ${getVariant(c).area} м²`) },
    { label: "Мощность BTU", values: selected.map((c) => getVariant(c).btu) },
    { label: "Охлаждение", values: selected.map((c) => getVariant(c).cooling) },
    { label: "Обогрев", values: selected.map((c) => getVariant(c).heating) },
    { label: "Уровень шума", values: selected.map((c) => c.noise) },
    { label: "Страна", values: selected.map((c) => c.country) },
    { label: "Умный дом", values: selected.map((c) => (c.smartHome ? "✅" : "—")) },
    {
      label: "Цена",
      values: selected.map((c) => {
        const price = formatRub(getVariant(c).price);
        return c.type === "Полупромышленный" ? price : `${price} + монтаж ${formatRub(INSTALL_PRICE)}`;
      }),
    },
  ];

  const hasDiff = (row: CompareRow) => new Set(row.values.map((v) => String(v))).size > 1;
  const visibleRows = onlyDiff && selected.length > 1 ? rows.filter(hasDiff) : rows;

  return (
    <section className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Каталог</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">Сравнение кондиционеров</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Характеристики указаны для минимальной мощности (BTU) каждой модели. Выбрано моделей: {selected.length} из 4.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:text-[#1a3a5c]">
            <input
              type="checkbox"
              checked={onlyDiff}
              onChange={(e) => setOnlyDiff(e.target.checked)}
              className="h-4 w-4 accent-[#ff6b35]"
            />
            Только отличия
          </label>
          <button
            type="button"
            onClick={clear}
            className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-red-500"
          >
            Очистить сравнение
          </button>
          <Link to="/kondicionery#catalog" className="rounded-2xl px-4 py-3 text-sm font-bold text-[#1a3a5c] transition hover:bg-white">
            + Добавить модель из каталога
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-40 bg-white p-4 align-bottom text-xs font-black uppercase tracking-wider text-slate-500 sm:w-48">
                  Характеристика
                </th>
                {selected.map((c) => (
                  <th key={c.id} className="min-w-[180px] border-l border-slate-100 p-4 align-top">
                    <Link to={`/kondicionery/${getModelUrlSlug(c)}`} className="block">
                      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                        <img src={getMainCoverPhoto(c)} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <div className="mt-3 text-xs font-black uppercase tracking-wider text-[#ff6b35]">{c.brand}</div>
                      <div className="mt-1 text-sm font-black leading-snug text-[#1a3a5c]">{c.name}</div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggle(c.id)}
                      className="mt-3 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                    >
                      ✕ Убрать
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={selected.length + 1} className="p-8 text-center text-sm font-bold text-slate-500">
                    Отличий не найдено — все характеристики выбранных моделей совпадают.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const diff = hasDiff(row);
                  return (
                    <tr key={row.label} className={`border-t border-slate-100 ${diff ? "bg-orange-50/60" : ""}`}>
                      <td className={`sticky left-0 z-10 p-4 text-sm font-black text-[#1a3a5c] ${diff ? "bg-orange-50" : "bg-white"}`}>
                        {row.label}
                      </td>
                      {row.values.map((v, i) => (
                        <td key={selected[i].id} className="border-l border-slate-100 p-4 text-sm font-bold text-slate-700">
                          {v}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-[1.5rem] bg-[#1a3a5c] p-8 text-center sm:p-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Нужна помощь с выбором?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Инженер подберёт кондиционер под вашу площадь, окна и бюджет — бесплатно. Позвоните или напишите в чат.
          </p>
          <a
            href="tel:+79149146606"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            📞 +7 (914) 914-66-06
          </a>
        </div>
      </div>
    </section>
  );
}
