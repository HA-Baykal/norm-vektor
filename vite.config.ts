import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
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
        "top-10-konditsionerov-irkutsk-2026"
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const u of staticUrls) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/${u}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
        xml += `    <changefreq>${u === "" || u === "okna" || u === "kondicionery" ? "daily" : "weekly"}</changefreq>\n`;
        xml += `    <priority>${u === "" ? "1.0" : "0.9"}</priority>\n`;
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
      for (const b of blogSlugs) {
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
        ...servicePages
      ];
      const rewrites: any[] = [
        { source: "/kondicionery/:slug", destination: "/api/seo" },
        { source: "/okna/:slug", destination: "/api/seo" }
      ];
      for (const u of mainUrls) {
        rewrites.push({ source: u === "" ? "/" : `/${u}`, destination: `/api/page?path=/${u}` });
      }
      for (const c of cityUrls) {
        rewrites.push({ source: `/${c}`, destination: `/api/page?path=/${c}` });
      }
      // 301-редиректы: склейка дублей и старых адресов.
      // Vercel применяет redirects ДО rewrites, поэтому catch-all rewrite
      // этим правилам не мешает.
      const redirects = [
        // Транслитерационные варианты услуги «алмазное бурение» → канонический slug
        { source: "/almaznoe-burenie-i-sverlenie", destination: "/almaznoe-burenie", statusCode: 301 },
        { source: "/almaznaya-rezka", destination: "/almaznoe-burenie", statusCode: 301 },
        { source: "/almaznoe-burenie-irkutsk", destination: "/almaznoe-burenie", statusCode: 301 },
        { source: "/burenie-otverstij", destination: "/almaznoe-burenie", statusCode: 301 },
        // Мёртвые URL, уже заиндексированные Яндексом (из SEO-аудита)
        { source: "/burenie", destination: "/almaznoe-burenie", statusCode: 301 },
        { source: "/standarty-montazha", destination: "/standarty", statusCode: 301 },
        // Старые гео-ссылки с префиксом /burenie-... → канонический раздел
        { source: "/burenie-v-:slug*", destination: "/almaznoe-burenie", statusCode: 301 },
        { source: "/burenie-na-:slug*", destination: "/almaznoe-burenie", statusCode: 301 },
        // Варианты написания «вентиляция»
        { source: "/ventilyatsiya", destination: "/ventilyaciya", statusCode: 301 },
        { source: "/ventilyaciya-irkutsk", destination: "/ventilyaciya", statusCode: 301 },
        // Кондиционеры — варианты транслита
        { source: "/konditsionery", destination: "/kondicionery", statusCode: 301 },
        { source: "/split-sistemy", destination: "/kondicionery", statusCode: 301 },
        // Окна — варианты
        { source: "/plastikovye-okna", destination: "/okna", statusCode: 301 },
        { source: "/okna-pvh", destination: "/okna", statusCode: 301 },
        // Старая статья блога переехала
        { source: "/articles/kak-vybrat-kondicioner", destination: "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi", statusCode: 301 },
      ];

      rewrites.push({ source: "/((?!api/).*)", destination: "/index.html" });
      fs.writeFileSync(path.resolve(__dirname, "vercel.json"), JSON.stringify({ redirects, rewrites }, null, 2), "utf-8");
      console.log(`[Vercel Routes] Сгенерирован vercel.json (${rewrites.length} маршрутов)!`);
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
