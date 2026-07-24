import { useMemo, useState } from "react";
import QuickBookingModal from "./QuickBookingModal";

const INSTALL_PRICE = 18000;
type PowerVariant = {
  btu: number;
  area: number;
  cooling: string;
  heating: string;
  price: number;
  oldPrice?: number;
};
type Conditioner = {
  id: number;
  name: string;
  brand: string;
  type: "Инверторный" | "Обычный" | "Полупромышленный";
  smartHome: boolean;
  noise: string;
  country: string;
  image: string;
  badge?: string;
  variants: PowerVariant[];
};

const conditioners: Conditioner[] = [
  { id: 201, name: "SHUFT Berg SFTO", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-berg.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 16636, oldPrice: 17888 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 17566, oldPrice: 18888 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 25006, oldPrice: 26888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 43606, oldPrice: 46888 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 57556, oldPrice: 61888 },
    { btu: 36000, area: 100, cooling: "10.5 кВт", heating: "11.0 кВт", price: 75226, oldPrice: 80888 },
  ] },
  { id: 202, name: "SHUFT TOR SFTM", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-tor.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 19528, oldPrice: 20998 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22309, oldPrice: 23988 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 30586, oldPrice: 32888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 51325, oldPrice: 55188 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 66670, oldPrice: 71688 },
  ] },
  { id: 203, name: "SHUFT Soturai SFTH", brand: "SHUFT", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-soturai.jpg", badge: "Распродажа", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 22216, oldPrice: 23888 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 30586, oldPrice: 32888 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 56894, oldPrice: 59888 },
  ] },
  { id: 204, name: "Ballu Olympio Pro BSO", brand: "Ballu", type: "Обычный", smartHome: false, noise: "23 дБ", country: "КНР", image: "images/catalog/ballu-olympio-pro.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 23204, oldPrice: 24950 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 24747, oldPrice: 26610 },
  ] },
  { id: 205, name: "Ballu Olympio Edge BSO", brand: "Ballu", type: "Обычный", smartHome: false, noise: "23 дБ", country: "КНР", image: "images/catalog/ballu-olympio-edge.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24822, oldPrice: 26690 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 26403, oldPrice: 28390 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 36354, oldPrice: 39090 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 61929, oldPrice: 66590 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 77553, oldPrice: 83390 },
  ] },
  { id: 207, name: "Ballu Tessey BST", brand: "Ballu", type: "Обычный", smartHome: false, noise: "20 дБ", country: "КНР", image: "images/catalog/ballu-tessey.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 24822, oldPrice: 26690 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 36354, oldPrice: 39090 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 61929, oldPrice: 66590 },
  ] },
  { id: 209, name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-barocco.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 23622, oldPrice: 25400 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 26598, oldPrice: 28600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 36131, oldPrice: 38850 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 58730, oldPrice: 63150 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 74400, oldPrice: 80000 },
  ] },
  { id: 210, name: "Royal Thermo Siena RTS", brand: "Royal Thermo", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 23990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 25990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32541, oldPrice: 34990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 55847, oldPrice: 60050 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 70866, oldPrice: 76200 },
  ] },
  { id: 211, name: "Electrolux Skandi EACS-HSK/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-skandi.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25101, oldPrice: 26990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27891, oldPrice: 29990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 37191, oldPrice: 39990 },
  ] },
  { id: 212, name: "Electrolux Smartline EACS-HSM/N8", brand: "Electrolux", type: "Обычный", smartHome: true, noise: "26 дБ", country: "КНР", image: "images/catalog/electrolux-smartline.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 23, cooling: "2.34 кВт", heating: "2.34 кВт", price: 26961, oldPrice: 28990 },
    { btu: 9000, area: 26, cooling: "2.64 кВт", heating: "2.78 кВт", price: 29751, oldPrice: 31990 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 40539, oldPrice: 43590 },
    { btu: 18000, area: 52, cooling: "5.28 кВт", heating: "5.57 кВт", price: 64161, oldPrice: 68990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 79971, oldPrice: 85990 },
  ] },
  { id: 213, name: "Electrolux Fusion Wave EACS-HFW/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 29751, oldPrice: 31990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 33471, oldPrice: 35990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 45189, oldPrice: 48590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 71601, oldPrice: 76990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 88341, oldPrice: 94990 },
  ] },
  { id: 216, name: "Electrolux Nordic EACS-HT/N3", brand: "Electrolux", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-nordic.jpg", variants: [
    { btu: 30000, area: 80, cooling: "8.8 кВт", heating: "9.2 кВт", price: 103221, oldPrice: 110990 },
  ] },
  { id: 102, name: "Kentatsu Кумо KSGKU-HFRN1", brand: "Kentatsu", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/kentatsu-kumo.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 25890, oldPrice: 27090 },
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 28590, oldPrice: 29690 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.72 кВт", price: 36890, oldPrice: 37990 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.57 кВт", price: 63640, oldPrice: 64690 },
  ] },
  { id: 107, name: "Kentatsu Канами R32 KSGA-HFRN1", brand: "Kentatsu", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/kentatsu-kanami.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 25090, oldPrice: 26090 },
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 27390, oldPrice: 28390 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.56 кВт", price: 61090, oldPrice: 62190 },
  ] },
  { id: 109, name: "Midea Парамаунт R32 MSAG1", brand: "Midea", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/midea-paramount.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.34 кВт", heating: "2.34 кВт", price: 27890, oldPrice: 28990 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 39790, oldPrice: 40790 },
    { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.56 кВт", price: 67890, oldPrice: 68990 },
  ] },
  { id: 108, name: "Daichi Эверест R32 DA-EVQ1R", brand: "Daichi", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/daichi-everest.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.49 кВт", heating: "2.65 кВт", price: 24140, oldPrice: 24990 },
    { btu: 12000, area: 35, cooling: "3.23 кВт", heating: "3.52 кВт", price: 34290, oldPrice: 35290 },
  ] },
  { id: 106, name: "Axioma Серия H R32 ASX-H1R", brand: "Axioma", type: "Обычный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/axioma-h.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.05 кВт", heating: "2.2 кВт", price: 19690, oldPrice: 20790 },
    { btu: 9000, area: 25, cooling: "2.49 кВт", heating: "2.65 кВт", price: 21790, oldPrice: 22890 },
    { btu: 12000, area: 35, cooling: "3.23 кВт", heating: "3.52 кВт", price: 30090, oldPrice: 31190 },
    { btu: 18000, area: 50, cooling: "4.99 кВт", heating: "5.13 кВт", price: 50390, oldPrice: 51490 },
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
      { btu: 7000, area: 20, cooling: "2.2 кВт", heating: "2.29 кВт", price: 30090 },
      { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.78 кВт", price: 31890 },
      { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 35090 },
      { btu: 18000, area: 50, cooling: "5.28 кВт", heating: "5.42 кВт", price: 60890 },
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.18 кВт", price: 77990 },
    ],
  },

  { id: 301, name: "SHUFT Berg DC SFTOI", brand: "SHUFT", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/shuft-berg-inv.jpg", badge: "Новинка", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 25471, oldPrice: 27388 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 27238, oldPrice: 29288 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 32539, oldPrice: 34988 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 56440, oldPrice: 60688 },
  ] },
  { id: 304, name: "Ballu Tessey DC BSTI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "20 дБ", country: "КНР", image: "images/catalog/ballu-tessey-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 30774, oldPrice: 33090 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 32169, oldPrice: 34590 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 39516, oldPrice: 42490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 89364, oldPrice: 96090 },
  ] },
  { id: 305, name: "Ballu Odyssey DC BSOI", brand: "Ballu", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/ballu-odyssey.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 29844, oldPrice: 32090 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 40167, oldPrice: 43190 },
  ] },
  { id: 308, name: "Ballu Platinum Evolution DC BSUI", brand: "Ballu", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/ballu-platinum-evo.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 45747, oldPrice: 49190 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 51234, oldPrice: 55090 },
  ] },
  { id: 311, name: "Royal Thermo Diamond DC RTDI Wi-Fi", brand: "Royal Thermo", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/royal-diamond.jpg", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 28900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 31800 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 38490 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 82761, oldPrice: 88990 },
  ] },
  { id: 312, name: "Royal Thermo Siena DC RTSI", brand: "Royal Thermo", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/royal-siena-inv.jpg", badge: "Хит", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 33387, oldPrice: 35900 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 36828, oldPrice: 39600 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 42501, oldPrice: 45700 },
  ] },
  { id: 314, name: "Electrolux Smartline DC EACS/I-HSM/N8", brand: "Electrolux", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/electrolux-smartline-inv.jpg", badge: "Умный дом", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 39051, oldPrice: 41990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 41841, oldPrice: 44990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 48909, oldPrice: 52590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 81831, oldPrice: 87990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 100431, oldPrice: 107990 },
  ] },
  { id: 315, name: "Electrolux Fusion Wave Super DC EACS/I-HFW/N8", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-fusion-wave-inv.jpg", badge: "Лучший", variants: [
    { btu: 7000, area: 20, cooling: "2.1 кВт", heating: "2.2 кВт", price: 46491, oldPrice: 49990 },
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 49281, oldPrice: 52990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 56349, oldPrice: 60590 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 89271, oldPrice: 95990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 110661, oldPrice: 118990 },
  ] },
  { id: 316, name: "Electrolux Onix Super DC Black", brand: "Electrolux", type: "Инверторный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/electrolux-onix.jpg", badge: "Лучший", variants: [
    { btu: 9000, area: 25, cooling: "2.6 кВт", heating: "2.7 кВт", price: 58581, oldPrice: 62990 },
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.6 кВт", price: 64161, oldPrice: 68990 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.4 кВт", price: 98571, oldPrice: 105990 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.3 кВт", price: 119961, oldPrice: 128990 },
  ] },
  { id: 320, name: "Toshiba Seiya RAS-CVG", brand: "Toshiba", type: "Инверторный", smartHome: false, noise: "—", country: "Таиланд", image: "images/catalog/toshiba-seiya.jpg", badge: "Премиум", variants: [
    { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.2 кВт", price: 75900 },
  ] },
  { id: 105, name: "Kentatsu Канами Инвертор Wi-Fi", brand: "Kentatsu", type: "Инверторный", smartHome: true, noise: "—", country: "КНР", image: "images/catalog/kentatsu-kanami-wifi.jpg", variants: [
    { btu: 9000, area: 25, cooling: "2.64 кВт", heating: "2.93 кВт", price: 39140, oldPrice: 39890 },
    { btu: 12000, area: 35, cooling: "3.52 кВт", heating: "3.66 кВт", price: 43590, oldPrice: 44790 },
  ] },
  { id: 401, name: "Ballu Machine BLC_C кассетная", brand: "Ballu", type: "Полупромышленный", smartHome: false, noise: "—", country: "КНР", image: "images/catalog/ballu-machine-cassette.jpg", badge: "Хит", variants: [
    { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "3.8 кВт", price: 64728, oldPrice: 69600 },
    { btu: 18000, area: 50, cooling: "5.3 кВт", heating: "5.6 кВт", price: 70494, oldPrice: 75800 },
    { btu: 24000, area: 60, cooling: "7.0 кВт", heating: "7.5 кВт", price: 92628, oldPrice: 99600 },
    { btu: 36000, area: 100, cooling: "10.5 кВт", heating: "11.2 кВт", price: 123504, oldPrice: 132800 },
    { btu: 48000, area: 140, cooling: "14.0 кВт", heating: "15.0 кВт", price: 151962, oldPrice: 163400 },
    { btu: 60000, area: 180, cooling: "17.5 кВт", heating: "18.5 кВт", price: 159867, oldPrice: 171900 },
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
      { btu: 9000, area: 26, cooling: "2.6 кВт", heating: "3.2 кВт", price: 120000 },
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.2 кВт", price: 130000 },
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
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.4 кВт", price: 79800 },
      { btu: 12000, area: 40, cooling: "4.2 кВт", heating: "4.6 кВт", price: 216490 },
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
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.4 кВт", price: 119700 },
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
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 101100 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 103500 },
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
      { btu: 9000, area: 25, cooling: "2.65 кВт", heating: "2.8 кВт", price: 48600 },
      { btu: 18000, area: 50, cooling: "5.25 кВт", heating: "5.55 кВт", price: 75800 },
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
      { btu: 12000, area: 35, cooling: "3.5 кВт", heating: "4.0 кВт", price: 205050 },
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
      { btu: 12000, area: 42, cooling: "4.2 кВт", heating: "5.4 кВт", price: 302700 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 332800 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 378900 },
      { btu: 24000, area: 70, cooling: "7.1 кВт", heating: "8.2 кВт", price: 395600 },
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
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 228900 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 229300 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "4.0 кВт", price: 302300 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 406300 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 429400 },
      { btu: 24000, area: 70, cooling: "7.1 кВт", heating: "8.2 кВт", price: 482000 },
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
      { btu: 7000, area: 20, cooling: "2.0 кВт", heating: "2.5 кВт", price: 305000 },
      { btu: 9000, area: 25, cooling: "2.5 кВт", heating: "2.8 кВт", price: 331200 },
      { btu: 12000, area: 35, cooling: "3.4 кВт", heating: "4.0 кВт", price: 400400 },
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 516400 },
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
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 416986 },
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
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.5 кВт", price: 129190 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 168690 },
      { btu: 48000, area: 130, cooling: "13.14 кВт", heating: "13.5 кВт", price: 201490 },
      { btu: 60000, area: 160, cooling: "16.12 кВт", heating: "16.5 кВт", price: 223290 },
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
      { btu: 24000, area: 70, cooling: "7.0 кВт", heating: "7.3 кВт", price: 85990 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 114090 },
      { btu: 48000, area: 140, cooling: "14.1 кВт", heating: "14.5 кВт", price: 142290 },
      { btu: 60000, area: 176, cooling: "16.12 кВт", heating: "16.5 кВт", price: 148290 },
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
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.5 кВт", price: 124239 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 176790 },
      { btu: 48000, area: 140, cooling: "14.07 кВт", heating: "14.5 кВт", price: 210990 },
      { btu: 60000, area: 155, cooling: "15.24 кВт", heating: "15.7 кВт", price: 233890 },
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
      { btu: 24000, area: 70, cooling: "7.03 кВт", heating: "7.3 кВт", price: 90290 },
      { btu: 36000, area: 105, cooling: "10.55 кВт", heating: "11.0 кВт", price: 119790 },
      { btu: 48000, area: 140, cooling: "14.07 кВт", heating: "14.5 кВт", price: 149390 },
      { btu: 60000, area: 160, cooling: "16.12 кВт", heating: "16.5 кВт", price: 155690 },
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
      { btu: 18000, area: 50, cooling: "5.0 кВт", heating: "5.8 кВт", price: 360300 },
      { btu: 24000, area: 60, cooling: "6.0 кВт", heating: "7.0 кВт", price: 381800 },
    ],
  },
];

