#!/usr/bin/env node
// ============================================================================
// scripts/serve-local.mjs — локальная эмуляция прод-роутинга Vercel.
//
// Зачем: серверный SEO-контент этого сайта рождается не в билде, а в функциях
// Vercel (api/page.ts — страницы, api/seo.js — карточки, api/rss.ts — RSS).
// `vite preview` отдаёт только статику, поэтому «что видит краулер» локально
// проверить нельзя. Этот скрипт поднимает сервер, который повторяет порядок
// маршрутизации Vercel:
//
//   1. redirects (301: склейка слешей, старые адреса из src/constants/redirects.ts)
//   2. filesystem (статика из dist/)
//   3. rewrites  (/rss.xml → api/rss, /kondicionery/:slug и /okna/:slug → api/seo,
//                 всё остальное → api/page — как в генерируемом vercel.json)
//
// Использование:
//   npm run build
//   node scripts/serve-local.mjs            # http://localhost:4173
//   node scripts/check-seo.mjs http://localhost:4173
//
// Отличия от прода: нет CDN-кэша, нет ограничения скорости, canonical в HTML
// указывает на prod-домен (зашит в api/*). Для SEO-проверок это не важно.
// ============================================================================

import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4173);
const BUNDLE = path.join(__dirname, ".local", "vercel-bundle.mjs");

// ------------------------- Сборка api-функций в бандл ------------------------

const ENTRY = `
import pageHandler from "./api/page";
import seoHandler from "./api/seo.js";
import rssHandler from "./api/rss";
import { LEGACY_REDIRECTS, LEGACY_PATTERN_REDIRECTS, normalizePath, resolveLegacyRedirect } from "./src/constants/redirects";
export { pageHandler, seoHandler, rssHandler, LEGACY_REDIRECTS, LEGACY_PATTERN_REDIRECTS, normalizePath, resolveLegacyRedirect };
`;

async function bundleApi() {
  await fs.mkdir(path.dirname(BUNDLE), { recursive: true });
  await build({
    stdin: { contents: ENTRY, resolveDir: ROOT, loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    outfile: BUNDLE,
    logLevel: "warning",
  });
  return import(pathToFileURL(BUNDLE).href);
}

// ------------------------------ Статика --------------------------------------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function serveStatic(res, filePath) {
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

// --------------------------- Адаптеры функций ---------------------------------

/** Edge-функция (Request → Response), как api/page.ts и api/rss.ts. */
async function callEdge(handler, req, res, rewrittenUrl) {
  const host = req.headers.host || `localhost:${PORT}`;
  const request = new Request(rewrittenUrl, {
    method: req.method,
    headers: { host, "x-forwarded-proto": "http", "user-agent": req.headers["user-agent"] || "" },
  });
  const response = await handler(request);
  const headers = {};
  response.headers.forEach((v, k) => (headers[k] = v));
  res.writeHead(response.status, headers);
  res.end(await response.text());
}

/** Легаси-функция в стиле Express (req, res), как api/seo.js. */
async function callExpress(handler, req, res, query) {
  const fakeReq = {
    query,
    method: req.method,
    url: req.url,
    headers: { host: req.headers.host || `localhost:${PORT}`, "x-forwarded-proto": "http" },
  };
  const fakeRes = {
    statusCode: 200,
    headers: {},
    setHeader(k, v) {
      this.headers[String(k).toLowerCase()] = v;
    },
    status(c) {
      this.statusCode = c;
      return this;
    },
    send(body) {
      res.writeHead(this.statusCode, this.headers);
      res.end(typeof body === "string" ? body : JSON.stringify(body));
    },
    json(body) {
      this.headers["content-type"] = "application/json; charset=utf-8";
      this.send(JSON.stringify(body));
    },
  };
  await handler(fakeReq, fakeRes);
}

// ------------------------------ Роутинг ---------------------------------------

async function handle(req, res, api) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  // --- 1. redirects (Vercel применяет их до всего) --------------------------
  // Склейка слешей: /(.*)
  if (pathname !== "/" && pathname.endsWith("/")) {
    res.writeHead(301, { Location: pathname.slice(0, -1) });
    return res.end();
  }
  const legacy = api.resolveLegacyRedirect(pathname);
  if (legacy) {
    res.writeHead(301, { Location: legacy });
    return res.end();
  }

  // --- 2. filesystem: статика из dist/ --------------------------------------
  if (req.method === "GET" || req.method === "HEAD") {
    const clean = pathname.replace(/\/+$/, "") || "/";
    const candidates =
      clean === "/"
        ? [path.join(DIST, "index.html")]
        : [path.join(DIST, clean), path.join(DIST, clean + ".html"), path.join(DIST, clean, "index.html")];
    for (const c of candidates) {
      if (!c.startsWith(DIST)) continue; // защита от ../
      if (await serveStatic(res, c)) return;
    }
  }

  // --- 3. rewrites (как в генерируемом vercel.json) --------------------------
  const host = req.headers.host || `localhost:${PORT}`;
  const origin = `http://${host}`;

  if (pathname === "/api/page") {
    return callEdge(api.pageHandler, req, res, url.toString());
  }
  if (pathname === "/api/seo") {
    return callExpress(api.seoHandler, req, res, Object.fromEntries(url.searchParams));
  }
  if (pathname === "/api/rss" || pathname === "/api/rss-fresh") {
    return callEdge(api.rssHandler, req, res, origin + pathname);
  }
  if (pathname === "/rss.xml" || pathname === "/rss-fresh.xml") {
    return callEdge(api.rssHandler, req, res, origin + "/api" + pathname.replace(".xml", ""));
  }
  if (pathname.startsWith("/api/")) {
    res.writeHead(501, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("serve-local: этот api-эндпоинт не эмулируется");
  }

  // Карточки: /kondicionery/:slug, /okna/:slug (возможен ?btu=)
  const card = pathname.match(/^\/(kondicionery|okna)\/([^/]+)$/);
  if (card) {
    const query = { slug: card[2] };
    if (url.searchParams.has("btu")) query.btu = url.searchParams.get("btu");
    return callExpress(api.seoHandler, req, res, query);
  }

  // Всё остальное → api/page?path=<pathname> (+ пользовательские query)
  const userQuery = new URLSearchParams(url.searchParams);
  userQuery.delete("path");
  const qs = userQuery.toString();
  return callEdge(
    api.pageHandler,
    req,
    res,
    `${origin}/api/page?path=${encodeURIComponent(pathname)}${qs ? "&" + qs : ""}`,
  );
}

// -------------------------------- Старт ---------------------------------------

const api = await bundleApi();

// Проверяем, что бандл собрался со всеми экспортами (страховка от опечаток в entry)
for (const name of ["pageHandler", "seoHandler", "rssHandler", "resolveLegacyRedirect"]) {
  if (typeof api[name] !== "function") throw new Error(`Бандл api не экспортирует ${name}`);
}

const server = http.createServer((req, res) => {
  handle(req, res, api).catch((e) => {
    console.error("[serve-local]", req.url, e);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("serve-local error: " + e.message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`serve-local: эмуляция Vercel на http://localhost:${PORT}`);
  console.log(`  статика: ${DIST}`);
  console.log(`  next: node scripts/check-seo.mjs http://localhost:${PORT}`);
});
