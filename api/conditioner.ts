// Vercel Edge Function: отдаёт для каждого кондиционера отдельный HTML
// с настоящим названием, ценой, описанием и фото — для SEO (Яндекс/Google)
// и красивых превью ссылок. Само SPA-приложение тоже загружается.
import { conditioners } from "../src/data/conditioners";

export const config = { runtime: "edge" };

function fmt(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let slug = url.searchParams.get("slug") || "";
  if (!slug) {
    const m = url.pathname.match(/kondicionery\/([^/?#]+)/);
    if (m) slug = decodeURIComponent(m[1]);
  }

  // Базовый HTML приложения (single-file сборка)
  let html = "";
  try {
    const r = await fetch(new URL("/", url).toString());
    html = await r.text();
  } catch {
    return new Response("Server error", { status: 500 });
  }

  const c = conditioners.find((x) => x.slug.toLowerCase() === slug.toLowerCase());
  if (c) {
    const prices = c.variants.map((v) => v.price).filter((p) => p > 0);
    const mp = prices.length ? Math.min(...prices) : 0;
    const priceStr = mp > 0 ? fmt(mp) : "по запросу";
    const title = `${c.brand} ${c.name} — ${mp > 0 ? "цена от " + priceStr : "купить"} в Иркутске | Вектор Комфорта`;
    const desc = (`Сплит-система ${c.brand} ${c.name}. ${mp > 0 ? "Цена от " + priceStr + ". " : ""}Охлаждение, обогрев, профессиональный монтаж и гарантия в Иркутске. ` + c.intro).slice(0, 200);
    const img = c.image || "";

    const og =
      `<meta name="description" content="${esc(desc)}"/>` +
      `<meta property="og:type" content="product"/>` +
      `<meta property="og:site_name" content="Вектор Комфорта"/>` +
      `<meta property="og:title" content="${esc(title)}"/>` +
      `<meta property="og:description" content="${esc(desc)}"/>` +
      (img ? `<meta property="og:image" content="${esc(img)}"/>` : "") +
      `<meta property="og:url" content="https://www.vektor-komforta.ru/kondicionery/${c.slug}"/>` +
      `<meta name="twitter:card" content="summary_large_image"/>`;

    const seo =
      `<h1>${esc(c.brand)} ${esc(c.name)}</h1>` +
      `<p><strong>Цена:</strong> ${esc(priceStr)}</p>` +
      (img ? `<p><img src="${esc(img)}" alt="${esc(c.brand + " " + c.name)}" width="420"/></p>` : "") +
      `<p>${esc(c.intro)}</p>` +
      `<p>Тип: ${esc(c.type)}. ${c.inverter ? "Инверторный компрессор." : "Стандартный компрессор."} ${c.smartHome ? "Умный дом (Wi-Fi)." : ""} Хладагент ${esc(c.refrigerant)}. Уровень шума ${esc(c.noise)}. Страна: ${esc(c.country)}.</p>` +
      `<p>Купить и установить кондиционер ${esc(c.brand)} ${esc(c.name)} с гарантией в Иркутске, Ангарске, Шелехове, Хомутово и пригороде. Компания «Вектор Комфорта» — официальный партнёр Русклимат и Daichi.</p>`;

    html = html
      .replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`)
      .replace(/<meta\s+name="description"[^>]*>/i, "")
      .replace("</head>", `${og}</head>`)
      .replace(/<div id="root">\s*<\/div>/i, `<div id="root"></div><noscript>${seo}</noscript>`);
  }

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
