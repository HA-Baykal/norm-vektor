import { LineIcon } from "./LineIcon";

const brandCategories = [
  {
    category: "",
    description: "",
    color: "from-emerald-500 to-teal-600",
    brands: [
      { name: "Ballu", logo: "/images/brands/ballu.svg", country: "Россия" },
      { name: "Royal Thermo", logo: "/images/brands/royal-thermo.svg", country: "Италия/Россия" },
      { name: "Axioma", logo: "/images/brands/axioma.svg", country: "Россия" },
      { name: "AC ELECTRIC", logo: "/images/brands/ac-electric.svg", country: "Россия" },
    ],
  },
  {
    category: "Средний класс",
    description: "Надёжные системы с расширенным функционалом",
    color: "from-blue-500 to-indigo-600",
    brands: [
      { name: "Electrolux", logo: "/images/brands/electrolux.svg", country: "Швеция" },
      { name: "Zanussi", logo: "/images/brands/zanussi.svg", country: "Италия" },
      { name: "Midea", logo: "/images/brands/midea.svg", country: "Китай" },
      { name: "SHUFT", logo: "/images/brands/shuft.svg", country: "Дания/Китай" },
      { name: "AURUS", logo: "/images/brands/aurus.svg", country: "Россия" },
    ],
  },
  {
    category: "Премиум класс",
    description: "Передовые технологии и максимальная надёжность",
    color: "from-purple-500 to-pink-600",
    brands: [
      { name: "Daikin", logo: "/images/brands/daikin.svg", country: "Япония" },
      { name: "Toshiba", logo: "/images/brands/toshiba.svg", country: "Япония" },
    ],
  },
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
            Кондиционеры от проверенных производителей
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
            Мы работаем только с официальными дилерами. Все бренды сертифицированы и имеют гарантию от производителя.
          </p>
        </div>

        <div className="mt-12 space-y-12 sm:mt-16">
          {brandCategories.map((category, categoryIndex) => (
            <div
              key={category.category}
              className="reveal"
              style={{ transitionDelay: `${categoryIndex * 100}ms` }}
            >
              <div className={`rounded-2xl bg-gradient-to-r ${category.color} p-1`}>
                <div className="rounded-2xl bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <LineIcon name="check" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#1a3a5c]">{category.category}</h3>
                      <p className="text-sm text-slate-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {category.brands.map((brand, brandIndex) => (
                      <div
                        key={brand.name}
                        className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-[#ff6b35] hover:shadow-lg"
                        style={{ transitionDelay: `${brandIndex * 50}ms` }}
                      >
                        <div className="h-16 w-full flex items-center justify-center mb-3">
                          {/*  ЗАМЕНИТЬ НА ЛОГОТИП: Когда добавите SVG файлы */}
                          <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
                          <div className="text-xs font-black text-slate-400 text-center">{brand.name}</div>
                        </div>
                        <div className="text-sm font-bold text-[#1a3a5c]">{brand.name}</div>
                        <div className="text-xs text-slate-500">{brand.country}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
              <LineIcon name="check" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#1a3a5c]">Официальная гарантия</h4>
              <p className="mt-2 text-sm text-slate-600">
                Все кондиционеры имеют официальную гарантию производителя от 2 до 5 лет. 
                Мы являемся авторизованным дилером всех представленных брендов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
