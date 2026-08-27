import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigationType } from "react-router-dom";
import QuickBookingModal from "./QuickBookingModal";
import { getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";
import { useCompare } from "../utils/useCompare";

export const INSTALL_PRICE = 18000;
export type PowerVariant = {
  btu: number;
  area: number;
  cooling: string;
  heating: string;
  price: number;
  oldPrice?: number;
};
export type Conditioner = {
  id: number;
  name: string;
  brand: string;
  type: "Инверторный" | "Обычный" | "Полупромышленный" | "Мобильный" | "Промышленный";
  smartHome: boolean;
  noise: string;
  country: string;
  image: string;
  gallery?: string[];
  badge?: string;
  variants: PowerVariant[];
};

export const conditioners: Conditioner[] = [
  { id: 201, name: "SHUFT Berg SFTO", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-berg.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 17376, oldPrice: 17888 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 18562, oldPrice: 18888 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 26180, oldPrice: 26888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 45012, oldPrice: 46888 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 60031, oldPrice: 61888 },
    { btu: 36000, area: 100, cooling: "10.5 кВт", heating: "11.0 кВт", price: 79007, oldPrice: 80888 },
  ] },
  { id: 202, name: "SHUFT TOR SFTM", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-tor.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 20548, oldPrice: 20998 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 23305, oldPrice: 23988 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 31905, oldPrice: 32888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 53840, oldPrice: 55188 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 68104, oldPrice: 71688 },
  ] },
  { id: 203, name: "SHUFT Soturai SFTH", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-soturai.jpg", badge: "Распродажа", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 16313, oldPrice: 16488 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 21613, oldPrice: 22238 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 56894, oldPrice: 59888 },
  ] },
  { id: 204, name: "Ballu Olympio Pro BSO", brand: "Ballu", type: "Обычный", smartHome: false, noise: "23 дБ", country: "КНР", image: "images/catalog/ballu-olympio-pro.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 24375, oldPrice: 24950 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 26319, oldPrice: 26610 },
  ] },
  { id: 205, name: "Ballu Olympio Edge BSO", brand: "Ballu", type: "Обычный", smartHome: false, noise: "23 дБ", country: "КНР", image: "images/catalog/ballu-olympio-edge.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25622, oldPrice: 26690 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27822, oldPrice: 28390 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37136, oldPrice: 39090 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 63926, oldPrice: 66590 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 79221, oldPrice: 83390 },
  ] },
  { id: 207, name: "Ballu Tessey BST", brand: "Ballu", type: "Обычный", smartHome: false, noise: "20 дБ", country: "КНР", image: "images/catalog/ballu-tessey.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25622, oldPrice: 26690 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37136, oldPrice: 39090 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 60702, oldPrice: 62290 },
  ] },
  { id: 209, name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-barocco.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25026, oldPrice: 25400 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27831, oldPrice: 28600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37296, oldPrice: 38850 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 45720, oldPrice: 46888 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 79146, oldPrice: 80000 },
  ] },
  { id: 210, name: "Royal Thermo Siena RTS", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 23580, oldPrice: 23990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 25720, oldPrice: 25990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 33590, oldPrice: 34990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58780, oldPrice: 60050 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 74069, oldPrice: 76200 },
  ] },
  { id: 211, name: "Electrolux Skandi EACS-HSK/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-skandi.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 16321, oldPrice: 16612 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 29090, oldPrice: 29990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37991, oldPrice: 39990 },
  ] },
  { id: 212, name: "Electrolux Smartline EACS-HSM/N8", brand: "Electrolux", type: "Обычный", smartHome: true, noise: "26 дБ", country: "КНР", image: "images/catalog/electrolux-smartline.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 18729, oldPrice: 19112 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 30391, oldPrice: 31990 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 41411, oldPrice: 43590 },
    { btu: 18000, area: 52, cooling: "5.28 кВт", heating: "5.57 кВт", price: 67610, oldPrice: 68990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 83947, oldPrice: 85990 },
  ] },
  { id: 213, name: "Electrolux Fusion Wave EACS-HFW/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 31332, oldPrice: 31990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 34191, oldPrice: 35990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 47618, oldPrice: 48590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 75199, oldPrice: 76990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 93421, oldPrice: 94990 },
  ] },
  { id: 216, name: "Electrolux Nordic EACS-HT/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-nordic.jpg", variants: [
    { btu: 30000, area: 80, cooling: "8.8 кВт", heating: "9.2 кВт", price: 106550, oldPrice: 110990 },
  ] },
  { id: 102, name: "Kentatsu Кумо KSGKU-HFRN1", brand: "Kentatsu", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/kentants-kumo.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 25736, oldPrice: 27090 },
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 28799, oldPrice: 29690 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.72 кВт", price: 36850, oldPrice: 37990 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 63396, oldPrice: 64690 },
  ] },
  { id: 107, name: "Kentatsu Канами R32 KSGA-HFRN1", brand: "Kentatsu", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/kentatsu-kanami.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 25046, oldPrice: 26090 },
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 27822, oldPrice: 28390 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.56 кВт", price: 59702, oldPrice: 62190 },
  ] },
  { id: 109, name: "Midea Парамаунт R32 MSAG1", brand: "Midea", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/midea-paramount.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 28410, oldPrice: 28990 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 39974, oldPrice: 40790 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.56 кВт", price: 67610, oldPrice: 68990 },
  ] },
  { id: 108, name: "Daichi Эверест R32 DA-EVQ1R", brand: "Daichi", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/daichi-everest.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.49 кВт", heating: "2.65 кВт", price: 24490, oldPrice: 24990 },
    { btu: 12000, area: 35, cooling: "3.23 кВт", heating: "3.52 кВт", price: 33526, oldPrice: 35290 },
  ] },
  { id: 106, name: "Axioma Серия H R32 ASX-H1R", brand: "Axioma", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/axioma-h.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.05 кВт", heating: "2.2 кВт", price: 20374, oldPrice: 20790 },
    { btu: 9000, area: 25, cooling: "2.49 кВт", heating: "2.65 кВт", price: 21974, oldPrice: 22890 },
    { btu: 12000, area: 35, cooling: "3.23 кВт", heating: "3.52 кВт", price: 29631, oldPrice: 31190 },
    { btu: 18000, area: 50, cooling: "4.99 кВт", heating: "5.13 кВт", price: 48916, oldPrice: 51490 },
  ] },
      {
    id: 502,
    name: "Axioma Серия H Инвертор R32",
    brand: "Axioma",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/axioma-h-inv.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.29 кВт", price: 28886, oldPrice: 30090 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 30296, oldPrice: 31890 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 33336, oldPrice: 35090 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.42 кВт", price: 59672, oldPrice: 60890 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.18 кВт", price: 75650, oldPrice: 77990 },
    ],
  },

  { id: 301, name: "SHUFT Berg DC SFTOI", brand: "SHUFT", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-berg-inv.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 26019, oldPrice: 27388 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 28963, oldPrice: 29288 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 33588, oldPrice: 34988 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 59968, oldPrice: 60688 },
  ] },
  { id: 304, name: "Ballu Tessey DC BSTI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "20 дБ", country: "КНР", image: "images/catalog/ballu-tessey-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 30907, oldPrice: 31490 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 32516, oldPrice: 32990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 40790, oldPrice: 42490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 94168, oldPrice: 96090 },
  ] },
  { id: 305, name: "Ballu Odyssey DC BSOI", brand: "Ballu", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/ballu-odyssey.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31448, oldPrice: 32090 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 24977, oldPrice: 25738 },
  ] },
  { id: 308, name: "Ballu Platinum Evolution DC BSUI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/ballu-platinum-evo.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 21244, oldPrice: 21488 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 50521, oldPrice: 51490 },
  ] },
  { id: 311, name: "Royal Thermo Diamond DC RTDI Wi-Fi", brand: "Royal Thermo", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/royal-diamond.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 28188, oldPrice: 28900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31385, oldPrice: 31800 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 36950, oldPrice: 38490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 87679, oldPrice: 88990 },
  ] },
  { id: 312, name: "Royal Thermo Siena DC RTSI", brand: "Royal Thermo", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 35277, oldPrice: 35900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 38696, oldPrice: 39600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 44985, oldPrice: 45700 },
  ] },
  { id: 314, name: "Electrolux Smartline DC EACS/I-HSM/N8", brand: "Electrolux", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/electrolux-smartline-inv.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 41021, oldPrice: 41990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 43971, oldPrice: 44990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 51538, oldPrice: 52590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 86151, oldPrice: 87990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 105171, oldPrice: 107990 },
  ] },
  { id: 315, name: "Electrolux Fusion Wave Super DC EACS/I-HFW/N8", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave-inv.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 48490, oldPrice: 49990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 51930, oldPrice: 52990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 59416, oldPrice: 60590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 91191, oldPrice: 95990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 114230, oldPrice: 118990 },
  ] },
  { id: 316, name: "Electrolux Onix Super DC Black", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-onix.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 61675, oldPrice: 62990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 68045, oldPrice: 68990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 104341, oldPrice: 105990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 127634, oldPrice: 128990 },
  ] },
  { id: 320, name: "Toshiba Seiya RAS-CVG", brand: "Toshiba", type: "Инверторный", smartHome: false, noise: "19 дБ", country: "Таиланд", image: "https://rkcdn.ru/products/e90e8f4c-6304-11ef-b8db-00505601218a/main_big.jpg", badge: "Премиум", variants: [
    { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 74380, oldPrice: 75900 },
    { btu: 10000, area: 25, cooling: "2.5 кВт", heating: "3.2 кВт", price: 83200, oldPrice: 84900 },
    { btu: 13000, area: 35, cooling: "3.3 кВт", heating: "3.6 кВт", price: 95940, oldPrice: 97900 },
    { btu: 16000, area: 50, cooling: "4.6 кВт", heating: "5.4 кВт", price: 137100, oldPrice: 139900 },
    { btu: 18000, area: 55, cooling: "5.0 кВт", heating: "5.4 кВт", price: 156700, oldPrice: 159900 },
    { btu: 24000, area: 70, cooling: "6.5 кВт", heating: "7.0 кВт", price: 186100, oldPrice: 189900 },
  ] },
  { id: 105, name: "Kentatsu Канами Инвертор Wi-Fi", brand: "Kentatsu", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/kentatsu-kanami-wifi.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.93 кВт", price: 37896, oldPrice: 39890 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 43894, oldPrice: 44790 },
  ] },
  { id: 401, name: "Ballu Machine BLC_C кассетная", brand: "Ballu", type: "Полупромышленный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/ballu-machine-cassette.jpg", badge: "Хит", variants: [
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 67512, oldPrice: 69600 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 72010, oldPrice: 75800 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.5 кВт", price: 94620, oldPrice: 99600 },
    { btu: 36000, area: 100, cooling: "10.5 кВт", heating: "11.2 кВт", price: 130144, oldPrice: 132800 },
    { btu: 48000, area: 140, cooling: "14.0 кВт", heating: "15.0 кВт", price: 155230, oldPrice: 163400 },
    { btu: 60000, area: 180, cooling: "17.5 кВт", heating: "18.5 кВт", price: 163305, oldPrice: 171900 },
  ] },
  {
    id: 501,
    name: "AURUS A DC AAI",
    brand: "AURUS",
    type: "Инверторный",
    smartHome: false,
    noise: "15 дБ",
    country: "КНР",
    image: "images/catalog/aurus-a.jpg",
    badge: "Гарантия 7 лет",
    variants: [
      { btu: 9000, area: 26, cooling: "2.6 кВт", heating: "3.2 кВт", price: 117600, oldPrice: 120000 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 124800, oldPrice: 130000 },
    ],
  },
  {
    id: 511,
    name: "Daikin FTXF Sensira",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-sensira.jpg",
    badge: "Премиум",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.4 кВт", price: 75810, oldPrice: 79800 },
      { btu: 12000, area: 40, cooling: "4.2 кВт", heating: "4.6 кВт", price: 212160, oldPrice: 216490 },
    ],
  },
  {
    id: 512,
    name: "Daikin FTXF-F",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-ftxf-f.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.4 кВт", price: 113715, oldPrice: 119700 },
    ],
  },
  {
    id: 513,
    name: "Daikin FTXS",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-ftxs.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 98067, oldPrice: 101100 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 98325, oldPrice: 103500 },
    ],
  },
  {
    id: 514,
    name: "Daikin FTYN (On/Off)",
    brand: "Daikin",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-ftyn.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.65 кВт", heating: "2.8 кВт", price: 47628, oldPrice: 48600 },
      { btu: 18000, area: 50, cooling: "5.25 кВт", heating: "5.55 кВт", price: 72010, oldPrice: 75800 },
    ],
  },
  {
    id: 515,
    name: "Daikin FTXJ Emura",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-emura.jpg",
    badge: "Дизайн",
    variants: [
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.0 кВт", price: 198899, oldPrice: 205050 },
    ],
  },
  {
    id: 516,
    name: "Daikin FTXM Perfera",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-perfera.jpg",
    badge: "Премиум",
    variants: [
      { btu: 12000, area: 42, cooling: "4.2 кВт", heating: "5.4 кВт", price: 290592, oldPrice: 302700 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 326144, oldPrice: 332800 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 363744, oldPrice: 378900 },
      { btu: 24000, area: 70, cooling: "7.1 кВт", heating: "8.2 кВт", price: 375820, oldPrice: 395600 },
    ],
  },
  {
    id: 517,
    name: "Daikin FTXM-A Perfera",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-perfera-a.jpg",
    badge: "Премиум",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 224322, oldPrice: 228900 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 222421, oldPrice: 229300 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "4.0 кВт", price: 290208, oldPrice: 302300 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 390048, oldPrice: 406300 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 416518, oldPrice: 429400 },
      { btu: 24000, area: 70, cooling: "7.1 кВт", heating: "8.2 кВт", price: 462720, oldPrice: 482000 },
    ],
  },
  {
    id: 518,
    name: "Daikin FTXJ-AB9",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-ftxj-ab9.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 295850, oldPrice: 305000 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 314640, oldPrice: 331200 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "4.0 кВт", price: 392392, oldPrice: 400400 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 506072, oldPrice: 516400 },
    ],
  },
  {
    id: 519,
    name: "Daikin FVXM/RXM (напольная)",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-fvxm.jpg",
    variants: [
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 408646, oldPrice: 416986 },
    ],
  },
   // ===== KENTATSU кассетные — инверторные =====
  {
    id: 601,
    name: "Kentatsu кассетная KSVB Inverter (R32)",
    brand: "Kentatsu",
    type: "Полупромышленный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-cassette-inv.jpg",
    badge: "Инвертор",
    variants: [
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.5 кВт", price: 125314, oldPrice: 129190 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 165316, oldPrice: 168690 },
      { btu: 48000, area: 130, cooling: "13.14 кВт", heating: "13.5 кВт", price: 195445, oldPrice: 201490 },
      { btu: 60000, area: 160, cooling: "16.12 кВт", heating: "16.5 кВт", price: 212126, oldPrice: 223290 },
    ],
  },

  // ===== KENTATSU кассетные — обычные (On/Off) =====
  {
    id: 602,
    name: "Kentatsu кассетная KSVT / KSVG (On/Off)",
    brand: "Kentatsu",
    type: "Полупромышленный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-cassette.jpg",
    variants: [
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 83410, oldPrice: 85990 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 109526, oldPrice: 114090 },
      { btu: 48000, area: 140, cooling: "14.1 кВт", heating: "14.5 кВт", price: 136598, oldPrice: 142290 },
      { btu: 60000, area: 176, cooling: "16.12 кВт", heating: "16.5 кВт", price: 145324, oldPrice: 148290 },
    ],
  },

  // ===== MIDEA кассетные — инверторные (Full DC / Inverter) =====
  {
    id: 603,
    name: "Midea кассетная MCD Inverter (R32)",
    brand: "Midea",
    type: "Полупромышленный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-cassette-inv.jpg",
    badge: "Инвертор",
    variants: [
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.5 кВт", price: 121754, oldPrice: 124239 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 173254, oldPrice: 176790 },
      { btu: 48000, area: 140, cooling: "14.07 кВт", heating: "14.5 кВт", price: 202550, oldPrice: 210990 },
      { btu: 60000, area: 155, cooling: "15.24 кВт", heating: "15.7 кВт", price: 226873, oldPrice: 233890 },
    ],
  },

  // ===== MIDEA кассетные — обычные (On/Off) =====
  {
    id: 604,
    name: "Midea кассетная MCD (On/Off, R410A)",
    brand: "Midea",
    type: "Полупромышленный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-cassette.jpg",
    variants: [
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.3 кВт", price: 86678, oldPrice: 90290 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 113801, oldPrice: 119790 },
      { btu: 48000, area: 140, cooling: "14.07 кВт", heating: "14.5 кВт", price: 144908, oldPrice: 149390 },
      { btu: 60000, area: 160, cooling: "16.12 кВт", heating: "16.5 кВт", price: 147906, oldPrice: 155690 },
    ],
  },
   // ===== KENTATSU новые серии =====
  {
    id: 701,
    name: "Kentatsu Атама (Atama)",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-atama.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.05 кВт", heating: "2.2 кВт", price: 25210, oldPrice: 25990 },
      { btu: 9000, area: 25, cooling: "2.49 кВт", heating: "2.65 кВт", price: 26591, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.23 кВт", heating: "3.52 кВт", price: 35662, oldPrice: 36390 },
      { btu: 18000, area: 50, cooling: "4.99 кВт", heating: "5.13 кВт", price: 59839, oldPrice: 61690 },
      { btu: 24000, area: 70, cooling: "6.45 кВт", heating: "6.74 кВт", price: 75359, oldPrice: 77690 },
    ],
  },
  {
    id: 702,
    name: "Kentatsu Атама Инвертор (Atama Inverter)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-atama-inv.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.29 кВт", price: 33716, oldPrice: 35490 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 36566, oldPrice: 38090 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 41601, oldPrice: 43790 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.42 кВт", price: 71318, oldPrice: 74290 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.18 кВт", price: 90431, oldPrice: 95190 },
    ],
  },
  {
    id: 703,
    name: "Kentatsu Харуки (Haruki)",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-haruki.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.2 кВт", price: 25210, oldPrice: 25990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 26591, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 35662, oldPrice: 36390 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.42 кВт", price: 59839, oldPrice: 61690 },
      { btu: 24000, area: 70, cooling: "7.33 кВт", heating: "7.62 кВт", price: 75359, oldPrice: 77690 },
    ],
  },
  {
    id: 704,
    name: "Kentatsu Харуки Инвертор (Haruki Inverter)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-haruki-inv.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.35 кВт", price: 33716, oldPrice: 35490 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 36566, oldPrice: 38090 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 41601, oldPrice: 43790 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.13 кВт", price: 71318, oldPrice: 74290 },
      { btu: 24000, area: 70, cooling: "6.84 кВт", heating: "7.05 кВт", price: 90431, oldPrice: 95190 },
    ],
  },
  {
    id: 705,
    name: "Kentatsu Юки Инвертор (Yuki)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-yuki.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.35 кВт", heating: "2.43 кВт", price: 32776, oldPrice: 33790 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.93 кВт", price: 35956, oldPrice: 36690 },
      { btu: 12000, area: 35, cooling: "3.61 кВт", heating: "3.71 кВт", price: 41696, oldPrice: 43890 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.4 кВт", price: 74777, oldPrice: 77090 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 94371, oldPrice: 97290 },
    ],
  },
  {
    id: 706,
    name: "Kentatsu Тиба (Tiba)",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-tiba.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.3 кВт", heating: "2.35 кВт", price: 29366, oldPrice: 30590 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.6 кВт", price: 32194, oldPrice: 33190 },
      { btu: 12000, area: 35, cooling: "3.3 кВт", heating: "3.4 кВт", price: 41270, oldPrice: 42990 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.05 кВт", price: 71334, oldPrice: 72790 },
      { btu: 24000, area: 70, cooling: "6.2 кВт", heating: "6.7 кВт", price: 87391, oldPrice: 91990 },
    ],
  },
  {
    id: 707,
    name: "Kentatsu Тиба Инвертор (Tiba Inverter)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-tiba-inv.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.4 кВт", price: 43796, oldPrice: 44690 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 47226, oldPrice: 48190 },
      { btu: 12000, area: 35, cooling: "3.2 кВт", heating: "3.4 кВт", price: 52370, oldPrice: 53990 },
      { btu: 18000, area: 50, cooling: "4.6 кВт", heating: "5.2 кВт", price: 83510, oldPrice: 86990 },
      { btu: 24000, area: 70, cooling: "6.2 кВт", heating: "6.5 кВт", price: 110191, oldPrice: 115990 },
    ],
  },
  {
    id: 708,
    name: "Kentatsu Отари Инвертор (Otari)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-otari.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 55862, oldPrice: 57590 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.81 кВт", price: 60182, oldPrice: 62690 },
      { btu: 18000, area: 50, cooling: "5.2 кВт", heating: "5.6 кВт", price: 98088, oldPrice: 100090 },
      { btu: 24000, area: 70, cooling: "7.1 кВт", heating: "7.8 кВт", price: 121822, oldPrice: 125590 },
    ],
  },
  {
    id: 709,
    name: "Kentatsu Семпай Инвертор (Sempai)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-sempai.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.14 кВт", price: 55766, oldPrice: 58090 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.96 кВт", price: 60086, oldPrice: 62590 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.57 кВт", price: 86902, oldPrice: 89590 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.33 кВт", price: 114454, oldPrice: 116790 },
    ],
  },
  {
    id: 710,
    name: "Kentatsu Омори Инвертор (Omori)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-omori.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.93 кВт", price: 63831, oldPrice: 67190 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.81 кВт", price: 75136, oldPrice: 79090 },
    ],
  },
  {
    id: 711,
    name: "Kentatsu Тамаши Инвертор (Tamashi)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-tamashi.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 71811, oldPrice: 75590 },
      { btu: 12000, area: 35, cooling: "3.51 кВт", heating: "3.81 кВт", price: 79190, oldPrice: 82490 },
    ],
  },
  {
    id: 712,
    name: "Kentatsu Токачи Инвертор (Tokachi)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/kentatsu-tokachi.jpg",
    badge: "Премиум",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.5 кВт", price: 105782, oldPrice: 110190 },
      { btu: 12000, area: 35, cooling: "3.53 кВт", heating: "4.2 кВт", price: 114454, oldPrice: 116790 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "6.2 кВт", price: 145814, oldPrice: 148790 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.03 кВт", price: 159116, oldPrice: 167490 },
    ],
  },
  {
    id: 713,
    name: "Kentatsu Ичи Инвертор R32 (Ichi)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/596/j3nqso97cc4l509nq5lpzq2ucrle5qzn/yffgkm1gelxck0om3nan6znhe0iq6ok8.jpg",
    variants: [
      { btu: 24000, area: 60, cooling: "6.2 кВт", heating: "6.2 кВт", price: 75991, oldPrice: 79990 },
    ],
  },

  // ===== MIDEA новые серии =====
  {
    id: 720,
    name: "Midea Анлимитед (Unlimited)",
    brand: "Midea",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/f6a/2whrub6z169jsog90r1lks95nqukc2bj/j2wi9m5sd3sha9ce189q09t2bb48a2bs.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 26591, oldPrice: 27990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 29366, oldPrice: 30590 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 37611, oldPrice: 39590 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.28 кВт", price: 64214, oldPrice: 66890 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 82996, oldPrice: 84690 },
    ],
  },
  {
    id: 721,
    name: "Midea Персона (Persona)",
    brand: "Midea",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-persona.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 31938, oldPrice: 32590 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 33590, oldPrice: 34990 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 43894, oldPrice: 44790 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.28 кВт", price: 67726, oldPrice: 71290 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 83116, oldPrice: 87490 },
    ],
  },
  {
    id: 722,
    name: "Midea Персона Инвертор Wi-Fi (Persona)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: true,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-persona-inv.jpg",
    badge: "Умный дом",
    variants: [
      { btu: 7000, area: 20, cooling: "2.35 кВт", heating: "2.43 кВт", price: 45110, oldPrice: 46990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.93 кВт", price: 51497, oldPrice: 53090 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 56136, oldPrice: 59090 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 91094, oldPrice: 94890 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 117506, oldPrice: 123690 },
    ],
  },
  {
    id: 723,
    name: "Midea Breezeless E",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-breezeless-e.jpg",
    badge: "Без сквозняка",
    variants: [
      { btu: 9000, area: 25, cooling: "2.78 кВт", heating: "2.93 кВт", price: 51982, oldPrice: 53590 },
      { btu: 12000, area: 35, cooling: "3.6 кВт", heating: "3.8 кВт", price: 55668, oldPrice: 57390 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 75136, oldPrice: 79090 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 102422, oldPrice: 106690 },
    ],
  },
  {
    id: 724,
    name: "Midea Breezeless Wi-Fi",
    brand: "Midea",
    type: "Инверторный",
    smartHome: true,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-breezeless.jpg",
    badge: "Умный дом",
    variants: [
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.93 кВт", price: 71702, oldPrice: 74690 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.81 кВт", price: 75553, oldPrice: 77890 },
    ],
  },
  {
    id: 725,
    name: "Midea ХитФорс (HeatForce)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-heatforce.jpg",
    badge: "Мощный обогрев",
    variants: [
      { btu: 9000, area: 25, cooling: "2.93 кВт", heating: "3.22 кВт", price: 67631, oldPrice: 71190 },
      { btu: 12000, area: 35, cooling: "3.66 кВт", heating: "3.96 кВт", price: 71606, oldPrice: 74590 },
      { btu: 18000, area: 50, cooling: "5.45 кВт", heating: "5.57 кВт", price: 136857, oldPrice: 141090 },
      { btu: 24000, area: 60, cooling: "7.33 кВт", heating: "7.77 кВт", price: 171734, oldPrice: 178890 },
    ],
  },
  {
    id: 726,
    name: "Midea Гайа (Gaia)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-gaia.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "3.22 кВт", price: 75158, oldPrice: 78290 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.81 кВт", price: 78806, oldPrice: 82090 },
    ],
  },
  {
    id: 727,
    name: "Midea Изи Инвертор (Easy Inverter)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/midea-easy-inv.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.05 кВт", heating: "2.34 кВт", price: 36268, oldPrice: 37390 },
      { btu: 9000, area: 25, cooling: "2.78 кВт", heating: "3.22 кВт", price: 39680, oldPrice: 40490 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.52 кВт", price: 47422, oldPrice: 48390 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.4 кВт", price: 82731, oldPrice: 85290 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.3 кВт", price: 102116, oldPrice: 107490 },
    ],
  },

  // ===== BOSCH (новый бренд) =====
  {
    id: 730,
    name: "Bosch Climate Line 2000",
    brand: "Bosch",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/bosch-cl2000.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.3 кВт", heating: "2.3 кВт", price: 29750, oldPrice: 30990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.6 кВт", price: 33590, oldPrice: 34990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.7 кВт", price: 40730, oldPrice: 41990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.3 кВт", price: 51594, oldPrice: 53190 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 63592, oldPrice: 64890 },
    ],
  },
  {
    id: 731,
    name: "Bosch Climate Line 5000 Инвертор",
    brand: "Bosch",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/bosch-cl5000.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 45110, oldPrice: 46990 },
      { btu: 9000, area: 25, cooling: "2.8 кВт", heating: "3.2 кВт", price: 48490, oldPrice: 49990 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.5 кВт", price: 55850, oldPrice: 56990 },
    ],
  },
  {
    id: 732,
    name: "Bosch Climate 5000 Инвертор",
    brand: "Bosch",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/bosch-climate5000.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.9 кВт", price: 39484, oldPrice: 40290 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 74971, oldPrice: 77290 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 94706, oldPrice: 99690 },
    ],
  },
  {
    id: 733,
    name: "Bosch Climate 6000i Инвертор",
    brand: "Bosch",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "images/catalog/bosch-climate6000i.jpg",
    badge: "Премиум",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "3.0 кВт", price: 64505, oldPrice: 67900 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.5 кВт", price: 148310, oldPrice: 154490 },
    ],
  },


  {
    id: 520,
    name: "Daikin FDXM-F9 (канальная)",
    brand: "Daikin",
    type: "Полупромышленный",
    smartHome: false,
    noise: "—",
    country: "Япония",
    image: "images/catalog/daikin-fdxm.jpg",
    badge: "Канальная",
    variants: [
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 353094, oldPrice: 360300 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 370346, oldPrice: 381800 },
    ],
  },
  {
    id: 734,
    name: "Ballu Eco Smart DC BSYI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/53e81bda-d25c-11ef-b8dc-00505601218a/main_big.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 20287, oldPrice: 20738 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22388, oldPrice: 22738 },
      { btu: 10000, area: 27, cooling: "2.9 кВт", heating: "3.0 кВт", price: 34934, oldPrice: 36390 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 43476, oldPrice: 44490 },
    ],
  },
  {
    id: 735,
    name: "Royal Thermo Barocco DC RTBI",
    brand: "Royal Thermo",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/fe7ca232-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Лучший",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 46944, oldPrice: 48900 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 50251, oldPrice: 50900 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 53859, oldPrice: 55200 },
    ],
  },
  {
    id: 736,
    name: "Ballu iGreen Pro BSAG",
    brand: "Ballu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/456a3a97-abdb-11ed-b733-005056013a69/main_big.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 26883, oldPrice: 27489 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 28801, oldPrice: 29339 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 39624, oldPrice: 40369 },
    ],
  },
  {
    id: 737,
    name: "Ballu Defender BSHI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/f8730e5a-4b96-11f0-b8df-00505601218a/main_big.jpg",
    badge: "Лучший",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 46944, oldPrice: 48900 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 47414, oldPrice: 47990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 54624, oldPrice: 56900 },
    ],
  },
  {
    id: 738,
    name: "Ballu Greenland DC BSGRI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/f645ceb8-5b3e-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Распродажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 48925, oldPrice: 49990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 55217, oldPrice: 55990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 89102, oldPrice: 90990 },
    ],
  },
  {
    id: 739,
    name: "HITAIR HAM",
    brand: "HITAIR",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/d8bc9d48-1083-11f0-b8de-00505601218a/main_big.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 11062, oldPrice: 11238 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 12168, oldPrice: 12488 },
    ],
  },
  {
    id: 740,
    name: "NEOLINE NAM",
    brand: "NEOLINE",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/ce995fdb-f100-11ee-b8d8-00505601218a/main_big.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 12294, oldPrice: 12612 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 13725, oldPrice: 13988 },
    ],
  },
  {
    id: 741,
    name: "Ballu Olympio Legend BSW",
    brand: "Ballu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/5480f405-6305-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 13481, oldPrice: 13673 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27254, oldPrice: 28390 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37344, oldPrice: 38900 },
    ],
  },
  {
    id: 742,
    name: "Ballu Maverick DC BSMI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/13976ae5-ffef-11ef-b8de-00505601218a/main_big.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 31766, oldPrice: 33090 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 34166, oldPrice: 35590 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 39350, oldPrice: 40990 },
    ],
  },
  {
    id: 743,
    name: "Electrolux Loft EACS-HAL/N8",
    brand: "Electrolux",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/fef03f70-e2dc-11ee-b8d6-00505601218a/main_big.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24950, oldPrice: 25990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 29750, oldPrice: 30990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37430, oldPrice: 38990 },
    ],
  },
  {
    id: 744,
    name: "Electrolux Loft DC EACS/I-HAL/N8",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/5f42727e-5d3c-11ef-b8db-00505601218a/main_big.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 22553, oldPrice: 23238 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 24604, oldPrice: 25238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 44064, oldPrice: 45900 },
    ],
  },
  {
    id: 745,
    name: "Electrolux Slide EACS-HSL/N8",
    brand: "Electrolux",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/c4ca2dfc-d4d2-11ee-b8d6-00505601218a/main_big.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25910, oldPrice: 26990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 19838, oldPrice: 20238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 25435, oldPrice: 25988 },
    ],
  },
  {
    id: 746,
    name: "Daichi Айс (Ice)",
    brand: "Daichi",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/843/eeplcdhud1xr9skt8x9p1v8ul7gjfapu/e7ef71a5d086046ae4471f4f11d916c5.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.25 кВт", heating: "2.3 кВт", price: 26918, oldPrice: 28501 },
      { btu: 9000, area: 25, cooling: "2.55 кВт", heating: "2.65 кВт", price: 28550, oldPrice: 30229 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.5 кВт", price: 33140, oldPrice: 35089 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.2 кВт", price: 45890, oldPrice: 48589 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "6.2 кВт", price: 50990, oldPrice: 53989 },
    ],
  },
  {
    id: 747,
    name: "Daichi Эйр Инвертор (Air)",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/710/drwtr41sxpg3s3nms955bfin132y5dy1/ocobu8udxobthmgjlrlvkpgkv1olucch.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.63 кВт", price: 31814, oldPrice: 33685 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.42 кВт", price: 34976, oldPrice: 37033 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.13 кВт", price: 60986, oldPrice: 64573 },
      { btu: 24000, area: 60, cooling: "6.84 кВт", heating: "7.05 кВт", price: 86588, oldPrice: 91681 },
    ],
  },
  {
    id: 748,
    name: "Daichi Карбон Инвертор (Carbon)",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/4fe/c58p0gwt6pyekq93fxkd29l92pdzo9hm/ka688tv5a1mpf9bt0xjvn7rqc2szix5g.jpg",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.61 кВт", price: 50480, oldPrice: 53449 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.42 кВт", price: 54560, oldPrice: 57769 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.1 кВт", price: 93830, oldPrice: 99349 },
      { btu: 24000, area: 70, cooling: "6.81 кВт", heating: "6.87 кВт", price: 121370, oldPrice: 128509 },
    ],
  },
  {
    id: 749,
    name: "Kentatsu Ичи (Ichi)",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/92b/q091wd79snt2mxaf5dkpgar6qdyxs8ia/fa61c5a5e9aca81d1ecbfa2a88e11956.jpg",
    variants: [
      { btu: 7000, area: 20, cooling: "2.3 кВт", heating: "2.3 кВт", price: 22226, oldPrice: 23533 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 24266, oldPrice: 25693 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.7 кВт", price: 30896, oldPrice: 32713 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.3 кВт", price: 53132, oldPrice: 56257 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 70472, oldPrice: 74617 },
    ],
  },
  {
    id: 750,
    name: "Kentatsu Турин Инвертор (Turin)",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/6f4/8n29gsc41w42km8nisn9ky62q1wsrdh9/79e7fc7451fa77297d4028722945c75f.jpg",
    variants: [
      { btu: 24000, area: 60, cooling: "6.2 кВт", heating: "6.2 кВт", price: 84456, oldPrice: 89424 },
    ],
  },
  {
    id: 751,
    name: "Kentatsu Наоми (Naomi)",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/b47/5rx7jwm6ylcrcxw26kln1cl600q61zp4/pe2bqlidoj86vsns8vfvnx7t2xaoxuty.jpg",
    variants: [
      { btu: 36000, area: 100, cooling: "10.0 кВт", heating: "10.8 кВт", price: 157682, oldPrice: 166957 },
    ],
  },
  {
    id: 752,
    name: "Midea Парамаунт Инвертор (Paramount Inverter)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/7f7/i7dr14qog7hxxf95170hjtmiu2hpu26k/11.jpg",
    variants: [
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 84446, oldPrice: 89413 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 106478, oldPrice: 112741 },
    ],
  },
  {
    id: 753,
    name: "Midea Анлимитед Инвертор (Unlimited Inverter)",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/889/lg8l2t6wzjhyor32bizvxyjr53b87vrw/11.jpg",
    variants: [
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 84446, oldPrice: 89413 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 106478, oldPrice: 112741 },
    ],
  },

