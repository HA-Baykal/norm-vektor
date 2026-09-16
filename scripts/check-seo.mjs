#!/usr/bin/env node
// ============================================================================
// scripts/check-seo.mjs — проверка «что видит краулер» (сырой HTML, без JS).
//
// Адаптация скрипта из SEO-аудита (P0: CSR → индексируемый HTML) под стек
// этого проекта: Vercel edge-функции + одностраничный билд (single-file).
// Отличия от оригинала аналитика:
//   • список URL берётся из sitemap.xml целевого сайта (не руками);
//   • canonical проверяется не только на наличие, но и на самоссылку;
//   • проверяется meta robots / X-Robots-Tag на noindex — регрессия от
//     2026-09-13, когда главный страницы уходили краулеру с noindex;
//   • сайт-левел проверки: честный 404 (не soft-404), 301 со старых адресов,
//     склейка слешей, robots.txt, валидность sitemap.
//
// Запуск:
//   node scripts/check-seo.mjs https://www.vektor-komforta.ru            # весь sitemap (~310 URL)
//   node scripts/check-seo.mjs https://www.vektor-komforta.ru urls.txt   # свой список путей (по одному в строке)
//   node scripts/check-seo.mjs http://localhost:4173                     # локальный эмулятор: scripts/serve-local.mjs
//
// Флаги:
//   --max=50     проверить только первые N URL из sitemap
//   --quiet      печатать только ошибки и итог
//
// Exit code 1 при любой ошибке — можно ставить в CI после деплоя.
// ============================================================================

import fs from "node:fs/promises";

// ----------------------------- Параметры -----------------------------------

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flags = new Map(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v === undefined ? true : v];
  }),
);

const BASE = (args[0] || "https://www.vektor-komforta.ru").replace(/\/$/, "");
const URLS_FILE = args[1] || null;
const MAX_URLS = Number(flags.get("max") || 0) || Infinity;
const QUIET = Boolean(flags.get("quiet"));
const UA = "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)";
const FETCH_TIMEOUT = 20_000;

// ----------------------------- Вспомогательные ------------------------------

async function fetchWithTimeout(url, opts = {}) {
  return fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "ru" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    ...opts,
  });
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Текст внутри <div id="root">…</div> (в серверном HTML нет вложенных div). */
function extractRootText(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/div>/);
  return m ? stripTags(m[1]) : "";
}

