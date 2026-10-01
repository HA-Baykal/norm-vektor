#!/usr/bin/env node
// ============================================================================
// scripts/check-geo.mjs — проверка готовности сайта к ИИ-выдаче (GEO/AEO).
//
// Что проверяет: то, что реально получает генеративный поиск (Яндекс Нейро,
// Алиса AI, ChatGPT Search, Perplexity, Google AI Overviews, Copilot), а не
// то, что рисует браузер после исполнения JavaScript:
//   • robots.txt: не закрыты ли ИИ-краулеры и Яндекс;
//   • /llms.txt: есть ли карта сайта для языковых моделей;
//   • IndexNow: опубликован ли файл ключа и совпадает ли его содержимое с ключом;
//   • главные страницы услуг: есть ли «цитируемый» фрагмент — короткий ответ,
//     таблица цен, пары «вопрос → ответ»;
//   • JSON-LD: FAQPage, Service/Offer, BreadcrumbList, Article;
//   • canonical — самоссылочный, без noindex (регрессия от 2026-09-13);
//   • статьи базы знаний: короткий ответ + FAQ.
//
// Запуск:
//   node scripts/check-geo.mjs                                  # прод
//   node scripts/check-geo.mjs https://preview.vercel.app       # превью
//   node scripts/check-geo.mjs --prompts                        # список запросов
//                                                              # для ручного
//                                                              # мониторинга ИИ
//   node scripts/check-geo.mjs --quiet                          # только ошибки
//
// Exit code 1, если есть ошибки — можно ставить в CI после деплоя.
// ============================================================================

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flags = new Map(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v === undefined ? true : v];
    }),
);

const BASE = (args[0] || "https://www.vektor-komforta.ru").replace(/\/$/, "");
const QUIET = Boolean(flags.get("quiet"));
const TIMEOUT = 25_000;
const INDEXNOW_KEY = String(flags.get("key") || process.env.INDEXNOW_KEY || "0f5329cd354566f96c0ccb6fdc4a86ac");

const UA_YANDEX = "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)";
const UA_GPT = "Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)";

// Страницы, по которым людей спрашивают у нейросетей (коммерческие интенты).
// answer/faq — что обязательно должно быть в серверном HTML этой страницы.
const KEY_PAGES = [
  { path: "/", answer: false, faq: true },
  { path: "/okna", answer: true, faq: true },
  { path: "/kondicionery", answer: true, faq: true },
  { path: "/ventilyaciya", answer: true, faq: true },
  { path: "/almaznoe-burenie", answer: true, faq: true },
  { path: "/montazh-okon", answer: false, faq: false },
  { path: "/montazh-kondicionerov", answer: false, faq: false },
  { path: "/servis-kondicionerov", answer: false, faq: false },
  { path: "/osteklenie-balkonov", answer: false, faq: false },
];

// Статьи, которые чаще всего попадают в ответы на информационные запросы
const KEY_ARTICLES = [
  "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner",
  "/baza-znaniy/skolko-stoit-ustanovka-konditsionera-irkutsk",
  "/baza-znaniy/skolko-stoyat-plastikovye-okna-irkutsk",
  "/baza-znaniy/brizer-ili-rekuperator-chto-vybrat",
  "/baza-znaniy/pochemu-poteyut-plastikovye-okna",
];