// Мобильные и промышленные (B2B Русклимат + daichi.market), 25.08.2026
  {
    id: 754,
    name: "Ballu Orbis BPAC",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "—",
    country: "КНР",
    image: "https://rkcdn.ru/products/ab3696a4-cc02-11ee-b8d6-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 23611, oldPrice: 23990 },
      { btu: 8000, area: 22, cooling: "2.3 кВт", heating: "—", price: 28939, oldPrice: 29790 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 26668, oldPrice: 26990 },
    ],
  },
  {
    id: 756,
    name: "Ballu Aura BPAC-09 24Y",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/9eb2515a-6e8e-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 31528, oldPrice: 31990 },
    ],
  },
  {
    id: 757,
    name: "Ballu Aura BPAC-09 24Y + UniPort",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/829eaaca-5b5a-11f1-b8e3-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 33253, oldPrice: 33990 },
    ],
  },
  {
    id: 758,
    name: "Ballu Eclipse BPAC EPW white",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/5f2330d7-e392-11ef-b8de-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 31228, oldPrice: 31990 },
      { btu: 10000, area: 27, cooling: "2.9 кВт", heating: "—", price: 35413, oldPrice: 35990 },
    ],
  },
  {
    id: 760,
    name: "Ballu Eclipse BPAC-10 EPB black",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/dc5d0d5b-6e91-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 10000, area: 27, cooling: "2.9 кВт", heating: "—", price: 35973, oldPrice: 36990 },
    ],
  },
  {
    id: 761,
    name: "Ballu Twinkle BPAC-09 DWR Red",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/b8981469-1e32-11f1-b8e1-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 29257, oldPrice: 29590 },
    ],
  },
  {
    id: 762,
    name: "Ballu Twinkle BPAC-09 DWR Red + UniPort",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/ef128d96-5ff1-11f1-b8e3-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 31045, oldPrice: 31590 },
    ],
  },
  {
    id: 763,
    name: "Ballu Twinkle BPAC-09 DWB Blue",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/285622a0-1e33-11f1-b8e1-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 28898, oldPrice: 29590 },
    ],
  },
  {
    id: 764,
    name: "Ballu Twinkle BPAC-09 DWB Blue + UniPort",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/9a32b2fd-5ff1-11f1-b8e3-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 30975, oldPrice: 31590 },
    ],
  },
  {
    id: 765,
    name: "Ballu Stella BPAC",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/f0989a89-1058-11f0-b8de-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 23029, oldPrice: 23590 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 25430, oldPrice: 25990 },
    ],
  },
  {
    id: 767,
    name: "Ballu Selen BPAC",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/a45cc4f6-d7d5-11ef-b8dc-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 24650, oldPrice: 24990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 27284, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "—", price: 35169, oldPrice: 35990 },
    ],
  },
  {
    id: 770,
    name: "Ballu Smart Wind BPAC-09",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/a9acd3d0-f8a7-11ed-b736-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 28625, oldPrice: 28990 },
    ],
  },
  {
    id: 771,
    name: "Ballu Velure BPAC-14",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/4cb4934d-6e95-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "—", price: 49218, oldPrice: 49990 },
    ],
  },
  {
    id: 772,
    name: "Ballu BPAC-18 CE",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/c9aa0e15-09f6-11ee-b736-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "—", price: 54263, oldPrice: 54990 },
    ],
  },
  {
    id: 773,
    name: "Ballu Platinum X4 BPHS",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/ababf435-1d67-11f1-b8e1-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.4 кВт", price: 36377, oldPrice: 36990 },
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "3.7 кВт", price: 45153, oldPrice: 45990 },
    ],
  },
  {
    id: 775,
    name: "Ballu Platinum X4 BPHS + UniPort",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/4c153776-5dd5-11f1-b8e3-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.4 кВт", price: 38255, oldPrice: 38990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.2 кВт", price: 43377, oldPrice: 43990 },
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "3.7 кВт", price: 47119, oldPrice: 47990 },
    ],
  },
  {
    id: 778,
    name: "Ballu Platinum Comfort BPHS-H",
    brand: "Ballu",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/b827edde-fada-11ed-b736-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 8000, area: 22, cooling: "2.3 кВт", heating: "2.1 кВт", price: 33310, oldPrice: 33990 },
      { btu: 11000, area: 30, cooling: "3.2 кВт", heating: "3.0 кВт", price: 37922, oldPrice: 38990 },
      { btu: 13000, area: 35, cooling: "3.8 кВт", heating: "3.5 кВт", price: 42491, oldPrice: 42990 },
    ],
  },
  {
    id: 782,
    name: "Ballu Heavy Pro BGK",
    brand: "Ballu",
    type: "Промышленный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/15705e3e-027e-11ed-b732-005056013a69/main_big.jpg",
    badge: "Промышленный",
    variants: [
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "—", price: 152604, oldPrice: 155990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "—", price: 386104, oldPrice: 395990 },
      { btu: 27000, area: 80, cooling: "7.9 кВт", heating: "—", price: 242298, oldPrice: 245990 },
      { btu: 44000, area: 130, cooling: "12.8 кВт", heating: "—", price: 728531, oldPrice: 735990 },
    ],
  },
  {
    id: 786,
    name: "Electrolux Arizona EACM AZ",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/2b507b39-1264-11f1-b8e1-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 28158, oldPrice: 28990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 32386, oldPrice: 32990 },
    ],
  },
  {
    id: 788,
    name: "Electrolux EACM CLN 2.0",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/6097f25d-2962-11ef-b8d8-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "—", price: 38488, oldPrice: 39590 },
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "—", price: 42895, oldPrice: 43590 },
    ],
  },
  {
    id: 790,
    name: "Electrolux EACM-09 HR",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/e768de48-026f-11ef-b8d8-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 36675, oldPrice: 37590 },
    ],
  },
  {
    id: 791,
    name: "Electrolux EACM HP",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/203d609f-05e6-11ee-b736-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 16000, area: 45, cooling: "4.7 кВт", heating: "4.2 кВт", price: 65281, oldPrice: 66990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "4.8 кВт", price: 70854, oldPrice: 72990 },
    ],
  },
  {
    id: 793,
    name: "Electrolux Nebula EACM-16 NB V2",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/8b90aef1-dd4f-11ef-b8de-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 16000, area: 45, cooling: "4.7 кВт", heating: "—", price: 65057, oldPrice: 66990 },
    ],
  },
  {
    id: 794,
    name: "Electrolux EACM JK",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/2c18919b-ce27-11ed-b733-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 20000, area: 55, cooling: "5.9 кВт", heating: "—", price: 134277, oldPrice: 135990 },
      { btu: 22000, area: 60, cooling: "6.5 кВт", heating: "—", price: 143332, oldPrice: 145990 },
    ],
  },
  {
    id: 796,
    name: "Electrolux Fusion Mobile EACM",
    brand: "Electrolux",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/4477cfe8-fe08-11ed-b736-005056013a69/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 28205, oldPrice: 28990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 31622, oldPrice: 31990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "—", price: 38216, oldPrice: 38990 },
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "—", price: 40771, oldPrice: 41990 },
    ],
  },
  {
    id: 800,
    name: "AC ELECTRIC ACE FH",
    brand: "AC ELECTRIC",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/54609bda-df14-11ef-b8de-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 17472, oldPrice: 17990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 19645, oldPrice: 19990 },
    ],
  },
  {
    id: 802,
    name: "AC ELECTRIC Diona ACE",
    brand: "AC ELECTRIC",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/2f976677-3714-11f1-b8e1-00505601218a/main_big.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 20653, oldPrice: 20990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 23616, oldPrice: 23990 },
    ],
  },
  {
    id: 804,
    name: "Airwave AWD-PCW white",
    brand: "Airwave",
    type: "Мобильный",
    smartHome: true,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/046/eyxe2msqlul6ed2y84lhkhqz7ftfygbu/cde4652d4a12613d69f77aca070e199e.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 23575, oldPrice: 23990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 26405, oldPrice: 26990 },
    ],
  },
  {
    id: 805,
    name: "Airwave AWD-PCB black",
    brand: "Airwave",
    type: "Мобильный",
    smartHome: true,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/31b/hp4o6g5txgkq52etit1zil20qr87mwwp/Front.png",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 23385, oldPrice: 23990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 26407, oldPrice: 26990 },
    ],
  },
  {
    id: 808,
    name: "Midea MPPHAS-CHN7",
    brand: "Midea",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/5dc/f21e1ap3pbhlk05q84iemm3yejwo4iq8/MI_MPPHAS_07CH_001.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.0 кВт", price: 27155, oldPrice: 27990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.4 кВт", price: 29321, oldPrice: 29990 },
    ],
  },
  {
    id: 809,
    name: "Midea MPPH1-CHN7",
    brand: "Midea",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/0a6/rjoe5l22oyi1kunuol02a5fpkwqg3wf1/waf6zgtuquybilc0ouc768eb5jk1e0cd.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.0 кВт", price: 27593, oldPrice: 27990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.4 кВт", price: 29646, oldPrice: 29990 },
    ],
  },
  {
    id: 810,
    name: "Primera PRMC-09JBNE",
    brand: "Primera",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/855/zjj7w7tobmq9bzqfkdmqctebuggpknh0/624lhl2uwab0z5kbvpf4088w4aqmvub1.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 27679, oldPrice: 28499 },
    ],
  },
  {
    id: 813,
    name: "Primera PRMC-07JGNA",
    brand: "Primera",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/922/itwfiahlrszix2n11lxtx8kz3v6i6n1p/20220330_170520.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "—", price: 29381, oldPrice: 29990 },
    ],
  },
  {
    id: 814,
    name: "Airwave AWP-PHW",
    brand: "Airwave",
    type: "Мобильный",
    smartHome: true,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/7aa/1j9osebruh3dzlroo6f6vdg1bn48m8dg/A015E.png",
    badge: "Без монтажа",
    variants: [
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "—", price: 39261, oldPrice: 39990 },
      { btu: 14000, area: 40, cooling: "4.1 кВт", heating: "—", price: 41171, oldPrice: 41990 },
    ],
  },
  {
    id: 816,
    name: "Midea MPPDA-09CRN7",
    brand: "Midea",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/1dc/jyfoslybqzdfs0rzh2f5e5kvm2me17hl/e0464f027354da33b49e39dbccefdc65.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "—", price: 42510, oldPrice: 42990 },
    ],
  },
  {
    id: 817,
    name: "Midea MPPDB-12CRN7",
    brand: "Midea",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/487/1as2549pfjchomsbhzlksudk4nmw2k38/hvryk8e52kvsntcde30pjkp4ds7xz839.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "—", price: 44253, oldPrice: 44990 },
    ],
  },
  {
    id: 818,
    name: "Midea MPPDB-12HRN1",
    brand: "Midea",
    type: "Мобильный",
    smartHome: false,
    noise: "49–52 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.market/upload/iblock/1dc/jyfoslybqzdfs0rzh2f5e5kvm2me17hl/e0464f027354da33b49e39dbccefdc65.jpg",
    badge: "Без монтажа",
    variants: [
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.2 кВт", price: 49221, oldPrice: 49990 },
    ],
  },

  // === НОВЫЕ МОДЕЛИ РУСКЛИМАТ И ДАИЧИ (26.08.2026) ===
  {
    id: 820,
    name: "Electrolux Avalanche Super DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: true,
    noise: "25 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/971de017-6304-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Тепловой насос -25°C",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 61730, oldPrice: 62990 },
      { btu: 12000, area: 35, cooling: "3.51 кВт", heating: "3.81 кВт", price: 68590, oldPrice: 69990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 102890, oldPrice: 104990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.4 кВт", price: 127390, oldPrice: 129990 },
    ],
  },
  {
    id: 821,
    name: "Electrolux Skandi DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/22006943-1b8b-11f0-b8de-00505601218a/main_big.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 20220, oldPrice: 20738 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22170, oldPrice: 22738 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 25340, oldPrice: 25990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 48740, oldPrice: 49990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 63360, oldPrice: 64990 },
    ],
  },
  {
    id: 822,
    name: "Electrolux Fusion 2.0 Super DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/188ca74d-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 23990, oldPrice: 24488 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 26450, oldPrice: 26990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 34290, oldPrice: 34990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58790, oldPrice: 59990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 75450, oldPrice: 76990 },
    ],
  },
  {
    id: 823,
    name: "Electrolux Fusion 2.0",
    brand: "Electrolux",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/0262d489-d7bc-11ed-b733-005056013a69/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 19340, oldPrice: 19738 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 20690, oldPrice: 21113 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 29390, oldPrice: 29990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 48990, oldPrice: 49990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 63690, oldPrice: 64990 },
    ],
  },
  {
    id: 824,
    name: "Electrolux Slide DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/88b54ba5-ffee-11ef-b8de-00505601218a/main_big.jpg",
    badge: "Ультратонкий",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 22770, oldPrice: 23238 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 24730, oldPrice: 25238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32820, oldPrice: 33490 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 56830, oldPrice: 57990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 72510, oldPrice: 73990 },
    ],
  },
  {
    id: 825,
    name: "Electrolux Crystal Air Super DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: true,
    noise: "20 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/a12d4138-1553-11f0-b8de-00505601218a/main_big.jpg",
    badge: "Премиум стекло",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 77410, oldPrice: 78990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 86230, oldPrice: 87990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.8 кВт", price: 122490, oldPrice: 124990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.5 кВт", price: 146990, oldPrice: 149990 },
    ],
  },
  {
    id: 826,
    name: "Electrolux Enterprise Super DC Inverter",
    brand: "Electrolux",
    type: "Инверторный",
    smartHome: true,
    noise: "21 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/7df4d468-ece7-11ee-b8d7-00505601218a/main_big.jpg",
    badge: "Флагман",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 55850, oldPrice: 56990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 63690, oldPrice: 64990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.8 кВт", price: 97010, oldPrice: 98990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.5 кВт", price: 120530, oldPrice: 122990 },
    ],
  },
  {
    id: 827,
    name: "Electrolux Air Gate 2 Black",
    brand: "Electrolux",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/55f47000-415a-11e8-a53a-ac162d7b6f40/main_big.jpg",
    badge: "Дизайн Black",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 23260, oldPrice: 23738 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27430, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37230, oldPrice: 37990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58790, oldPrice: 59990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 77410, oldPrice: 78990 },
    ],
  },
  {
    id: 828,
    name: "Ballu iGreen Pro DC BSAGI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: true,
    noise: "21 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/b8dfa50a-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 20320, oldPrice: 20738 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22280, oldPrice: 22738 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32330, oldPrice: 32990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 55850, oldPrice: 56990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.2 кВт", price: 71530, oldPrice: 72990 },
    ],
  },
  {
    id: 829,
    name: "Ballu Greenland BSGR",
    brand: "Ballu",
    type: "Обычный",
    smartHome: false,
    noise: "23 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/d7df3972-c8a2-11ed-b733-005056013a69/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 18120, oldPrice: 18490 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 19830, oldPrice: 20238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 27920, oldPrice: 28490 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 48990, oldPrice: 49990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 62710, oldPrice: 63990 },
    ],
  },
  {
    id: 830,
    name: "Ballu Boho DC BSHPI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: true,
    noise: "20 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/161329aa-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Тканевая панель",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 58790, oldPrice: 59990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 67610, oldPrice: 68990 },
    ],
  },
  {
    id: 831,
    name: "Ballu Platinum Black DC BSNI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/2f23eb1f-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Black Edition",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 48990, oldPrice: 49990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 55850, oldPrice: 56990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 88190, oldPrice: 89990 },
    ],
  },
  {
    id: 832,
    name: "Ballu Ice Peak DC BSPI",
    brand: "Ballu",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/65c41f52-d287-11ef-b8dc-00505601218a/main_big.jpg",
    badge: "Тепловой насос -30°C",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.2 кВт", price: 78390, oldPrice: 79990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.0 кВт", price: 88190, oldPrice: 89990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "6.0 кВт", price: 137190, oldPrice: 139990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.8 кВт", price: 166590, oldPrice: 169990 },
    ],
  },
  {
    id: 833,
    name: "Royal Thermo Perfecto RTP",
    brand: "Royal Thermo",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/ae06a931-0c78-11ef-b8d8-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 18610, oldPrice: 18990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 19830, oldPrice: 20238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 29390, oldPrice: 29990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 51440, oldPrice: 52490 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 66630, oldPrice: 67990 },
    ],
  },
  {
    id: 834,
    name: "Royal Thermo Perfecto DC RTPI",
    brand: "Royal Thermo",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/cef8f1d2-646b-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 28410, oldPrice: 28990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31350, oldPrice: 31990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37230, oldPrice: 37990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 61730, oldPrice: 62990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 78390, oldPrice: 79990 },
    ],
  },
  {
    id: 835,
    name: "Royal Thermo Barocco DC Black RTBI-B",
    brand: "Royal Thermo",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/e3b6d9b9-d7d2-11ef-b8dc-00505601218a/main_big.jpg",
    badge: "Дизайн Black",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 51840, oldPrice: 52900 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 56050, oldPrice: 57200 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 88100, oldPrice: 89900 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 109760, oldPrice: 112000 },
    ],
  },
  {
    id: 836,
    name: "SHUFT Soturai DC SFTHI",
    brand: "SHUFT",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/86923b1e-c51b-11ee-b8d6-00505601218a/main_big.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.6 кВт", heating: "2.8 кВт", price: 18990, oldPrice: 19488 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 20950, oldPrice: 21488 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 23870, oldPrice: 24488 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58790, oldPrice: 59990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 73490, oldPrice: 74990 },
    ],
  },
  {
    id: 837,
    name: "SHUFT Tor DC SFTMI",
    brand: "SHUFT",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/649a37ee-cf98-11ed-b733-005056013a69/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24490, oldPrice: 24990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27430, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 34290, oldPrice: 34990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58790, oldPrice: 59990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 75450, oldPrice: 76990 },
    ],
  },
  {
    id: 838,
    name: "Toshiba Shorai Edge RAS-B-G3KVS",
    brand: "Toshiba",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "Таиланд",
    image: "https://rkcdn.ru/products/ee2e1ff2-5d41-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Премиум A+++",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 107700, oldPrice: 109900 },
      { btu: 10000, area: 25, cooling: "2.5 кВт", heating: "3.2 кВт", price: 122400, oldPrice: 124900 },
      { btu: 13000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 137100, oldPrice: 139900 },
      { btu: 18000, area: 55, cooling: "5.0 кВт", heating: "6.0 кВт", price: 205700, oldPrice: 209900 },
      { btu: 24000, area: 75, cooling: "7.0 кВт", heating: "8.0 кВт", price: 264500, oldPrice: 269900 },
    ],
  },
  {
    id: 839,
    name: "Toshiba Haori RAS-B-N4KVR",
    brand: "Toshiba",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "Таиланд",
    image: "https://rkcdn.ru/products/afea4dd8-5d41-11ef-b8db-00505601218a/main_big.jpg",
    badge: "Флагман Текстиль",
    variants: [
      { btu: 10000, area: 25, cooling: "2.5 кВт", heating: "3.2 кВт", price: 166500, oldPrice: 169900 },
      { btu: 13000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 186100, oldPrice: 189900 },
      { btu: 16000, area: 50, cooling: "4.6 кВт", heating: "5.5 кВт", price: 235100, oldPrice: 239900 },
    ],
  },
  {
    id: 840,
    name: "AC ELECTRIC PRO ACEM",
    brand: "AC ELECTRIC",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/5d503f92-8968-11f0-b8e0-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 15180, oldPrice: 15490 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 16150, oldPrice: 16488 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 21790, oldPrice: 22238 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 41150, oldPrice: 41990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 52910, oldPrice: 53990 },
    ],
  },
  {
    id: 841,
    name: "AC ELECTRIC ACEMI",
    brand: "AC ELECTRIC",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/bbd22c2b-8966-11f0-b8e0-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 19590, oldPrice: 19990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 21050, oldPrice: 21488 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 23990, oldPrice: 24488 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 47030, oldPrice: 47990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 60750, oldPrice: 61990 },
    ],
  },
  {
    id: 842,
    name: "ONE AIR OACT",
    brand: "ONE AIR",
    type: "Обычный",
    smartHome: false,
    noise: "25 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/e29863ca-564d-11ef-b8d9-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 13700, oldPrice: 13988 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 14930, oldPrice: 15238 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 20560, oldPrice: 20988 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 37230, oldPrice: 37990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 48010, oldPrice: 48990 },
    ],
  },
  {
    id: 843,
    name: "ONE AIR OATI",
    brand: "ONE AIR",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/7d8cae47-8d8f-11f0-b8e0-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 18610, oldPrice: 18990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 19590, oldPrice: 19990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 21540, oldPrice: 21988 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 44090, oldPrice: 44990 },
      { btu: 24000, area: 65, cooling: "7.0 кВт", heating: "7.3 кВт", price: 55850, oldPrice: 56990 },
    ],
  },
  {
    id: 844,
    name: "RAPID RAM",
    brand: "RAPID",
    type: "Обычный",
    smartHome: false,
    noise: "25 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/abb88eac-e2b1-11ee-b8d6-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 12360, oldPrice: 12613 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 13700, oldPrice: 13988 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 19340, oldPrice: 19738 },
    ],
  },
  {
    id: 845,
    name: "RAPID RAMI",
    brand: "RAPID",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/a3a9c067-994f-11f0-b8e1-00505601218a/main_big.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 17630, oldPrice: 17990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 19100, oldPrice: 19490 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 20320, oldPrice: 20738 },
    ],
  },
  {
    id: 846,
    name: "AURUS D DC Inverter",
    brand: "AURUS",
    type: "Инверторный",
    smartHome: true,
    noise: "15 дБ",
    country: "КНР",
    image: "https://rkcdn.ru/products/939d0a6b-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    badge: "Гарантия 7 лет",
    variants: [
      { btu: 9000, area: 26, cooling: "2.6 кВт", heating: "3.2 кВт", price: 112700, oldPrice: 115000 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 122500, oldPrice: 125000 },
      { btu: 18000, area: 52, cooling: "5.3 кВт", heating: "5.8 кВт", price: 171500, oldPrice: 175000 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.8 кВт", price: 210700, oldPrice: 215000 },
    ],
  },
  {
    id: 847,
    name: "Axioma Серия F R32",
    brand: "Axioma",
    type: "Обычный",
    smartHome: false,
    noise: "23 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/e1c/s1d3l0r8cr4b6jjo8pdika7n8wgxp8xd/l7zeo3sfglb4hymp7a63xkj2wpei4m4r.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.1 кВт", price: 18610, oldPrice: 18990 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.5 кВт", price: 20660, oldPrice: 21090 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.4 кВт", price: 26450, oldPrice: 26990 },
      { btu: 18000, area: 50, cooling: "4.8 кВт", heating: "4.8 кВт", price: 42130, oldPrice: 42990 },
      { btu: 24000, area: 70, cooling: "6.8 кВт", heating: "6.8 кВт", price: 53890, oldPrice: 54990 },
    ],
  },
  {
    id: 848,
    name: "Axioma Серия F Инвертор R32",
    brand: "Axioma",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/dd6/1imp5g86l86iuzqj8p1k9g1lqpf84p2c/7xygyht1vt9twsadsrkn7owix2s8x0fw.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.05 кВт", heating: "2.35 кВт", price: 26450, oldPrice: 26990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 28410, oldPrice: 28990 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.4 кВт", price: 31350, oldPrice: 31990 },
      { btu: 18000, area: 50, cooling: "4.8 кВт", heating: "4.8 кВт", price: 54280, oldPrice: 55390 },
      { btu: 24000, area: 70, cooling: "6.8 кВт", heating: "7.0 кВт", price: 68590, oldPrice: 69990 },
    ],
  },
  {
    id: 849,
    name: "Daichi Айс 2 Инвертор",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/be2/2vlp8zzvhir9rwbj1dkvy4baw7xzed7v/sd8epmyc0czjbblkmyv9lrhhefp7exuj.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 28410, oldPrice: 28990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31350, oldPrice: 31990 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "3.5 кВт", price: 35270, oldPrice: 35990 },
      { btu: 18000, area: 50, cooling: "5.1 кВт", heating: "5.3 кВт", price: 58790, oldPrice: 59990 },
      { btu: 24000, area: 70, cooling: "6.2 кВт", heating: "6.5 кВт", price: 107390, oldPrice: 109590 },
    ],
  },
  {
    id: 850,
    name: "Daichi Миракл R32",
    brand: "Daichi",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/b79/yot70myx4tdiuon95zzhmdx1o4bu40k8/2f9npwq5u14p12vkykb3aue45yd8aour.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 25470, oldPrice: 25990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27920, oldPrice: 28490 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 34290, oldPrice: 34990 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.42 кВт", price: 69760, oldPrice: 71190 },
      { btu: 24000, area: 70, cooling: "7.33 кВт", heating: "7.62 кВт", price: 85440, oldPrice: 87190 },
    ],
  },
  {
    id: 851,
    name: "Daichi Миракл Инвертор",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/a6e/1uurigj71opqxjp7yy00lf8yerbekoza/763qermcbm5uxmgp30unfz266i51yt0i.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 34290, oldPrice: 34990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 38210, oldPrice: 38990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.7 кВт", price: 44090, oldPrice: 44990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 88190, oldPrice: 89990 },
      { btu: 24000, area: 70, cooling: "6.84 кВт", heating: "7.1 кВт", price: 132290, oldPrice: 134990 },
    ],
  },
  {
    id: 852,
    name: "Daichi Альпайн Инвертор",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/6d9/2jlnbdg639wa15tnyefxm26bmgy9ywfb/3eq3ztzu9wu0za9g8owg77dw5llyq91d.jpg",
    badge: "Премиум A+++",
    variants: [
      { btu: 7000, area: 20, cooling: "2.35 кВт", heating: "2.43 кВт", price: 40750, oldPrice: 41590 },
      { btu: 9000, area: 25, cooling: "2.65 кВт", heating: "2.85 кВт", price: 45070, oldPrice: 45990 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.75 кВт", price: 50950, oldPrice: 51990 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.6 кВт", price: 83290, oldPrice: 84990 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.4 кВт", price: 103870, oldPrice: 105990 },
    ],
  },
  {
    id: 853,
    name: "Daichi Сибериа Инвертор",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: true,
    noise: "20 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/288/b225irw1hbgje3dk2juz769bgfd9bapi/g9z241r74whuyceakbmrecid19k274oy.jpg",
    badge: "Тепловой насос -25°C",
    variants: [
      { btu: 9000, area: 25, cooling: "2.7 кВт", heating: "3.0 кВт", price: 63980, oldPrice: 65290 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 71530, oldPrice: 72990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.8 кВт", price: 113670, oldPrice: 115990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.5 кВт", price: 143070, oldPrice: 145990 },
    ],
  },
  {
    id: 854,
    name: "Daichi Эверест Инвертор",
    brand: "Daichi",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/7db/9345zuwtjj0x12p8i8h1hjc25p60kwx8/ffcceac8399e0f4dbb7c3f328a8e9963.jpg",
    badge: undefined,
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 34290, oldPrice: 34990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.7 кВт", price: 39190, oldPrice: 39990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.5 кВт", price: 73490, oldPrice: 74990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.2 кВт", price: 93090, oldPrice: 94990 },
    ],
  },
  {
    id: 855,
    name: "Primera Лаунж 2",
    brand: "Primera",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/98d/yrrt0e99q0u77wss43qsg9xt4uuqjf1a/i70sjl39mm3js4r252zlmdkxy0qi347j.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 17630, oldPrice: 17990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 19400, oldPrice: 19799 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 24490, oldPrice: 24990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 41150, oldPrice: 41990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.2 кВт", price: 52910, oldPrice: 53990 },
    ],
  },
  {
    id: 856,
    name: "Primera Лаунж Инвертор 2",
    brand: "Primera",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/492/gi6uuxg6sousfu2ogigxbb78z6x0wr3p/4w1305t3yl3kt7crxcn1girdoc3nhoi1.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.35 кВт", price: 24690, oldPrice: 25199 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 27430, oldPrice: 27990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 31350, oldPrice: 31990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.5 кВт", price: 53890, oldPrice: 54990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.2 кВт", price: 67610, oldPrice: 68990 },
    ],
  },
  {
    id: 857,
    name: "Primera Классик",
    brand: "Primera",
    type: "Обычный",
    smartHome: false,
    noise: "25 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/98d/yrrt0e99q0u77wss43qsg9xt4uuqjf1a/i70sjl39mm3js4r252zlmdkxy0qi347j.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 16650, oldPrice: 16990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 18610, oldPrice: 18990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 23510, oldPrice: 23990 },
    ],
  },
  {
    id: 858,
    name: "Midea Футура Инвертор",
    brand: "Midea",
    type: "Инверторный",
    smartHome: false,
    noise: "21 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/0a9/x7f17c8sj8ei8ototd0ge5lwucezdly8/0eebv7y1ywl56vq5335u7zzpr140cavt.jpg",
    badge: "Новинка",
    variants: [
      { btu: 7000, area: 20, cooling: "2.35 кВт", heating: "2.43 кВт", price: 29390, oldPrice: 29990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 32330, oldPrice: 32990 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 36250, oldPrice: 36990 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 62710, oldPrice: 63990 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.33 кВт", price: 81330, oldPrice: 82990 },
    ],
  },
  {
    id: 859,
    name: "Midea Форест",
    brand: "Midea",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/802/r76lm5kms1ksg6ia6i4e2sdes37o6rzq/u2evu5b1zizk5f1epp11nw3109a3p0bz.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 27430, oldPrice: 27990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 30370, oldPrice: 30990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 38210, oldPrice: 38990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 60750, oldPrice: 61990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.2 кВт", price: 77410, oldPrice: 78990 },
    ],
  },
  {
    id: 860,
    name: "Midea Оазис Плюс Super DC",
    brand: "Midea",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/836/eq9zm8srdkc989b07ze95disks4h5ke1/on89axltbpjjggdaak9h7m5zdg587etj.jpg",
    badge: "Тепловой насос -30°C",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "3.5 кВт", price: 97010, oldPrice: 98990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 112690, oldPrice: 114990 },
    ],
  },
  {
    id: 861,
    name: "Kentatsu Кумо Инвертор",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/405/ybovzzallea6a5ro8r0kenwyqk9s6gzi/cj008w8jg37almzlj51ycds3nickqmpp.jpg",
    badge: "Хит",
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 34290, oldPrice: 34990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 37230, oldPrice: 37990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 42130, oldPrice: 42990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.5 кВт", price: 70550, oldPrice: 71990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 88190, oldPrice: 89990 },
    ],
  },
  {
    id: 862,
    name: "Kentatsu Браво",
    brand: "Kentatsu",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/b5b/1hqfxn4ys0c4lmr2ywtsiy4tiolljdp8/8ce21f2559b35cfefb695a159a64a75f.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24490, oldPrice: 24990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 26940, oldPrice: 27490 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 34290, oldPrice: 34990 },
    ],
  },
  {
    id: 863,
    name: "Kentatsu Рио Инвертор",
    brand: "Kentatsu",
    type: "Инверторный",
    smartHome: false,
    noise: "22 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/6a5/lvc3s5zzn9lkt2w0dp80rz1klz99o833/5zmzzsbkyns0vccq040tffxxzfl4w7sb.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.3 кВт", price: 33310, oldPrice: 33990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.8 кВт", price: 36250, oldPrice: 36990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 41150, oldPrice: 41990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.5 кВт", price: 68590, oldPrice: 69990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 87210, oldPrice: 88990 },
    ],
  },
  {
    id: 864,
    name: "Bosch Climate 3000i Инвертор",
    brand: "Bosch",
    type: "Инверторный",
    smartHome: false,
    noise: "20 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/4a7/oiz3t120d0z43rf2hsciuldjayrxzsxw/ebc7f52c6f1eab116aa3591e43bba8d5.jpg",
    badge: "Bosch Немецкое качество",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.9 кВт", price: 48990, oldPrice: 49990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 55850, oldPrice: 56990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 88190, oldPrice: 89990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 117590, oldPrice: 119990 },
    ],
  },
  {
    id: 865,
    name: "Bosch Climate 8000i Инвертор",
    brand: "Bosch",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "Германия",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/d5e/y3yg6lpv4z50p0gd1gcovp5192deh7se/74e9e9a453eece99c3156ccb6a73714d.jpg",
    badge: "Премиум Стекло",
    variants: [
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "3.2 кВт", price: 117590, oldPrice: 119990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 137190, oldPrice: 139990 },
    ],
  },
  {
    id: 866,
    name: "Daikin FTXF-E Sensira",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: false,
    noise: "20 дБ",
    country: "Чехия",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/a39/devwxp5hq2y8agyxddq5cf80ocwvx3ps/2n0zsjxvf2gbvt0iilv0ap3fadj658su.jpg",
    badge: "Премиум Daikin",
    variants: [
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 118280, oldPrice: 120700 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.0 кВт", price: 136120, oldPrice: 138900 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "6.0 кВт", price: 194530, oldPrice: 198500 },
      { btu: 24000, area: 65, cooling: "6.0 кВт", heating: "6.4 кВт", price: 240100, oldPrice: 245000 },
    ],
  },
  {
    id: 867,
    name: "Daikin FTXJ Emura 3",
    brand: "Daikin",
    type: "Инверторный",
    smartHome: true,
    noise: "19 дБ",
    country: "Чехия",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/8e6/cs1pl0qf98lrmfmwhnv72usjedh0x6z8/e73201906a8558449947be23bc61cbec.jpg",
    badge: "Флагман Daikin",
    variants: [
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 234220, oldPrice: 239000 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 254500, oldPrice: 259700 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.0 кВт", price: 293020, oldPrice: 299000 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 381220, oldPrice: 389000 },
    ],
  },
  {
    id: 868,
    name: "Coolup Genius",
    brand: "Coolup",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/445/2minqt2kfszs13uj6unopmi2d6dl9elm/484729bd6wx5925sp0xk88pq6ojjid07.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 16650, oldPrice: 16990 },
      { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 18610, oldPrice: 18990 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 24490, oldPrice: 24990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 42130, oldPrice: 42990 },
      { btu: 24000, area: 70, cooling: "6.45 кВт", heating: "6.74 кВт", price: 55550, oldPrice: 56690 },
    ],
  },
  {
    id: 869,
    name: "Asita Асита",
    brand: "Asita",
    type: "Обычный",
    smartHome: false,
    noise: "24 дБ",
    country: "КНР",
    image: "/api/img-proxy?url=https://daichi.business/upload/iblock/430/8uila3azm8ut8crfh3znaief5aehvbvs/j2thpji7c8bhey6wbaoqbzsvq95i15yb.jpg",
    badge: undefined,
    variants: [
      { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 19590, oldPrice: 19990 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 21740, oldPrice: 22190 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 28410, oldPrice: 28990 },
      { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 46050, oldPrice: 46990 },
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 58790, oldPrice: 59990 },
    ],
  },
];

