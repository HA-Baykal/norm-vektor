export const INTERIER_APP_URL = "https://interier-delta.vercel.app/";
export const INTERIER_EXTERNAL_URL = "https://interier-fmbx.onrender.com";
export const INTERIER_TITLE = "Interier — дизайн интерьера по фото";

export function trackInterierEvent(name: string) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(110599022, "reachGoal", name);
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name);
  }
}

declare global {
  interface Window {
    ym?: (id: number, action: string, url?: string, params?: object) => void;
    gtag?: (...args: unknown[]) => void;
  }
}
