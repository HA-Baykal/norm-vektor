#!/usr/bin/env node
// ============================================================================
// scripts/indexnow.mjs — уведомление поисковиков об изменениях через IndexNow.
//
// Зачем: IndexNow — способ сказать поисковикам «эти адреса обновились, заберите
// их в индекс сейчас», без ожидания планового обхода. Один POST-запрос уходит
// в общий шлюз api.indexnow.org и расходится по Bing, Яндекс, Seznam, Naver и
// Yep. Google в IndexNow не участвует — ему нужен Search Console.
//
// Что нужно на стороне сайта (уже сделано):
//   • ключ 0f5329cd354566f96c0ccb6fdc4a86ac;
//   • файл ключа public/0f5329cd354566f96c0ccb6fdc4a86ac.txt — публикуется
//     вместе с сайтом и проверяется поисковиками по keyLocation.
//
// Запуск:
//   node scripts/indexnow.mjs                 # 15 ключевых страниц (как в CI)
//   node scripts/indexnow.mjs --all           # все URL из sitemap.xml (324)
//   node scripts/indexnow.mjs --dry-run       # только показать список
//   node scripts/indexnow.mjs --urls=list.txt # свой список (по одному в строке)
//   node scripts/indexnow.mjs --all --batch=1000
//
// Флаги:
//   --all            взять все URL из sitemap (по умолчанию — 15 ключевых);
//   --dry-run        ничего не отправлять, только вывести список;
//   --urls=FILE      свой список URL (по одному в строке);
//   --base=URL       сайт, если sitemap нужно скачать (по умолчанию прод);
//   --batch=N        размер одной отправки, максимум 10 000 (по умолчанию все);
//   --key=KEY        переопределить ключ IndexNow;
//   --quiet          печатать только итог;
//   --json           итог в виде JSON (удобно для CI).
//
// Успех — ответ 200 или 202 от api.indexnow.org. Код 403/422 означает, что
// файл ключа не опубликован или не совпадает с ключом: сначала деплой, потом
// IndexNow. Код 429 — слишком часто, повторить позже.
// ============================================================================

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ------------------------------- параметры ----------------------------------

const args = new Map(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v === undefined ? true : v];
    }),
);

const DEFAULT_KEY = "0f5329cd354566f96c0ccb6fdc4a86ac";
const KEY = String(args.get("key") || process.env.INDEXNOW_KEY || DEFAULT_KEY);
const KEY_FILE = path.join(ROOT, "public", `${KEY}.txt`);

const BASE = String(args.get("base") || process.env.INDEXNOW_BASE || "https://www.vektor-komforta.ru")
  .replace(/\/+$/, "");