export const AREA_TO_BTU: Record<string, number> = {
  "20": 7000, "25": 9000, "35": 12000, "50": 18000,
  "60": 24000, "80": 30000, "100": 36000, "140": 48000, "180": 60000,
};

export function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}
// Автоматически генерирует описание и особенности модели по её данным
export function getDescription(item: Conditioner): { intro: string; features: string[] } {
  const isMobile = item.type === "Мобильный";
  const isInverter = item.type === "Инверторный";
  const isCassette = item.type === "Полупромышленный";

  let intro = "";
  if (isMobile) {
    intro = `${item.name} — мобильный кондиционер-моноблок ${item.brand}. Его можно перемещать между комнатами и сразу подключать к обычной розетке 220 В. Стационарный монтаж не требуется.`;
  } else if (isCassette) {
    intro = `${item.name} — полупромышленная кассетная сплит-система ${item.brand}. Идеально подходит для офисов, магазинов, кафе и просторных помещений. Равномерно распределяет воздух по всем направлениям благодаря потолочному расположению.`;
  } else if (isInverter) {
    intro = `${item.name} — инверторная сплит-система ${item.brand}. Плавно регулирует мощность, поддерживая ровную температуру без перепадов. Экономит до 40% электроэнергии, работает тихо и служит дольше обычных моделей.`;
  } else {
    intro = `${item.name} — надёжная сплит-система ${item.brand} для дома, квартиры и офиса. Простое и доступное решение для охлаждения и обогрева помещения с хорошим соотношением цена-качество.`;
  }

  const features: string[] = [];
  features.push(isMobile ? "Охлаждение без наружного блока" : "Режимы охлаждения и обогрева");
  if (isMobile) {
    features.push("Стационарный монтаж не требуется");
    features.push("Подключение к обычной розетке 220 В");
    features.push("Колёсики для перемещения между комнатами");
  } else if (isInverter) {
    features.push("Инверторный компрессор — экономия электроэнергии");
    features.push("Тихая работа без резких включений");
    features.push("Плавное поддержание температуры");
    features.push("Работа на обогрев при низких температурах");
  } else {
    features.push("Проверенная технология, доступная цена");
    features.push("Простое управление с пульта");
  }
  if (item.smartHome) {
    features.push("Управление со смартфона и через умный дом (Алиса, Маруся)");
  }
  if (isCassette) {
    features.push("Потолочный монтаж, равномерный обдув 360°");
    features.push("Для коммерческих и больших помещений");
  }
  features.push("Режимы: авто, осушение, вентиляция, сон");
  features.push("Многоступенчатая фильтрация воздуха");
  features.push("Ночной режим для комфортного сна");
  features.push("Авторестарт после отключения электричества");
  features.push(isMobile ? "Официальная гарантия производителя" : "Официальная гарантия и профессиональный монтаж");

  return { intro, features };
}

