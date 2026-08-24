// api/rss-fresh.ts — RSS-лента для Яндекс Вебмастера ("Свежее и актуальное")
import articlesData from "../src/data/articlesData";

export const config = { runtime: "edge" };

const SITE = "https://www.vektor-komforta.ru";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function blockToHtml(b: any): string {
  if (b.type === "h") return `<h2>${esc(b.text)}</h2>`;
  if (b.type === "list") {
    const items = (b.items || []).map((i: string) => `<li>${esc(i)}</li>`).join("");
    return `<ul>${items}</ul>`;
  }
  return `<p>${esc(b.text)}</p>`;
}

function buildDescription(article: any): string {
  if (article.metaDescription) return article.metaDescription;
  if (article.excerpt) return article.excerpt;
  if (article.summary) return article.summary;
  const first = (article.content || []).find((b: any) => b.type === "p");
  const raw = first?.text ?? article.title ?? "";
  return raw.length > 250 ? raw.slice(0, 250) + "…" : raw;
}

function rfc822(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${days[d.getUTCDay()]}, ${p(d.getUTCDate())} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:00 +0800`;
}

export default async function handler() {
  const entries = Object.entries((articlesData as Record<string, any>) || {});

  const items = entries
    .filter(([slug]) => /^[a-z0-9-]+$/.test(slug))
    .map(([slug, article]) => {
      const url = `${SITE}/baza-znaniy/${slug}`;
      const html = (article.content || []).map(blockToHtml).join("");

      const dateStr = article.date || "2026-08-20";
      const dateObj = new Date(`${dateStr}T08:00:00+08:00`);
      const pubDate = rfc822(isNaN(dateObj.getTime()) ? new Date() : dateObj);

      return `<item>
  <title>${esc(article.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${esc(buildDescription(article))}</description>
  <category>${esc(article.category || "База знаний")}</category>
  <content:encoded><![CDATA[${html.replace(/\]\]>/g, "]]&gt;")}]]></content:encoded>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Вектор Комфорта — статьи об окнах, кондиционерах и вентиляции в Иркутске</title>
<link>${SITE}/</link>
<description>Свежие и актуальные статьи компании «Вектор Комфорта» (Иркутск): как выбрать кондиционер по площади, окна VEKA, вентиляцию и бризеры. Советы от монтажников с опытом более 10 лет.</description>
<language>ru</language>
<atom:link href="${SITE}/rss-fresh.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