const HOST = new URL(BASE).host;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = String(process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow");

const ALL = Boolean(args.get("all"));
const DRY_RUN = Boolean(args.get("dry-run"));
const QUIET = Boolean(args.get("quiet"));
const JSON_OUT = Boolean(args.get("json"));
const URLS_FILE = args.get("urls") ? String(args.get("urls")) : null;
const BATCH = Math.min(Number(args.get("batch") || 0) || 10_000, 10_000);

// 15 ключевых страниц: главная, 4 услуги, 4 под-услуги, база знаний и 5 статей
// с коммерческим интентом (те же, что проверяет scripts/check-geo.mjs).
const KEY_URLS = [
  "/",
  "/okna",
  "/kondicionery",
  "/ventilyaciya",
  "/almaznoe-burenie",
  "/montazh-okon",
  "/montazh-kondicionerov",
  "/servis-kondicionerov",
  "/osteklenie-balkonov",
  "/baza-znaniy",
  "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner",
  "/baza-znaniy/skolko-stoit-ustanovka-konditsionera-irkutsk",
  "/baza-znaniy/skolko-stoyat-plastikovye-okna-irkutsk",
  "/baza-znaniy/brizer-ili-rekuperator-chto-vybrat",
  "/baza-znaniy/pochemu-poteyut-plastikovye-okna",
];

// ------------------------------ список URL ----------------------------------

/** Все <loc> из sitemap.xml (локального public/, иначе — с сайта). */
async function loadSitemapUrls() {
  const local = path.join(ROOT, "public", "sitemap.xml");
  let xml;
  try {
    xml = await fs.readFile(local, "utf8");
  } catch {
    const res = await fetch(`${BASE}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);
    xml = await res.text();
  }
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]);
}

/** Приводим путь/URL к абсолютному URL нашего хоста, убираем дубли и мусор. */
function normalizeUrl(value) {
  const raw = value.trim();
  if (!raw || raw.startsWith("#")) return null;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `${BASE}${raw.startsWith("/") ? "" : "/"}${raw}`);
    if (url.host !== HOST) return null;
    url.hash = "";
    return url.toString().replace(/\/$/, "") || BASE;
  } catch {
    return null;
  }
}

async function loadUrls() {
  let list;
  if (URLS_FILE) {
    const txt = await fs.readFile(path.resolve(process.cwd(), URLS_FILE), "utf8");
    list = txt.split("\n").map((s) => s.trim()).filter(Boolean);
  } else if (ALL) {
    list = await loadSitemapUrls();
  } else {
    list = KEY_URLS;
  }
  const seen = new Set();
  const urls = [];
  for (const item of list) {
    const url = normalizeUrl(item);
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}

// ------------------------------- отправка -----------------------------------

const STATUS_HELP = {
  200: "принято",
  202: "принято (ключ будет проверен)",
  204: "принято без тела ответа",
  400: "неверный формат запроса",
  403: "файл ключа не найден или не совпадает — проверьте деплой",
  422: "URL не принадлежат хосту или ключ не подходит",
  429: "слишком много запросов — повторите позже",
};

async function sendBatch(batch, batchNo, total) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  });
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
    signal: AbortSignal.timeout(30_000),
  });
  const ok = res.status === 200 || res.status === 202 || res.status === 204;
  const text = (await res.text().catch(() => "")).slice(0, 300);
  if (!QUIET) {
    const note = STATUS_HELP[res.status] || "";
    console.log(
      `  Партия ${batchNo}/${total}: ${batch.length} URL → HTTP ${res.status}${note ? ` (${note})` : ""}` +
        (text && !ok ? ` — ${text}` : ""),
    );
  }
  return { ok, status: res.status, sent: batch.length };
}

// ---------------------------------- main ------------------------------------

const urls = await loadUrls();
if (!urls.length) {
  console.error("Нет URL для отправки: проверьте sitemap.xml или --urls=FILE.");
  process.exit(1);
}

if (!QUIET) {
  console.log(`IndexNow: ${urls.length} URL, хост ${HOST}`);
  console.log(`Ключ: ${KEY}`);
  console.log(`Файл ключа: ${KEY_LOCATION}`);
  console.log(`Приёмник: ${ENDPOINT}\n`);
}
if (DRY_RUN) {
  for (const u of urls) console.log(u);
  console.log(`\nЧерновой прогон: отправлено 0, показано ${urls.length}.`);
  process.exit(0);
}

// Ключ должен лежать рядом с сайтом — иначе IndexNow ответит 403.
try {
  const localKey = (await fs.readFile(KEY_FILE, "utf8")).trim();
  if (localKey !== KEY) {
    console.error(`Ключ в ${path.relative(ROOT, KEY_FILE)} не совпадает с ${KEY}.`);
    process.exit(1);
  }
} catch {
  console.warn(`Предупреждение: локальный файл ключа ${path.relative(ROOT, KEY_FILE)} не найден.`);
}

const batches = [];
for (let i = 0; i < urls.length; i += BATCH) batches.push(urls.slice(i, i + BATCH));

const results = [];
for (const [i, batch] of batches.entries()) {
  try {
    results.push(await sendBatch(batch, i + 1, batches.length));
  } catch (e) {
    results.push({ ok: false, status: 0, sent: batch.length, error: String(e) });
    if (!QUIET) console.error(`  Партия ${i + 1}/${batches.length}: ошибка сети — ${e}`);
  }
}

const sent = results.reduce((sum, r) => sum + (r.ok ? r.sent : 0), 0);
const failed = results.filter((r) => !r.ok);
const summary = {
  host: HOST,
  total: urls.length,
  sent,
  failed: urls.length - sent,
  batches: results.length,
  statuses: results.map((r) => r.status),
};

if (JSON_OUT) {
  console.log(JSON.stringify(summary));
} else if (!QUIET) {
  console.log(`\nИтог: принято ${sent} из ${urls.length} URL.`);
  if (failed.length) {
    console.log(
      "Не принято: " +
        failed.map((r) => `${r.sent} URL (HTTP ${r.status || "сеть"})`).join(", ") +
        ". Проверьте, что файл ключа опубликован на проде, и повторите запуск.",
    );
  }
}
process.exit(failed.length ? 1 : 0);
