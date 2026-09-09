/** Единственное место с адресом приложения. При переезде на app.vektor-komforta.ru менять только здесь. */
export const INTERIER_APP_URL = "https://interier-delta.vercel.app/";
export const INTERIER_TITLE = "Interier — дизайн интерьера по фото";

export const INTERIER_ORIGIN = (() => {
  try {
    return new URL(INTERIER_APP_URL).origin;
  } catch {
    return "https://interier-delta.vercel.app";
  }
})();

export function interierEmbedUrl(): string {
  const url = new URL(INTERIER_APP_URL);
  url.searchParams.set("embed", "1");
  url.searchParams.set("from", "vektor-komforta");
  return url.toString();
}

const PAYMENT_HOST =
  /(^|\.)(yoomoney\.ru|yookassa\.ru|youkassa\.ru|money\.yandex\.ru|checkout\.yookassa\.ru)$/i;

export function isPaymentUrl(raw: string | undefined | null): raw is string {
  if (!raw) return false;
  try {
    const host = new URL(raw, INTERIER_APP_URL).hostname.toLowerCase();
    return PAYMENT_HOST.test(host) || host.includes("yoomoney") || host.includes("yookassa");
  } catch {
    return /yoomoney|yookassa/i.test(raw);
  }
}

export function extractPaymentUrl(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === "string") return isPaymentUrl(data) ? data : null;
  if (typeof data !== "object") return null;
  const rec = data as Record<string, unknown>;
  const candidates = [
    rec.url,
    rec.href,
    rec.confirmationUrl,
    rec.confirmation_url,
    typeof rec.confirmation === "object" && rec.confirmation
      ? (rec.confirmation as Record<string, unknown>).confirmation_url
      : null,
    rec.payload,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && isPaymentUrl(value)) return value;
  }
  return null;
}

export function openPaymentTab(url: string) {
  trackInterierEvent("interier_open_payment");
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup) popup.opener = null;
}

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
