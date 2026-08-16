// api/rss.ts — RSS-лента для Яндекс Дзена
import articlesData from "../src/data/articlesData";
export const config = { runtime: "edge" };
const SITE = "https://www.vektor-komforta.ru";
function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
  if (article.excerpt) return article.excerpt;
  const first = (article.content || []).find((b: any) => b.type === "p");
  const raw = first?.text ?? article.title ?? "";
  return raw.length > 250 ? raw.slice(0, 250) + "…" : raw;
}
function rfc822(d: Date): string {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${days[d.getUTCDay()]}, ${p(d.getUTCDate())} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:00 +0800`;
}
export default async function handler() {
  const now = new Date();
  const local = new Date(now.getTime() + 8 * 3600 * 1000);
  const dayStartUtc = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 0, 0, 0);
  const entries = Object.entries((articlesData as Record<string, any>) || {});
  const items = entries
    .filter(([slug]) => /^[a-z0-9-]+$/.test(slug))
    .map(([slug, article], i) => {
      const url = `${SITE}/baza-znaniy/${slug}`;
      const html = (article.content || []).map(blockToHtml).join("");
      const pubDate = rfc822(new Date(dayStartUtc + i * 3600 * 1000));
      return `<item>
  <title>${esc(article.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${esc(buildDescription(article))}</description>
  <category>native-draft</category>
  <category>format-article</category>
  <category>index</category>
  <category>comment-all</category>
  <content:encoded><![CDATA[${html.replace(/\]\]>/g, "]]&gt;")}]]></content:encoded>
</item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Вектор Комфорта — статьи об окнах, кондиционерах и вентиляции в Иркутске</title>
<link>${SITE}/</link>
<description>База знаний компании «Вектор Комфорта» (Иркутск): как выбрать кондиционер по площади, окна VEKA, вентиляцию и бризеры. Советы от монтажников с опытом более 10 лет.</description>
<language>ru</language>
<media:rating scheme="urn:simple">nonadult</media:rating>
${items}
</channel>
</rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