export const ITEMS_PER_PAGE = 12;

export default function CatalogConditioners() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация фильтров из URL search params или sessionStorage
  const initialPage = parseInt(searchParams.get("page") || sessionStorage.getItem("catalog_last_page") || "1", 10) || 1;
  const initialBrand = searchParams.get("brand") || "all";
  const initialArea = searchParams.get("area") || "all";
  const initialType = searchParams.get("type") || "all";
  const initialSmart = searchParams.get("smart") || "all";
  const initialSort = searchParams.get("sort") || "default";
  const initialSearch = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [area, setArea] = useState<string>(initialArea);
  const [type, setType] = useState<string>(initialType);
  const [smart, setSmart] = useState<string>(initialSmart);
  const [sort, setSort] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [orderServiceName, setOrderServiceName] = useState("Заказ кондиционера");
  const [orderCalcDetails, setOrderCalcDetails] = useState("");
  const compare = useCompare();

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(conditioners.map((c) => c.brand)))],
    []
  );

  const minPrice = (c: Conditioner) => Math.min(...c.variants.map((v) => v.price));

  const filtered = useMemo(() => {
    let result = conditioners.filter((c) => {
      const okSearch = search.trim() === "" || c.name.toLowerCase().includes(search.toLowerCase().trim()) || c.brand.toLowerCase().includes(search.toLowerCase().trim());
      const okBrand = brand === "all" || c.brand === brand;
      const okType = type === "all" || c.type === type;
      const okSmart = smart === "all" || (smart === "yes" ? c.smartHome : !c.smartHome);
      const okArea = area === "all" || c.variants.some((v) => v.btu === AREA_TO_BTU[area]);
      return okSearch && okBrand && okType && okSmart && okArea;
    });
    if (sort === "price-asc") result = [...result].sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "price-desc") result = [...result].sort((a, b) => minPrice(b) - minPrice(a));
    return result;
  }, [search, brand, area, type, smart, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Синхронизация фильтров и страницы в URL
  const updateUrlParams = (newPage: number, newBrand = brand, newArea = area, newType = type, newSmart = smart, newSort = sort, newSearch = search) => {
    const params: Record<string, string> = {};
    if (newPage > 1) params.page = String(newPage);
    if (newBrand !== "all") params.brand = newBrand;
    if (newArea !== "all") params.area = newArea;
    if (newType !== "all") params.type = newType;
    if (newSmart !== "all") params.smart = newSmart;
    if (newSort !== "default") params.sort = newSort;
    if (newSearch.trim() !== "") params.q = newSearch.trim();

    setSearchParams(params, { replace: true });
    sessionStorage.setItem("catalog_last_page", String(newPage));
  };

  const handleFilterChange = (setter: (val: string) => void, paramName: string, value: string) => {
    setter(value);
    setCurrentPage(1);
    const updated = {
      brand: paramName === "brand" ? value : brand,
      area: paramName === "area" ? value : area,
      type: paramName === "type" ? value : type,
      smart: paramName === "smart" ? value : smart,
      sort: paramName === "sort" ? value : sort,
      search: paramName === "search" ? value : search,
    };
    updateUrlParams(1, updated.brand, updated.area, updated.type, updated.smart, updated.sort, updated.search);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page);
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Возврат к последней просмотренной карточке:
  // - при POP (назад/вперёд) только подсвечиваем карточку и не скроллим страницу (скролл восстанавливает ScrollToTop);
  // - при обычном возврате в каталог по ссылке — плавно подводим к карточке;
  // - catalog_last_card_id не удаляем раньше времени, пока карточка реально не появилась в DOM;
  // - эффект зависит от актуальных данных каталога.
  const navigationType = useNavigationType();
  useEffect(() => {
    const targetCardId = sessionStorage.getItem("catalog_last_card_id");
    if (!targetCardId) return;

    const isPop = navigationType === "POP";
    let rafId = 0;
    let attempts = 0;
    let highlightTimer: number | undefined;
    let initialTimer: number | undefined;

    const tryFind = () => {
      const el = document.getElementById(`card-${targetCardId}`);
      if (el) {
        if (!isPop) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        el.classList.add("ring-4", "ring-[#ff6b35]", "ring-offset-4");
        highlightTimer = window.setTimeout(() => {
          el.classList.remove("ring-4", "ring-[#ff6b35]", "ring-offset-4");
        }, 2500);
        sessionStorage.removeItem("catalog_last_card_id");
      } else if (attempts++ < 60) {
        rafId = requestAnimationFrame(tryFind);
      }
    };

    initialTimer = window.setTimeout(tryFind, 80);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (highlightTimer) clearTimeout(highlightTimer);
    };
  }, [filtered, navigationType]);

  const visible = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safeCurrentPage]);

  const handleOrderCard = (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => {
    const variant = item.variants.find((v) => v.btu === btu) || item.variants[0];
    const isMobile = item.type === "Мобильный";
    const isInstallOnRequest = item.type === "Полупромышленный" || item.type === "Промышленный";
    const installPart = isMobile
      ? ""
      : isInstallOnRequest
        ? ", Монтаж: рассчитывается после осмотра объекта"
        : `, Монтаж (+18 000 ₽): ${withInstall ? "Да" : "Нет"}`;
    const details = `Модель: ${item.name} (${item.brand}), Мощность: ${btu} BTU (до ${variant.area} м²)${installPart}, Итоговая цена: ${formatRub(totalPrice)}`;

    setOrderServiceName(`Заказ кондиционера: ${item.name}`);
    setOrderCalcDetails(details);
    setBookingModalOpen(true);
  };

  const handleCardClick = (cardId: number) => {
    sessionStorage.setItem("catalog_last_card_id", String(cardId));
    sessionStorage.setItem("catalog_last_page", String(safeCurrentPage));
    if (window.scrollY > 0) {
      sessionStorage.setItem("catalog_scroll_pos", String(Math.round(window.scrollY)));
    }
  };

  const selectClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100";

  return (
    <section id="catalog" className="bg-slate-50 py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff6b35] sm:text-sm sm:tracking-[0.2em]">Каталог</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1a3a5c] sm:mt-4 sm:text-4xl lg:text-5xl">Каталог кондиционеров в Иркутске</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Выберите модель по названию, бренду или площади помещения. Стоимость стандартного монтажа под ключ можно отметить галочкой.</p>
        </div>

        <div className="mt-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(setSearch, "search", e.target.value)}
              placeholder="🔍 Быстрый поиск по названию или бренду..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold shadow-sm focus:outline-none focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 pr-10"
            />
            {search && (
              <button
                onClick={() => handleFilterChange(setSearch, "search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-[1.5rem] bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-5">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Бренд</span>
            <select value={brand} onChange={(e) => handleFilterChange(setBrand, "brand", e.target.value)} className={selectClass}>
              {brands.map((b) => (<option key={b} value={b}>{b === "all" ? "Все бренды" : b}</option>))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Площадь</span>
            <select value={area} onChange={(e) => handleFilterChange(setArea, "area", e.target.value)} className={selectClass}>
              <option value="all">Любая площадь</option>
              <option value="20">до 20 м²</option>
              <option value="25">до 25 м²</option>
              <option value="35">до 35 м²</option>
              <option value="50">до 50 м²</option>
              <option value="60">до 60 м²</option>
              <option value="80">до 80 м²</option>
              <option value="100">до 100 м²</option>
              <option value="140">до 140 м²</option>
              <option value="180">до 180 м²</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Тип</span>
            <select value={type} onChange={(e) => handleFilterChange(setType, "type", e.target.value)} className={selectClass}>
              <option value="all">Все типы</option>
              <option value="Инверторный">Инверторный</option>
              <option value="Обычный">Обычный</option>
              <option value="Полупромышленный">Полупромышленные (кассетные)</option>
              <option value="Мобильный">Мобильные кондиционеры</option>
              <option value="Промышленный">Промышленные (моноблоки)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Умный дом</span>
            <select value={smart} onChange={(e) => handleFilterChange(setSmart, "smart", e.target.value)} className={selectClass}>
              <option value="all">Не важно</option>
              <option value="yes">С умным домом</option>
              <option value="no">Без умного дома</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Сортировка</span>
            <select value={sort} onChange={(e) => handleFilterChange(setSort, "sort", e.target.value)} className={selectClass}>
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-slate-500">
          <div>Найдено моделей: <span className="text-slate-800 font-black">{filtered.length}</span></div>
          {filtered.length > 0 && (
            <div className="text-xs text-slate-400 font-semibold">
              Показаны {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} из {filtered.length}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] bg-white p-10 text-center text-slate-500 shadow-sm">
            По выбранным фильтрам ничего не найдено.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visible.map((c) => (
                <ConditionerCard
                  key={c.id + "-" + area}
                  item={c}
                  areaFilter={area}
                  onOrder={handleOrderCard}
                  isCompared={compare.isSelected(c.id)}
                  onToggleCompare={compare.toggle}
                  onCardNavigate={handleCardClick}
                />
              ))}
            </div>

            {/* Классическая нумерованная пагинация страниц */}
            <CatalogPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {compare.ids.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-slate-200 bg-white shadow-[0_-8px_30px_rgba(15,23,42,0.15)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff6b35] text-xs font-black text-white">{compare.ids.length}</span>
              <span className="text-sm font-black text-[#1a3a5c]">Выбрано для сравнения</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {compare.selected.map((c) => (
                <span key={c.id} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                  <span className="max-w-[10rem] truncate">{c.name}</span>
                  <button type="button" onClick={() => compare.toggle(c.id)} className="text-slate-400 transition hover:text-red-500" aria-label={`Убрать ${c.name} из сравнения`}>✕</button>
                </span>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={compare.clear} className="rounded-full px-4 py-2.5 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                Очистить
              </button>
              <Link to="/sravnenie" className="rounded-full bg-[#1a3a5c] px-6 py-2.5 text-xs font-black text-white transition hover:bg-[#122943]">
                Сравнить →
              </Link>
            </div>
          </div>
        </div>
      )}

      <QuickBookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        serviceName={orderServiceName}
        calcDetails={orderCalcDetails}
      />
    </section>
  );
}

/**
 * Компонент классической нумерованной постраничной навигации
 */
function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Пагинация каталога" className="mt-12 flex flex-col items-center justify-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Кнопка Назад */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-black transition sm:px-5 sm:py-3 sm:text-sm ${
            currentPage === 1
              ? "cursor-not-allowed bg-slate-100 text-slate-300"
              : "bg-white text-[#1a3a5c] shadow-sm ring-1 ring-slate-200 hover:bg-[#1a3a5c] hover:text-white active:scale-95"
          }`}
          aria-label="Предыдущая страница"
        >
          <span className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Назад</span>
        </button>

        {/* Номера страниц */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                …
              </span>
            );
          }
          const pageNum = Number(p);
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[2.5rem] h-10 sm:min-w-[3rem] sm:h-12 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center px-2 ${
                isActive
                  ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/30 scale-105 ring-2 ring-[#ff6b35]"
                  : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[#1a3a5c] active:scale-95"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Кнопка Вперед */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-xs font-black transition sm:px-5 sm:py-3 sm:text-sm ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-slate-100 text-slate-300"
              : "bg-white text-[#1a3a5c] shadow-sm ring-1 ring-slate-200 hover:bg-[#1a3a5c] hover:text-white active:scale-95"
          }`}
          aria-label="Следующая страница"
        >
          <span className="hidden sm:inline">Вперед</span>
          <span className="text-base leading-none">→</span>
        </button>
      </div>

      <div className="text-xs font-bold text-slate-500">
        Страница <span className="text-slate-800 font-black">{currentPage}</span> из <span className="text-slate-800 font-black">{totalPages}</span>
      </div>
    </nav>
  );
}

function ConditionerCard({
  item,
  areaFilter,
  onOrder,
  isCompared,
  onToggleCompare,
  onCardNavigate,
}: {
  item: Conditioner;
  areaFilter: string;
  onOrder: (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => void;
  isCompared: boolean;
  onToggleCompare: (id: number) => void;
  onCardNavigate?: (id: number) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBtu, setSelectedBtu] = useState(() => {
    if (areaFilter !== "all" && AREA_TO_BTU[areaFilter]) {
      const wanted = AREA_TO_BTU[areaFilter];
      if (item.variants.some((v) => v.btu === wanted)) return wanted;
    }
    return item.variants[0].btu;
  });
  const [withInstall, setWithInstall] = useState(false);
  const variant = item.variants.find((v) => v.btu === selectedBtu) ?? item.variants[0];
  const discount = variant.oldPrice ? variant.oldPrice - variant.price : 0;
  const isMobile = item.type === "Мобильный";
  const isInstallOnRequest = item.type === "Полупромышленный" || item.type === "Промышленный";
  const totalPrice = variant.price + (withInstall && !isMobile && !isInstallOnRequest ? INSTALL_PRICE : 0);

  const cardLink = `/kondicionery/${getModelUrlSlug(item)}`;

  return (
    <article
      id={`card-${item.id}`}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] transition-all"
    >
      <Link
        to={cardLink}
        onClick={() => onCardNavigate && onCardNavigate(item.id)}
        className="relative aspect-[4/3] overflow-hidden bg-slate-100 block group-hover:opacity-95 transition"
      >
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {item.badge && (<span className="rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white">{item.badge}</span>)}
          {discount > 0 && (<span className="rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white">−{formatRub(discount)}</span>)}
        </div>
        {item.smartHome && (<span className="absolute right-3 top-3 z-10 rounded-full bg-[#1a3a5c] px-3 py-1 text-xs font-black text-white">🎙️ Умный дом</span>)}
        {!imgError ? (
          <img src={getMainCoverPhoto(item)} alt={item.name} loading="lazy" onError={() => setImgError(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <div className="text-5xl">❄️</div>
            <div className="mt-2 text-xs font-semibold">Фото скоро</div>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">{item.brand}</div>
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-[#1a3a5c]">
            <input type="checkbox" checked={isCompared} onChange={() => onToggleCompare(item.id)} className="h-4 w-4 shrink-0 accent-[#ff6b35]" />
            Сравнить
          </label>
        </div>
        <Link
          to={cardLink}
          onClick={() => onCardNavigate && onCardNavigate(item.id)}
          className="block group-hover:text-[#ff6b35] transition"
        >
          <h3 className="mt-1 text-lg font-black text-[#1a3a5c] hover:text-[#ff6b35] transition">{item.name}</h3>
        </Link>
        <div className="mt-4">
          <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Мощность (BTU)</div>
          <div className="flex flex-wrap gap-2">
            {item.variants.map((v) => (
              <button key={v.btu} type="button" onClick={() => setSelectedBtu(v.btu)} className={`rounded-xl px-3 py-2 text-xs font-black transition ${selectedBtu === v.btu ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {v.btu.toLocaleString("ru-RU")}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Площадь</span><span className="font-bold text-slate-800">до {variant.area} м²</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Охлаждение</span><span className="font-bold text-slate-800">{variant.cooling}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Обогрев</span><span className="font-bold text-slate-800">{variant.heating}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Уровень шума</span><span className="font-bold text-slate-800">{item.noise}</span></li>
          <li className="flex items-center justify-between border-b border-slate-100 pb-2"><span>Тип</span><span className="font-bold text-slate-800">{item.type}</span></li>
          <li className="flex items-center justify-between"><span>Страна</span><span className="font-bold text-slate-800">{item.country}</span></li>
        </ul>
        {isMobile ? null : isInstallOnRequest ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
            Монтаж рассчитывается после осмотра объекта
          </div>
        ) : (
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
            <span className="text-sm font-bold text-slate-700">+ Стандартный монтаж<span className="block text-xs font-semibold text-slate-400">{formatRub(INSTALL_PRICE)}</span></span>
            <input type="checkbox" checked={withInstall} onChange={(e) => setWithInstall(e.target.checked)} className="h-5 w-5 shrink-0 accent-[#ff6b35]" />
          </label>
        )}
        <div className="mt-auto pt-5">
          <div className="flex items-end gap-2">
            <div className="text-2xl font-black text-[#1a3a5c]">{formatRub(totalPrice)}</div>
            {variant.oldPrice && !withInstall && (<div className="mb-1 text-sm font-bold text-slate-400 line-through">{formatRub(variant.oldPrice)}</div>)}
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {isInstallOnRequest ? "цена оборудования" : isMobile ? "цена кондиционера (монтаж не требуется)" : withInstall ? "кондиционер + монтаж" : "цена кондиционера"}
          </div>
          <Link
            to={cardLink}
            onClick={() => onCardNavigate && onCardNavigate(item.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1a3a5c] px-6 py-2.5 text-sm font-black text-[#1a3a5c] transition hover:bg-[#1a3a5c] hover:text-white"
          >
            Подробнее и фото
          </Link>
          <button
            type="button"
            onClick={() => onOrder(item, selectedBtu, withInstall, totalPrice)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            Заказать
          </button>
        </div>
      </div>
    </article>
  );
}
