import { useEffect, useMemo, useRef, useState } from "react";
import { WORKS, SERVICE_COLORS, SERVICE_LABELS, type WorkService } from "../data/works";
import Reveal from "./Reveal";

// Карта выполненных работ на Leaflet (OpenStreetMap). Библиотека грузится
// с CDN — без npm-зависимостей и без платных API-ключей. Если CDN
// недоступен, показываем список работ карточками, чтобы блок не пропадал.

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

declare global {
  interface Window {
    L?: any;
  }
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(window.L));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
    // Если CDN молчит дольше 10 секунд — уходим в запасной список.
    setTimeout(() => {
      if (!window.L) reject(new Error("Leaflet timeout"));
    }, 10000);
  });
}

type Filter = "all" | WorkService;

export default function WorksMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  const shownWorks = useMemo(
    () => (filter === "all" ? WORKS : WORKS.filter((w) => w.service === filter)),
    [filter]
  );

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapInstance.current) return;
        const map = L.map(mapRef.current, { scrollWheelZoom: false }).setView([52.28, 104.28], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        mapInstance.current = map;
        layerRef.current = L.layerGroup().addTo(map);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
      // Карта живёт на уровне модуля-страницы; при уходе со страницы чистим.
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  // Перерисовка маркеров при смене фильтра.
  useEffect(() => {
    const L = window.L;
    if (status !== "ready" || !L || !layerRef.current) return;
    layerRef.current.clearLayers();

    shownWorks.forEach((w) => {
      const color = SERVICE_COLORS[w.service];
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(15,23,42,.4)"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -10],
      });
      L.marker(w.coords, { icon })
        .addTo(layerRef.current)
        .bindPopup(
          `<div style="font-family:inherit;min-width:190px">
            <div style="font-weight:800;color:#1a3a5c;font-size:13px">${w.title}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">${w.district} · ${w.year} · ${SERVICE_LABELS[w.service]}</div>
            <div style="font-size:12px;color:#334155;margin-top:6px;line-height:1.45">${w.summary}</div>
          </div>`
        );
    });

    if (shownWorks.length > 0) {
      const bounds = L.latLngBounds(shownWorks.map((w) => w.coords));
      mapInstance.current?.fitBounds(bounds.pad(0.25));
    }
  }, [status, shownWorks]);

  return (
    <section id="karta-rabot" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            География работ
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Сделано в Иркутске
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Каждая точка на карте — реальный объект: окна, кондиционеры, вентиляция, алмазное бурение.
            Работаем по Иркутску, Ангарску, Шелехову и пригороду до 50 км.
          </p>
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-wrap gap-2">
            {([["all", "Все работы"], ...Object.entries(SERVICE_LABELS)] as [Filter, string][]).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm ${
                  filter === id ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {id !== "all" && (
                  <span
                    className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: SERVICE_COLORS[id as WorkService] }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-6">
          {status === "failed" ? (
            // Запасной вариант: карта недоступна — показываем работы списком.
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shownWorks.map((w) => (
                <div key={w.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERVICE_COLORS[w.service] }} />
                    {w.district} · {w.year}
                  </div>
                  <div className="mt-2 font-black text-[#1a3a5c]">{w.title}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{w.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 shadow-sm sm:rounded-[2rem]">
              <div ref={mapRef} className="h-[420px] w-full sm:h-[520px]" />
              {status === "loading" && (
                <div className="absolute inset-0 grid place-items-center bg-slate-50">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ff6b35]" />
                    <p className="mt-3 text-sm font-bold text-slate-500">Загружаем карту…</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Reveal>

        <p className="mt-4 text-xs text-slate-400">
          Показано {shownWorks.length} {shownWorks.length === 1 ? "работа" : "работ"} из {WORKS.length}. Точные адреса объектов не публикуем — по запросу покажем фото и договор.
        </p>
      </div>
    </section>
  );
}