/** Внутренние ссылки: только корневые относительные href="/…". */
function extractInternalLinks(html) {
  return [...html.matchAll(/<a[^>]+href="(\/[^"#]*)"/g)].map((m) => m[1]);
}

// ----------------------------- Список URL ----------------------------------

async function loadUrlList() {
  if (URLS_FILE) {
    const txt = await fs.readFile(URLS_FILE, "utf8");
    return txt.split("\n").map((s) => s.trim()).filter(Boolean).map((s) => (s.startsWith("/") ? s : new URL(s).pathname));
  }
  // Берём sitemap целевого сайта: проверяем ровно то, что мы сами отдаём поисковикам.
  const res = await fetchWithTimeout(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter(Boolean);
}

// ----------------------------- Проверки страницы ----------------------------

async function checkPage(path) {
  const row = { path, ok: true, issues: [], warn: [] };
  try {
    const res = await fetchWithTimeout(BASE + path, { redirect: "follow" });
    const html = await res.text();

    if (res.status !== 200) {
      row.issues.push(`HTTP ${res.status}`);
    }

    // 1. Title
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || "";
    if (title.length < 5) row.issues.push("нет/пустой <title>");
    row.title = title;

    // 2. Meta description
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || "";
    if (desc.length < 20) row.issues.push("нет/короткий meta description");

    // 3. Canonical: наличие + самоссылка (pathname совпадает; origin в canonical
    //    зашит prod-домен, поэтому локальный прогон сравнивает только путь)
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] || "";
    if (!canonical) {
      row.issues.push("нет canonical");
    } else {
      try {
        if (new URL(canonical, BASE).pathname !== path) {
          row.issues.push(`canonical ведёт на ${canonical}`);
        }
      } catch {
        row.issues.push(`canonical не парсится: ${canonical}`);
      }
    }

    // 4. Контент в HTML (не пустой #root) — то, ради чего всё затевалось
    const rootText = extractRootText(html);
    if (rootText.length < 200) row.issues.push(`мало контента в #root (${rootText.length} симв.)`);
    row.contentLen = rootText.length;

    // 5. H1
    const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
    if (!h1) row.issues.push("нет <h1>");
    row.h1 = h1.slice(0, 90);

    // 6. Внутренние ссылки в HTML
    const links = [...new Set(extractInternalLinks(html))];
    if (links.length < 5) row.issues.push(`мало внутренних ссылок в HTML (${links.length})`);
    row.links = links.length;

    // 7. JSON-LD
    const jsonLdCount = (html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) || []).length;
    if (jsonLdCount === 0) row.warn.push("нет JSON-LD");

    // 8. OG-теги
    if (!/<meta[^>]+property=["']og:title["']/i.test(html)) row.warn.push("нет og:title");

    // 9. Регрессия 2026-09-13: noindex на страницах, которые должны индексироваться
    const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)?.[1] || "";
    if (/noindex/i.test(robotsMeta)) row.issues.push(`meta robots: ${robotsMeta}`);
    const xRobots = res.headers.get("x-robots-tag") || "";
    if (/noindex/i.test(xRobots)) row.issues.push(`X-Robots-Tag: ${xRobots}`);

    // 10. Кэш-заголовки (P1-2): info-поле, не ошибка
    row.cache = res.headers.get("cache-control") || "—";
  } catch (e) {
    row.issues.push(`fetch error: ${e.message}`);
  }
  row.ok = row.issues.length === 0;
  return row;
}

// ----------------------------- Сайт-левел проверки ---------------------------

async function checkSiteLevel() {
  const rows = [];

  const add = (name, ok, detail) => rows.push({ name, ok, detail });

  // 1. Честный 404 на мусорном адресе (soft-404 — главный источник мусора в индексе)
  try {
    const res = await fetchWithTimeout(`${BASE}/soft-404-proverka-${Date.now()}`, { redirect: "follow" });
    add("честный 404 (мусорный URL)", res.status === 404, `HTTP ${res.status}`);
  } catch (e) {
    add("честный 404 (мусорный URL)", false, e.message);
  }

  // 2. Честный 404 на несуществующей карточке (маршрут /kondicionery/:slug → api/seo)
  try {
    const res = await fetchWithTimeout(`${BASE}/kondicionery/nesushchestvuyushchaya-model-${Date.now()}`, { redirect: "follow" });
    add("честный 404 (несуществующая карточка)", res.status === 404, `HTTP ${res.status}`);
  } catch (e) {
    add("честный 404 (несуществующая карточка)", false, e.message);
  }

  // 3. 301 со старого адреса
  try {
    const res = await fetchWithTimeout(`${BASE}/burenie`, { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    const ok = res.status === 301 && /\/almaznoe-burenie$/.test(new URL(loc, BASE).pathname);
    add("301 /burenie → /almaznoe-burenie", ok, `HTTP ${res.status} → ${loc || "—"}${res.status === 301 && !ok ? " (плохой Location)" : ""}`);
  } catch (e) {
    add("301 /burenie → /almaznoe-burenie", false, e.message);
  }

  // 4. Склейка слешей: /okna/ → /okna
  try {
    const res = await fetchWithTimeout(`${BASE}/okna/`, { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    const ok = [301, 308].includes(res.status) && new URL(loc, BASE).pathname === "/okna";
    add("склейка слешей /okna/ → /okna", ok, `HTTP ${res.status} → ${loc || "—"}`);
  } catch (e) {
    add("склейка слешей /okna/ → /okna", false, e.message);
  }

  // 5. robots.txt
  try {
    const res = await fetchWithTimeout(`${BASE}/robots.txt`);
    const txt = await res.text();
    add("robots.txt + Sitemap", res.status === 200 && /sitemap:/i.test(txt), `HTTP ${res.status}, sitemap ${/sitemap:/i.test(txt) ? "есть" : "нет"}`);
  } catch (e) {
    add("robots.txt + Sitemap", false, e.message);
  }

  // 6. sitemap.xml валиден и не пуст
  try {
    const res = await fetchWithTimeout(`${BASE}/sitemap.xml`);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const allSameOrigin = locs.every((l) => l.startsWith("https://www.vektor-komforta.ru/"));
    add(
      "sitemap.xml валиден",
      res.status === 200 && locs.length >= 200 && allSameOrigin,
      `HTTP ${res.status}, ${locs.length} URL${allSameOrigin ? "" : ", есть чужой origin!"}`,
    );
  } catch (e) {
    add("sitemap.xml валиден", false, e.message);
  }

  return rows;
}

// ----------------------------- Пул запросов ----------------------------------

async function runPool(items, worker, size = 5) {
  const results = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await worker(items[idx]);
      }
    }),
  );
  return results;
}

// ----------------------------- Отчёт -----------------------------------------

const t0 = Date.now();
console.log("=== SEO CHECK: сырой HTML без исполнения JS ===");
console.log(`Цель: ${BASE}${URLS_FILE ? ` (список: ${URLS_FILE})` : " (список: sitemap.xml)"}`);

let paths;
try {
  paths = await loadUrlList();
} catch (e) {
  console.error(`Не удалось получить список URL: ${e.message}`);
  process.exit(2);
}
if (paths.length > MAX_URLS) paths = paths.slice(0, MAX_URLS);
console.log(`Страниц к проверке: ${paths.length}\n`);

const results = await runPool(paths, checkPage);
const siteChecks = await checkSiteLevel();

const okCount = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
const warnCount = results.filter((r) => r.warn.length).length;
const minContent = Math.min(...results.map((r) => r.contentLen ?? 0));
const minLinks = Math.min(...results.map((r) => r.links ?? 0));

for (const r of results) {
  if (QUIET && r.ok) continue;
  const mark = r.ok ? "✓" : "✗";
  console.log(`${mark} ${r.path}`);
  if (!QUIET) {
    if (r.title) console.log(`   title:    ${r.title.slice(0, 90)}`);
    if (r.h1) console.log(`   h1:       ${r.h1}`);
    if (r.contentLen !== undefined) console.log(`   контент:  ${r.contentLen} симв., ссылок: ${r.links}, cache: ${r.cache}`);
  }
  if (r.warn.length) console.log(`   ⚠ ${r.warn.join("; ")}`);
  if (r.issues.length) console.log(`   ✗ проблемы: ${r.issues.join("; ")}`);
}

console.log("\n--- Сайт-левел проверки ---");
for (const c of siteChecks) {
  console.log(`${c.ok ? "✓" : "✗"} ${c.name} — ${c.detail}`);
}

console.log("\n=== ИТОГ ===");
console.log(`Страниц: ${results.length}, OK: ${okCount}, с ошибками: ${failed.length}, с предупреждениями: ${warnCount}`);
console.log(`Мин. контент в #root: ${minContent} симв. | мин. внутренних ссылок: ${minLinks}`);
const siteFail = siteChecks.filter((c) => !c.ok).length;
console.log(`Сайт-левел: ${siteChecks.length - siteFail}/${siteChecks.length} OK`);
console.log(`Время: ${((Date.now() - t0) / 1000).toFixed(1)} с`);

if (failed.length === 0 && siteFail === 0) {
  console.log("\n✅ P0 закрыт: краулер видит контент, мета и ссылки в сыром HTML.");
  process.exit(0);
} else {
  console.log(`\n❌ Есть проблемы: ${failed.length} страниц с ошибками, ${siteFail} сайт-левел ошибок.`);
  process.exit(1);
}
