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
            const staticUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "portfolio", "standarty", "otzyv", "baza-znaniy", "kontakty",
        "okna-v-homutovo", "kondicionery-v-homutovo",
        "okna-v-molodezhnom", "kondicionery-v-molodezhnom",
        "okna-v-angarske", "kondicionery-v-angarske",
        "okna-v-shelehove", "kondicionery-v-shelehove"
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

      xml += `</urlset>`;

      const publicSitemap = path.resolve(__dirname, "public/sitemap.xml");
      fs.writeFileSync(publicSitemap, xml, "utf-8");
      
      const distSitemap = path.resolve(__dirname, "dist/sitemap.xml");
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.writeFileSync(distSitemap, xml, "utf-8");
      }
        // 3. Генерация vercel.json с маршрутами для SEO-функций
      const cityUrls = [
        "okna-v-homutovo", "kondicionery-v-homutovo",
        "okna-v-molodezhnom", "kondicionery-v-molodezhnom",
        "okna-v-angarske", "kondicionery-v-angarske",
        "okna-v-shelehove", "kondicionery-v-shelehove"
      ];
      const mainUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "kontakty", "standarty", "otzyv", "baza-znaniy", "portfolio"
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
      rewrites.push({ source: "/((?!api/).*)", destination: "/index.html" });
      fs.writeFileSync(path.resolve(__dirname, "vercel.json"), JSON.stringify({ rewrites }, null, 2), "utf-8");
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
});
