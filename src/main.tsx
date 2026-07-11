import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Гарантированная установка иконки сайта (Favicon) во всех браузерах
const FAVICON_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%234F46E5'/%3E%3Cstop offset='50%25' stop-color='%237C3AED'/%3E%3Cstop offset='100%25' stop-color='%23EC4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' rx='140' fill='url(%23g)'/%3E%3Cpath d='M110 160 C110 140 125 125 145 125 L230 125 C244 125 257 132 265 144 L285 174 C290 181 298 185 307 185 L367 185 C387 185 402 200 402 220 L402 360 C402 380 387 395 367 395 L145 395 C125 395 110 380 110 360 Z' fill='rgba(255,255,255,0.25)'/%3E%3Cpath d='M110 215 C110 195 125 180 145 180 L367 180 C387 180 402 195 402 215 L402 360 C402 380 387 395 367 395 L145 395 C125 395 110 380 110 360 Z' fill='%23FFFFFF'/%3E%3Ctext x='256' y='325' font-family='sans-serif' font-size='115' font-weight='900' fill='url(%23g)' text-anchor='middle'%3EFS%3C/text%3E%3C/svg%3E";

function ensureFavicon() {
  if (typeof document === 'undefined') return;
  
  const links = document.querySelectorAll("link[rel*='icon']");
  if (links.length === 0) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = FAVICON_DATA_URI;
    document.head.appendChild(link);
  } else {
    links.forEach((node) => {
      const link = node as HTMLLinkElement;
      if (link.href && (link.href.includes('404') || link.href.endsWith('/favicon.svg') || link.href.endsWith('/favicon.ico'))) {
        link.href = FAVICON_DATA_URI;
      }
    });
  }
}
ensureFavicon();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
