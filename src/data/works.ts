// Карта выполненных работ «Сделано в Иркутске».
//
// ВНИМАНИЕ: это ДЕМО-данные — придуманные объекты на уровне районов,
// без точных адресов. Перед публикацией заменить на реальные объекты
// компании (район + краткое описание). Точные адреса в открытом виде
// лучше не указывать — только район или улицу по согласованию с заказчиком.

export type WorkService = "okna" | "kondicionery" | "ventilyaciya" | "burenie";

export interface Work {
  id: string;
  title: string;
  district: string;
  service: WorkService;
  /** Координаты маркера (центр района, не точный адрес). */
  coords: [number, number];
  summary: string;
  year: string;
}

export const SERVICE_LABELS: Record<WorkService, string> = {
  okna: "Окна",
  kondicionery: "Кондиционеры",
  ventilyaciya: "Вентиляция",
  burenie: "Алмазное бурение",
};

export const SERVICE_COLORS: Record<WorkService, string> = {
  okna: "#ff6b35",
  kondicionery: "#229ED9",
  ventilyaciya: "#16a34a",
  burenie: "#1a3a5c",
};

export const WORKS: Work[] = [
  { id: "w1", title: "Остекление трёшки", district: "Академгородок", service: "okna", coords: [52.236, 104.318], summary: "7 окон, профиль 70 мм, энергосберегающий стеклопакет. Демонтаж и монтаж за 2 дня.", year: "2026" },
  { id: "w2", title: "Кондиционер в спальню", district: "Синюшина гора", service: "kondicionery", coords: [52.256, 104.256], summary: "Инверторная сплит-система 7-ка, трасса 3 м, бурение с пылесосом.", year: "2026" },
  { id: "w3", title: "Бризер Ballu OneAir", district: "Солнечный", service: "ventilyaciya", coords: [52.246, 104.347], summary: "Приточная вентиляция с HEPA-фильтром, отверстие 132 мм, монтаж за 3 часа.", year: "2026" },
  { id: "w4", title: "Отверстия под трассы", district: "Ново-Ленино", service: "burenie", coords: [52.245, 104.207], summary: "6 отверстий 55 мм в панельном доме, сухое бурение — без пыли.", year: "2025" },
  { id: "w5", title: "Остекление балкона", district: "Юбилейный", service: "okna", coords: [52.263, 104.318], summary: "Тёплое остекление 6 м², вынос подоконника, отделка сайдингом.", year: "2025" },
  { id: "w6", title: "Кондиционер в офис", district: "Иркутск-2", service: "kondicionery", coords: [52.298, 104.258], summary: "Полупромышленная сплит-система на 2 помещения, скрытая трасса.", year: "2025" },
  { id: "w7", title: "Вентиляция кафе", district: "Центр", service: "ventilyaciya", coords: [52.286, 104.28], summary: "Приточно-вытяжная система для зала на 40 мест, проект по СП 60.13330.", year: "2025" },
  { id: "w8", title: "Отверстия под вентиляцию", district: "Первомайский", service: "burenie", coords: [52.277, 104.313], summary: "4 отверстия 152 мм в кирпичной стене — под врезку воздуховодов.", year: "2025" },
  { id: "w9", title: "Окна в коттедж", district: "Маркова", service: "okna", coords: [52.233, 104.286], summary: "12 окон с ламинацией «золотой дуб», монтаж по ГОСТ с лентами ПСУЛ.", year: "2025" },
  { id: "w10", title: "Рекуператор Vakio", district: "Хомутово", service: "ventilyaciya", coords: [52.448, 104.351], summary: "Приточно-вытяжная установка с рекуперацией 80%, вывод через стену.", year: "2025" },
  { id: "w11", title: "Кондиционеры в квартиру", district: "Ангарск", service: "kondicionery", coords: [52.54, 103.888], summary: "Два инверторных блока: гостиная и спальня, единая трасса.", year: "2025" },
  { id: "w12", title: "Остекление школы искусств", district: "Шелехов", service: "okna", coords: [52.208, 104.098], summary: "Замена витражных конструкций, ударопрочный стеклопакет.", year: "2024" },
];
