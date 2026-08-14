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
