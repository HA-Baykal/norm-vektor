import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import QuickBookingModal from "./QuickBookingModal";
import { getMainCoverPhoto, getModelUrlSlug } from "../data/officialSpecsEngine";

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
  type: "Инверторный" | "Обычный" | "Полупромышленный";
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
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 17351, oldPrice: 17888 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 18132, oldPrice: 18888 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 25812, oldPrice: 26888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 45012, oldPrice: 46888 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 60031, oldPrice: 61888 },
    { btu: 36000, area: 100, cooling: "10.5 кВт", heating: "11.0 кВт", price: 79270, oldPrice: 80888 },
  ] },
  { id: 202, name: "SHUFT TOR SFTM", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-tor.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 20578, oldPrice: 20998 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22789, oldPrice: 23988 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32230, oldPrice: 32888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 52429, oldPrice: 55188 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 68104, oldPrice: 71688 },
  ] },
  { id: 203, name: "SHUFT Soturai SFTH", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-soturai.jpg", badge: "Распродажа", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22694, oldPrice: 23888 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32230, oldPrice: 32888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 56894, oldPrice: 59888 },
  ] },
  { id: 204, name: "Ballu Olympio Pro BSO", brand: "Ballu", type: "Обычный", smartHome: false, noise: "23 дБ", country: "КНР", image: "images/catalog/ballu-olympio-pro.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 24451, oldPrice: 24950 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 25546, oldPrice: 26610 },
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
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 63926, oldPrice: 66590 },
  ] },
  { id: 209, name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-barocco.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24638, oldPrice: 25400 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 28028, oldPrice: 28600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37296, oldPrice: 38850 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 59993, oldPrice: 63150 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 78400, oldPrice: 80000 },
  ] },
  { id: 210, name: "Royal Thermo Siena RTS", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 22791, oldPrice: 23990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 25210, oldPrice: 25990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 33590, oldPrice: 34990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58849, oldPrice: 60050 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 74676, oldPrice: 76200 },
  ] },
  { id: 211, name: "Electrolux Skandi EACS-HSK/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-skandi.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25910, oldPrice: 26990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 29090, oldPrice: 29990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37991, oldPrice: 39990 },
  ] },
  { id: 212, name: "Electrolux Smartline EACS-HSM/N8", brand: "Electrolux", type: "Обычный", smartHome: true, noise: "26 дБ", country: "КНР", image: "images/catalog/electrolux-smartline.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 28410, oldPrice: 28990 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 30391, oldPrice: 31990 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 41411, oldPrice: 43590 },
    { btu: 18000, area: 52, cooling: "5.28 кВт", heating: "5.57 кВт", price: 67610, oldPrice: 68990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 83410, oldPrice: 85990 },
  ] },
  { id: 213, name: "Electrolux Fusion Wave EACS-HFW/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 30391, oldPrice: 31990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 34191, oldPrice: 35990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 47618, oldPrice: 48590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 75450, oldPrice: 76990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 91190, oldPrice: 94990 },
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
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 28409, oldPrice: 29288 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 33588, oldPrice: 34988 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 59474, oldPrice: 60688 },
  ] },
  { id: 304, name: "Ballu Tessey DC BSTI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "20 дБ", country: "КНР", image: "images/catalog/ballu-tessey-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 32097, oldPrice: 33090 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 33206, oldPrice: 34590 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 40790, oldPrice: 42490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 94168, oldPrice: 96090 },
  ] },
  { id: 305, name: "Ballu Odyssey DC BSOI", brand: "Ballu", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/ballu-odyssey.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31448, oldPrice: 32090 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 41031, oldPrice: 43190 },
  ] },
  { id: 308, name: "Ballu Platinum Evolution DC BSUI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/ballu-platinum-evo.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 47714, oldPrice: 49190 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 52336, oldPrice: 55090 },
  ] },
  { id: 311, name: "Royal Thermo Diamond DC RTDI Wi-Fi", brand: "Royal Thermo", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/royal-diamond.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 28322, oldPrice: 28900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 30210, oldPrice: 31800 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 36950, oldPrice: 38490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 87210, oldPrice: 88990 },
  ] },
  { id: 312, name: "Royal Thermo Siena DC RTSI", brand: "Royal Thermo", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 34105, oldPrice: 35900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 37620, oldPrice: 39600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 44329, oldPrice: 45700 },
  ] },
  { id: 314, name: "Electrolux Smartline DC EACS/I-HSM/N8", brand: "Electrolux", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/electrolux-smartline-inv.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 40730, oldPrice: 41990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 44090, oldPrice: 44990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 51538, oldPrice: 52590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 83591, oldPrice: 87990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 102591, oldPrice: 107990 },
  ] },
  { id: 315, name: "Electrolux Fusion Wave Super DC EACS/I-HFW/N8", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave-inv.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 48490, oldPrice: 49990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 51930, oldPrice: 52990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 59378, oldPrice: 60590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 91191, oldPrice: 95990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 114230, oldPrice: 118990 },
  ] },
  { id: 316, name: "Electrolux Onix Super DC Black", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-onix.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 60470, oldPrice: 62990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 67610, oldPrice: 68990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 102810, oldPrice: 105990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 126410, oldPrice: 128990 },
  ] },
  { id: 320, name: "Toshiba Seiya RAS-CVG", brand: "Toshiba", type: "Инверторный", smartHome: false, noise: "—", country: "Таиланд", image: "images/catalog/toshiba-seiya.jpg", badge: "Премиум", variants: [
    { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.2 кВт", price: 72105, oldPrice: 75900 },
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
    image: "images/catalog/kentatsu-ichi-inv.jpg",
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
    image: "images/catalog/midea-unlimited.jpg",
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
  const isInverter = item.type === "Инверторный";
  const isCassette = item.type === "Полупромышленный";

  let intro = "";
  if (isCassette) {
    intro = `${item.name} — полупромышленная кассетная сплит-система ${item.brand}. Идеально подходит для офисов, магазинов, кафе и просторных помещений. Равномерно распределяет воздух по всем направлениям благодаря потолочному расположению.`;
  } else if (isInverter) {
    intro = `${item.name} — инверторная сплит-система ${item.brand}. Плавно регулирует мощность, поддерживая ровную температуру без перепадов. Экономит до 40% электроэнергии, работает тихо и служит дольше обычных моделей.`;
  } else {
    intro = `${item.name} — надёжная сплит-система ${item.brand} для дома, квартиры и офиса. Простое и доступное решение для охлаждения и обогрева помещения с хорошим соотношением цена-качество.`;
  }

  const features: string[] = [];
  features.push("Режимы охлаждения и обогрева");
  if (isInverter) {
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
  features.push("Официальная гарантия и профессиональный монтаж");

  return { intro, features };
}

export default function CatalogConditioners() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [area, setArea] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [smart, setSmart] = useState<string>("all");
  const [sort, setSort] = useState<string>("default");
  const [visibleCount, setVisibleCount] = useState(9);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [orderServiceName, setOrderServiceName] = useState("Заказ кондиционера");
  const [orderCalcDetails, setOrderCalcDetails] = useState("");

  const resetCount = () => setVisibleCount(9);

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

  const visible = filtered.slice(0, visibleCount);

  const handleOrderCard = (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => {
    const variant = item.variants.find((v) => v.btu === btu) || item.variants[0];
    const details = `Модель: ${item.name} (${item.brand}), Мощность: ${btu} BTU (до ${variant.area} м²), Монтаж (+18 000 ₽): ${withInstall ? "Да" : "Нет"}, Итоговая цена: ${formatRub(totalPrice)}`;

    setOrderServiceName(`Заказ кондиционера: ${item.name}`);
    setOrderCalcDetails(details);
    setBookingModalOpen(true);
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
              onChange={(e) => { setSearch(e.target.value); resetCount(); }}
              placeholder="🔍 Быстрый поиск по названию или бренду..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold shadow-sm focus:outline-none focus:border-[#ff6b35] focus:ring-4 focus:ring-orange-100 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
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
            <select value={brand} onChange={(e) => { setBrand(e.target.value); resetCount(); }} className={selectClass}>
              {brands.map((b) => (<option key={b} value={b}>{b === "all" ? "Все бренды" : b}</option>))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Площадь</span>
            <select value={area} onChange={(e) => { setArea(e.target.value); resetCount(); }} className={selectClass}>
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
            <select value={type} onChange={(e) => { setType(e.target.value); resetCount(); }} className={selectClass}>
              <option value="all">Все типы</option>
              <option value="Инверторный">Инверторный</option>
              <option value="Обычный">Обычный</option>
              <option value="Полупромышленный">Полупромышленные (кассетные)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Умный дом</span>
            <select value={smart} onChange={(e) => { setSmart(e.target.value); resetCount(); }} className={selectClass}>
              <option value="all">Не важно</option>
              <option value="yes">С умным домом</option>
              <option value="no">Без умного дома</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Сортировка</span>
            <select value={sort} onChange={(e) => { setSort(e.target.value); resetCount(); }} className={selectClass}>
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </label>
        </div>
        <div className="mt-6 text-sm font-bold text-slate-500">Найдено моделей: {filtered.length}</div>
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
                />
              ))}
            </div>
            {visible.length < filtered.length && (
                <div className="mt-10 text-center">
                  <button
                      type="button"
                      onClick={() => setVisibleCount((n) => n + 6)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1a3a5c] px-8 py-4 text-sm font-black text-white transition hover:bg-[#122943]"
                  >
                    Показать ещё
                  </button>
                </div>
            )}
          </>
        )}
      </div>

      <QuickBookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        serviceName={orderServiceName}
        calcDetails={orderCalcDetails}
      />
    </section>
  );
}

