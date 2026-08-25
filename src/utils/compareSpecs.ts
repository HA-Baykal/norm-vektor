import {
  type Conditioner,
  type PowerVariant,
  INSTALL_PRICE,
} from "../components/CatalogConditioners";
import {
  getOfficialSpecification,
  type OfficialSpecification,
} from "../data/officialSpecsEngine";

export interface CompareModel {
  item: Conditioner;
  btu: number;
  variant: PowerVariant;
  specs: OfficialSpecification;
}

export function buildCompareModel(item: Conditioner, btu?: number): CompareModel {
  const variant = item.variants.find((v) => v.btu === btu) ?? item.variants[0];
  const specs = getOfficialSpecification(item, variant.btu);
  return { item, btu: variant.btu, variant, specs };
}

export function totalWithInstall(m: CompareModel): number {
  if (m.item.type === "Полупромышленный" || m.item.type === "Промышленный" || m.item.type === "Мобильный") {
    return m.variant.price;
  }
  return m.variant.price + INSTALL_PRICE;
}

/* ── helpers ────────────────────────────────────────────────────────── */

export function firstNumber(str: string): number | null {
  if (!str) return null;
  const cleaned = str.replace(/,/g, ".");
  const m = cleaned.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

export function energyRank(str: string): number {
  if (!str) return 0;
  const s = str.toUpperCase();
  if (s.includes("A+++")) return 4;
  if (s.includes("A++")) return 3;
  if (s.includes("A+")) return 2;
  if (s.includes("A")) return 1;
  return 0;
}

function allEqual(values: (number | null)[]): boolean {
  const defined = values.filter((v) => v !== null);
  if (defined.length === 0) return true;
  return defined.every((v) => v === defined[0]);
}

/* ── row / group types ─────────────────────────────────────────────── */

export interface CompareRow {
  label: string;
  values: string[];
  scores: (number | null)[];
  better: "min" | "max" | "yes" | null;
}

export interface CompareGroup {
  id: string;
  title: string;
  rows: CompareRow[];
}

/* ── builders ──────────────────────────────────────────────────────── */

function mkRow(
  label: string,
  values: string[],
  scores: (number | null)[],
  better: "min" | "max" | "yes" | null,
): CompareRow {
  return { label, values, scores, better };
}

function strValues(models: CompareModel[], fn: (m: CompareModel) => string): string[] {
  return models.map(fn);
}

function numValues(models: CompareModel[], fn: (m: CompareModel) => string): (number | null)[] {
  return models.map((m) => firstNumber(fn(m)));
}

function nullScores(count: number): (number | null)[] {
  return Array(count).fill(null);
}

export function buildCompareGroups(models: CompareModel[]): CompareGroup[] {
  const v = (fn: (m: CompareModel) => string) => strValues(models, fn);
  const s = (fn: (m: CompareModel) => string) => numValues(models, fn);
  const ns = () => nullScores(models.length);

  /* ── 🏷️ Основное ── */
  const basic: CompareRow[] = [
    mkRow("Бренд", v((m) => m.item.brand), ns(), null),
    mkRow("Модель", v((m) => m.item.name), ns(), null),
    mkRow("Тип сплит-системы", v((m) => m.item.type), ns(), null),
    mkRow("Страна сборки", v((m) => m.item.country), ns(), null),
    mkRow(
      "Поставка и сервис",
      v((m) => `${m.item.brand} (сертифицированный дилер в Иркутске)`),
      ns(),
      null,
    ),
    mkRow(
      "Официальный дистрибьютор",
      v((m) => m.specs.distributor),
      ns(),
      null,
    ),
    mkRow(
      "Гарантия",
      v((m) => m.specs.warrantyYears),
      s((m) => m.specs.warrantyYears),
      "max",
    ),
    mkRow(
      "Срок службы",
      v((m) => m.specs.serviceLife),
      s((m) => m.specs.serviceLife),
      "max",
    ),
  ];

  /* ── ❄️ Мощность и площадь ── */
  const power: CompareRow[] = [
    mkRow(
      "Индекс мощности (BTU)",
      v((m) => `${m.btu}`),
      models.map((m) => m.btu),
      null,
    ),
    mkRow(
      "Рекомендуемая площадь",
      v((m) => `до ${m.variant.area} м²`),
      models.map((m) => m.variant.area),
      "max",
    ),
    mkRow(
      "Мощность охлаждения",
      v((m) => m.variant.cooling),
      s((m) => m.variant.cooling),
      "max",
    ),
    mkRow(
      "Мощность обогрева",
      v((m) => m.variant.heating),
      s((m) => m.variant.heating),
      "max",
    ),
    mkRow(
      "Класс энергоэффективности",
      v((m) => m.specs.energyClass),
      models.map((m) => energyRank(m.specs.energyClass)),
      "max",
    ),
    mkRow(
      "Доступные мощности модели",
      v((m) => m.item.variants.map((vv) => `${vv.btu} BTU`).join(", ")),
      ns(),
      null,
    ),
  ];

  /* ── ⚙️ Компрессор, хладагент и трасса ── */
  const compressor: CompareRow[] = [
    mkRow(
      "Тип и марка компрессора",
      v((m) => m.specs.compressorBrand),
      ns(),
      null,
    ),
    mkRow(
      "Хладагент",
      v((m) => m.specs.refrigerant),
      ns(),
      null,
    ),
    mkRow(
      "Заводская заправка фреона",
      v((m) => m.specs.freonWeight),
      ns(),
      null,
    ),
    mkRow(
      "Диаметр труб",
      v((m) => m.specs.pipes),
      ns(),
      null,
    ),
    mkRow(
      "Макс. длина трассы",
      v((m) => m.specs.maxPipeLength),
      s((m) => m.specs.maxPipeLength),
      "max",
    ),
  ];

  /* ── 🔇 Шум и рабочие диапазоны ── */
  const noise: CompareRow[] = [
    mkRow(
      "Шум внутреннего блока",
      v((m) => m.specs.minNoise),
      s((m) => m.specs.minNoise),
      "min",
    ),
    mkRow(
      "Шум внешнего блока",
      v((m) => m.specs.maxOutdoorNoise),
      s((m) => m.specs.maxOutdoorNoise),
      "min",
    ),
    mkRow(
      "Климат в помещении",
      v((m) => m.specs.indoorTempRange),
      ns(),
      null,
    ),
    mkRow(
      "Зимний диапазон (обогрев)",
      v((m) => m.specs.winterRange),
      s((m) => m.specs.winterRange),
      "min",
    ),
    mkRow(
      "Напряжение питания",
      v((m) => m.specs.voltageRange),
      ns(),
      null,
    ),
    mkRow(
      "Умный дом",
      v((m) => (m.item.smartHome ? "Да" : "Нет")),
      models.map((m) => (m.item.smartHome ? 1 : 0)),
      "yes",
    ),
  ];

  /* ── 💰 Цена и монтаж ── */
  const price: CompareRow[] = [
    mkRow(
      "Цена оборудования",
      v((m) => `${m.variant.price.toLocaleString("ru-RU")} ₽`),
      models.map((m) => m.variant.price),
      "min",
    ),
    mkRow(
      "Цена до скидки",
      v((m) =>
        m.variant.oldPrice ? `${m.variant.oldPrice.toLocaleString("ru-RU")} ₽` : "—",
      ),
      models.map((m) => m.variant.oldPrice ?? null),
      null,
    ),
    mkRow(
      "Ваша выгода",
      v((m) => {
        if (!m.variant.oldPrice) return "—";
        const d = m.variant.oldPrice - m.variant.price;
        return d > 0 ? `${d.toLocaleString("ru-RU")} ₽` : "—";
      }),
      models.map((m) =>
        m.variant.oldPrice ? m.variant.oldPrice - m.variant.price : null,
      ),
      "max",
    ),
    mkRow(
      "Монтаж",
      v((m) =>
        m.item.type === "Мобильный"
          ? "Не требуется"
          : m.item.type === "Полупромышленный" || m.item.type === "Промышленный"
            ? "Рассчитывается после осмотра"
            : `${INSTALL_PRICE.toLocaleString("ru-RU")} ₽`,
      ),
      models.map((m) =>
        m.item.type === "Мобильный" || m.item.type === "Полупромышленный" || m.item.type === "Промышленный"
          ? null
          : INSTALL_PRICE,
      ),
      null,
    ),
    mkRow(
      "Итого под ключ",
      v((m) => `${totalWithInstall(m).toLocaleString("ru-RU")} ₽`),
      models.map((m) => totalWithInstall(m)),
      "min",
    ),
  ];

  /* ── ✨ Функции и оснащение (матрица) ── */
  const stripEmoji = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, "").trim();
  const allFeatures: string[] = [];
  for (const m of models) {
    for (const f of m.specs.officialFeatures) {
      const clean = stripEmoji(f);
      if (clean && !allFeatures.includes(clean)) allFeatures.push(clean);
    }
  }
  const features: CompareRow[] = allFeatures.map((feat) =>
    mkRow(
      feat,
      models.map((m) => {
        const has = m.specs.officialFeatures.some(
          (f) => stripEmoji(f) === feat,
        );
        return has ? "Есть" : "—";
      }),
      models.map((m) => {
        const has = m.specs.officialFeatures.some(
          (f) => stripEmoji(f) === feat,
        );
        return has ? 1 : 0;
      }),
      "yes",
    ),
  );

  return [
    { id: "basic", title: "🏷️ Основное", rows: basic },
    { id: "power", title: "❄️ Мощность и площадь", rows: power },
    { id: "compressor", title: "⚙️ Компрессор, хладагент и трасса", rows: compressor },
    { id: "noise", title: "🔇 Шум и рабочие диапазоны", rows: noise },
    { id: "price", title: "💰 Цена и монтаж", rows: price },
    { id: "features", title: "✨ Функции и оснащение", rows: features },
  ];
}

/* ── diff helpers ──────────────────────────────────────────────────── */

export function rowHasDiff(row: CompareRow): boolean {
  return new Set(row.values.map((v) => String(v))).size > 1;
}

export function bestIndexes(
  row: CompareRow,
  modelCount: number,
): number[] {
  if (modelCount < 2 || !row.better || !rowHasDiff(row)) return [];
  const scores = row.scores;
  if (!scores || scores.every((s) => s === null)) return [];
  if (allEqual(scores)) return [];

  const validIdx = scores
    .map((s, i) => (s !== null ? i : -1))
    .filter((i) => i >= 0);
  if (validIdx.length === 0) return [];

  if (row.better === "min") {
    const minVal = Math.min(...validIdx.map((i) => scores[i] as number));
    return validIdx.filter((i) => scores[i] === minVal);
  }
  if (row.better === "max") {
    const maxVal = Math.max(...validIdx.map((i) => scores[i] as number));
    return validIdx.filter((i) => scores[i] === maxVal);
  }
  if (row.better === "yes") {
    return validIdx.filter((i) => scores[i] === 1);
  }
  return [];
}
