
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSeo, useBreadcrumb } from "../utils/useSeo";

// ============================================================================
// БАЗА ЗНАНИЙ — список статей
// Как добавить статью: добавьте объект в массив articles + создайте текст
// статьи в объекте articleContent (см. файл BlogArticle).
// ============================================================================
function formatRussianDate(dateStr?: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  if (!year || !month || !day) return dateStr;
  return `${day} ${months[month - 1]} ${year}`;
}

export const articles = [
  {
    slug: "montazh-okon-osenyu-i-zimoy",
    date: "2026-08-20",
    title: "Можно ли устанавливать пластиковые окна осенью и зимой: условия монтажа и чек-лист приёмки",
    excerpt:
      "Осенний и зимний монтаж окон возможен не «по сезону», а при соблюдении условий для профиля, проёма и каждого материала монтажного шва. Разбираем, что проверить до заказа и при приёмке работ.",
    category: "Окна",
    icon: "🪟",
    readTime: "8 мин",
  },
  {
    slug: "brizer-i-rekuperator-zimoy",
    date: "2026-08-18",
    title: "Бризер и рекуператор зимой: как выбрать режим, обслужить фильтры и не потерять производительность",
    excerpt:
      "Зимняя эксплуатация приточной вентиляции зависит от типа устройства и комплектации. Разбираем, почему бризеру нужен рабочий вытяжной канал, как рекуператор борется с обмерзанием и почему фильтры нельзя обслуживать «на глаз».",
    category: "Вентиляция",
    icon: "💨",
    readTime: "9 мин",
  },
  {
    slug: "nuzhno-li-nakryvat-naruzhnyy-blok-konditsionera-zimoy",
    date: "2026-08-16",
    title: "Нужно ли накрывать наружный блок кондиционера на зиму: когда защита от снега нужна, а когда мешает",
    excerpt:
      "Наружный блок рассчитан на улицу, но не на перекрытые решётки, снежный занос и падающие сосульки. Разбираем разницу между герметичным чехлом, навесом и правильно выбранным местом монтажа.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "7 мин",
  },
  {
    slug: "kak-vybrat-konditsioner-po-ploshchadi",
    date: "2026-08-14",
    title: "Как выбрать кондиционер по площади помещения",
    excerpt:
      "Разбираем, какая мощность нужна для комнаты 20, 30 или 40 м², что означают цифры 07, 09, 12 и как не переплатить за лишнее.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "invertornyy-ili-obychnyy-konditsioner",
    date: "2026-08-05",
    title: "Инверторный или обычный кондиционер — что выбрать",
    excerpt:
      "Честное сравнение: чем отличается инвертор от обычной сплит-системы, что экономичнее, тише и когда переплата оправдана.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
  slug: "okna-veka-vs-rehau-chto-luchshe-dlya-irkutska",
    date: "2026-08-10",
  title: "Окна VEKA vs Rehau: что лучше для Иркутска? Честное сравнение от производителя",
  excerpt: "Выбор между VEKA и Rehau — это выбор между двумя лучшими немецкими профилями для пластиковых окон. Разберём по пунктам, что лучше для сурового климата Иркутска.",
  category: "Окна",
  icon: "🪟",
  readTime: "8 мин",
},
  {
    slug: "kakie-plastikovye-okna-vybrat",
    date: "2026-08-02",
    title: "Какие пластиковые окна выбрать для квартиры в Иркутске",
    excerpt:
      "Профиль, камеры, стеклопакет, фурнитура — на что реально смотреть при выборе окон в наших климатических условиях.",
    category: "Окна",
    icon: "🪟",
    readTime: "7 мин",
  },
  {
    slug: "pochemu-ventilyatsiya-stoit-dorogo",
    date: "2026-07-25",
    title: "Почему правильная вентиляция стоит дорого: разбираем по компонентам",
    excerpt:
      "Разбираем, из чего складывается стоимость вентиляции: оборудование, материалы, монтаж. Почему нельзя сделать дёшево и качественно — честный технический разбор от профессиональных монтажников.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "10 мин",
  },
  {
    slug: "zachem-nuzhna-ventilyatsiya",
    date: "2026-07-21",
    title: "Зачем нужна вентиляция в квартире и как она работает",
    excerpt:
      "Почему пластиковые окна «запирают» воздух, что такое бризер и рекуператор, и как обеспечить свежий воздух без сквозняков.",
    category: "Вентиляция",
    icon: "🌬️",
    readTime: "6 мин",
  },
  {
    slug: "mozhno-li-zabolet-ot-konditsionera",
    date: "2026-08-12",
    title: "Можно ли заболеть от кондиционера: развенчиваем главный миф с техническим разбором",
    excerpt:
      "Почему люди болеют от кондиционера: грязные фильтры, закрытые окна, неправильная температура. Технические причины и как этого избежать — честный разбор от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "8 мин",
  },
    {
    slug: "invertornyy-konditsioner-stoit-li-pereplachivat",
    date: "2026-07-18",
    title: "Инверторный кондиционер: за что вы переплачиваете 15 000 ₽ и окупается ли это",
    excerpt:
      "Разбираем с расчётами: экономия электричества, срок службы компрессора, уровень шума. Когда инвертор окупается, а когда лучше взять обычный — честный разбор от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "9 мин",
  },
  {
    slug: "skolko-stoit-ustanovka-konditsionera-irkutsk",
    date: "2026-07-15",
    title: "Сколько стоит установить кондиционер в Иркутске",
    excerpt:
      "Из чего складывается цена на кондиционер и монтаж, сколько стоит оборудование и работы, и от чего зависит итоговая сумма.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "skolko-stoyat-plastikovye-okna-irkutsk",
    date: "2026-07-10",
    title: "Сколько стоят пластиковые окна в Иркутске",
    excerpt:
      "Разбираем цену окон по составляющим: конструкция, профиль, стеклопакет, монтаж, откосы. Пример расчёта окна под ключ.",
    category: "Окна",
    icon: "🪟",
    readTime: "5 мин",
  },
    {
    slug: "brizer-ili-rekuperator-chto-vybrat",
    date: "2026-07-29",
    title: "Бризер или рекуператор: что выбрать для квартиры в Иркутске — техническое сравнение",
    excerpt:
      "Разбираем с расчётами: КПД рекуперации, экономия на отоплении, окупаемость. Когда бризер лучше, а когда рекуператор — честный разбор от профессиональных монтажников.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "9 мин",
  },
  {
    slug: "pochemu-poteyut-plastikovye-okna",
    date: "2026-07-05",
    title: "Почему потеют пластиковые окна и что делать",
    excerpt:
      "Главные причины конденсата на окнах, что можно исправить самому и когда проблему решает только вентиляция.",
    category: "Окна",
    icon: "🪟",
    readTime: "6 мин",
  },
  {
    slug: "nuzhno-li-obsluzhivat-konditsioner",
    date: "2026-06-30",
    title: "Нужно ли обслуживать кондиционер и как часто",
    excerpt:
      "Зачем нужно ТО кондиционера, что в него входит, как часто проводить и по каким признакам понять, что пора на обслуживание.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "top-10-konditsionerov-irkutsk-2026",
    date: "2026-08-08",
    title: "ТОП-10 кондиционеров для квартиры в Иркутске 2026: экспертный рейтинг с техническим разбором",
    excerpt:
      "Разбираем не только цены, но и техническую начинку: компрессоры, теплообменники, электронику. Сравниваем Axioma и Midea, Ballu и Daikin — честный рейтинг от профессиональных монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "10 мин",
  },
  {
    slug: "almaznoe-burenie-tsena-i-tehnologiya",
    date: "2026-06-25",
    title: "Алмазное бурение в Иркутске: цены и технология — честный разбор",
    excerpt:
      "Сколько стоит просверлить отверстие алмазной коронкой, чем сухое бурение отличается от мокрого и почему перфоратор — плохая идея. Цены по диаметрам и материалам.",
    category: "Алмазное бурение",
    icon: "🔩",
    readTime: "7 мин",
  },
  {
    slug: "osteklenie-balkonov-tseny-po-variantam",
    date: "2026-06-20",
    title: "Остекление балкона в Иркутске: цены по вариантам — тёплое и холодное",
    excerpt:
      "Тёплое ПВХ от 38 000 ₽ или холодный алюминий от 18 000 ₽? Разбираем все варианты остекления балкона, что входит в цену под ключ и можно ли сделать балкон жилой комнатой.",
    category: "Окна",
    icon: "🏠",
    readTime: "8 мин",
  },
  {
    slug: "montazh-konditsionera-po-gostu-chek-list",
    date: "2026-06-15",
    title: "Монтаж кондиционера по ГОСТу: чек-лист из 10 пунктов",
    excerpt:
      "Единого ГОСТа на сплит-системы нет, но есть обязательная технология монтажа. Чек-лист из 10 пунктов: от вакуумирования до уклона дренажа — как проверить работу монтажников.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "7 мин",
  },
  {
    slug: "zapravka-konditsionera-freonom-kogda-i-skolko",
    date: "2026-06-10",
    title: "Заправка кондиционера фреоном: когда нужна и сколько стоит",
    excerpt:
      "Главный миф: фреон нужно дозаправлять каждый год. Разбираем, когда заправка действительно нужна, по каким признакам понять нехватку и сколько это стоит в Иркутске.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
    slug: "ventilyatsiya-v-chastnom-dome",
    date: "2026-06-05",
    title: "Вентиляция в частном доме: как сделать правильно и сколько это стоит",
    excerpt:
      "Герметичные окна и утеплитель превращают дом в термос без свежего воздуха. Разбираем решения от клапана КИВ-125 до рекуператора и считаем реальные цены под ключ.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "9 мин",
  },
  {
    slug: "okna-dlya-doma-iz-brusa",
    date: "2026-05-30",
    title: "Окна для дома из бруса: обсада, усадка и правильный монтаж",
    excerpt:
      "Дом из бруса даёт усадку, поэтому окна нельзя ставить намертво. Рассказываем, что такое обсада (окосячка), какой зазор оставлять и какие окна выбрать для сруба.",
    category: "Окна",
    icon: "🪟",
    readTime: "8 мин",
  },
  {
    slug: "duet-iz-plastikovogo-okna",
    date: "2026-05-25",
    title: "Дует из пластикового окна: 7 причин и способы устранения",
    excerpt: "Откуда берутся сквозняки в новых окнах: изношенная резина, ошибка монтажа, неправильная фурнитура или повреждённый профиль. Как найти причину и устранить без замены окна.",
    category: "Окна",
    icon: "🪟",
    readTime: "6 мин",
  },
  {
    slug: "okna-propyskayut-shum",
    date: "2026-05-20",
    title: "Окна пропускают уличный шум: как это исправить в Иркутске",
    excerpt: "Почему даже новые пластиковые окна могут пропускать шум: однокамерный стеклопакет, плохая фурнитура или ошибки установки. Как повысить звукоизоляцию без полной замены.",
    category: "Окна",
    icon: "🪟",
    readTime: "7 мин",
  },
  {
    slug: "zimniy-letniy-rezhim-okon",
    date: "2026-05-15",
    title: "Зимний и летний режим окон: как переключить фурнитуру MACO",
    excerpt: "Переключение фурнитуры между сезонами увеличивает прижим створки зимой и продлевает срок службы резины. Как это сделать самостоятельно и когда нужна регулировка мастера.",
    category: "Окна",
    icon: "🪟",
    readTime: "5 мин",
  },
  {
    slug: "energosberegayushchiy-steklopaket-i-steklo",
    date: "2026-05-10",
    title: "Энергосберегающий стеклопакет и i-стекло: в чём разница",
    excerpt: "Разбираем, что такое i-стекло, мультифункциональное покрытие и аргоновое заполнение. Какой стеклопакет выбрать для Иркутска, чтобы не переплачивать и не мёрзнуть зимой.",
    category: "Окна",
    icon: "🪟",
    readTime: "6 мин",
  },
  {
    slug: "mozhno-li-obedinit-balkon-s-komnatoi",
    date: "2026-05-05",
    title: "Можно ли объединить балкон с комнатой в Иркутске: разрешения и риски",
    excerpt: "Юридические и технические аспекты объединения: нужно ли разрешение в Иркутске, как утеплить парапет, можно ли выносить батарею и какие ошибки приводят к промерзанию стены.",
    category: "Окна",
    icon: "🏠",
    readTime: "8 мин",
  },
  {
    slug: "kuda-veshat-konditsioner",
    date: "2026-04-28",
    title: "Куда вешать кондиционер в квартире: правила размещения блоков",
    excerpt: "Оптимальные места для внутреннего и наружного блоков: расстояние до потолка, направление потока, доступ для обслуживания и правила установки на фасаде в Иркутске.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
    slug: "konditsioner-na-obogrev-zimoy",
    date: "2026-04-22",
    title: "Можно ли использовать кондиционер для обогрева зимой в Иркутске",
    excerpt: "Как работает функция обогрева у инверторных моделей, при каких температурах она эффективна (-30°C?), сколько стоит обогрев электричеством и когда дешевле включать котёл.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "7 мин",
  },
  {
    slug: "konditsioner-ploho-holodit",
    date: "2026-04-16",
    title: "Кондиционер плохо холодит: 8 причин и порядок диагностики",
    excerpt: "Что проверить в первую очередь: грязные фильтры, утечка фреона, неисправный компрессор или ошибка в настройках. Как отличить простую проблему от серьёзного ремонта.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
    slug: "zapah-iz-konditsionera",
    date: "2026-04-10",
    title: "Неприятный запах из кондиционера: бактерии или плесень",
    excerpt: "Откуда берётся запах сырости или гнили: загрязнённый теплообменник, дренажный поддон с бактериями или плесень в воздуховоде. Как устранить без дорогостоящей чистки.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "kapaet-voda-iz-konditsionera",
    date: "2026-04-05",
    title: "Капает вода из кондиционера: забит дренаж или ошибка монтажа",
    excerpt: "Почему появляется конденсат под внутренним блоком: засор дренажной трубки, отсутствие уклона или повреждение поддона. Как почистить дренаж своими руками и когда вызывать мастера.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "tipy-konditsionerov-split-kassetnyy-kanalnyy",
    date: "2026-03-28",
    title: "Типы кондиционеров: сплит, кассетный, канальный — что выбрать",
    excerpt: "Сравниваем настенные сплит-системы, кассетные и канальные модели для квартиры и офиса. Когда канальный кондиционер оправдан и почему кассетный дороже в монтаже.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "7 мин",
  },
  {
    slug: "mobilnyy-konditsioner-ili-split-sistema",
    date: "2026-03-22",
    title: "Мобильный кондиционер или сплит-система — что лучше для Иркутска",
    excerpt: "Честное сравнение: уровень шума, энергоэффективность, необходимость вывода шланга в окно и стоимость владения. Почему мобильный кондиционер редко оправдан для постоянного использования.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "6 мин",
  },
  {
    slug: "pochemu-shumit-konditsioner",
    date: "2026-03-16",
    title: "Почему шумит кондиционер: внутренний или наружный блок",
    excerpt: "Причины шума на разных режимах работы: изношенные подшипники вентилятора, вибрация наружного блока, ослабленные крепления или проблема в компрессоре. Как найти источник шума.",
    category: "Кондиционеры",
    icon: "❄️",
    readTime: "5 мин",
  },
  {
    slug: "brizer-chto-eto",
    date: "2026-03-10",
    title: "Бризер — что это и как он работает в условиях Иркутска",
    excerpt: "Простое объяснение для новичков: как бризер подаёт и очищает воздух, нужен ли подогрев зимой и чем он отличается от простого приточного клапана. Когда бризер — лучшее решение.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "5 мин",
  },
  {
    slug: "brizer-ili-konditsioner",
    date: "2026-03-05",
    title: "Бризер или кондиционер: в чём разница и можно ли заменить одно другим",
    excerpt: "Кондиционер охлаждает, но не подаёт свежий воздух. Бризер подаёт свежий воздух, но не охлаждает. Почему в Иркутске нужны оба устройства и как их правильно совмещать в одной квартире.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "6 мин",
  },
  {
    slug: "klapan-brizer-ili-rekuperator",
    date: "2026-02-28",
    title: "Приточный клапан, бризер или рекуператор — что выбрать для квартиры",
    excerpt: "Сравниваем три решения для притока свежего воздуха: простой клапан КИВ-125, бризер с фильтрацией и рекуператор с подогревом. Когда достаточно клапана, а когда нужен полноценный бризер.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "7 мин",
  },
  {
    slug: "pochemu-v-kvartire-dushno-co2",
    date: "2026-02-20",
    title: "Почему в квартире душно: углекислый газ, влажность и вентиляция",
    excerpt: "Объясняем на цифрах: сколько CO₂ выдыхает семья из 4 человек, как быстро он накапливается в герметичной квартире и почему открывать окна недостаточно. Как бризер решает проблему.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "6 мин",
  },
  {
    slug: "vytyazhka-ne-rabotaet-i-zapahi-ot-sosedey",
    date: "2026-02-12",
    title: "Не работает вытяжка и тянет запахи от соседей: причины и решения",
    excerpt: "Почему вытяжка не тянет воздух: засор в шахте, отсутствие притока или обратная тяга. Как бризер и приточный клапан решают проблему запахов из соседних квартир и подъезда.",
    category: "Вентиляция",
    icon: "💨",
    readTime: "5 мин",
  },
  {
    slug: "mozhno-li-sverlit-nesushchuyu-stenu",
    date: "2026-02-05",
    title: "Можно ли сверлить несущую стену алмазной коронкой в Иркутске",
    excerpt: "Юридические и технические ограничения: когда сверление несущей стены разрешено, какой максимальный диаметр, нужно ли разрешение УК или БТИ и какие риски при нарушении технологии.",
    category: "Алмазное бурение",
    icon: "🔩",
    readTime: "6 мин",
  },
  {
    slug: "pochemu-montazh-okon-stoit-dorozhe",
    date: "2026-01-20",
    title: "Почему мой монтаж окон стоит чуть дороже: 8 ошибок, за которые вы заплатите дважды",
    excerpt: "Честный разбор от монтажника, который работает на себя: мостики холода, пена в один слой, клинья поперёк рамы, шов без паро-влагоизоляции — и как проверить монтаж за 10 минут.",
    category: "Окна",
    icon: "🪟",
    readTime: "8 мин",
  },
];

