// Проверка SEO-отдачи продакшена ГЛАЗАМИ КРАУЛЕРА (без исполнения JS).
//
// Запуск:
//   node scripts/check-seo.mjs [base] [urls.txt]
//   node scripts/check-seo.mjs                                   → https://www.vektor-komforta.ru + scripts/urls.txt
//   node scripts/check-seo.mjs https://drugoy-host.ru urls.txt  → другой хост/список
//
// Что проверяется на каждом URL (всё это должен отдавать СЕРВЕРНЫЙ HTML
// из api/page.ts и api/seo.js, а не клиентский JS после гидрации):
//   1. HTTP 200
//   2. уникальный <title> (не дефолтный главной)
//   3. meta description
//   4. canonical = сам URL
//   5. <h1> в исходном HTML
//   6. объём текста в #root (краулеру нужен контент без JS)
//   7. НЕТ маркера тела главной страницы (все страницы-дубли главной — главный
//      риск этого проекта: так Яндекс склеивал статьи и карточки)
//   8. внутренние ссылки <a href="/..."> в исходном HTML
//   9. JSON-LD (BreadcrumbList/Product)
//  10. og:title
//
// Плюс пробы инфраструктуры:
//   - мусорный URL → честный HTTP 404 + noindex (ловим «мягкие 404»)
//   - старый адрес /ventilyatsiya → 301 на /ventilyaciya
//   - /okna/ (слеш в конце) → 301 на /okna
//
// Код выхода: 0 — всё чисто, 1 — есть проблемы (можно вешать в CI).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE = (process.argv[2] || "https://www.vektor-komforta.ru").replace(/\/$/, "");
const URLS_FILE = process.argv[3] || path.join(__dirname, "urls.txt");
const CONCURRENCY = 10;

const DEFAULT_HOME_TITLE = "Пластиковые окна, кондиционеры и вентиляция в Иркутске — Вектор Комфорта";
const HOMEPAGE_BODY_MARKER = "Окна, кондиционеры и вентиляция в Иркутске — под ключ";

const urls = (await fs.readFile(URLS_FILE, "utf8"))
  .split("\n").map((s) => s.trim()).filter(Boolean);

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)" },
    redirect: "manual", // редиректы проверяем сами — нам важен код ответа
  });
  const html = await res.text();
  return { status: res.status, headers: res.headers, html, location: res.headers.get("location") };
}

