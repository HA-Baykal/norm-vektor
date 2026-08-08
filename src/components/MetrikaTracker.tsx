import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const YM_COUNTER_ID = 110599022;

declare global {
  interface Window {
    ym?: (id: number, action: string, url?: string, params?: object) => void;
  }
}

export default function MetrikaTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ym === "function") {
      window.ym(YM_COUNTER_ID, "hit", location.pathname + location.search);
    }

    const base = "https://www.vektor-komforta.ru";
    const cleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const fullUrl = base + cleanPath;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.href = fullUrl;

    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = fullUrl;
  }, [location]);

  return null;
}
