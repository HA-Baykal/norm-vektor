import { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";
import { useCompare } from "../utils/useCompare";
import {
  conditioners,
  formatRub,
} from "../components/CatalogConditioners";
import { getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";
import {
  buildCompareModel,
  buildCompareGroups,
  totalWithInstall,
  rowHasDiff,
  bestIndexes,
  type CompareModel,
  type CompareGroup,
} from "../utils/compareSpecs";

/* ── localStorage hooks ── */
const BTU_KEY = "vk_compare_btu";

function loadBtuMap(): Record<number, number> {
  try {
    const raw = localStorage.getItem(BTU_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveBtuMap(map: Record<number, number>) {
  try { localStorage.setItem(BTU_KEY, JSON.stringify(map)); } catch { /* */ }
}

const NUMBERS = ["①", "②", "③", "④"];

export default function ComparePage() {
  useSeo(
    "Сравнение кондиционеров — полные характеристики и техпаспорт | Вектор Комфорта, Иркутск",
    "Подробное сравнение выбранных кондиционеров по всем характеристикам техпаспорта: компрессор, хладагент, шум, мощность, цена с монтажом. До 4 моделей одновременно."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "Сравнение кондиционеров", path: "/sravnenie" },
  ]);

  const { selected, toggle, clear } = useCompare();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [btuMap, setBtuMap] = useState<Record<number, number>>(loadBtuMap);
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  /* persist btu */
  useEffect(() => { saveBtuMap(btuMap); }, [btuMap]);

  const setBtu = useCallback((id: number, btu: number) => {
    setBtuMap((prev) => ({ ...prev, [id]: btu }));
  }, []);

  const setAllBtu = useCallback((btu: number) => {
    setBtuMap((prev) => {
      const next: Record<number, number> = { ...prev };
      for (const c of selected) {
        const has = c.variants.some((v) => v.btu === btu);
        if (has) next[c.id] = btu;
      }
      return next;
    });
  }, [selected]);

  /* build models */
  const models: CompareModel[] = useMemo(
    () => selected.map((c) => buildCompareModel(c, btuMap[c.id])),
    [selected, btuMap],
  );

  const groups: CompareGroup[] = useMemo(() => buildCompareGroups(models), [models]);

  /* total diff count */
  const totalRows = useMemo(
    () => groups.reduce((s, g) => s + g.rows.length, 0),
    [groups],
  );
  const diffCount = useMemo(
    () => groups.reduce((s, g) => s + g.rows.filter(rowHasDiff).length, 0),
    [groups],
  );

  /* cheapest model index */
  const cheapestIdx = useMemo(() => {
    if (models.length < 2) return -1;
    const totals = models.map(totalWithInstall);
    const minVal = Math.min(...totals);
    const idx = totals.indexOf(minVal);
    return totals.filter((t) => t === minVal).length === 1 ? idx : -1;
  }, [models]);

  /* available btu values for "compare at same power" */
  const commonBtus = useMemo(() => {
    const all = new Set<number>();
    for (const c of selected) for (const v of c.variants) all.add(v.btu);
    return Array.from(all).sort((a, b) => a - b);
  }, [selected]);

  /* models not yet selected */
  const availableModels = conditioners.filter(
    (c) => !selected.some((s) => s.id === c.id),
  );

  /* ── empty state ── */
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

  const visibleGroups = activeGroup === "all"
    ? groups
    : groups.filter((g) => g.id === activeGroup);

  const filteredGroups = visibleGroups.map((g) => ({
    ...g,
    rows: onlyDiff && models.length > 1 ? g.rows.filter(rowHasDiff) : g.rows,
  })).filter((g) => g.rows.length > 0);

  return (
    <section className="bg-slate-50 py-8 sm:py-14 pb-24 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Каталог</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
          Сравнение кондиционеров
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          Полные характеристики из техпаспорта. Выбрано моделей: {selected.length} из 4.
        </p>

        {/* controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:text-[#1a3a5c]">
            <input
              type="checkbox"
              checked={onlyDiff}
              onChange={(e) => setOnlyDiff(e.target.checked)}
              className="h-4 w-4 accent-[#ff6b35]"
            />
            Только отличия
          </label>
          <span className="text-sm font-bold text-slate-500">
            отличий найдено: {diffCount} из {totalRows}
          </span>
          <button
            type="button"
            onClick={clear}
            className="rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-red-500"
          >
            Очистить
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-[#1a3a5c] shadow-sm transition hover:text-[#ff6b35]"
            >
              + Добавить модель
            </button>
            {showAddDropdown && (
              <div className="absolute left-0 top-full z-30 mt-2 max-h-60 w-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-xl">
                {availableModels.length === 0 ? (
                  <p className="p-3 text-sm font-bold text-slate-500">Все модели уже добавлены</p>
                ) : (
                  availableModels.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { toggle(c.id); setShowAddDropdown(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <img src={getMainCoverPhoto(c)} alt="" className="h-8 w-10 rounded-lg object-cover" />
                      <span>{c.brand} {c.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* BTU quick-select */}
        {commonBtus.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-500">Сравнить при мощности:</span>
            {commonBtus.map((btu) => (
              <button
                key={btu}
                type="button"
                onClick={() => setAllBtu(btu)}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-[#1a3a5c] shadow-sm transition hover:bg-[#ff6b35] hover:text-white"
              >
                {btu} BTU
              </button>
            ))}
          </div>
        )}

        {/* group chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveGroup("all")}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              activeGroup === "all"
                ? "bg-[#1a3a5c] text-white"
                : "bg-white text-slate-600 hover:text-[#1a3a5c]"
            }`}
          >
            Все характеристики
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${
                activeGroup === g.id
                  ? "bg-[#1a3a5c] text-white"
                  : "bg-white text-slate-600 hover:text-[#1a3a5c]"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>

        {/* ── MOBILE VIEW ── */}
        <div className="mt-6 block sm:hidden">
          {/* compact model cards */}
          <div className="grid grid-cols-2 gap-3">
            {models.map((m, mi) => (
              <div key={m.item.id} className="relative rounded-2xl bg-white p-3 shadow-md">
                <button
                  type="button"
                  onClick={() => toggle(m.item.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  ✕
                </button>
                <div className="flex gap-2">
                  <img
                    src={getMainCoverPhoto(m.item)}
                    alt={m.item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-[#ff6b35]">{NUMBERS[mi]}</div>
                    <div className="text-xs font-black text-slate-400">{m.item.brand}</div>
                    <div className="truncate text-xs font-black leading-tight text-[#1a3a5c]">{m.item.name}</div>
                    {cheapestIdx === mi && (
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black text-green-700">
                        Выгоднее всего
                      </span>
                    )}
                  </div>
                </div>
                {/* btu selector */}
                <select
                  value={m.btu}
                  onChange={(e) => setBtu(m.item.id, Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700"
                >
                  {m.item.variants.map((v) => (
                    <option key={v.btu} value={v.btu}>{v.btu} BTU</option>
                  ))}
                </select>
                <div className="mt-1 text-sm font-black text-[#1a3a5c]">
                  {formatRub(totalWithInstall(m))} <span className="text-[10px] font-bold text-slate-400">под ключ</span>
                </div>
              </div>
            ))}
          </div>

          {/* accordion groups */}
          <div className="mt-5 space-y-4">
            {filteredGroups.map((group) => (
              <MobileGroupAccordion
                key={group.id}
                group={group}
                models={models}
              />
            ))}
          </div>
          {filteredGroups.length === 0 && (
            <p className="mt-8 rounded-2xl bg-white p-6 text-center text-sm font-bold text-slate-500">
              Отличий не найдено — все характеристики совпадают.
            </p>
          )}
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="mt-6 hidden sm:block">
          <div className="overflow-x-auto rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-20 bg-white shadow-sm">
                <tr>
                  <th className="sticky left-0 z-30 w-48 bg-white p-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    Характеристика
                  </th>
                  {models.map((m, mi) => (
                    <th key={m.item.id} className="min-w-[170px] border-l border-slate-100 p-4 align-top">
                      <div className="flex items-start gap-2">
                        <span className="text-lg text-[#ff6b35]">{NUMBERS[mi]}</span>
                        <div className="min-w-0">
                          <Link to={`/kondicionery/${getModelUrlSlug(m.item)}`} className="block">
                            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                              <img src={getMainCoverPhoto(m.item)} alt={m.item.name} loading="lazy" className="h-full w-full object-cover" />
                            </div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-[#ff6b35]">{m.item.brand}</div>
                            <div className="mt-0.5 text-sm font-black leading-snug text-[#1a3a5c]">{m.item.name}</div>
                          </Link>
                          <select
                            value={m.btu}
                            onChange={(e) => setBtu(m.item.id, Number(e.target.value))}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700"
                          >
                            {m.item.variants.map((v) => (
                              <option key={v.btu} value={v.btu}>{v.btu} BTU — до {v.area} м²</option>
                            ))}
                          </select>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-black text-[#1a3a5c]">{formatRub(totalWithInstall(m))}</span>
                            {cheapestIdx === mi && (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black text-green-700">Выгоднее</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggle(m.item.id)}
                            className="mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                          >
                            ✕ Убрать
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={models.length + 1} className="p-8 text-center text-sm font-bold text-slate-500">
                      Отличий не найдено — все характеристики совпадают.
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((group) => (
                    <DesktopGroupBlock
                      key={group.id}
                      group={group}
                      modelCount={models.length}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── price summary ── */}
        <div className="mt-10 rounded-[1.5rem] bg-[#1a3a5c] p-6 sm:p-10">
          <h2 className="text-xl font-black text-white sm:text-2xl">Итоговые цены</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {models.map((m, mi) => (
              <div key={m.item.id} className="rounded-2xl bg-white/10 p-4">
                <div className="text-xs font-black uppercase text-orange-300">{NUMBERS[mi]} {m.item.brand}</div>
                <div className="mt-1 text-sm font-bold text-white/80">{m.item.name}</div>
                <div className="mt-3 text-2xl font-black text-white">{formatRub(totalWithInstall(m))}</div>
                <div className="text-xs font-bold text-white/60">под ключ</div>
                <Link
                  to={`/kondicionery/${getModelUrlSlug(m.item)}`}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#ff6b35] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#e95620]"
                >
                  Подробнее и заказать →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-[1.5rem] bg-[#1a3a5c] p-6 text-center sm:p-8">
          <h2 className="text-xl font-black text-white sm:text-2xl">Нужна помощь с выбором?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            Инженер подберёт кондиционер под вашу площадь, окна и бюджет — бесплатно. Позвоните или напишите в чат.
          </p>
          <a
            href="tel:+79149146606"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            📞 +7 (914) 914-66-06
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Mobile accordion group ── */
function MobileGroupAccordion({
  group,
  models,
}: {
  group: CompareGroup;
  models: CompareModel[];
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-black text-[#1a3a5c]">{group.title}</span>
        <span className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="border-t border-slate-100">
          {group.rows.map((row) => {
            const diff = rowHasDiff(row);
            const best = bestIndexes(row, models.length);
            return (
              <div
                key={row.label}
                className={`border-b border-slate-50 px-4 py-3 last:border-b-0 ${diff ? "bg-orange-50/60" : ""}`}
              >
                <div className="text-xs font-black text-[#1a3a5c]">{row.label}</div>
                <div className="mt-2 space-y-1.5">
                  {row.values.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-black text-[#ff6b35]">{NUMBERS[i]}</span>
                      <span className={`flex-1 text-xs font-bold text-slate-700 ${best.includes(i) ? "text-green-700" : ""}`}>
                        {v}
                        {best.includes(i) && (
                          <span className="ml-1.5 inline-block rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-black text-green-700">
                            Лучше
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Desktop group block ── */
function DesktopGroupBlock({
  group,
  modelCount,
}: {
  group: CompareGroup;
  modelCount: number;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={modelCount + 1}
          className="sticky left-0 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wider text-[#1a3a5c]"
        >
          {group.title}
        </td>
      </tr>
      {group.rows.map((row) => {
        const diff = rowHasDiff(row);
        const best = bestIndexes(row, modelCount);
        return (
          <tr
            key={row.label}
            className={`border-t border-slate-100 ${diff ? "bg-orange-50/60" : ""}`}
          >
            <td className={`sticky left-0 z-10 p-4 text-sm font-black text-[#1a3a5c] ${diff ? "bg-orange-50" : "bg-white"}`}>
              {row.label}
              {diff && modelCount > 1 && (
                <span className="ml-2 inline-block rounded-full bg-orange-200 px-1.5 py-0.5 text-[9px] font-black text-orange-800">
                  отличие
                </span>
              )}
            </td>
            {row.values.map((v, i) => (
              <td key={i} className="border-l border-slate-100 p-4 text-sm font-bold text-slate-700">
                {v}
                {best.includes(i) && (
                  <span className="ml-1.5 inline-block rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-black text-green-700">
                    Лучше
                  </span>
                )}
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
