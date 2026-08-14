import { useEffect } from "react";

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

/**
 * Единый SEO-хук: устанавливает <title>, meta description и Open Graph
 * для каждой страницы. Используется и клиентским рендером, и согласуется
 * с серверными meta в api/page.ts.
 */
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", window.location.href, true);
    setMeta("og:type", "website", true);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description]);
}

const SITE_ORIGIN = "https://www.vektor-komforta.ru";

export interface BreadcrumbItem {
  /** Название пункта («Главная», «Кондиционеры», «Ballu Eclipse»…) */
  name: string;
  /** Путь от корня сайта («/», «/kondicionery»). У последнего пункта можно опустить. */
  path?: string;
}

/**
 * SEO-хук хлебных крошек: вставляет в <head> JSON-LD разметку
 * Schema.org BreadcrumbList (P2-3 SEO-аудита). Принимает массив
 * пунктов от главной до текущей страницы; у последнего пункта
 * ссылку можно не указывать. При уходе со страницы разметка удаляется.
 */
export function useBreadcrumb(items: BreadcrumbItem[]) {
  useEffect(() => {
    if (!items.length) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, i) => {
        const listItem: Record<string, unknown> = {
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
        };
        if (item.path) {
          listItem.item = item.path.startsWith("http")
            ? item.path
            : `${SITE_ORIGIN}${item.path === "/" ? "/" : item.path}`;
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
  }, [JSON.stringify(items)]);
}
