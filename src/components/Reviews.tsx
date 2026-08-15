import { useState } from "react";
import {
  reviews2Gis,
  GIS_RATING,
  GIS_REVIEW_COUNT,
  GIS_REVIEWS_URL,
} from "../data/reviews2Gis";

export default function Reviews() {
  const [visible, setVisible] = useState(6);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-sm font-semibold mb-3">
            Отзывы с 2ГИС
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Нам доверяют жители Иркутской области
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Реальные отзывы клиентов — рейтинг {GIS_RATING.toLocaleString("ru-RU")} на 2ГИС ·{" "}
            {GIS_REVIEW_COUNT} отзывов
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews2Gis.slice(0, visible).map((r, i) => (
            <div
              key={i}
              className="flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-brand-300 dark:hover:border-accent-500 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.color} text-white flex items-center justify-center font-bold`}
                >
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{r.author}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.service} · {r.date}
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.37 2.447c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.644 9.153c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.286-3.958z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1">
                «{r.text}»
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
                Источник:{" "}
                <a
                  href={GIS_REVIEWS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
                >
                  2ГИС
                </a>
              </div>
            </div>
          ))}
        </div>

        {visible < reviews2Gis.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisible(reviews2Gis.length)}
              className="px-6 py-3 rounded-xl border-2 border-brand-600 text-brand-700 dark:text-brand-400 dark:border-brand-500 hover:bg-brand-600 hover:text-white transition font-semibold"
            >
              Показать ещё отзывы
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <a
            href={GIS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            Все отзывы и рейтинг на 2ГИС
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
