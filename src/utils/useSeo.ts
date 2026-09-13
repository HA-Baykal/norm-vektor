import { useEffect } from "react";
import { SITE_ORIGIN } from "../constants/redirects";

const DEFAULT_TITLE = "Пластиковые окна, кондиционеры и вентиляция в Иркутске — Вектор Комфорта";

function setMeta(nameOrProperty: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let meta = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, nameOrProperty);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.href = href;
}

export function setRobots(content: string) {
  let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function removeRobots() {
  const meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (meta) meta.remove();
}

function getCleanUrl(): string {
  if (typeof window === "undefined") return SITE_ORIGIN;
  // pathname without search and hash, keep as is (no trailing slash normalization — handled by redirect)
  return `${SITE_ORIGIN}${window.location.pathname}`;
}

/**
 * Единый SEO-хук: устанавливает <title>, meta description, canonical, OG
 * для каждой страницы. Canonical всегда без ?query — швейцарские часы.
 */
export function useSeo(title: string, description: string, opts?: { canonical?: string; robots?: string; ogType?: string }) {
  useEffect(() => {
    const safeTitle = title && title.trim() ? title.trim() : DEFAULT_TITLE;
    const safeDesc = description && description.trim() ? description.trim() : "Пластиковые окна VEKA, кондиционеры и вентиляция в Иркутске — продажа и монтаж по ГОСТу от компании Вектор Комфорта.";
    const canonical = opts?.canonical || getCleanUrl();
    const robots = opts?.robots;
    const ogType = opts?.ogType || "website";

    document.title = safeTitle;
    setMeta("description", safeDesc);
    setMeta("og:title", safeTitle, true);
    setMeta("og:description", safeDesc, true);
    setMeta("og:url", canonical, true);
    setMeta("og:type", ogType, true);
    setCanonical(canonical);
    if (robots) setRobots(robots);
    else removeRobots();

    return () => {
      document.title = DEFAULT_TITLE;
      removeRobots();
    };
  }, [title, description, opts?.canonical, opts?.robots, opts?.ogType]);
}

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

/**
 * SEO-хук хлебных крошек: вставляет JSON-LD BreadcrumbList
 */
export function useBreadcrumb(items: BreadcrumbItem[]) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (!items.length) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => {
        const listItem: Record<string, unknown> = {
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
        };
        const path = item.path ?? (i === items.length - 1 ? pathname : undefined);
        if (path) {
          listItem.item = path.startsWith("http") ? path : `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
        }
        return listItem;
      }),
    };

    const SCRIPT_ID = "seo-breadcrumb-schema";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(SCRIPT_ID);
      if (el) el.remove();
    };
  }, [JSON.stringify(items), pathname]);
}

export { SITE_ORIGIN, DEFAULT_TITLE };
