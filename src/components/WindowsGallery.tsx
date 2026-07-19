import { useState } from "react";

const windowPhotos = [
  { src: "/images/windows/window-1.jpg", title: "Тёплое остекление лоджии" },
  { src: "/images/windows/window-2.jpg", title: "Остекление в доме" },
  { src: "/images/windows/window-3.jpg", title: "Монтаж окон и двери VEKA" },
  { src: "/images/windows/window-4.jpg", title: "Алюминиевое остекление дома" },
  { src: "/images/windows/window-5.jpg", title: "Окна в дом" },
  { src: "/images/windows/window-6.jpg", title: "Алюминиевые конструкции" },
];

function WindowPhoto({ src, title }: { src: string; title: string }) {
  const [error, setError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        {!error ? (
          <img
            src={src}
            alt={title}
            loading="lazy"
            onError={() => setError(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm font-semibold">
            Фото не найдено
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
    </div>
  );
}

export default function WindowsGallery() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Наши работы по остеклению
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Реальные фото объектов в Иркутске и области
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {windowPhotos.map((photo) => (
            <WindowPhoto key={photo.src} src={photo.src} title={photo.title} />
          ))}
        </div>
      </div>
    </section>
  );
}