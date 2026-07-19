type VideoItem = {
  title: string;
  embed: string;
};

// Все 6 видео с чистыми ссылками встраивания Rutube
const videos: VideoItem[] = [
  {
    title: "Монтаж кондиционера в Иркутске",
    embed: "https://rutube.ru/play/embed/53765cebef119a09e65fb1ff955e84b7/",
  },
  {
    title: "Установка пластиковых окон VEKA",
    embed: "https://rutube.ru/play/embed/9cd106967893bb794b241f0476abad22/",
  },
  {
    title: "Монтаж Алюминиевых конструкций в Иркутске",
    embed: "https://rutube.ru/play/embed/5274d14a7d88cd81df998f2efc83b240/",
  },
  {
    title: "Монтаж приточно вытяжной вентиляции в Иркутске",
    embed: "https://rutube.ru/play/embed/ed55e0f2ee94f1650a082ecaea13aa3f/",
  },
  {
    title: "Монтаж настенного кондиционера",
    embed: "https://rutube.ru/play/embed/9865b1bedf2a4de3017b4dd2dcccec41/",
  },
  {
    title: "Закладка трассы кондиционера в черновом варианте. Иркутск",
    embed: "https://rutube.ru/play/embed/c742cc8fa40a17000b5c2f9b091669ef/",
  },
];

export default function VideoGallery() {
  const ready = videos.filter((v) => v.embed.trim() !== "");

  if (ready.length === 0) return null;

  return (
    <section className="bg-[#10263d] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300 sm:text-sm sm:tracking-[0.2em]">
            Видео
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
            Видео наших работ
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Посмотрите, как мы работаем на реальных объектах в Иркутске и области.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {ready.map((video) => (
            <div
              key={video.title + video.embed}
              className="overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-2xl sm:rounded-[2rem]"
            >
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={video.embed}
                  title={video.title}
                  frameBorder="0"
                  allow="clipboard-write; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute left-0 top-0 h-full w-full"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-black sm:text-base">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}