export default function BlogPage() {
  useSeo(
    "База знаний — окна, кондиционеры и вентиляция | Вектор Комфорта, Иркутск",
    "Полезные статьи о выборе кондиционера по площади, пластиковых окнах VEKA, бризерах и рекуператорах, монтаже вентиляции. Простые советы от компании Вектор Комфорта, Иркутск."
  );
  useBreadcrumb([
    { name: "Главная", path: "/" },
    { name: "База знаний", path: "/baza-znaniy" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Получаем уникальные категории
  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))];

  // Фильтруем статьи по категории
  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#10263d] px-4 pb-14 pt-24 text-white sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm font-semibold text-orange-300">
            <Link to="/" className="hover:underline">Главная</Link> / База знаний
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">База знаний</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Полезные статьи о кондиционерах, окнах и вентиляции. Помогаем разобраться, чтобы вы
            сделали правильный выбор и не переплатили.
          </p>
        </div>
      </section>

      {/* Фильтр по категориям */}
      <section className="bg-white border-b border-slate-200 px-4 py-6 sm:px-6 lg:px-8 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-2">Категория:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-black transition ${
                  selectedCategory === cat
                    ? "bg-[#ff6b35] text-white shadow-md shadow-[#ff6b35]/25"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "Все статьи" : cat}
                {cat !== "all" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({articles.filter((a) => a.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Список статей */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-black text-slate-700">Статьи не найдены</h2>
              <p className="mt-2 text-slate-500">Попробуйте выбрать другую категорию</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm font-bold text-slate-500">
                Найдено статей: {filteredArticles.length}
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/baza-znaniy/${article.slug}`}
                    className="group flex flex-col rounded-[1.5rem] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                        {article.icon}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                        {article.category}
                      </span>
                    </div>
                    <h2 className="mt-5 text-lg font-black leading-6 text-[#1a3a5c] sm:text-xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                        {article.date && <span>📅 {formatRussianDate(article.date)}</span>}
                        <span>⏱ {article.readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-black text-[#ff6b35] transition-all group-hover:gap-3">
                        Читать
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          
          {/* CTA */}
          <div className="mt-14 rounded-[1.5rem] bg-[#1a3a5c] p-8 text-center text-white sm:rounded-[2rem] sm:p-12">
            <h2 className="text-2xl font-black sm:text-3xl">Остались вопросы?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Позвоните — бесплатно проконсультируем и подберём решение под вашу задачу.
            </p>
            <a
              href="tel:+79149146606"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-8 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
            >
              Позвонить +7 (914) 914-66-06
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