// Запросы, по которым нужно раз в месяц вручную проверять ИИ-ответы.
// Принцип отбора: пользователь ещё выбирает и сравнивает, а не «купить здесь».
const AI_PROMPTS = [
  // Окна
  "пластиковые окна в Иркутске цены за квадратный метр",
  "какие окна поставить в Иркутске: VEKA или Rehau",
  "сколько стоят окна в Иркутске под ключ с установкой",
  "чем отличается монтаж окон по ГОСТ от обычного",
  "почему потеют пластиковые окна зимой",
  "какой стеклопакет выбрать для Сибири",
  // Кондиционеры
  "инверторный или обычный кондиционер что выбрать",
  "сколько стоит установка кондиционера в Иркутске",
  "какой кондиционер выбрать на квартиру 35 кв м",
  "можно ли заболеть от кондиционера",
  "можно ли ставить кондиционер зимой в Иркутске",
  "почему кондиционер плохо холодит",
  // Вентиляция
  "бризер или рекуператор что выбрать для квартиры",
  "чем отличается бризер от кондиционера",
  "как сделать вентиляцию в частном доме в Сибири",
  "почему в новостройке нет тяги вентиляции",
  "сколько стоит вентиляция в квартире под ключ",
  "как избавиться от конденсата и плесени на окнах",
  // Алмазное бурение
  "сколько стоит алмазное бурение отверстия в бетоне",
  "как просверлить отверстие 150 мм в несущей стене",
  "можно ли сверлить несущую стену под вентиляцию",
  // Смешанные
  "окна кондиционер вентиляция в Иркутске под ключ одной компанией",
  "кто делает окна и вентиляцию в Иркутске",
  "какая компания ставит окна в Иркутске с гарантией 5 лет",
];

if (flags.get("prompts")) {
  console.log(`Запросы для ручной проверки ИИ-выдачи (${AI_PROMPTS.length} шт.).`);
  console.log("Проверять: Яндекс (блок Нейро/Алиса), ChatGPT с поиском, Perplexity.\n");
  AI_PROMPTS.forEach((p, i) => console.log(`${String(i + 1).padStart(2, " ")}. ${p}`));
  console.log(
    "\nФиксируйте в таблице: дата · запрос · движок · есть ли ИИ-ответ · какие сайты/бренды названы.",
  );
  process.exit(0);
}

// ----------------------------- helpers -------------------------------------

async function fetchText(path, ua = UA_YANDEX) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { "User-Agent": ua, "Accept-Language": "ru", Accept: "text/html,*/*" },
      signal: controller.signal,
      redirect: "follow",
    });
    return { status: res.status, url: res.url, text: await res.text() };
  } catch (e) {
    return { status: 0, url: `${BASE}${path}`, text: "", error: String(e) };
  } finally {
    clearTimeout(timer);
  }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1].trim());
      for (const node of Array.isArray(data) ? data : [data]) {
        const t = node && node["@type"];
        if (typeof t === "string") types.add(t);
        if (Array.isArray(node?.["@graph"])) {
          for (const g of node["@graph"]) if (typeof g?.["@type"] === "string") types.add(g["@type"]);
        }
      }
    } catch {
      types.add("НЕВАЛИДНЫЙ_JSON");
    }
  }
  return types;
}

function countFaqPairs(html) {
  // 1) видимые пары: заголовок-вопрос + следующий абзац с ответом;
  // 2) разметка: число узлов Question в JSON-LD (FAQPage)
  const visible = (html.match(/<h3[^>]*>[^<]*\?[\s\S]{0,600}?<\/p>/gi) || []).length;
  const marked = (html.match(/"@type"\s*:\s*"Question"/g) || []).length;
  return Math.max(visible, marked);
}

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "OK  " : "ОШИБКА";
  if (!QUIET || !ok) console.log(`  [${mark}] ${name}${detail ? " — " + detail : ""}`);
}

// ----------------------------- robots.txt ----------------------------------

if (!QUIET) console.log(`\nПроверяем ${BASE}\n\nrobots.txt, llms.txt и IndexNow`);
/**
 * Закрыт ли бот в robots.txt: либо своя секция с «Disallow: /», либо секция
 * «*» с полным запретом и отсутствием собственной секции у бота.
 */
function botBlocked(robots, bot) {
  const groups = robots.split(/\n(?=User-agent:)/i);
  const own = groups.find((g) => new RegExp(`^User-agent:\\s*${bot}\\s*$`, "im").test(g.trim().split("\n")[0] || ""));
  const wildcard = groups.find((g) => /^User-agent:\s*\*\s*$/im.test(g.trim().split("\n")[0] || ""));
  const hasFullBan = (g) => Boolean(g) && g.split("\n").some((l) => /^Disallow:\s*\/\s*$/i.test(l.trim()));
  if (own) return hasFullBan(own);
  return hasFullBan(wildcard);
}

