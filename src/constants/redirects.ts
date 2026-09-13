/**
 * Единый источник правды для 301-редиректов (склейка дублей и старых адресов).
 *
 * Правила намеренно вынесены в один модуль: они используются в четырёх местах,
 * и если списки вести вручную — они разъезжаются, и часть дублей остаётся в индексе.
 *
 *   1. vite.config.ts  -> vercel.json (redirects + страховочные rewrites)
 *                         и public/_redirects (хостинги в стиле Netlify/Cloudflare)
 *   2. api/page.ts     -> серверный HTTP 301, если слой маршрутизации хостинга
 *                         не сработал (устаревший vercel.json, другой хостинг, preview)
 *   3. src/App.tsx     -> клиентский <Navigate> для переходов внутри SPA
 *
 * Модуль не должен тянуть React и другие клиентские зависимости: его импортирует
 * edge-функция api/page.ts.
 */

export const SITE_ORIGIN = "https://www.vektor-komforta.ru";

/** Точные адреса: старый/дубль URL -> канонический URL. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // Алмазное бурение: транслитерационные варианты и старые названия услуги
  "/almaznoe-burenie-i-sverlenie": "/almaznoe-burenie",
  "/almaznaya-rezka": "/almaznoe-burenie",
  "/almaznoe-burenie-irkutsk": "/almaznoe-burenie",
  "/burenie-otverstij": "/almaznoe-burenie",
  // Мёртвые URL, которые уже успел проиндексировать Яндекс (из SEO-аудита)
  "/burenie": "/almaznoe-burenie",
  "/standarty-montazha": "/standarty",
  // Вентиляция: варианты написания
  "/ventilyatsiya": "/ventilyaciya",
  "/ventilyaciya-irkutsk": "/ventilyaciya",
  // Кондиционеры: варианты транслита
  "/konditsionery": "/kondicionery",
  "/split-sistemy": "/kondicionery",
  // Окна: варианты
  "/plastikovye-okna": "/okna",
  "/okna-pvh": "/okna",
  // Старая статья блога переехала
  "/articles/kak-vybrat-kondicioner": "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi",
};

export interface PatternRedirect {
  /** Шаблон в синтаксисе Vercel/path-to-regexp: `:slug` — сегмент, `:rest*` — хвост. */
  source: string;
  /** Куда ведёт; может содержать те же плейсхолдеры, что и source. */
  destination: string;
}

/** Групповые правила для семейств старых адресов. */
export const LEGACY_PATTERN_REDIRECTS: PatternRedirect[] = [
  // Старые гео-ссылки с префиксом /burenie-... -> канонический раздел
  { source: "/burenie-v-:rest*", destination: "/almaznoe-burenie" },
  { source: "/burenie-na-:rest*", destination: "/almaznoe-burenie" },
  // Алиас карточек остекления: канонический адрес — /okna/:slug
  { source: "/windows/:slug", destination: "/okna/:slug" },
];

interface CompiledPattern {
  re: RegExp;
  keys: string[];
}

const compiledPatterns = new Map<string, CompiledPattern>();

/**
 * Компилирует шаблон Vercel в RegExp.
 * Поддерживаем только то, что реально используем: `:name` (один сегмент)
 * и `:name*` (хвост пути). Плейсхолдер может стоять внутри сегмента,
 * например `/burenie-v-:rest*`.
 */
function compilePattern(source: string): CompiledPattern {
  const cached = compiledPatterns.get(source);
  if (cached) return cached;

  const keys: string[] = [];
  const body = source.replace(/:([A-Za-z0-9_]+)(\*)?|[.*+?^${}()|[\]\\]/g, (match, name, star) => {
    if (!name) return `\\${match}`; // экранируем служебные символы регулярки
    keys.push(name);
    return star ? "(.*)" : "([^/]+)";
  });

  const compiled = { re: new RegExp(`^${body}$`), keys };
  compiledPatterns.set(source, compiled);
  return compiled;
}

/**
 * Приводит путь к каноническому виду: без завершающего слеша и в нижнем регистре.
 * Приведение идемпотентно, поэтому не может создать петлю редиректов.
 */
export function normalizePath(rawPath: string): string {
  let p = rawPath || "/";
  try {
    p = decodeURIComponent(p);
  } catch {
    // Некорректный percent-encoding ("%zz") — работаем с сырым значением,
    // иначе decodeURIComponent бросит исключение и функция ответит 500.
  }
  p = p.toLowerCase();
  if (p !== "/" && p.endsWith("/")) p = p.slice(0, -1);
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

/**
 * Возвращает канонический адрес для старого/дубль-URL или null, если правило не найдено.
 */
export function resolveLegacyRedirect(rawPath: string): string | null {
  const path = normalizePath(rawPath);
  const exact = LEGACY_REDIRECTS[path];
  if (exact) return exact;

  for (const rule of LEGACY_PATTERN_REDIRECTS) {
    const { re, keys } = compilePattern(rule.source);
    const match = path.match(re);
    if (!match) continue;
    let destination = rule.destination;
    keys.forEach((key, i) => {
      destination = destination.replace(new RegExp(`:${key}\\*?`, "g"), match[i + 1] || "");
    });
    return normalizePath(destination);
  }

  return null;
}

/**
 * Преобразует шаблон Vercel в синтаксис файла _redirects (Netlify/Cloudflare Pages):
 * `/burenie-v-:rest*` -> `/burenie-v-*`, именованные `:slug` остаются как есть.
 */
export function toNetlifyPattern(source: string): string {
  return source.replace(/:[A-Za-z0-9_]+\*/g, "*");
}
