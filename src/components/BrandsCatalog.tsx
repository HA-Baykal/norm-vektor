import { LineIcon } from "./LineIcon";

const brands = [
  { name: "VEKA", logo: "images/brands/veka.svg" },
  { name: "Ballu", logo: "images/brands/ballu.svg" },
  { name: "Vakio", logo: "images/brands/vakio.svg" },
  { name: "Daikin", logo: "images/brands/daikin.svg" },
  { name: "Toshiba", logo: "images/brands/toshiba.svg" },
  { name: "Midea", logo: "images/brands/midea.svg" },
  { name: "Electrolux", logo: "images/brands/electrolux.svg" },
  { name: "Zanussi", logo: "images/brands/zanussi.svg" },
  { name: "Royal Thermo", logo: "images/brands/royal-thermo.svg" },
  { name: "AC ELECTRIC", logo: "images/brands/ac-electric.svg" },
  { name: "Axioma", logo: "images/brands/axioma.svg" },
  { name: "SHUFT", logo: "images/brands/shuft.svg" },
  { name: "AURUS", logo: "images/brands/aurus.svg" },
];

export default function BrandsCatalog() {
  return (
    <section id="brands" className="bg-white py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">
            Бренды
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">
            Работаем только с проверенными производителями
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            Окна из профиля VEKA, кондиционеры и вентиляция от надёжных брендов Ballu, Vakio, Daikin,
            Toshiba, Midea и других. Только качественное оборудование с гарантией от производителя.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="group flex h-24 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-[#ff6b35] hover:bg-white hover:shadow-xl"
              style={{ transitionDelay: `${index * 20}ms` }}
            >
              <div className="flex h-12 w-full items-center justify-center relative">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-11 max-w-[90%] object-contain opacity-95 group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedSlash) {
                      target.dataset.triedSlash = "true";
                      target.src = "/" + brand.logo;
                    } else {
                      target.style.display = "none";
                      const fallback = target.parentElement?.querySelector(".fallback-text") as HTMLElement;
                      if (fallback) fallback.style.display = "block";
                    }
                  }}
                />
                <div className="fallback-text hidden text-center">
                  <span className="text-base font-black tracking-wider text-[#1a3a5c] uppercase">
                    {brand.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-slate-50 p-6 sm:mt-12 sm:p-8 border border-slate-200/80">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white shadow-md">
              <LineIcon name="check" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#1a3a5c]">Официальная гарантия завода</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Всё поставляемое оборудование поставляется с официальным гарантийным талоном завода-изготовителя — от 2 до 5 лет. На все выполненные монтажные работы даём собственную гарантию 1 год.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}