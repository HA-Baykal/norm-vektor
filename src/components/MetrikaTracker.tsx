import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const YM_COUNTER_ID = 110599022;

declare global {
  interface Window {
    ym?: (id: number, action: string, url?: string, params?: object) => void;
  }
}

// ИИ-поиск и ассистенты: помечаем визит параметром ai_source, чтобы в Метрике
// можно было построить отчёт/сегмент «трафик из ИИ-поиска» и связать его с заявками.
const AI_REFERRERS: Record<string, string> = {
  "chatgpt.com": "chatgpt",
  "chat.openai.com": "chatgpt",
  "perplexity.ai": "perplexity",
  "gemini.google.com": "gemini",
  "claude.ai": "claude",
  "copilot.microsoft.com": "copilot",
  "alice.yandex.ru": "alice",
  "neuro.yandex.ru": "yandex-neuro",
};

function detectAiSource(referrer: string): string | null {
  if (!referrer) return null;
  for (const [host, name] of Object.entries(AI_REFERRERS)) {
    if (referrer.includes(host)) return name;
  }
  return null;
}

export default function MetrikaTracker() {
  const location = useLocation();

  useEffect(() => {
    const aiSource = detectAiSource(document.referrer);
    if (typeof window.ym === "function") {
      window.ym(
        YM_COUNTER_ID,
        "hit",
        location.pathname + location.search,
        aiSource ? { params: { ai_source: aiSource } } : undefined,
      );
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
