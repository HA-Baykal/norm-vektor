// Пары фото «до и после» для слайдера сравнения.
//
// ВАЖНО: сейчас здесь демо-пары из имеющихся фотографий, чтобы увидеть,
// как выглядит блок. Для сайта нужны снимки ОДНОГО объекта до начала
// работ и после сдачи — тогда сравнение честное. Присланные фото
// раскладываются в public/images/before-after/ и прописываются здесь.

export type BeforeAfterPair = {
  before: string;
  after: string;
  title: string;
  note: string;
};

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    before: "/images/ventilation/vent-3.webp",
    after: "/images/portfolio/vent-2.webp",
    title: "Вентиляция в кафе",
    note: "Монтаж воздуховодов на потолке → готовый зал",
  },
  {
    before: "/images/drilling/drill-2.webp",
    after: "/images/service-conditioner.webp",
    title: "Трасса под кондиционер",
    note: "Сухое бурение под коммуникации → смонтированный блок Ballu",
  },
  {
    before: "/images/windows/window-5.webp",
    after: "/images/windows/window-6.webp",
    title: "Остекление объекта",
    note: "Монтаж конструкций → остеклённый фасад",
  },
];
