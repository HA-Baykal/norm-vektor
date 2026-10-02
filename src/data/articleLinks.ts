// Перелинковка статей базы знаний: что показать читателю в блоке
// «Читайте также». Вынесено из BlogArticle.tsx в данные, потому что тот же
// список должен попадать и в серверный HTML для краулеров — иначе краулер
// видит одни ссылки, а человек другие.
//
// Для статей, которых здесь нет, ссылки подбираются по теме статьи: раньше
// они получали три общие ссылки на каталоги, не связанные с текстом.

import blogIndexData from "./blogIndexData";

export type ArticleLink = { title: string; to: string };

/** Отобрано вручную: к статье — соседние по смыслу и коммерческие выходы. */
const CURATED: Record<string, ArticleLink[]> = {
    "vakio-pritochno-vytyazhnaya-ustanovka": [
      {
        "title": "→ Бризер или рекуператор: что выбрать",
        "to": "/baza-znaniy/brizer-ili-rekuperator-chto-vybrat"
      },
      {
        "title": "→ Бризер и рекуператор зимой",
        "to": "/baza-znaniy/brizer-i-rekuperator-zimoy"
      },
      {
        "title": "→ Вентиляция и бризеры в Иркутске",
        "to": "/ventilyaciya"
      }
    ],
    "montazh-okon-osenyu-i-zimoy": [
      {
        "title": "→ Подготовка окон к зиме: фурнитура и прижим",
        "to": "/baza-znaniy/zimniy-letniy-rezhim-okon"
      },
      {
        "title": "→ Почему монтаж окон стоит дороже",
        "to": "/baza-znaniy/pochemu-montazh-okon-stoit-dorozhe"
      },
      {
        "title": "→ Окна VEKA в Иркутске",
        "to": "/okna"
      }
    ],
    "brizer-i-rekuperator-zimoy": [
      {
        "title": "→ Приточный клапан, бризер или рекуператор",
        "to": "/baza-znaniy/klapan-brizer-ili-rekuperator"
      },
      {
        "title": "→ Почему не работает вытяжка",
        "to": "/baza-znaniy/vytyazhka-ne-rabotaet-i-zapahi-ot-sosedey"
      },
      {
        "title": "→ Вентиляция и бризеры в Иркутске",
        "to": "/ventilyaciya"
      }
    ],
    "nuzhno-li-nakryvat-naruzhnyy-blok-konditsionera-zimoy": [
      {
        "title": "→ Кондиционер на обогрев зимой",
        "to": "/baza-znaniy/konditsioner-na-obogrev-zimoy"
      },
      {
        "title": "→ Нужно ли обслуживать кондиционер",
        "to": "/baza-znaniy/nuzhno-li-obsluzhivat-konditsioner"
      },
      {
        "title": "→ Каталог кондиционеров в Иркутске",
        "to": "/kondicionery"
      }
    ],
    "kak-vybrat-konditsioner-po-ploshchadi": [
      {
        "title": "→ Инверторный или обычный — что выбрать",
        "to": "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner"
      },
      {
        "title": "→ Сколько стоит установка кондиционера",
        "to": "/baza-znaniy/skolko-stoit-ustanovka-konditsionera-irkutsk"
      },
      {
        "title": "→ Каталог кондиционеров от 17 351 ₽",
        "to": "/kondicionery"
      }
    ],
    "mozhno-li-zabolet-ot-konditsionera": [
      {
        "title": "→ Нужно ли обслуживать кондиционер",
        "to": "/baza-znaniy/nuzhno-li-obsluzhivat-konditsioner"
      },
      {
        "title": "→ Зачем нужна вентиляция в квартире",
        "to": "/baza-znaniy/zachem-nuzhna-ventilyatsiya"
      },
      {
        "title": "→ Каталог кондиционеров в Иркутске",
        "to": "/kondicionery"
      }
    ],
    "top-10-konditsionerov-irkutsk-2026": [
      {
        "title": "→ Как выбрать кондиционер по площади (07,09,12)",
        "to": "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi"
      },
      {
        "title": "→ Инверторный или обычный — что выбрать",
        "to": "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner"
      },
      {
        "title": "→ Каталог кондиционеров в Иркутске",
        "to": "/kondicionery"
      }
    ],
    "invertornyy-ili-obychnyy-konditsioner": [
      {
        "title": "→ Как выбрать по площади (07,09,12...)",
        "to": "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi"
      },
      {
        "title": "→ Нужно ли обслуживать кондиционер",
        "to": "/baza-znaniy/nuzhno-li-obsluzhivat-konditsioner"
      },
      {
        "title": "→ Каталог инверторных от 27 900 ₽",
        "to": "/kondicionery"
      }
    ],
    "kakie-plastikovye-okna-vybrat": [
      {
        "title": "→ Сколько стоят пластиковые окна",
        "to": "/baza-znaniy/skolko-stoyat-plastikovye-okna-irkutsk"
      },
      {
        "title": "→ Почему потеют окна и что делать",
        "to": "/baza-znaniy/pochemu-poteyut-plastikovye-okna"
      },
      {
        "title": "→ Окна VEKA в Иркутске от 11 000 ₽/м²",
        "to": "/okna"
      }
    ],
    "pochemu-ventilyatsiya-stoit-dorogo": [
      {
        "title": "→ Зачем нужна вентиляция в квартире",
        "to": "/baza-znaniy/zachem-nuzhna-ventilyatsiya"
      },
      {
        "title": "→ Каталог вентиляции в Иркутске",
        "to": "/ventilyaciya"
      },
      {
        "title": "→ Алмазное бурение под вентиляцию",
        "to": "/almaznoe-burenie"
      }
    ],
    "brizer-ili-rekuperator-chto-vybrat": [
      {
        "title": "→ Зачем нужна вентиляция в квартире",
        "to": "/baza-znaniy/zachem-nuzhna-ventilyatsiya"
      },
      {
        "title": "→ Почему вентиляция стоит дорого",
        "to": "/baza-znaniy/pochemu-ventilyatsiya-stoit-dorogo"
      },
      {
        "title": "→ Каталог вентиляции в Иркутске",
        "to": "/ventilyaciya"
      }
    ],
    "zachem-nuzhna-ventilyatsiya": [
      {
        "title": "→ Почему потеют окна — вентиляция",
        "to": "/baza-znaniy/pochemu-poteyut-plastikovye-okna"
      },
      {
        "title": "→ Какие окна выбрать с вентиляцией",
        "to": "/baza-znaniy/kakie-plastikovye-okna-vybrat"
      },
      {
        "title": "→ Вентиляция и бризеры Тион/Vakio",
        "to": "/ventilyaciya"
      }
    ],
    "invertornyy-konditsioner-stoit-li-pereplachivat": [
      {
        "title": "→ Инверторный или обычный — что выбрать",
        "to": "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner"
      },
      {
        "title": "→ ТОП-10 кондиционеров 2026",
        "to": "/baza-znaniy/top-10-konditsionerov-irkutsk-2026"
      },
      {
        "title": "→ Каталог инверторных кондиционеров",
        "to": "/kondicionery"
      }
    ],
    "okna-veka-vs-rehau-chto-luchshe-dlya-irkutska": [
      {
        "title": "→ Сколько стоят пластиковые окна",
        "to": "/baza-znaniy/skolko-stoyat-plastikovye-okna-irkutsk"
      },
      {
        "title": "→ Почему потеют окна и что делать",
        "to": "/baza-znaniy/pochemu-poteyut-plastikovye-okna"
      },
      {
        "title": "→ Окна VEKA в Иркутске от 11 000 ₽/м²",
        "to": "/okna"
      }
    ],
    "skolko-stoit-ustanovka-konditsionera-irkutsk": [
      {
        "title": "→ Как выбрать по площади 07,09,12",
        "to": "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi"
      },
      {
        "title": "→ Инвертор или обычный",
        "to": "/baza-znaniy/invertornyy-ili-obychnyy-konditsioner"
      },
      {
        "title": "→ Алмазное бурение 32–250 мм",
        "to": "/almaznoe-burenie"
      }
    ],
    "skolko-stoyat-plastikovye-okna-irkutsk": [
      {
        "title": "→ Какие окна выбрать для Иркутска",
        "to": "/baza-znaniy/kakie-plastikovye-okna-vybrat"
      },
      {
        "title": "→ Остекление балконов под ключ",
        "to": "/okna/Teploe-osteklenie-lodjii"
      },
      {
        "title": "→ Окна VEKA — каталог 6 товаров",
        "to": "/okna"
      }
    ],
    "pochemu-poteyut-plastikovye-okna": [
      {
        "title": "→ Какие окна выбрать чтобы не потели",
        "to": "/baza-znaniy/kakie-plastikovye-okna-vybrat"
      },
      {
        "title": "→ Зачем нужна вентиляция Vakio/Тион",
        "to": "/baza-znaniy/zachem-nuzhna-ventilyatsiya"
      },
      {
        "title": "→ Нужна вентиляция? От 6 000 ₽",
        "to": "/ventilyaciya"
      }
    ],
    "nuzhno-li-obsluzhivat-konditsioner": [
      {
        "title": "→ Сколько стоит установка",
        "to": "/baza-znaniy/skolko-stoit-ustanovka-konditsionera-irkutsk"
      },
      {
        "title": "→ Как выбрать по площади",
        "to": "/baza-znaniy/kak-vybrat-konditsioner-po-ploshchadi"
      },
      {
        "title": "→ Каталог кондиционеров — подобрать",
        "to": "/kondicionery"
      }
    ],
    "almaznoe-burenie-tsena-i-tehnologiya": [
      {
        "title": "→ Монтаж кондиционера по ГОСТу",
        "to": "/baza-znaniy/montazh-konditsionera-po-gostu-chek-list"
      },
      {
        "title": "→ Вентиляция в частном доме",
        "to": "/baza-znaniy/ventilyatsiya-v-chastnom-dome"
      },
      {
        "title": "→ Алмазное бурение от 2 000 ₽",
        "to": "/almaznoe-burenie"
      }
    ],
    "osteklenie-balkonov-tseny-po-variantam": [
      {
        "title": "→ Сколько стоят пластиковые окна",
        "to": "/baza-znaniy/skolko-stoyat-plastikovye-okna-irkutsk"
      },
      {
        "title": "→ Interier — дизайн интерьера по фото",
        "to": "/interier"
      },
      {
        "title": "→ Остекление балконов под ключ",
        "to": "/osteklenie-balkonov"
      }
    ],
    "montazh-konditsionera-po-gostu-chek-list": [
      {
        "title": "→ Заправка фреоном: когда и сколько",
        "to": "/baza-znaniy/zapravka-konditsionera-freonom-kogda-i-skolko"
      },
      {
        "title": "→ Алмазное бурение: цена и технология",
        "to": "/baza-znaniy/almaznoe-burenie-tsena-i-tehnologiya"
      },
      {
        "title": "→ Монтаж кондиционера от 18 400 ₽",
        "to": "/montazh-kondicionerov"
      }
    ],
    "zapravka-konditsionera-freonom-kogda-i-skolko": [
      {
        "title": "→ Нужно ли обслуживать кондиционер",
        "to": "/baza-znaniy/nuzhno-li-obsluzhivat-konditsioner"
      },
      {
        "title": "→ Монтаж кондиционера по ГОСТу",
        "to": "/baza-znaniy/montazh-konditsionera-po-gostu-chek-list"
      },
      {
        "title": "→ Сервис и заправка от 4 000 ₽",
        "to": "/servis-kondicionerov"
      }
    ],
    "ventilyatsiya-v-chastnom-dome": [
      {
        "title": "→ Почему вентиляция стоит дорого",
        "to": "/baza-znaniy/pochemu-ventilyatsiya-stoit-dorogo"
      },
      {
        "title": "→ Бризер или рекуператор",
        "to": "/baza-znaniy/brizer-ili-rekuperator-chto-vybrat"
      },
      {
        "title": "→ Вентиляция в Иркутске от 6 000 ₽",
        "to": "/ventilyaciya"
      }
    ],
    "okna-dlya-doma-iz-brusa": [
      {
        "title": "→ Какие пластиковые окна выбрать",
        "to": "/baza-znaniy/kakie-plastikovye-okna-vybrat"
      },
      {
        "title": "→ Остекление балконов: цены",
        "to": "/baza-znaniy/osteklenie-balkonov-tseny-po-variantam"
      },
      {
        "title": "→ Остекление загородных домов",
        "to": "/okna/Osteklenie-v-dome"
      }
    ]
  };

/** Общий запасной список, если статью вдруг убрали из базы. */
const GENERIC: ArticleLink[] = [
  { title: "→ Все статьи базы знаний", to: "/baza-znaniy" },
  { title: "→ Каталог кондиционеров Иркутск", to: "/kondicionery" },
  { title: "→ Окна VEKA Иркутск", to: "/okna" },
  { title: "→ Interier — дизайн интерьера по фото", to: "/interier" },
];

/**
 * Ссылки для блока «Читайте также».
 * Сначала отобранные вручную, иначе — соседние статьи той же темы.
 */
export function relatedFor(slug: string, limit = 5): ArticleLink[] {
  if (CURATED[slug]) return CURATED[slug];
  const card = blogIndexData.find((c) => c.slug === slug);
  if (!card) return GENERIC;
  const siblings = blogIndexData
    .filter((c) => c.slug !== slug && c.category === card.category)
    .slice(0, limit)
    .map((c) => ({ title: c.title, to: "/baza-znaniy/" + c.slug }));
  return siblings.length ? siblings : GENERIC;
}