{
  const { status, text } = await fetchText("/robots.txt");
  check("robots.txt отвечает 200", status === 200, `HTTP ${status}`);
  const blocked = ["YandexBot", "GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Google-Extended"].filter(
    (bot) => botBlocked(text, bot),
  );
  check("ИИ-краулеры не закрыты", blocked.length === 0, blocked.join(", ") || "");
}

{
  const { status, text } = await fetchText("/llms.txt", UA_GPT);
  check("llms.txt отвечает 200", status === 200, `HTTP ${status}`);
  check("llms.txt содержит карту услуг", /Кондиционеры|вентиляц/i.test(text));
}

{
  const keyPath = `/${INDEXNOW_KEY}.txt`;
  const { status, text } = await fetchText(keyPath);
  const body = text.trim();
  check(`IndexNow: файл ключа (${keyPath}) отвечает 200`, status === 200, `HTTP ${status}`);
  check(
    "IndexNow: содержимое файла совпадает с ключом",
    status === 200 && body === INDEXNOW_KEY,
    body === INDEXNOW_KEY ? `${BASE}${keyPath}` : body.slice(0, 40) || "пусто",
  );
}

// ------------------------- страницы и статьи --------------------------------

async function auditPage({ path, answer, faq }, kind) {
  const [yandex, gpt] = await Promise.all([fetchText(path, UA_YANDEX), fetchText(path, UA_GPT)]);
  if (!QUIET) console.log(`\n${path}`);
  check(`${path}: HTTP 200`, yandex.status === 200, `HTTP ${yandex.status}`);
  check(`${path}: доступна ChatGPT Search (OAI-SearchBot)`, gpt.status === 200, `HTTP ${gpt.status}`);

  const text = visibleText(yandex.text);
  check(`${path}: текст в HTML без JS`, text.length > 700, `${text.length} знаков`);
  check(`${path}: нет noindex`, !/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(yandex.text));

  const canonical = yandex.text.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  check(
    `${path}: canonical самоссылочный`,
    Boolean(canonical) && canonical[1].endsWith(path === "/" ? "/" : path),
    canonical ? canonical[1] : "не найден",
  );

  if (answer) {
    check(`${path}: есть «Короткий ответ»`, /Короткий ответ/i.test(text));
  }

  if (faq) {
    const faqPairs = countFaqPairs(yandex.text);
    check(`${path}: пары «вопрос → ответ» в HTML`, faqPairs >= 5, `${faqPairs} пар`);
  }

  const types = jsonLdTypes(yandex.text);
  check(
    `${path}: разметка FAQPage/Service/Article`,
    types.has("FAQPage") || types.has("Service") || types.has("Article") || types.has("Product"),
    [...types].join(", ") || "нет JSON-LD",
  );
  if (path !== "/") {
    check(`${path}: есть BreadcrumbList`, types.has("BreadcrumbList"), [...types].join(", ") || "нет JSON-LD");
  }
}

if (!QUIET) console.log("\nГлавные страницы услуг");
for (const page of KEY_PAGES) await auditPage(page, "service");

if (!QUIET) console.log("\nСтатьи базы знаний (информационные запросы)");
for (const path of KEY_ARTICLES) await auditPage({ path, answer: true, faq: false }, "article");

// ----------------------------- итог ----------------------------------------

const failed = results.filter((r) => !r.ok);
console.log(
  `\nИтог: ${results.length - failed.length} из ${results.length} проверок пройдено` +
    (failed.length ? `, ошибок: ${failed.length}` : ". Всё готово к ИИ-выдаче."),
);
if (failed.length && QUIET) {
  console.log("\nОшибки:");
  for (const f of failed) console.log(`  • ${f.name}${f.detail ? " — " + f.detail : ""}`);
}
if (!QUIET) {
  console.log(
    "\nЧто дальше: 1) обновить контент по ошибкам выше; 2) отправить URL на переобход\n" +
      "в Яндекс.Вебмастере и Google Search Console; 3) прогнать запросы из --prompts\n" +
      "в Яндексе (блок Нейро), ChatGPT и Perplexity и записать, кто цитируется.",
  );
}
process.exit(failed.length ? 1 : 0);
