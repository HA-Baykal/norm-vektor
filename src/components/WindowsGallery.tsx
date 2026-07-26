import { useState } from "react";
import { Link } from "react-router-dom";
import { windowsCatalogData, type WindowProduct } from "../data/windowsCatalog";
import QuickBookingModal from "./QuickBookingModal";

function WindowPhotoCard({ item, onOrder }: { item: WindowProduct; onOrder: (w: WindowProduct) => void }) {
  const [error, setError] = useState(false);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-900/5 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#ff6b35]/50 transition duration-300">
      <div>
        <Link to={`/okna/${item.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-900 block group-hover:opacity-95 transition">
          {!error ? (
            <img
              src={item.image}
              alt={`${item.title} Иркутск`}
              loading="lazy"
              onError={() => setError(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400 text-sm font-semibold">
              Фото скоро появится
            </div>
          )}
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white shadow-md">
              {item.badge}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-4 text-white opacity-95 group-hover:opacity-100 transition">
            <span className="text-[11px] font-extrabold text-amber-400 block uppercase tracking-wider">{item.category}</span>
          </div>
        </Link>

        <div className="p-5 sm:p-6">
          <Link to={`/okna/${item.slug}`} className="block group-hover:text-[#ff6b35] transition">
            <h3 className="text-lg sm:text-xl font-black text-[#1a3a5c] hover:text-[#ff6b35] transition leading-snug">
              {item.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {item.shortDesc}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs font-bold text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Профиль:</span>
              <span className="text-[#1a3a5c]">{item.profileName.split(" ")[0]} {item.profileName.split(" ")[1]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Гарантия завода:</span>
              <span className="text-emerald-600 font-black">5 лет по договору</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0 mt-auto">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Ориентировочная цена</span>
            <span className="text-2xl font-black text-[#1a3a5c]">
              от {item.basePrice.toLocaleString("ru-RU")} ₽
            </span>
            <span className="text-xs text-slate-500 font-bold ml-1">/ {item.priceUnit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to={`/okna/${item.slug}`}
            className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a3a5c] font-black text-xs text-center transition flex items-center justify-center gap-1"
          >
            <span>📋 Подробнее</span>
          </Link>
          <button
            type="button"
            onClick={() => onOrder(item)}
            className="py-3 px-3 rounded-xl bg-[#ff6b35] hover:bg-[#e95620] active:scale-95 text-white font-black text-xs transition text-center shadow-md shadow-[#ff6b35]/25"
          >
            <span>🔥 Замер 0 ₽</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WindowsGallery() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedWin, setSelectedWin] = useState(windowsCatalogData[0]);

  const handleOrder = (win: WindowProduct) => {
    setSelectedWin(win);
    setBookingOpen(true);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
            Собственный сборочный цех в Иркутске
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1a3a5c] dark:text-white">
            Каталог решений по остеклению
          </h2>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-400 mt-3 sm:text-lg">
            Выбирайте нужный тип остекления, чтобы открыть подробный технологический паспорт! Каждое окно собирается на нашем заводе в Иркутске и устанавливается строго по ГОСТ 30971.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {windowsCatalogData.map((w) => (
            <WindowPhotoCard key={w.id} item={w} onOrder={handleOrder} />
          ))}
        </div>

        {/* Спецпредложение для коттеджей по области */}
        <div className="mt-14 p-8 sm:p-12 rounded-[32px] bg-[#1a3a5c] text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff6b35]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-left max-w-2xl space-y-3 z-10">
            <span className="px-3.5 py-1 rounded-full bg-[#ff6b35] text-white font-extrabold text-xs inline-block shadow-md">
              🏡 Остекление коттеджей и дач по области
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Планируете остекление дома в Хомутово, Грановщине, Шелехове или Ангарске?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              При комплексном заказе от 5 окон мы дадим <strong>максимальную оптовую скидку напрямую от нашего завода</strong>, сделаем ламинацию под цвет фасада и подарим москитные сетки! Выезд инженера-замерщика до 50 км по области — 0 рублей.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto z-10 shrink-0">
            <button
              type="button"
              onClick={() => { setSelectedWin(windowsCatalogData[1]); setBookingOpen(true); }}
              className="px-8 py-4 rounded-2xl bg-[#ff6b35] hover:bg-[#e95620] text-white font-black text-center text-base transition shadow-xl shadow-[#ff6b35]/30 block"
            >
              📐 Заказать расчёт коттеджа
            </button>
            <a
              href="tel:+79149146606"
              className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 font-black text-center text-base transition block text-white"
            >
              📞 Позвонить инженеру
            </a>
          </div>
        </div>
      </div>

      <QuickBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        serviceName={`Заявка на остекление: ${selectedWin.title}`}
        calcDetails={`Оценка: от ${selectedWin.basePrice.toLocaleString("ru-RU")} ₽ / ${selectedWin.priceUnit}. Собственный цех, монтаж по ГОСТу!`}
      />
    </section>
  );
}
