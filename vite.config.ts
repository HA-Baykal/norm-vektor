import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Автоматический SEO-генератор карты сайта и базы для Vercel API
const seoSitemapAndApiGenerator = () => ({
  name: "seo-sitemap-and-api-generator",
  closeBundle() {
    try {
      const catPath = path.resolve(__dirname, "src/components/CatalogConditioners.tsx");
      if (!fs.existsSync(catPath)) return;
      const content = fs.readFileSync(catPath, "utf-8");

      // 1. Экспорт всех моделей и всех вариантов мощности (BTU) в JSON для Vercel API (api/seo.js)
      const startMarker = "export const conditioners: Conditioner[] = ";
      const startIndex = content.indexOf(startMarker);
      if (startIndex !== -1) {
        const afterStart = content.slice(startIndex + startMarker.length);
        const endIndex = afterStart.indexOf("];\n");
        if (endIndex !== -1) {
          const arrayCode = afterStart.slice(0, endIndex + 1);
          // Преобразуем чистый код массива в JSON
          try {
            const parsedCatalog = eval(`(${arrayCode})`);
            const apiDataPath = path.resolve(__dirname, "api/catalog-data.json");
            if (fs.existsSync(path.dirname(apiDataPath))) {
              fs.writeFileSync(apiDataPath, JSON.stringify(parsedCatalog, null, 2), "utf-8");
              console.log(`[Vercel API Data] Успешно обновлена серверная база для парсеров (${parsedCatalog.length} моделей и вариантов BTU)!`);
            }
          } catch (e) {
            console.error("[Vercel API Data] Ошибка экспорта данных для Vercel:", e);
          }
        }
      }

      // 2. Генерация карты сайта Sitemap.xml
      const modelNames: string[] = [];
      const regex = /name:\s*"(.*?)"/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        modelNames.push(match[1]);
      }

      const dateStr = new Date().toISOString().split("T")[0];
      const staticUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "portfolio", "standarty", "otzyv", "baza-znaniy", "kontakty"
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const u of staticUrls) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/${u}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
        xml += `    <changefreq>${u === "" || u === "kondicionery" ? "daily" : "weekly"}</changefreq>\n`;
        xml += `    <priority>${u === "" ? "1.0" : "0.9"}</priority>\n`;
        xml += `  </url>\n`;
      }

      for (const name of modelNames) {
        const slug = name.replace(/\s+/g, "-").replace(/\//g, "-");
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/kondicionery/${encodeURI(slug)}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      const publicSitemap = path.resolve(__dirname, "public/sitemap.xml");
      fs.writeFileSync(publicSitemap, xml, "utf-8");
      
      const distSitemap = path.resolve(__dirname, "dist/sitemap.xml");
      if (fs.existsSync(path.resolve(__dirname, "dist"))) {
        fs.writeFileSync(distSitemap, xml, "utf-8");
      }

      console.log(`[SEO SITEMAP] Успешно сгенерирована карта сайта: включено ${staticUrls.length} основных страниц и ${modelNames.length} карточек кондиционеров!`);
    } catch (err) {
      console.error("[SEO SITEMAP] Ошибка при генерации sitemap:", err);
    }
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), seoSitemapAndApiGenerator()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
