import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { LEGACY_PATTERN_REDIRECTS, LEGACY_REDIRECTS, toNetlifyPattern } from "./src/constants/redirects";
import { windowsCatalogData } from "./src/data/windowsCatalog";
import { conditioners } from "./src/data/conditioners";
import { readArticleContent, syncGeneratedFiles } from "./scripts/lib/baza-znaniy.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Автоматический SEO-генератор карты сайта (Sitemap.xml) и базы для Vercel API
const seoSitemapAndApiGenerator = () => ({
  name: "seo-sitemap-and-api-generator",
  buildStart() {
    // Данные для списка статей и серверной отрисовки собираются ДО бандла.
    // Если генерировать их только в closeBundle, в сборку попадают файлы,
    // закоммиченные прошлым выпуском: статья, добавленная в BlogArticle.tsx,
    // открывается по прямой ссылке, но в списке её нет. Здесь генератор
    // успевает переписать src/data до того, как Vite прочитает её.
    try {
      const built = syncGeneratedFiles();
      console.log(`[Blog] до сборки: ${built.articles} статей, ${built.cards} карточек`);
    } catch (err) {
      console.error("[Blog] Не удалось пересобрать данные статей до сборки:", err);
    }
  },
  closeBundle() {
    try {
      // 1. Экспорт всех моделей кондиционеров в JSON для Vercel API.
      // Данные берём импортом из src/data/conditioners.ts: раньше массив
      // выковыривался из компонента текстовым поиском строки "];" и на файле
      // с CRLF молча выходил пустым — из карты сайта пропадали 177 карточек,
      // а серверная база оставалась старой.
      const parsedCatalog: any[] = conditioners;
      if (!parsedCatalog.length) {
        throw new Error("Каталог кондиционеров пуст — проверьте src/data/conditioners.ts");
      }
      const apiDataPath = path.resolve(__dirname, "api/catalog-data.json");
      if (fs.existsSync(path.dirname(apiDataPath))) {
        fs.writeFileSync(apiDataPath, JSON.stringify({
          conditioners: parsedCatalog,
          windows: windowsCatalogData
        }, null, 2), "utf-8");
        console.log(`[Vercel API Data] Обновлена серверная база (${parsedCatalog.length} кондиционеров и ${windowsCatalogData.length} решений по окнам)`);
      }

      // 2. Генерация карты сайта Sitemap.xml (Яндекс и Google)
      // Для статей указываем lastmod только при наличии даты реального редактирования;
      // дату сборки для остальных URL не подставляем, чтобы не создавать ложный сигнал свежести.

      // Все локальные страницы: 17 локаций × (окна + кондиционеры) = 34 URL
      const cityLocations = [
        "homutovo", "molodezhnom", "angarske", "shelehove",
        "solnechnom", "pervomaiskom", "novolenino", "yubileynom",
        "akademgorodke", "raduzhnom", "universitetskom",
        "baikalskom-trakte", "golooustnenskom-trakte",
        "pivovarikhe", "urike", "stolbovo", "listvyanke"
      ];
      const cityPages = cityLocations.flatMap((loc) => {
        const prep = loc.endsWith("-trakte") ? "na" : "v";
        return [
          `okna-${prep}-${loc}`,
          `kondicionery-${prep}-${loc}`,
          `ventilyaciya-${prep}-${loc}`,
          `almaznoe-burenie-${prep}-${loc}`,
        ];
      });

      // Посадочные страницы под-услуг (P4 SEO)
      const servicePages = [
        "montazh-kondicionerov", "montazh-okon",
        "servis-kondicionerov", "osteklenie-balkonov"
      ];

      // Юридические страницы (src/data/legal.ts) — индексируются, Яндекс учитывает их как коммерческий фактор
      const legalPages = ["politika-konfidencialnosti", "soglasie-na-obrabotku-pd", "rekvizity"];

      const staticUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "portfolio", "standarty", "otzyv", "baza-znaniy", "kontakty",
        "sravnenie", "interier",
        ...legalPages,
        ...servicePages,
        ...cityPages
      ];

      // Статьи базы знаний. Единственный источник для RSS, SSR-маршрутов,
      // карточек списка и Sitemap — articleContent. Разбор общий с проверкой
      // (scripts/lib/baza-znaniy.mjs) и не зависит от переводов строк: раньше
      // граница объекта искалась строкой с "\n" и на файле с CRLF статьи
      // молча пропадали из карты сайта.
      const parsedArticles: Record<string, any> = readArticleContent();
      const articleSlugs: string[] = Object.keys(parsedArticles);
      if (!articleSlugs.length) {
        // Без статей сборка оставила бы сайт со старым списком и старой картой
        // сайта — лучше не собраться вовсе.
        throw new Error("В src/pages/BlogArticle.tsx не нашлось ни одной статьи");
      }
      const articleModifiedDates: Record<string, string> = Object.fromEntries(
        Object.entries(parsedArticles)
          .filter(([, article]: [string, any]) => /^\d{4}-\d{2}-\d{2}$/u.test(article.modifiedDate || ""))
          .map(([slug, article]: [string, any]) => [slug, article.modifiedDate])
      );
      const built = syncGeneratedFiles();
      console.log(`[Blog] ${built.articles} статей выгружено, ${built.cards} карточек собрано`);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const u of staticUrls) {
        // Швейцарские часы: /interier — отдельный проект, снижает тематичность. Держим с низким приоритетом, рекомендуем вынести на поддомен interier.vektor-komforta.ru
        const isInterier = u === "interier";
        const isLegal = legalPages.includes(u);
        const changefreq = isInterier || isLegal ? "yearly" : (u === "" || u === "okna" || u === "kondicionery" ? "daily" : "weekly");
        const priority = isInterier ? "0.3" : isLegal ? "0.4" : (u === "" ? "1.0" : "0.9");
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/${u}</loc>\n`;
        xml += `    <changefreq>${changefreq}</changefreq>\n`;
        xml += `    <priority>${priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      // Добавляем все 70+ кондиционеров в Sitemap
      for (const c of parsedCatalog) {
        if (c.name) {
          const slug = c.name.replace(/\s+/g, "-").replace(/\//g, "-");
          xml += `  <url>\n`;
          xml += `    <loc>https://www.vektor-komforta.ru/kondicionery/${encodeURI(slug)}</loc>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.85</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      // Добавляем все SEO-страницы окон и остекления в Sitemap
      for (const w of windowsCatalogData) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/okna/${encodeURI(w.slug)}</loc>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.88</priority>\n`;
        xml += `  </url>\n`;
      }

      // Добавляем статьи базы знаний в Sitemap; lastmod есть только у обновлённых статей.
      for (const b of articleSlugs) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/baza-znaniy/${b}</loc>\n`;
        if (articleModifiedDates[b]) xml += `    <lastmod>${articleModifiedDates[b]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      const publicSitemap = path.resolve(__dirname, "public/sitemap.xml");
      fs.writeFileSync(publicSitemap, xml, "utf-8");
      
      const distSitemap = path.resolve(__dirname, "dist/sitemap.xml");
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.writeFileSync(distSitemap, xml, "utf-8");
      }
      // 3. Генерация vercel.json с маршрутами для SEO-функций
      const cityUrls = cityPages;
      const mainUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "kontakty", "standarty", "otzyv", "baza-znaniy", "portfolio",
        "sravnenie", "interier",
        ...legalPages,
        ...servicePages
      ];
      const rewrites: any[] = [
        { source: "/rss.xml", destination: "/api/rss" },
        { source: "/rss-fresh.xml", destination: "/api/rss-fresh" },
        { source: "/kondicionery/:slug", destination: "/api/seo" },
        { source: "/okna/:slug", destination: "/api/seo" }
      ];
      for (const u of mainUrls) {
        rewrites.push({ source: u === "" ? "/" : `/${u}`, destination: `/api/page?path=/${u}` });
      }
      for (const c of cityUrls) {
        rewrites.push({ source: `/${c}`, destination: `/api/page?path=/${c}` });
      }
      // Статьи базы знаний — серверная отрисовка (иначе Яндекс считает
      // их дублями главной и не индексирует)
      for (const b of articleSlugs) {
        rewrites.push({ source: `/baza-znaniy/${b}`, destination: `/api/page?path=/baza-znaniy/${b}` });
      }
      rewrites.push({ source: "/baza-znaniy/:slug", destination: "/api/page?path=/baza-znaniy/:slug" });

      // 301-редиректы: склейка дублей и старых адресов.
      // Vercel применяет redirects ДО rewrites, поэтому catch-all rewrite
      // этим правилам не мешает. Сами правила живут в src/constants/redirects.ts —
      // оттуда же их берут api/page.ts (серверный 301) и src/App.tsx (клиентский).
      const redirects: any[] = [
        // Схлопываем дубли со слешем: /baza-znaniy/ → /baza-znaniy (Google видит их как две страницы)
        { source: "/(.*)/", destination: "/$1", statusCode: 301 },
        ...Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({ source, destination, statusCode: 301 })),
        ...LEGACY_PATTERN_REDIRECTS.map(({ source, destination }) => ({ source, destination, statusCode: 301 })),
      ];

      // Страховка для старых адресов: если слой редиректов хостинга не сработал
      // (устаревший vercel.json, другой хостинг, локальный preview), эти пути всё
      // равно попадут в api/page.ts, который отдаст честный HTTP 301.
      for (const [source] of Object.entries(LEGACY_REDIRECTS)) {
        rewrites.push({ source, destination: `/api/page?path=${source}` });
      }
      for (const { source } of LEGACY_PATTERN_REDIRECTS) {
        rewrites.push({ source, destination: "/api/page" });
      }

      // Все остальные пути, которых нет в файловой системе, уходят в api/page.ts:
      // известные страницы — 200 с серверным SEO-контентом, неизвестные — честный
      // HTTP 404 + noindex (раньше здесь был index.html со статусом 200, из-за чего
      // Яндекс видел «мягкие 404» на любом мусорном адресе).
      rewrites.push({ source: "/((?!api/).*)", destination: "/api/page?path=/$1" });
      fs.writeFileSync(path.resolve(__dirname, "vercel.json"), JSON.stringify({ redirects, rewrites }, null, 2), "utf-8");
      console.log(`[Vercel Routes] Сгенерирован vercel.json (${redirects.length} редиректов, ${rewrites.length} маршрутов)!`);

      // 4. _redirects — те же правила для хостингов в стиле Netlify/Cloudflare Pages.
      // Генерируем из того же источника, чтобы список не расходился с vercel.json.
      const pad = (s: string, width: number) => s + " ".repeat(Math.max(1, width - s.length));
      const exactLines = Object.entries(LEGACY_REDIRECTS);
      const patternLines = LEGACY_PATTERN_REDIRECTS.map(({ source, destination }) => [
        toNetlifyPattern(source),
        toNetlifyPattern(destination),
      ]);
      const exactWidth = Math.max(...exactLines.map(([from]) => from.length)) + 2;
      const patternWidth = Math.max(...patternLines.map(([from]) => from.length)) + 2;
      const redirectsFile = [
        "# AUTO-GENERATED из src/constants/redirects.ts — не править вручную",
        "# 301-редиректы: склейка дублей и старых адресов",
        ...exactLines.map(([from, to]) => `${pad(from, exactWidth)}${to}  301`),
        "# Групповые правила (старые гео-ссылки и алиасы карточек)",
        ...patternLines.map(([from, to]) => `${pad(from, patternWidth)}${to}  301`),
        "",
        "# SPA-fallback: отдаём index.html, клиентский роутер дорисует страницу",
        "/*    /index.html   200",
        "",
      ].join("\n");
      fs.writeFileSync(path.resolve(__dirname, "public/_redirects"), redirectsFile, "utf-8");
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.writeFileSync(path.resolve(__dirname, "dist/_redirects"), redirectsFile, "utf-8");
      }
      console.log(`[_redirects] Сгенерирован файл для Netlify/Cloudflare (${redirects.length - 1} правил)!`);
      console.log(`[SEO SITEMAP] Успешно сгенерирована карта сайта: включено ${staticUrls.length} основных страниц, ${parsedCatalog.length} карточек кондиционеров и ${windowsCatalogData.length} страниц остекления!`);
    } catch (err) {
      console.error("[SEO SITEMAP] Ошибка при генерации sitemap:", err);
    }
  }
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoSitemapAndApiGenerator(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