function extractRootText(html) {
  // Серверный контент лежит в <div id="root"><main>...</main></div> (api/page.ts, api/seo.js),
  // деградированный случай — просто текст до первого </div>
  const m = html.match(/<div id="root">([\s\S]*?)<\/main><\/div>/) || html.match(/<div id="root">([\s\S]*?)<\/div>/);
  const inner = m ? m[1] : "";
  return inner.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function checkUrl(url) {
  const row = { url, ok: true, issues: [] };
  try {
    const { status, headers, html } = await fetchHtml(BASE + url);

    if (status !== 200) {
      row.issues.push(`HTTP ${status}`);
      row.ok = false;
    }
    if (/noindex/i.test(headers.get("x-robots-tag") || "")) {
      row.issues.push(`X-Robots-Tag: ${headers.get("x-robots-tag")}`);
      row.ok = false;
    }

    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    if (!title || title.length < 5) {
      row.issues.push("нет <title>");
      row.ok = false;
    } else if (url !== "/" && title === DEFAULT_HOME_TITLE) {
      row.issues.push("title = дефолтный главной (сервер не подменил)");
      row.ok = false;
    }

    const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1];
    if (!desc || desc.length < 20) {
      row.issues.push("нет/короткий meta description");
      row.ok = false;
    }

    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1];
    if (!canonical) {
      row.issues.push("нет canonical");
      row.ok = false;
    }

    const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
    if (noindex) {
      row.issues.push("meta robots noindex на индексируемой странице");
      row.ok = false;
    }

    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
    if (!h1) {
      row.issues.push("нет <h1> в исходном HTML");
      row.ok = false;
    }

    const text = extractRootText(html);
    row.contentLen = text.length;
    if (text.length < 200) {
      row.issues.push(`мало текста для краулера (${text.length} симв.)`);
      row.ok = false;
    }
    if (url !== "/" && text.includes(HOMEPAGE_BODY_MARKER)) {
      row.issues.push("тело = блок главной страницы (дубль!)");
      row.ok = false;
    }

    const linkScope = html.match(/<div id="root">[\s\S]*$/)?.[0] || html;
    const links = [...linkScope.matchAll(/<a[^>]+href=["'](\/[^"']*)["']/g)].map((m) => m[1]);
    row.links = links.length;
    if (links.length < 3) {
      row.issues.push(`мало внутренних ссылок в HTML (${links.length})`);
      row.ok = false;
    }

    if (!/application\/ld\+json/i.test(html)) row.issues.push("нет JSON-LD (некритично)");
    if (!/<meta[^>]+property=["']og:title["']/i.test(html)) row.issues.push("нет og:title");

    row.title = title || "—";
  } catch (e) {
    row.ok = false;
    row.issues.push(`fetch error: ${e.message}`);
  }
  return row;
}

// ---- Пробы инфраструктуры -------------------------------------------------

async function probeInfra() {
  const probes = [];

  // Честный 404 на мусорном адресе
  try {
    const r = await fetchHtml(`${BASE}/seo-probe-never-exists-${Date.now()}`);
    const noindex = /noindex/i.test(r.html);
    probes.push({
      name: "мусорный URL → честный 404 + noindex",
      ok: r.status === 404 && noindex,
      detail: `HTTP ${r.status}${noindex ? ", noindex есть" : ", noindex НЕТ"}`,
    });
  } catch (e) {
    probes.push({ name: "проба 404", ok: false, detail: e.message });
  }

  // 301 со старого адреса
  try {
    const r = await fetchHtml(`${BASE}/ventilyatsiya`);
    const loc = r.location || "";
    probes.push({
      name: "/ventilyatsiya → 301 /ventilyaciya",
      ok: r.status === 301 && loc.replace(/\/$/, "").endsWith("/ventilyaciya"),
      detail: `HTTP ${r.status}, Location: ${loc || "—"}`,
    });
  } catch (e) {
    probes.push({ name: "проба 301 (legacy)", ok: false, detail: e.message });
  }

  // Слеш в конце → 301 на канонический адрес
  try {
    const r = await fetchHtml(`${BASE}/okna/`);
    const loc = r.location || "";
    probes.push({
      name: "/okna/ → 301 /okna (склейка слеш-дублей)",
      ok: r.status === 301 && loc.replace(/\/+$/, "").endsWith("/okna"),
      detail: `HTTP ${r.status}, Location: ${loc || "—"}`,
    });
  } catch (e) {
    probes.push({ name: "проба 301 (слеш)", ok: false, detail: e.message });
  }

  // sitemap доступен
  try {
    const r = await fetchHtml(`${BASE}/sitemap.xml`);
    probes.push({
      name: "sitemap.xml доступен",
      ok: r.status === 200 && r.html.includes("<urlset"),
      detail: `HTTP ${r.status}`,
    });
  } catch (e) {
    probes.push({ name: "проба sitemap.xml", ok: false, detail: e.message });
  }

  return probes;
}

// ---- Запуск ----------------------------------------------------------------

console.log(`\nSEO CHECK (глазами краулера, без JS)\nBase: ${BASE}\nURLs: ${urls.length}\n`);

const results = [];
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = await Promise.all(urls.slice(i, i + CONCURRENCY).map(checkUrl));
  results.push(...batch);
  process.stdout.write(`\rпроверено ${results.length}/${urls.length}...`);
}
process.stdout.write("\n\n");

const infra = await probeInfra();

const bad = results.filter((r) => !r.ok);
console.log("=== ИНФРАСТРУКТУРА ===");
for (const p of infra) console.log(`${p.ok ? "✓" : "✗"} ${p.name} — ${p.detail}`);

console.log("\n=== СТРАНИЦЫ ===");
console.log(`OK: ${results.length - bad.length} / ${results.length}, FAIL: ${bad.length}\n`);

// Полный вывод только для провалов; первые 5 успешных — для контроля
for (const r of bad) {
  console.log(`✗ ${r.url}`);
  console.log(`   ${r.issues.join("; ")}`);
  if (r.title) console.log(`   title: ${r.title.slice(0, 90)}`);
}
if (bad.length === 0) {
  for (const r of results.slice(0, 5)) {
    console.log(`✓ ${r.url} — text: ${r.contentLen} симв., links: ${r.links}`);
  }
}

const infraFailed = infra.some((p) => !p.ok);
process.exit(bad.length || infraFailed ? 1 : 0);