const AREA_TO_BTU: Record<string, number> = {
  "20": 7000, "25": 9000, "35": 12000, "50": 18000,
  "60": 24000, "80": 30000, "100": 36000, "140": 48000, "180": 60000,
};

function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
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
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {item.badge && (<span className="rounded-full bg-[#ff6b35] px-3 py-1 text-xs font-black text-white">{item.badge}</span>)}
          {discount > 0 && (<span className="rounded-full bg-green-600 px-3 py-1 text-xs font-black text-white">−{formatRub(discount)}</span>)}
        </div>
        {item.smartHome && (<span className="absolute right-3 top-3 z-10 rounded-full bg-[#1a3a5c] px-3 py-1 text-xs font-black text-white">🎙️ Умный дом</span>)}
        {!imgError ? (
          <img src={item.image} alt={item.name} loading="lazy" onError={() => setImgError(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <div className="text-5xl">❄️</div>
            <div className="mt-2 text-xs font-semibold">Фото скоро</div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="text-xs font-black uppercase tracking-wider text-[#ff6b35]">{item.brand}</div>
        <h3 className="mt-1 text-lg font-black text-[#1a3a5c]">{item.name}</h3>
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
          <button
            type="button"
            onClick={() => onOrder(item, selectedBtu, withInstall, totalPrice)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 py-3 text-sm font-black text-white transition hover:bg-[#e95620]"
          >
            Заказать
          </button>
        </div>
      </div>
    </article>
  );
}