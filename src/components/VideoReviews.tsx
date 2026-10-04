import { MAX_LINK, WHATSAPP_LINK } from "../data/contacts";

// Видеоотзывы клиентов. Пока реальных видеоотзывов нет — блок показывает
// приглашение прислать отзыв. Как только появятся видео (Rutube/VK-ссылки),
// добавить их в массив ниже: компонент сам переключится на сетку с плеерами.

type VideoReview = {
  title: string;
  name: string;
  district: string;
  /** Ссылка на встраивание (Rutube embed или VK video). */
  embed: string;
};

const REVIEWS: VideoReview[] = [
  // Пример заполнения:
  // { title: "Остекление лоджии за 2 дня", name: "Ирина", district: "Солнечный", embed: "https://rutube.ru/play/embed/..." },
];

export default function VideoReviews() {
  const ready = REVIEWS.filter((r) => r.embed.trim() !== "");

  return (
    <section id="video-otzyvy" className="bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Видеоотзывы
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Клиенты рассказывают сами
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Живые видео от наших заказчиков — без сценариев и постановки.
          </p>
        </div>

        {ready.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ready.map((r) => (
              <div key={r.title + r.embed} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm sm:rounded-[2rem]">
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={r.embed}
                    title={r.title}
                    frameBorder="0"
                    allow="clipboard-write; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute left-0 top-0 h-full w-full"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-black text-[#1a3a5c] sm:text-base">{r.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{r.name} · {r.district}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm sm:rounded-[2rem] sm:p-8 lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#ff6b35]/10 text-2xl">🎬</div>
                <div>
                  <h3 className="text-lg font-black text-[#1a3a5c] sm:text-xl">Снимаем первые видеоотзывы</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Мы только начали собирать видеоотзывы. Если мы делали вам окна, кондиционер, вентиляцию или
                    бурение — запишите короткое видео на телефон (30–60 секунд): что делали, как прошло, довольны ли
                    результатом. Взамен — скидка на сервисное обслуживание.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1fb457]">
                      Отправить в WhatsApp
                    </a>
                    <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#1a3a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#122943]">
                      Отправить в MAX
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border-2 border-dashed border-slate-300 bg-white/60 p-6 sm:rounded-[2rem] sm:p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="text-4xl">▶️</div>
                <p className="mt-3 text-sm font-bold text-slate-500">Здесь появится ваш видеоотзыв</p>
                <p className="mt-1 text-xs text-slate-400">Первый ролик опубликуем с разрешения автора</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
