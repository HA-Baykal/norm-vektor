import { Link } from "react-router-dom";

type Service = { slug: string; label: string };
type GeoLocation = { key: string; prep: "v" | "na"; loc: string };
type GeoGroup = { title: string; locations: GeoLocation[] };

const SERVICES: Service[] = [
  { slug: "okna", label: "Окна" },
  { slug: "kondicionery", label: "Кондиционеры" },
  { slug: "ventilyaciya", label: "Вентиляция" },
  { slug: "almaznoe-burenie", label: "Алмазное бурение" },
];

const GROUPS: GeoGroup[] = [
  {
    title: "Иркутск — микрорайоны",
    locations: [
      { key: "solnechnom", prep: "v", loc: "в Солнечном" },
      { key: "pervomaiskom", prep: "v", loc: "в Первомайском" },
      { key: "novolenino", prep: "v", loc: "в Ново-Ленино" },
      { key: "yubileynom", prep: "v", loc: "в Юбилейном" },
      { key: "akademgorodke", prep: "v", loc: "в Академгородке" },
      { key: "raduzhnom", prep: "v", loc: "в Радужном" },
      { key: "universitetskom", prep: "v", loc: "в Университетском" },
    ],
  },
  { title: "Ангарск", locations: [{ key: "angarske", prep: "v", loc: "в Ангарске" }] },
  { title: "Шелехов", locations: [{ key: "shelehove", prep: "v", loc: "в Шелехове" }] },
  { title: "Хомутово", locations: [{ key: "homutovo", prep: "v", loc: "в Хомутово" }] },
  { title: "Байкальский тракт", locations: [{ key: "baikalskom-trakte", prep: "na", loc: "на Байкальском тракте" }] },
  { title: "Голоустненский тракт", locations: [{ key: "golooustnenskom-trakte", prep: "na", loc: "на Голоустненском тракте" }] },
  {
    title: "Пригород",
    locations: [
      { key: "molodezhnom", prep: "v", loc: "в Молодёжном" },
      { key: "pivovarikhe", prep: "v", loc: "в Пивоварихе" },
      { key: "urike", prep: "v", loc: "в Урике" },
      { key: "stolbovo", prep: "v", loc: "в Столбова" },
      { key: "listvyanke", prep: "v", loc: "в Листвянке" },
    ],
  },
];

export default function GeoLinksBlock() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-400 text-sm font-semibold mb-3">
            География работ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Работаем в Иркутске, Ангарске, Шелехове, Хомутово и пригороде
          </h2>
        </div>

        <div className="space-y-10">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-4">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.locations.flatMap((loc) =>
                  SERVICES.map((s) => (
                    <Link
                      key={`${s.slug}-${loc.key}`}
                      to={`/${s.slug}-${loc.prep}-${loc.key}`}
                      className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 text-sm font-semibold hover:bg-brand-800 hover:text-white transition"
                    >
                      {s.label} {loc.loc}
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
