import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { LEGACY_PATTERN_REDIRECTS, LEGACY_REDIRECTS, toNetlifyPattern } from "./src/constants/redirects";
import { windowsCatalogData } from "./src/data/windowsCatalog";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Автоматический SEO-генератор карты сайта (Sitemap.xml) и базы для Vercel API
const seoSitemapAndApiGenerator = () => ({
  name: "seo-sitemap-and-api-generator",
  closeBundle() {
    try {
      const catPath = path.resolve(__dirname, "src/components/CatalogConditioners.tsx");
      if (!fs.existsSync(catPath)) return;
      const content = fs.readFileSync(catPath, "utf-8");

      // 1. Экспорт всех моделей кондиционеров в JSON для Vercel API
      const startMarker = "export const conditioners: Conditioner[] = ";
      const startIndex = content.indexOf(startMarker);
      let parsedCatalog: any[] = [];
      if (startIndex !== -1) {
        const afterStart = content.slice(startIndex + startMarker.length);
        const endIndex = afterStart.indexOf("];\n");
        if (endIndex !== -1) {
          const arrayCode = afterStart.slice(0, endIndex + 1);
          try {
            parsedCatalog = eval(`(${arrayCode})`);
            const apiDataPath = path.resolve(__dirname, "api/catalog-data.json");
            if (fs.existsSync(path.dirname(apiDataPath))) {
              fs.writeFileSync(apiDataPath, JSON.stringify({
                conditioners: parsedCatalog,
                windows: windowsCatalogData
              }, null, 2), "utf-8");
              console.log(`[Vercel API Data] Успешно обновлена серверная база (${parsedCatalog.length} кондиционеров и ${windowsCatalogData.length} решений по окнам)!`);
            }
          } catch (e) {
            console.error("[Vercel API Data] Ошибка экспорта данных для Vercel:", e);
          }
        }
      }

      // 2. Генерация карты сайта Sitemap.xml (Яндекс и Google)
      const dateStr = new Date().toISOString().split("T")[0];

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

      const staticUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "portfolio", "standarty", "otzyv", "baza-znaniy", "kontakty",
        "sravnenie", "interier",
        ...servicePages,
        ...cityPages
      ];

      // Статьи базы знаний
      const blogSlugs = [
        "kak-vybrat-konditsioner-po-ploshchadi",
        "invertornyy-ili-obychnyy-konditsioner",
        "okna-veka-vs-rehau-chto-luchshe-dlya-irkutska",
        "kakie-plastikovye-okna-vybrat",
        "pochemu-ventilyatsiya-stoit-dorogo",
        "zachem-nuzhna-ventilyatsiya",
        "mozhno-li-zabolet-ot-konditsionera",
        "invertornyy-konditsioner-stoit-li-pereplachivat",
        "skolko-stoit-ustanovka-konditsionera-irkutsk",
        "skolko-stoyat-plastikovye-okna-irkutsk",
        "brizer-ili-rekuperator-chto-vybrat",
        "pochemu-poteyut-plastikovye-okna",
        "nuzhno-li-obsluzhivat-konditsioner",
        "top-10-konditsionerov-irkutsk-2026",
        "almaznoe-burenie-tsena-i-tehnologiya",
        "osteklenie-balkonov-tseny-po-variantam",
        "montazh-konditsionera-po-gostu-chek-list",
        "zapravka-konditsionera-freonom-kogda-i-skolko",
        "ventilyatsiya-v-chastnom-dome",
        "okna-dlya-doma-iz-brusa",
        "duet-iz-plastikovogo-okna",
        "okna-propyskayut-shum",
        "zimniy-letniy-rezhim-okon",
        "energosberegayushchiy-steklopaket-i-steklo",
        "mozhno-li-obedinit-balkon-s-komnatoi",
        "kuda-veshat-konditsioner",
        "konditsioner-na-obogrev-zimoy",
        "konditsioner-ploho-holodit",
        "zapah-iz-konditsionera",
        "kapaet-voda-iz-konditsionera",
        "tipy-konditsionerov-split-kassetnyy-kanalnyy",
        "mobilnyy-konditsioner-ili-split-sistema",
        "pochemu-shumit-konditsioner",
        "brizer-chto-eto",
        "brizer-ili-konditsioner",
        "klapan-brizer-ili-rekuperator",
        "pochemu-v-kvartire-dushno-co2",
        "vytyazhka-ne-rabotaet-i-zapahi-ot-sosedey",
        "mozhno-li-sverlit-nesushchuyu-stenu",
        "pochemu-montazh-okon-stoit-dorozhe"
      ];
      // Единственный источник для RSS, SSR-маршрутов и Sitemap — articleContent.
      // Статический список выше остаётся безопасным fallback, если экспорт не удался.
      let articleSlugs: string[] = [...blogSlugs];
      try {
        const blogPath = path.resolve(__dirname, "src/pages/BlogArticle.tsx");
        const blogSrc = fs.readFileSync(blogPath, "utf-8");
        const artStartMarker = "const articleContent: Record<string, Article> = {";
        const artStart = blogSrc.indexOf(artStartMarker);
        const artEnd = blogSrc.indexOf("};\nexport default function BlogArticle");
        if (artStart !== -1 && artEnd !== -1) {
          const articleCode = blogSrc.slice(artStart + artStartMarker.length - 1, artEnd + 1);
          const parsedArticles = eval(`(${articleCode})`);
          articleSlugs = Object.keys(parsedArticles);
          const outTs = `// AUTO-GENERATED\nconst articlesData = ${JSON.stringify(parsedArticles)};\nexport default articlesData;\n`;
          fs.writeFileSync(path.resolve(__dirname, "src/data/articlesData.ts"), outTs, "utf-8");
          console.log(`[RSS] Экспортировано ${articleSlugs.length} статей для RSS-ленты Дзена`);
        }
      } catch (e) {
        console.error("[RSS] Ошибка экспорта статей для RSS:", e);
      }

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const u of staticUrls) {
        // Швейцарские часы: /interier — отдельный проект, снижает тематичность. Держим с низким приоритетом, рекомендуем вынести на поддомен interier.vektor-komforta.ru
        const isInterier = u === "interier";
        const changefreq = isInterier ? "yearly" : (u === "" || u === "okna" || u === "kondicionery" ? "daily" : "weekly");
        const priority = isInterier ? "0.3" : (u === "" ? "1.0" : "0.9");
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/${u}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
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
          xml += `    <lastmod>${dateStr}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.85</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      // Добавляем все SEO-страницы окон и остекления в Sitemap
      for (const w of windowsCatalogData) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/okna/${encodeURI(w.slug)}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.88</priority>\n`;
        xml += `  </url>\n`;
      }

      // Добавляем статьи базы знаний в Sitemap
      for (const b of articleSlugs) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/baza-znaniy/${b}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
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
    viteSingleFile(),
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
