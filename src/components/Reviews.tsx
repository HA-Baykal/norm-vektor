import { useState } from "react";

interface Review {
  name: string;
  city: string;
  service: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
}

const reviews: Review[] = [
  {
    name: "Александр М.",
    city: "Иркутск",
    service: "Остекление балкона",
    text: "Остеклили балкон под ключ. Работа сделана аккуратно, в оговоренные сроки. Ребята вежливые, после себя убрали. Цена адекватная, качество отличное. Рекомендую!",
    rating: 5,
    initials: "АМ",
    color: "from-brand-500 to-brand-700",
  },
  {
    name: "Екатерина В.",
    city: "Ангарск",
    service: "Кондиционер",
    text: "Заказали кондиционер в квартиру. Помогли с выбором модели под наш бюджет. Монтаж занял пару часов, всё чисто, штробы аккуратные. Работает уже второй сезон без нареканий.",
    rating: 5,
    initials: "ЕВ",
    color: "from-accent-500 to-accent-600",
  },
  {
    name: "Дмитрий К.",
    city: "Шелехов",
    service: "Бризер Тион",
    text: "Установили бризер Тион в спальне. Проблему с духотой решили полностью, теперь спим с закрытыми окнами. Мастера приехали вовремя, всё объяснили. Спасибо!",
    rating: 5,
    initials: "ДК",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Ольга С.",
    city: "Иркутск",
    service: "Алмазное бурение",
    text: "Нужно было отверстие 132 мм под вентиляцию в несущей стене. Сделали сухим способом с пылесосом — ни пылинки! У меня уже был чистовой ремонт, переживала зря.",
    rating: 5,
    initials: "ОС",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "Игорь П.",
    city: "Хомутово",
    service: "Окна ПВХ в доме",
    text: "Поставили окна во весь коттедж — 14 штук. Собственное производство чувствуется: замер, изготовление, монтаж — всё свои. Никаких посредников и накруток.",
    rating: 5,
    initials: "ИП",
    color: "from-rose-500 to-rose-700",
  },
  {
    name: "Марина Т.",
    city: "Иркутск",
    service: "Вентиляция в кафе",
    text: "Сделали проект и монтаж приточно-вытяжной вентиляции в нашем кафе. Учли все требования СЭС, работает тихо, гости не жалуются на запахи. Профессионалы!",
    rating: 5,
    initials: "МТ",
    color: "from-cyan-500 to-cyan-700",
  },
];

export default function Reviews() {
  const [visible, setVisible] = useState(3);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-sm font-semibold mb-3">
            Отзывы клиентов
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Нам доверяют жители Иркутской области
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Более 3500 довольных клиентов за 15 лет работы
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, visible).map((r, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-brand-300 dark:hover:border-accent-500 transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.color} text-white flex items-center justify-center font-bold`}>
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{r.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.city} · {r.service}
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.363 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118L10 13.347l-3.37 2.447c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.644 9.153c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.951-.69l1.286-3.958z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">«{r.text}»</p>
            </div>
          ))}
        </div>

        {visible < reviews.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisible(reviews.length)}
              className="px-6 py-3 rounded-xl border-2 border-brand-600 text-brand-700 dark:text-brand-400 dark:border-brand-500 hover:bg-brand-600 hover:text-white transition font-semibold"
            >
              Показать ещё отзывы
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