function ConditionerCard({
  item,
  areaFilter,
  onOrder,
}: {
  item: Conditioner;
  areaFilter: string;
  onOrder: (item: Conditioner, btu: number, withInstall: boolean, totalPrice: number) => void;
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
  const isCassette = item.type === "Полупромышленный";
  const totalPrice = variant.price + (withInstall && !isCassette ? INSTALL_PRICE : 0);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem]">
      <Link to={`/kondicionery/${getModelUrlSlug(item)}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100 block group-hover:opacity-95 transition">
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
        <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">{item.brand}</div>
        <Link to={`/kondicionery/${getModelUrlSlug(item)}`} className="block group-hover:text-[#ff6b35] transition">
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
        {isCassette ? (
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
            {isCassette ? "цена оборудования" : withInstall ? "кондиционер + монтаж" : "цена кондиционера"}
          </div>
          <Link
            to={`/kondicionery/${getModelUrlSlug(item)}`}
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

      {/* Модальное окно с полным описанием */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[2rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка модалки */}
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-6 sm:p-8">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">{item.brand}</div>
                <h3 className="mt-1 text-xl font-black text-[#1a3a5c] sm:text-2xl">{item.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Описание */}
              <p className="text-sm leading-7 text-slate-600 sm:text-base">{getDescription(item).intro}</p>

              {/* Выбор мощности */}
              <div className="mt-6">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Выберите мощность</div>
                <div className="flex flex-wrap gap-2">
                  {item.variants.map((v) => (
                    <button
                      key={v.btu}
                      type="button"
                      onClick={() => setSelectedBtu(v.btu)}
                      className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                        selectedBtu === v.btu ? "bg-[#1a3a5c] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {v.btu.toLocaleString("ru-RU")} BTU
                    </button>
                  ))}
                </div>
              </div>

              {/* Характеристики */}
              <div className="mt-6">
                <div className="mb-3 text-sm font-black text-[#1a3a5c]">Характеристики</div>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Площадь помещения</span><span className="font-black text-slate-800">до {variant.area} м²</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Мощность охлаждения</span><span className="font-black text-slate-800">{variant.cooling}</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Мощность обогрева</span><span className="font-black text-slate-800">{variant.heating}</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Мощность</span><span className="font-black text-slate-800">{selectedBtu.toLocaleString("ru-RU")} BTU</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Уровень шума</span><span className="font-black text-slate-800">{item.noise}</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Тип</span><span className="font-black text-slate-800">{item.type}</span></li>
                  <li className="flex justify-between border-b border-slate-100 pb-2.5"><span className="text-slate-500">Умный дом</span><span className="font-black text-slate-800">{item.smartHome ? "Да" : "Нет"}</span></li>
                  <li className="flex justify-between"><span className="text-slate-500">Страна производства</span><span className="font-black text-slate-800">{item.country}</span></li>
                </ul>
              </div>

              {/* Возможности */}
              <div className="mt-6">
                <div className="mb-3 text-sm font-black text-[#1a3a5c]">Возможности и функции</div>
                <ul className="space-y-2">
                  {getDescription(item).features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-1 text-[#ff6b35]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Цена + кнопка */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-black text-[#1a3a5c]">{formatRub(variant.price)}</div>
                  {variant.oldPrice && (<div className="mb-1 text-sm font-bold text-slate-400 line-through">{formatRub(variant.oldPrice)}</div>)}
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  {isCassette ? "цена оборудования (монтаж после осмотра)" : "цена кондиционера (без монтажа)"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setModalOpen(false); onOrder(item, selectedBtu, withInstall, totalPrice); }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-4 text-sm font-black text-white transition hover:bg-[#e95620]"
              >
                Заказать эту модель
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
