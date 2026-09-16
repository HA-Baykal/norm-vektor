// Локальный регрессионный тест api/seo.js (карточки товаров).
// Прогоняет serverless-функцию БЕЗ Vercel: оболочкой SPA служит dist/index.html.
//
// Запуск: node scripts/test-seo-fn.mjs
// Перед запуском нужен собранный dist: npm run build
//
// Что проверяем (глазами поискового краулера без JS):
//   1. карточка кондиционера → 200, уникальный title/canonical, h1 с именем модели,
//      цена и текст В ИСХОДНОМ HTML, внутренние ссылки, JSON-LD;
//   2. в исходном body НЕТ статического блока главной (иначе все карточки — дубли);
//   3. карточка окна → то же самое;
//   4. BTU-вариант (?btu=12000) → пересчитанная цена в title и в тексте;
//   5. неизвестный slug → честный HTTP 404 + noindex;
//   6. поиск по id (старые ссылки) → 200.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const shellPath = path.join(ROOT, "dist", "index.html");
if (!fs.existsSync(shellPath)) {
  console.error("Нет dist/index.html — сначала выполните: npm run build");
  process.exit(2);
}
const shell = fs.readFileSync(shellPath, "utf8");

// Подменяем fetch: функция забирает оболочку SPA через fetchShell()
globalThis.fetch = async (url) => {
  if (String(url).endsWith("/index.html")) {
    return { ok: true, text: async () => shell };
  }
  throw new Error("unexpected fetch: " + url);
};

const { default: handler } = await import("../api/seo.js");

// Мок req/res в стиле Vercel Node handler
function makeReq(query) {
  return { query, headers: { host: "www.vektor-komforta.ru", "x-forwarded-proto": "https" } };
}
function makeRes() {
  return {
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    send(body) { this.body = body; return this; },
  };
}

const HOMEPAGE_MARKER = "Окна, кондиционеры и вентиляция в Иркутске — под ключ";

function bodyText(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/main><\/div>/);
  return (m ? m[1] : "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function internalLinks(html) {
  const m = html.match(/<div id="root">([\s\S]*?)<\/main><\/div>/);
  return m ? [...m[1].matchAll(/<a[^>]+href="(\/[^"]*)"/g)].map((x) => x[1]) : [];
}

const tests = [
  {
    name: "карточка кондиционера (slug из sitemap, с регистром)",
    query: { slug: "SHUFT-Berg-SFTO" },
    expect: (res) => {
      assert(res.statusCode === 200, `ожидали 200, получили ${res.statusCode}`);
      assert(res.body.includes("<title>SHUFT Berg SFTO — купить с установкой в Иркутске | Вектор Комфорта</title>"), "title не подменён");
      assert(res.body.includes('rel="canonical" href="https://www.vektor-komforta.ru/kondicionery/SHUFT-Berg-SFTO"'), "canonical неверен");
      assert(res.body.includes("<h1>SHUFT Berg SFTO</h1>"), "нет h1 с именем модели в исходном HTML");
      assert(res.body.includes("application/ld+json"), "нет JSON-LD");
      const text = bodyText(res.body);
      assert(text.includes("SHUFT Berg SFTO"), "в тексте body нет имени модели");
      assert(text.includes("17 376 ₽"), "в тексте body нет цены");
      assert(!text.includes(HOMEPAGE_MARKER), "ВНИМАНИЕ: body содержит блок главной — карточка будет дублем!");
      assert(text.length > 300, `мало текста в body (${text.length} симв.)`);
      const links = internalLinks(res.body);
      assert(links.length >= 5, `мало внутренних ссылок в body (${links.length})`);
    },
  },
  {
    name: "карточка кондиционера в нижнем регистре (как видит Яндекс в логах)",
    query: { slug: "ballu-olympio-pro-bso" },
    expect: (res) => {
      assert(res.statusCode === 200, `ожидали 200, получили ${res.statusCode}`);
      assert(res.body.includes("<h1>Ballu Olympio Pro BSO</h1>"), "нет h1 модели");
      assert(!bodyText(res.body).includes(HOMEPAGE_MARKER), "body = дубль главной");
    },
  },
  {
    name: "BTU-вариант (?btu=12000)",
    query: { slug: "SHUFT-Berg-SFTO", btu: "12000" },
    expect: (res) => {
      assert(res.statusCode === 200, `ожидали 200, получили ${res.statusCode}`);
      // toLocaleString('ru-RU') отделяет тысячи узким nbsp (U+202F/00A0) —
      // нормализуем пробелы перед сравнением
      const norm = (s) => s.replace(/\s+/g, " "); // \s в JS покрывает и nbsp (U+00A0), и узкий nbsp (U+202F)
      const btuPrice = norm(Math.round(17376 * 1.25).toLocaleString("ru-RU"));
      assert(res.body.includes(`(12000 BTU)`), "нет BTU в title");
      assert(norm(res.body).includes(btuPrice), `нет пересчитанной цены ${btuPrice}`);
      assert(bodyText(res.body).includes(btuPrice), "BTU-цены нет в тексте body");
    },
  },
  {
    name: "карточка окна (slug как в sitemap, с регистром)",
    query: { slug: "Teploe-osteklenie-lodjii" },
    expect: (res) => {
      assert(res.statusCode === 200, `ожидали 200, получили ${res.statusCode}`);
      assert(res.body.includes("<h1>Тёплое остекление лоджии и балкона под ключ</h1>"), "нет h1 окна");
      assert(res.body.includes('rel="canonical" href="https://www.vektor-komforta.ru/okna/Teploe-osteklenie-lodjii"'), "canonical неверен");
      const text = bodyText(res.body);
      assert(text.includes("38 000 ₽"), "нет цены в тексте");
      assert(!text.includes(HOMEPAGE_MARKER), "body = дубль главной");
      const links = internalLinks(res.body);
      assert(links.some((l) => l === "/okna/Osteklenie-v-dome"), "нет ссылок на смежные решения (канонический регистр)");
      assert(links.length >= 6, `мало внутренних ссылок (${links.length})`);
    },
  },
  {
    name: "неизвестный slug → честный 404 + noindex",
    query: { slug: "takoy-modeli-ne-sushchestvuet" },
    expect: (res) => {
      assert(res.statusCode === 404, `ожидали 404, получили ${res.statusCode}`);
      assert(res.body.includes('content="noindex"'), "нет noindex на 404");
    },
  },
  {
    name: "поиск по id (legacy-ссылки)",
    query: { slug: "201" },
    expect: (res) => {
      assert(res.statusCode === 200, `ожидали 200, получили ${res.statusCode}`);
      assert(res.body.includes("<h1>SHUFT Berg SFTO</h1>"), "id 201 должен находить SHUFT Berg SFTO");
    },
  },
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let failed = 0;
for (const t of tests) {
  try {
    const res = makeRes();
    await handler(makeReq(t.query), res);
    t.expect(res);
    console.log(`✓ ${t.name}`);
  } catch (e) {
    failed++;
    console.error(`✗ ${t.name}\n  ${e.message}`);
  }
}

if (failed) {
  console.error(`\n${failed} тест(ов) провалено`);
  process.exit(1);
}
console.log(`\nВсе ${tests.length} тестов прошли: карточки отдают уникальный серверный контент, 404 честные.`);
