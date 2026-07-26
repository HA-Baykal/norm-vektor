import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Автоматический SEO-генератор карты сайта (Sitemap.xml)
// Сам находит все 70+ моделей кондиционеров из кода и генерирует идеальную карту для Яндекса и Google
const seoSitemapGenerator = () => ({
  name: "seo-sitemap-generator",
  closeBundle() {
    try {
      const catPath = path.resolve(__dirname, "src/components/CatalogConditioners.tsx");
      if (!fs.existsSync(catPath)) return;
      const content = fs.readFileSync(catPath, "utf-8");

      // Извлекаем все имена моделей из каталога
      const modelNames: string[] = [];
      const regex = /name:\s*"(.*?)"/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        modelNames.push(match[1]);
      }

      const dateStr = new Date().toISOString().split("T")[0]; // Например: 2026-04-01

      const staticUrls = [
        "", "okna", "kondicionery", "ventilyaciya", "almaznoe-burenie",
        "portfolio", "standarty", "otzyv", "baza-znaniy", "kontakty"
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Добавляем основные страницы сайта
      for (const u of staticUrls) {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.vektor-komforta.ru/${u}</loc>\n`;
        xml += `    <lastmod>${dateStr}</lastmod>\n`;
        xml += `    <changefreq>${u === "" || u === "kondicionery" ? "daily" : "weekly"}</changefreq>\n`;
        xml += `    <priority>${u === "" ? "1.0" : "0.9"}</priority>\n`;
        xml += `  </url>\n`;
      }

      // Добавляем все 70+ персональных страниц кондиционеров для быстрого поиска в Яндексе и Гугле
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), seoSitemapGenerator()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
