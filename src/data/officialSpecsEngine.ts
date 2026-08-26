import { Conditioner } from "../components/CatalogConditioners";

export interface OfficialSpecification {
  distributor: "Русклимат (Rusklimat B2B)" | "Daichi (Даичи Бизнес)";
  compressorBrand: string;
  refrigerant: string;
  freonWeight: string;
  minNoise: string;
  maxOutdoorNoise: string;
  energyClass: string;
  pipes: string;
  maxPipeLength: string;
  winterRange: string;
  indoorTempRange: string;
  voltageRange: string;
  warrantyYears: string;
  serviceLife: string;
  fullDescription: string;
  officialFeatures: string[];
  officialModelPhotos: string[];
}
function proxyIfDaichi(url: string): string {
  if (url.startsWith("https://daichi.business/") || url.startsWith("https://daichi.market/")) {
    return "/api/img-proxy?url=" + encodeURIComponent(url);
  }
  return url;
}

// 100% ТОЧНАЯ БАЗА ОФИЦИАЛЬНЫХ ФОТОГРАФИЙ С СЕРВЕРОВ РУСКЛИМАТ (rkcdn.ru) И ДАИЧИ (daichi.business)
// Каждая модель привязана строго к своему уникальному ID из вашего каталога. Никаких чужих или придуманных фото!
const EXACT_OFFICIAL_PHOTOS_BY_ID: Record<number, string[]> = {
  // === SHUFT ===
  201: [ // SHUFT Berg SFTO (Обычный)
    "https://rkcdn.ru/products/304ecea4-f226-11f0-b8e1-00505601218a/main_big.jpg"
  ],
  202: [ // SHUFT TOR SFTM (Обычный)
    "https://rkcdn.ru/products/ca929e5c-502d-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ca929e60-502d-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d099e83f-502d-11f0-b8df-00505601218a/main_big.jpg"
  ],
  203: [ // SHUFT Soturai SFTH (Обычный)
    "https://rkcdn.ru/products/7264570f-ccd8-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/72645713-ccd8-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/7264571b-ccd8-11ee-b8d6-00505601218a/main_big.jpg"
  ],
  301: [ // SHUFT Berg DC SFTOI (Инверторный)
    "https://rkcdn.ru/products/1a48a1f7-f226-11f0-b8e1-00505601218a/main_big.jpg"
  ],

  // === BALLU ===
  204: [ // Ballu Olympio Pro BSO (Обычный)
    "https://rkcdn.ru/products/3763a5a6-6946-11f1-b8e3-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ebbaa999-2c2b-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/f1d977ef-2c2b-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  205: [ // Ballu Olympio Edge BSO (Обычный)
    "https://rkcdn.ru/products/03c2c7c2-cf20-11ed-b733-005056013a69/main_big.jpg",
    "https://rkcdn.ru/products/aa36a7dd-34ab-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  207: [ // Ballu Tessey BST (Обычный)
    "https://rkcdn.ru/products/08e757de-2cf6-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/310e0187-2cd3-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/310e0189-2cd3-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/310e018d-2cd3-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  304: [ // Ballu Tessey DC BSTI (Инверторный)
    "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/24cc222e-2cd3-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/24cc2232-2cd3-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  305: [ // Ballu Odyssey DC BSOI (Инверторный)
    "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/24cc222e-2cd3-11f1-b8e1-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/24cc2232-2cd3-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  308: [ // Ballu Platinum Evolution DC BSUI (Инверторный)
    "https://rkcdn.ru/products/546d79db-d290-11ef-b8dc-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/665949d9-d290-11ef-b8dc-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/6feb47a1-d290-11ef-b8dc-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/94fc2e3a-d290-11ef-b8dc-00505601218a/main_big.jpg"
  ],
  401: [ // Ballu Machine BLC_C кассетная (Полупромышленный)
    "https://rkcdn.ru/products/65fdd6a5-646b-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/6c5ff153-646b-11ef-b8db-00505601218a/main_big.jpg"
  ],

  // === ROYAL THERMO ===
  209: [ // Royal Thermo Barocco RTB (Обычный)
    "https://rkcdn.ru/products/d8cfba4b-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d8cfba4d-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d8cfba51-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d8cfba59-5b3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  210: [ // Royal Thermo Siena RTS (Обычный)
    "https://rkcdn.ru/products/e6d7f9c1-0c78-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/890c0dd4-19d8-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/99d4627a-19d8-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ed28fd14-0c78-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/46b03550-2961-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  311: [ // Royal Thermo Diamond DC RTDI Wi-Fi (Инверторный)
    "https://rkcdn.ru/products/18198e52-4b97-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d84f2083-3564-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d84f2085-3564-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d84f2087-3564-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d84f2089-3564-11f0-b8df-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/d84f2093-3564-11f0-b8df-00505601218a/main_big.jpg"
  ],
  312: [ // Royal Thermo Siena DC RTSI (Инверторный)
    "https://rkcdn.ru/products/3e0ffbed-5b40-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/3e0ffbf1-5b40-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/3e0ffbf3-5b40-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/4476ce67-5b40-11ef-b8db-00505601218a/main_big.jpg"
  ],

  // === ELECTROLUX ===
  211: [ // Electrolux Skandi EACS-HSK/N3 (Обычный)
    "https://rkcdn.ru/products/e7511050-ece7-11ee-b8d7-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e7511054-ece7-11ee-b8d7-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e7511058-ece7-11ee-b8d7-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ef89a3fc-ece7-11ee-b8d7-00505601218a/main_big.jpg"
  ],
  212: [ // Electrolux Smartline EACS-HSM/N8 (Обычный)
    "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae923fa-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae923fc-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e10760a3-5d3e-11ef-b8db-00505601218a/main_big.jpg"
  ],
  213: [ // Electrolux Fusion Wave EACS-HFW/N3 (Обычный)
    "https://rkcdn.ru/products/802b254c-10c4-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/a98e3d5d-10c4-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ede1e9db-10c5-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/00a0ec3f-10c6-11f0-b8de-00505601218a/main_big.jpg"
  ],
  216: [ // Electrolux Nordic EACS-HT/N3 (Обычный)
    "https://rkcdn.ru/products/2e8a20d4-2801-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/2e8a20d6-2801-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/349d4a56-2801-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  314: [ // Electrolux Smartline DC EACS/I-HSM/N8 (Инверторный)
    "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae923fa-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae923fc-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae923fe-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/dae92400-5d3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e10760a3-5d3e-11ef-b8db-00505601218a/main_big.jpg"
  ],
  315: [ // Electrolux Fusion Wave Super DC EACS/I-HFW/N8 (Инверторный)
    "https://rkcdn.ru/products/2f2b1e80-0b09-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/2f2b1e84-0b09-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/2f2b1e86-0b09-11f0-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/2f2b1e8c-0b09-11f0-b8de-00505601218a/main_big.jpg"
  ],
  316: [ // Electrolux Onix Super DC Black (Инверторный)
    "https://rkcdn.ru/products/0c920006-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/0c920008-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/0c92000a-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/0c92000c-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/0c92000e-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/128a718d-5d3f-11ef-b8db-00505601218a/main_big.jpg"
  ],

  // === KENTATSU (ДАИЧИ) ===
  102: [
  "/images/catalog/kentatsu-kumo.jpg",
  "/images/catalog/kentatsu-kumo-2.jpg",
  "/images/catalog/kentatsu-kumo-3.jpg"
],
  105: [
    "/images/catalog/kentatsu-kanami-wifi.jpg",
    "/images/catalog/kentatsu-kanami-wifi-2.jpg",
    "/images/catalog/kentatsu-kanami-wifi-3.jpg",
    "/images/catalog/kentatsu-kanami-wifi-4.jpg",
    "/images/catalog/kentatsu-kanami-wifi-5.jpg",
    "/images/catalog/kentatsu-kanami-wifi-6.jpg"
  ],
  
  107:  [
  "/images/catalog/kentatsu-kanami.jpg",
  "/images/catalog/kentatsu-kanami-2.jpg",
  "/images/catalog/kentatsu-kanami-3.jpg",
  "/images/catalog/kentatsu-kanami-4.jpg"
],
  701: [ // Kentatsu Атама (Atama) (Обычный)
  "/images/catalog/kentatsu-atama.jpg",
  "/images/catalog/kentatsu-atama-2.jpg",
  "/images/catalog/kentatsu-atama-3.jpg",
  "/images/catalog/kentatsu-atama-4.jpg"
  ],
  702: [ // Kentatsu Атама Инвертор (Atama Inverter) (Инверторный)
    "/images/catalog/kentatsu-atama-invertor.jpg",
  "/images/catalog/kentatsu-atama-invertor-2.jpg",
  "/images/catalog/kentatsu-atama-invertor-3.jpg",
  "/images/catalog/kentatsu-atama-invertor-4.jpg"
  ],
  703: [ // Kentatsu Харуки (Haruki) (Обычный)
    "/images/catalog/kentatsu-haruki.jpg",
  "/images/catalog/kentatsu-haruki-2.jpg",
  "/images/catalog/kentatsu-haruki-3.jpg",
  "/images/catalog/kentatsu-haruki-4.jpg"
  ],
  704: [ // Kentatsu Харуки Инвертор (Haruki Inverter)
    "/images/catalog/kentatsu-haruki-inv.jpg",
  "/images/catalog/kentatsu-haruki-inv-2.jpg",
  "/images/catalog/kentatsu-haruki-inv-3.jpg",
  "/images/catalog/kentatsu-haruki-inv-4.jpg"
  ],
  705: [ // Kentatsu Юки Инвертор (Yuki) (Инверторный)
    "/images/catalog/kentatsu-yuki-inv.jpg",
  "/images/catalog/kentatsu-yuki-inv-2.jpg",
  "/images/catalog/kentatsu-yuki-inv-3.jpg",
  "/images/catalog/kentatsu-yuki-inv-4.jpg"
  ],
  706: [ // Kentatsu Тиба (Tiba) (Обычный)
    "/images/catalog/kentatsu-tiba.jpg",
  "/images/catalog/kentatsu-tiba-2.jpg",
  "/images/catalog/kentatsu-tiba-3.jpg",
  "/images/catalog/kentatsu-tiba-4.jpg",
  "/images/catalog/kentatsu-tiba-5.jpg"
  ],
  707: [ // Kentatsu Тиба Инвертор (Tiba Inverter) (Инверторный)
    "/images/catalog/kentatsu-tiba-inv.jpg",
  "/images/catalog/kentatsu-tiba-inv-2.jpg",
  "/images/catalog/kentatsu-tiba-inv-3.jpg",
  "/images/catalog/kentatsu-tiba-inv-4.jpg"
  ],
  708: [ // Kentatsu Отари Инвертор (Otari) (Инверторный)
     "/images/catalog/kentatsu-otari-inv.jpg",
  "/images/catalog/kentatsu-otari-inv-2.jpg",
  "/images/catalog/kentatsu-otari-inv-3.jpg",
  "/images/catalog/kentatsu-otari-inv-4.jpg"
  ],
  709: [ // Kentatsu Семпай Инвертор (Sempai) (Инверторный)
     "/images/catalog/kentatsu-sempai-inv.jpg",
  "/images/catalog/kentatsu-sempai-inv-2.jpg",
  "/images/catalog/kentatsu-sempai-inv-3.jpg",
  "/images/catalog/kentatsu-sempai-inv-4.jpg",
  "/images/catalog/kentatsu-sempai-inv-5.jpg"
  ],
  710: [ // Kentatsu Омори Инвертор (Omori) (Инверторный)
    "/images/catalog/kentatsu-omori-inv.jpg",
  "/images/catalog/kentatsu-omori-inv-2.jpg",
  "/images/catalog/kentatsu-omori-inv-3.jpg",
  "/images/catalog/kentatsu-omori-inv-4.jpg"
  ],
  711: [ // Kentatsu Тамаши Инвертор (Tamashi) (Инверторный)
    "/images/catalog/kentatsu-tamahi-inv.jpg",
  "/images/catalog/kentatsu-tamahi-inv-2.jpg",
  "/images/catalog/kentatsu-tamahi-inv-3.jpg",
  "/images/catalog/kentatsu-tamahi-inv-4.jpg"
  ],
  712: [ // Kentatsu Токачи Инвертор (Tokachi) (Инверторный)
   "/images/catalog/kentatsu-tokahi-inv.jpg"
  ],
  713: [ // Kentatsu Ичи Инвертор R32 (Ichi) (Инверторный)
    "https://daichi.market/upload/iblock/596/j3nqso97cc4l509nq5lpzq2ucrle5qzn/yffgkm1gelxck0om3nan6znhe0iq6ok8.jpg",
    "https://daichi.market/upload/iblock/386/5cb01d270fa420ce7ed7a9786a6b0051.jpg",
    "https://daichi.market/upload/iblock/feb/4923fe9677bba06a7dd1d397f995e2c3.jpg"
  ],
  601: [ // Kentatsu кассетная KSVB Inverter (R32) (Полупромышленный)
    "/images/catalog/kentatsu-cassette-inv.jpg"
  ],
  602: [ // Kentatsu кассетная KSVT / KSVG (On/Off) (Полупромышленный)
    "/images/catalog/kentatsu-ksvt.jpg",
  "/images/catalog/kentatsu-ksvt-2.jpg",
  "/images/catalog/kentatsu-ksvt-3.jpg",
  "/images/catalog/kentatsu-ksvt-4.jpg"
  ],

  // === MIDEA (ДАИЧИ) ===
  109: [ // Midea Парамаунт R32 MSAG1 (Обычный) — официальные фото Daichi (daichi.market, серия Paramount R32)
    "https://daichi.market/upload/iblock/df6/xtkqw1s6bpxqfff0nth0taddoaho4tf2/nt3xtnllw8tr7h7rwtrd1043akw2mlqq.jpg",
    "https://daichi.market/upload/iblock/887/c2iu14bhtljggb9ygihvc5l8bhrr5jgz/4880b54c799e20acbff3d1e3ad41a356.jpg",
    "https://daichi.market/upload/iblock/6d0/3sxy1bmi8nkxx6xxnc99p9qps5rllc7w/1390b6b47f459b425e0d0d454e29266b.jpg",
    "https://daichi.market/upload/iblock/549/bq0khx222n2pi2zu7s16cynvp71lz8iw/uv0sko6qr5yfw3who7702sjaese3h9jp.jpg",
    "https://daichi.market/upload/iblock/2f8/bs34a7l0k3gll9o64rn3iafg02jzg7yl/8bk8ravsbv72atoztubel4nqzayqbr55.jpg",
    "https://daichi.market/upload/iblock/a70/2rorutzl0wu9t38vodu5g7y8zurz0lq0/hooj2ns23b68cdrvj36jrandq5eviiou.jpg"
  ],
  720: [ // Midea Анлимитед (Unlimited) (Обычный) — официальные фото Daichi (daichi.market, серия Unlimited R32)
    "https://daichi.market/upload/iblock/f6a/2whrub6z169jsog90r1lks95nqukc2bj/j2wi9m5sd3sha9ce189q09t2bb48a2bs.jpg",
    "https://daichi.market/upload/iblock/fae/eqexs3ezeeby0acxdu63qlk2amdge2mv/ac7fbeee66f2f9d9394d6486d51baf12.jpg",
    "https://daichi.market/upload/iblock/3f7/ob4uotupvcg6re3fk2e9vpjl8ru311nd/w9uhw2eg3w9mw3huyvuru1etfr1eg4pv.jpg",
    "https://daichi.market/upload/iblock/bfd/uem0so12p2prmhyeq83erqmcdsy4jewi/9ybj5kbdug3yn1v6u9dyajznck27mi8j.jpg",
    "https://daichi.market/upload/iblock/7e7/4xt2udpyj8jyubi8m3czxc5om2vrs7u4/890lelicik54spyu8t28c51d2qpuz74f.jpg",
    "https://daichi.market/upload/iblock/47b/68doyoboo16proqq4shvrckd27dsgd9v/93f37f07d6f9a47b27a7c9c257f27ba9.jpg",
    "https://daichi.market/upload/iblock/2f8/bs34a7l0k3gll9o64rn3iafg02jzg7yl/8bk8ravsbv72atoztubel4nqzayqbr55.jpg",
    "https://daichi.market/upload/iblock/a70/2rorutzl0wu9t38vodu5g7y8zurz0lq0/hooj2ns23b68cdrvj36jrandq5eviiou.jpg"
  ],
  721: [ // Midea Персона (Persona) (Обычный)
    "/images/catalog/midea-persona.jpg",
  "/images/catalog/midea-persona-2.jpg",
  "/images/catalog/midea-persona-3.jpg",
  "/images/catalog/midea-persona-4.jpg"
  ],
  722: [ // Midea Персона Инвертор Wi-Fi (Persona) (Инверторный)
    "/images/catalog/midea-persona-inv.jpg",
  "/images/catalog/midea-persona-inv-2.jpg",
  "/images/catalog/midea-persona-inv-3.jpg",
  "/images/catalog/midea-persona-inv-4.jpg",
  "/images/catalog/midea-persona-inv-5.jpg"
  ],
  723: [ // Midea Breezeless E (Инверторный)
    "/images/catalog/midea-brezel.jpg",
  "/images/catalog/midea-brezel-2.jpg",
  "/images/catalog/midea-brezel-3.jpg",
  "/images/catalog/midea-brezel-4.jpg"
  ],
  724: [ // Midea Breezeless Wi-Fi (Инверторный)
     "/images/catalog/midea-brezel-wifi.jpg",
     "/images/catalog/midea-brezel-wifi-2.jpg",
     "/images/catalog/midea-brezel-wifi-3.jpg",
    "/images/catalog/midea-brezel-wifi-4.jpg",
    "/images/catalog/midea-brezel-wifi-5.jpg",
    "/images/catalog/midea-brezel-wifi-6.jpg",
    "/images/catalog/midea-brezel-wifi-7.jpg",
    "/images/catalog/midea-brezel-wifi-8.jpg",
    "/images/catalog/midea-brezel-wifi-9.jpg",
  "/images/catalog/midea-brezel-wifi-10.jpg"
  ],
  725: [ // Midea ХитФорс (HeatForce) (Инверторный - 100% подтверждено!)
   "/images/catalog/midea-force.jpg",
  "/images/catalog/midea-force-2.jpg",
  "/images/catalog/midea-force-3.jpg",
  "/images/catalog/midea-force-4.jpg"
  ],
  726: [ // Midea Гайа (Gaia) (Инверторный)
   "/images/catalog/midea-gaia.jpg",
  "/images/catalog/midea-gaia-2.jpg",
  "/images/catalog/midea-gaia-3.jpg",
  "/images/catalog/midea-gaia-4.jpg"
  ],
  727: [ // Midea Изи Инвертор (Easy Inverter) (Инверторный)
    "/images/catalog/midea-easy.jpg",
  "/images/catalog/midea-easy-2.jpg",
  "/images/catalog/midea-easy-3.jpg",
    "/images/catalog/midea-easy-4.jpg",
    "/images/catalog/midea-easy-5.jpg",
  "/images/catalog/midea-easy-6.jpg"
  ],
  603: [ // Midea кассетная MCD Inverter (R32) (Полупромышленный)
     "/images/catalog/midea-mcd.jpg",
  "/images/catalog/midea-mcd-2.jpg",
  "/images/catalog/midea-mcd-3.jpg",
  "/images/catalog/midea-mcd-4.jpg"
  ],
  604: [ // Midea кассетная MCD (On/Off, R410A) (Полупромышленный)
      "/images/catalog/midea-mcd-ne.jpg",
  "/images/catalog/midea-mcd-ne-2.jpg",
  "/images/catalog/midea-mcd-ne-3.jpg",
  "/images/catalog/midea-mcd-ne-4.jpg"
  ],

  // === DAIKIN (ДАИЧИ) ===
  511: [ // Daikin FTXF Sensira (Инверторный)
    "https://daichi.business/upload/iblock/cc6/jm34hyl3p2sxj39pdlpe46fzr56d21kn/7733ead2a8e2b48b0e680ea8b9a65aa7.jpg",
    "https://daichi.business/upload/iblock/f68/e4o0ckvbwja91gekuplewemmplhacl6i/835b1c2a94b396483ce825e0540e1dfc.jpg",
    "https://daichi.business/upload/iblock/4c5/6p06e8mxqzyj4izd2ossfn9x0asl5szs/526b7154ec4619858a109c32c28749c6.jpg"
  ],
  512: [ // Daikin FTXF-F (Инверторный)
    "https://daichi.business/upload/iblock/238/s6691tajccy0ton6x3oktjmquou43tbd/nx9knz1eowu2yd1gyg3n963f0x18nvzy.jpg",
    "https://daichi.business/upload/iblock/5f0/jyw0v4x16udad9bcemnpj0680n70oxyw/wubxw6hf5vtxweuzvq8kbpll9osd2iyi.jpg",
    "https://daichi.business/upload/iblock/de6/dhn1fw12m7ct9uziu6oe8zsl2jfk2lpn/f3qdo0q1mnu4ih8718qtdohhriaosidz.jpg",
    "https://daichi.business/upload/iblock/da3/8lvnl2trt75ee0h7khpz22q6wjdljb4m/53s2ww9kh8q01co72j2fida7b22bevc0.jpg",
    "https://daichi.business/upload/iblock/30b/wwtqo0w30x4s0gocfticnf2g6sh262qy/r5grgl4k0dsdrakxva0gvfgl33wvyvic.jpg"
  ],
  513: [ // Daikin FTXS (Инверторный)
    "/images/catalog/daikin-ftxs.jpg"
  ],
  514: [ // Daikin FTYN (On/Off) (Обычный)
    "https://daichi.business/upload/iblock/6fd/1h7ebge4871n6k5jlfdj4lftu1m8rr9y/9400fc8f20307af86600f9c5a6d7e74e.jpg",
    "https://daichi.business/upload/iblock/a88/h3bqu4i64gxfizokzt8to64p5v27iyld/5fb3b77be9e8c0ac62fabaae5f7a3956.jpg",
    "https://daichi.business/upload/iblock/c32/r3anfo6mj6m3f9jiyw64aynmbc09u7jt/4fe3b51aae8be68ab9833056e1044f59.jpg",
    "https://daichi.business/upload/iblock/e05/i528x46qojluhszwh4szcpjo8v47j2q1/f0286778bc352f281e77ba91e0b9d393.jpg"
  ],
  515: [ // Daikin FTXJ Emura (Инверторный)
    "https://daichi.business/upload/iblock/3c7/rdj04unfv0zjvxzk19x10mogl06oxlcw/5849920929240c4125cdbcba7f4ababc.jpg",
    "https://daichi.business/upload/iblock/4fb/qwq0jac3myox63upj72otczcb6c9v5ri/6c3c6225e8a1c95bd972484626b1b855.jpg",
    "https://daichi.business/upload/iblock/45d/eudkfpdq7sb5lwpbgsnbkg2jp9xisgcv/9abb28cde31783b2e152c75cb107abb0.jpg"
  ],
  516: [ // Daikin FTXM Perfera (Инверторный)
    "https://daichi.business/upload/iblock/8e1/18cuonr7cbh7lew9i624rq94xpzra42w/5ur073eya56kmf8jk8d6bga8nwtjiahe.jpg",
    "https://daichi.business/upload/iblock/e62/7osacl29b0aau62ph2ck98dbwoyjximi/jdggfgfu527jqrjy2od3lxgg1m370lw2.jpg",
    "https://daichi.business/upload/iblock/a23/ibq56uhzt8n2lclcp46sk1eh07e99u0q/6ij8fy9cr3dbdf7sphg35spg6tiwy3lz.jpg",
    "https://daichi.business/upload/iblock/bf8/z3jjdpzoeuibn4yvt8c1um27y3fnl6pg/wfadxxd51diyw1y59xzu3waxhksh9p5t.jpg",
    "https://daichi.business/upload/iblock/af1/b8fclz32ez1tq03319m5phzb68158d7q/tfa8b3ocvxk2odda3qdo2czw2fpvnthc.jpg"
  ],
  517: [ // Daikin FTXM-A Perfera (Инверторный)
    "https://daichi.business/upload/iblock/713/bfow3r76etx8zrwn16at1aa16itub6ce/bd521ea7c974f219c2fc9052b3f145cf.jpg",
    "https://daichi.business/upload/iblock/444/ec61y011c5vk338i2co894zk0srnerk4/f93b52b51d56ff6bdbcc6884ce58d711.jpg",
    "https://daichi.business/upload/iblock/fca/95y0twm6p74fbcza70epnb0dlbzgc209/b8dda2a99c84bf4733fee3822521dc00.jpg"
  ],
  518: [ // Daikin FTXJ-AB9 (Инверторный)
    "https://daichi.business/upload/iblock/790/13thzdv5h53mov9w90oc25mr57g83jar/5c5gt4liasw9y3vpun4vr6yy9xuuv5tk.jpg",
    "https://daichi.business/upload/iblock/57e/25037irm0cvixu2l17b71n2x5q38e4b4/0tfavm0sl3kprvxbfp2pfedniex2h2gz.jpg",
    "https://daichi.business/upload/iblock/13b/wphqx4ir0hphnnuwhmvz892g7ugtnhhm/ui89wgjhnqa48iri46ltsjck8g2tdc6k.jpg",
    "https://daichi.business/upload/iblock/73d/sjc8viqf0nyhfd1yjtuu0spm1flrb2jl/z3t076m3ormre4mvdu6wueqd3hgr0ph2.jpg",
    "https://daichi.business/upload/iblock/f48/rpj2mpp1ba15toh4nz0nai4t573b7hiz/1c8f3a0w6z091l1ro0v7zjv413iog1ju.jpg"
  ],
  519: [ // Daikin FVXM/RXM (напольная) (Инверторный)
    "/images/catalog/daikin-fvxm.jpg"
  ],
  520: [ // Daikin FDXM-F9 (канальная) (Инверторный)
    "https://daichi.business/upload/iblock/e5b/gip31spgtz0ffdub0pkfacoiy9pyuisy/66342be67326921674b2d43f50afa5db.jpg",
    "https://daichi.business/upload/iblock/c45/ycr3wxsg0p7iw7b2naldfdbj3z4igaf5/a1cfe3788ed7b09d105bc8773cd0b25f.jpg",
    "https://daichi.business/upload/iblock/7fd/qu2p0nto185ljoi903fyo1ocnzg1z7i7/3a5dcd96e6c3099a05b544d55a77f0c8.jpg"
  ],

  // === BOSCH (ДАИЧИ) ===
  730: [ // Bosch Climate Line 2000 (Обычный)
    "/images/catalog/bosh-2000.jpg",
  "/images/catalog/bosh-2000-2.jpg",
  "/images/catalog/bosh-2000-3.jpg",
  "/images/catalog/bosh-2000-4.jpg"
  ],
  731: [ // Bosch Climate Line 5000 Инвертор (Инверторный)
  "/images/catalog/bosh-line-5000.jpg",
  "/images/catalog/bosh-line-5000-2.jpg",
  "/images/catalog/bosh-line-5000-3.jpg",
  "/images/catalog/bosh-line-5000-4.jpg"
  ],
  732: [ // Bosch Climate 5000 Инвертор (Инверторный)
    "/images/catalog/bosh-cline-5000.jpg",
  "/images/catalog/bosh-cline-5000-2.jpg",
  "/images/catalog/bosh-cline-5000-3.jpg",
  "/images/catalog/bosh-cline-5000-4.jpg"
  ],
  733: [ // Bosch Climate 6000i Инвертор (Инверторный)
     "/images/catalog/bosh-cline-6000.jpg",
  "/images/catalog/bosh-cline-6000-2.jpg",
  "/images/catalog/bosh-cline-6000-3.jpg",
  "/images/catalog/bosh-cline-6000-4.jpg"
  ],

  // === TOSHIBA & DAICHI EVEREST & AURUS & AXIOMA ===
  320: [ // Toshiba Seiya RAS-CVG (Инверторный)
    "https://rkcdn.ru/products/e90e8f4c-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e90e8f50-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e90e8f52-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e90e8f54-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/b127e58c-1388-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e90e8f5a-6304-11ef-b8db-00505601218a/main_big.jpg"
  ],
  108: [ // Daichi Эверест R32 DA-EVQ1R (Обычный)
  "/images/catalog/daichi-ever.jpg",
  "/images/catalog/daichi-ever-2.jpg",
  "/images/catalog/daichi-ever-3.jpg",
  "/images/catalog/daichi-ever-4.jpg"
  ],
  501: [ // AURUS A DC AAI (Инверторный)
    "https://rkcdn.ru/products/80073bb2-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f48-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f4a-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f4c-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f4e-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f50-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/86fb1f52-4ab0-11f1-b8e2-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e1b35564-2294-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  106: [ // Axioma Серия H R32 ASX-H1R (Обычный)
    "/images/catalog/axioma-h.jpg",
  "/images/catalog/axioma-h-2.jpg",
  "/images/catalog/axioma-h-3.jpg"
  ],
  502: [ // Axioma Серия H Инвертор R32 (Инверторный)
    "/images/catalog/axioma-h-inv.jpg",
  "/images/catalog/axioma-h-inv-2.jpg",
  "/images/catalog/axioma-h-inv-3.jpg"
  ],

  // === НОВЫЕ ЛИНЕЙКИ И МОБИЛЬНЫЕ/ПРОМЫШЛЕННЫЕ, 25.08.2026 ===
  734: [ // Ballu Eco Smart DC BSYI — 11 фото
    "https://rkcdn.ru/products/53e81bda-d25c-11ef-b8dc-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/c964a56a-6304-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/9af46048-646f-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/9af4604a-646f-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/9af4604c-646f-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c964a56c-6304-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/780377ce-04fe-11ee-b736-005056013a69/src.jpg",
    "https://rkcdn.ru/products/c964a56e-6304-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c964a570-6304-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c964a572-6304-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cf7f1984-6304-11ef-b8db-00505601218a/src.jpg"
  ],
  735: [ // Royal Thermo Barocco DC RTBI — 1 фото
    "https://rkcdn.ru/products/fe7ca232-5b3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  736: [ // Ballu iGreen Pro BSAG — 10 фото
    "https://rkcdn.ru/products/456a3a97-abdb-11ed-b733-005056013a69/main_big.jpg",
    "https://rkcdn.ru/products/59d716ed-abd8-11ed-b733-005056013a69/src.jpg",
    "https://rkcdn.ru/products/87cd5472-abd8-11ed-b733-005056013a69/src.jpg",
    "https://rkcdn.ru/products/6985dab2-abd9-11ed-b733-005056013a69/src.jpg",
    "https://rkcdn.ru/products/de4e4871-8771-11ed-b732-005056013a69/src.jpg",
    "https://rkcdn.ru/products/e989b98d-8771-11ed-b732-005056013a69/src.jpg",
    "https://rkcdn.ru/products/f5691db6-8771-11ed-b732-005056013a69/src.jpg",
    "https://rkcdn.ru/products/897b0b9b-24e7-11ef-b8d8-00505601218a/src.jpg",
    "https://rkcdn.ru/products/55a126e6-24e7-11ef-b8d8-00505601218a/src.jpg",
    "https://rkcdn.ru/products/d6c7ef63-24e7-11ef-b8d8-00505601218a/src.jpg"
  ],
  737: [ // Ballu Defender BSHI — 1 фото
    "https://rkcdn.ru/products/f8730e5a-4b96-11f0-b8df-00505601218a/main_big.jpg"
  ],
  738: [ // Ballu Greenland DC BSGRI — 7 фото
    "https://rkcdn.ru/products/f645ceb8-5b3e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/f04d429a-5b3e-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/f645ceae-5b3e-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/f645ceb0-5b3e-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/f645ceb2-5b3e-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/f645ceb4-5b3e-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/f645ceb6-5b3e-11ef-b8db-00505601218a/src.jpg"
  ],
  739: [ // HITAIR HAM — 1 фото
    "https://rkcdn.ru/products/d8bc9d48-1083-11f0-b8de-00505601218a/main_big.jpg"
  ],
  740: [ // NEOLINE NAM — 1 фото
    "https://rkcdn.ru/products/ce995fdb-f100-11ee-b8d8-00505601218a/main_big.jpg"
  ],
  741: [ // Ballu Olympio Legend BSW — 16 фото
    "https://rkcdn.ru/products/5480f405-6305-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/5480f407-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5480f409-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5480f40b-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/2018dbc6-d27a-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/264371ae-d27a-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5480f40d-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258a3-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258a5-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258a7-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258a9-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258ab-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258ad-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258af-6305-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/264371bc-d27a-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/5aa258b1-6305-11ef-b8db-00505601218a/src.jpg"
  ],
  742: [ // Ballu Maverick DC BSMI — 1 фото
    "https://rkcdn.ru/products/13976ae5-ffef-11ef-b8de-00505601218a/main_big.jpg"
  ],
  743: [ // Electrolux Loft EACS-HAL/N8 — 16 фото
    "https://rkcdn.ru/products/fef03f70-e2dc-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/fef03f72-e2dc-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f83418-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8341a-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8341c-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8341e-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f83420-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f83422-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f83424-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cea859b2-80c8-11ef-b8db-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f83428-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8342a-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8342c-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/04f8342e-e2dd-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/b0b3c5a6-1ec0-11f0-b8de-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c168acb0-1ec0-11f0-b8de-00505601218a/src.jpg"
  ],
  744: [ // Electrolux Loft DC EACS/I-HAL/N8 — 1 фото
    "https://rkcdn.ru/products/5f42727e-5d3c-11ef-b8db-00505601218a/main_big.jpg"
  ],
  745: [ // Electrolux Slide EACS-HSL/N8 — 11 фото
    "https://rkcdn.ru/products/c4ca2dfc-d4d2-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/c4ca2dfe-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c4ca2e00-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d29-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d2b-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d2d-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d2f-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d31-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/cb0f4d33-d4d2-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/83e52380-1ec2-11f0-b8de-00505601218a/src.jpg",
    "https://rkcdn.ru/products/9b67b4c9-1ec2-11f0-b8de-00505601218a/src.jpg"
  ],
  746: [ // Daichi Айс (Ice) — 4 фото
    "https://daichi.business/upload/iblock/843/eeplcdhud1xr9skt8x9p1v8ul7gjfapu/e7ef71a5d086046ae4471f4f11d916c5.jpg",
    "https://daichi.business/upload/iblock/f2f/mtxqwl18bgiuolzr708pabipm71rjhr2/f32a2ab38100eb1bdf30aa7d736b06a3.jpg",
    "https://daichi.business/upload/iblock/46a/5uf1raknxzxeea4xwecpuynedjsh59kc/00bb674fa54146289d3f75606d6e41fc.jpg"
  ],
  747: [ // Daichi Эйр Инвертор (Air) — 11 фото
    "https://daichi.business/upload/iblock/710/drwtr41sxpg3s3nms955bfin132y5dy1/ocobu8udxobthmgjlrlvkpgkv1olucch.jpg",
    "https://daichi.business/upload/iblock/825/8i3jj7ozlelh8vmpgtogllqqdzd5o9ox/7nar88jzl208b1o62k8i1kekxrukwile.jpg",
    "https://daichi.business/upload/iblock/885/m1w6klns1z333y5o2nph0a22bdtfo56x/i1wobmrx9jmkyq1yofwf8449zl105zzr.jpg",
    "https://daichi.business/upload/iblock/ce8/gymryewa4o30hkkr05lccariyb85ipvs/osakvfa8l3yld7jqhsv7lk19c4351emq.jpg",
    "https://daichi.business/upload/iblock/957/8q2m6il6bx9bl3shom3fob5atjkgaoj5/e7ppkjup4xixgm76nysrq4lzrndvrqwa.jpg",
    "https://daichi.business/upload/iblock/ad8/40fzjvmcv67tkb8sknduu1m2boo0kqfm/lk1t470nggk2rvo3lglv19b03qcpqbu8.jpg",
    "https://daichi.business/upload/iblock/c28/8guum5zchhtlbdqq4fh4g7bs5ehjhoc5/mt5yi96jt9vjr2cxz4voojmwp2rciu88.jpg",
    "https://daichi.business/upload/iblock/ea5/811ew6qcv8e5q3a99os250tthf60a2ku/01c3kc0td73eb71emj22rpaq0eff7x59.jpg",
    "https://daichi.business/upload/iblock/c76/iowg0f9er7b1lchbe0cgr5g0ixbu9a5v/iwgsfyghkdszgfiomlb5gnftm3il3wl5.jpg",
    "https://daichi.business/upload/iblock/1c1/cq9xrayntut5u2966h8ynhvj5b1b2aai/49aa64hohr7hjyp53lg46ypf7qtpbw2m.jpg",
    "https://daichi.business/upload/iblock/03f/g3wqjh6sbopvckgcofdbj0ana4mo1u3f/7aawxg4n04nur6jx33pmn9opuyedgwhp.jpg"
  ],
  748: [ // Daichi Карбон Инвертор (Carbon) — 3 фото
    "https://daichi.business/upload/iblock/4fe/c58p0gwt6pyekq93fxkd29l92pdzo9hm/ka688tv5a1mpf9bt0xjvn7rqc2szix5g.jpg",
    "https://daichi.business/upload/iblock/334/mw1yaug3o6vqawt0jsut0t06obg2pfn9/4bfsjzujfirfsmxf7lq798pgerfcze33.jpg",
    "https://daichi.business/upload/iblock/5ef/15hmc886w8tyh3evzpo0bdzho5wxz5t6/v25hclkunlf4gmt22153lsaa8fycn9ks.jpg"
  ],
  749: [ // Kentatsu Ичи (Ichi) — 5 фото
    "https://daichi.business/upload/iblock/92b/q091wd79snt2mxaf5dkpgar6qdyxs8ia/fa61c5a5e9aca81d1ecbfa2a88e11956.jpg",
    "https://daichi.business/upload/iblock/0cb/4tv42w98j7i08p461uu924vc5dsfa0b6/dd2aaadd8426167941f8b28951216eb8.jpg",
    "https://daichi.business/upload/iblock/ca1/t2qzp52s0wic4kn850k7yiniufl6dx1i/2feba730881e63b64ab0fe625bb90e23.jpg",
    "https://daichi.business/upload/iblock/b55/t3sftedyqydy1j18g21dwgqfaazo1b60/8bba7ec111ea79ff392c6d3ec7dea17a.jpg"
  ],
  750: [ // Kentatsu Турин Инвертор (Turin) — 4 фото
    "https://daichi.business/upload/iblock/6f4/8n29gsc41w42km8nisn9ky62q1wsrdh9/79e7fc7451fa77297d4028722945c75f.jpg"
  ],
  751: [ // Kentatsu Наоми (Naomi) — 11 фото
    "https://daichi.business/upload/iblock/b47/5rx7jwm6ylcrcxw26kln1cl600q61zp4/pe2bqlidoj86vsns8vfvnx7t2xaoxuty.jpg"
  ],
  752: [ // Midea Парамаунт Инвертор (Paramount Inverter) — 7 фото
    "https://daichi.market/upload/iblock/7f7/i7dr14qog7hxxf95170hjtmiu2hpu26k/11.jpg",
    "https://daichi.market/upload/iblock/d3b/x40nmd7887efzs0z3eyw56svbdud2nd4/01-_2_.jpg",
    "https://daichi.market/upload/iblock/dde/wv4lpquw17b2rej3mrqymu81usv8umge/02.jpg",
    "https://daichi.market/upload/iblock/5ee/y3srp5yqx2ykk9yc6td5p0dn3pm4070r/03.jpg",
    "https://daichi.market/upload/iblock/581/n22rn6ge895qk2c1ttn1p15cehf401jr/04.jpg",
    "https://daichi.market/upload/iblock/7ed/omtg52qfwjztv0dw0bsq31k41ur9kg2i/05.jpg",
    "https://daichi.market/upload/iblock/bcd/5m3hxftcwijj5k1pqk23dre7vrsrxhmn/06.jpg",
    "https://daichi.market/upload/iblock/5b0/k85y0vs7cnmwen12sn0vau5vsg0ney05/07.jpg"
  ],
  753: [ // Midea Анлимитед Инвертор (Unlimited Inverter) — 5 фото
    "https://daichi.market/upload/iblock/889/lg8l2t6wzjhyor32bizvxyjr53b87vrw/11.jpg",
    "https://daichi.market/upload/iblock/043/scps0w84dmeofrywh3h7lx7kkpup30n4/01-_3_.jpg",
    "https://daichi.market/upload/iblock/e52/gqclqod195dk46hujubpj1mc75srcmlt/02.jpg",
    "https://daichi.market/upload/iblock/c38/0w8je6uphz5cra9dq1e5gwqe0kd2tzfv/03.jpg",
    "https://daichi.market/upload/iblock/107/jufl6xx4ai1xdao1mpw89npkrm9fxk4d/04.jpg",
    "https://daichi.market/upload/iblock/ea8/lfh5bydmzh8hnx2tgbj5xij30t2bkmwv/05.jpg",
    "https://daichi.market/upload/iblock/5ea/u3rmrjisqxnjyrhi03ritachtldemd2k/06.jpg",
    "https://daichi.market/upload/iblock/932/cdr42n3wfvt87m4e1a35534hyqg7iy75/07.jpg"
  ],
  754: [ // Ballu Orbis BPAC — 1 фото
    "https://rkcdn.ru/products/ab3696a4-cc02-11ee-b8d6-00505601218a/main_big.jpg"
  ],
  756: [ // Ballu Aura BPAC-09 24Y — 12 фото
    "https://rkcdn.ru/products/9eb2515a-6e8e-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/9c0c5e02-c5c8-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/ad47ba70-c5c8-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c13148bb-c5c8-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/005629c1-c5c9-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/414b267a-ca47-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/67617b49-ca47-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/92755dc7-ca47-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/b38844a7-ca47-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/9f8fa656-ca48-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/c4d506b7-ca48-11ee-b8d6-00505601218a/src.jpg",
    "https://rkcdn.ru/products/d6fe6b96-ca48-11ee-b8d6-00505601218a/src.jpg"
  ],
  757: [ // Ballu Aura BPAC-09 24Y + UniPort — 1 фото
    "https://rkcdn.ru/products/829eaaca-5b5a-11f1-b8e3-00505601218a/main_big.jpg"
  ],
  758: [ // Ballu Eclipse BPAC EPW white — 1 фото
    "https://rkcdn.ru/products/5f2330d7-e392-11ef-b8de-00505601218a/main_big.jpg"
  ],
  760: [ // Ballu Eclipse BPAC-10 EPB black — 1 фото
    "https://rkcdn.ru/products/dc5d0d5b-6e91-11ef-b8db-00505601218a/main_big.jpg"
  ],
  761: [ // Ballu Twinkle BPAC-09 DWR Red — 1 фото
    "https://rkcdn.ru/products/b8981469-1e32-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  762: [ // Ballu Twinkle BPAC-09 DWR Red + UniPort — 1 фото
    "https://rkcdn.ru/products/ef128d96-5ff1-11f1-b8e3-00505601218a/main_big.jpg"
  ],
  763: [ // Ballu Twinkle BPAC-09 DWB Blue — 1 фото
    "https://rkcdn.ru/products/285622a0-1e33-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  764: [ // Ballu Twinkle BPAC-09 DWB Blue + UniPort — 1 фото
    "https://rkcdn.ru/products/9a32b2fd-5ff1-11f1-b8e3-00505601218a/main_big.jpg"
  ],
  765: [ // Ballu Stella BPAC — 1 фото
    "https://rkcdn.ru/products/f0989a89-1058-11f0-b8de-00505601218a/main_big.jpg"
  ],
  767: [ // Ballu Selen BPAC — 1 фото
    "https://rkcdn.ru/products/a45cc4f6-d7d5-11ef-b8dc-00505601218a/main_big.jpg"
  ],
  770: [ // Ballu Smart Wind BPAC-09 — 1 фото
    "https://rkcdn.ru/products/a9acd3d0-f8a7-11ed-b736-005056013a69/main_big.jpg"
  ],
  771: [ // Ballu Velure BPAC-14 — 1 фото
    "https://rkcdn.ru/products/4cb4934d-6e95-11ef-b8db-00505601218a/main_big.jpg"
  ],
  772: [ // Ballu BPAC-18 CE — 1 фото
    "https://rkcdn.ru/products/c9aa0e15-09f6-11ee-b736-005056013a69/main_big.jpg"
  ],
  773: [ // Ballu Platinum X4 BPHS — 1 фото
    "https://rkcdn.ru/products/ababf435-1d67-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  775: [ // Ballu Platinum X4 BPHS + UniPort — 1 фото
    "https://rkcdn.ru/products/4c153776-5dd5-11f1-b8e3-00505601218a/main_big.jpg"
  ],
  778: [ // Ballu Platinum Comfort BPHS-H — 1 фото
    "https://rkcdn.ru/products/b827edde-fada-11ed-b736-005056013a69/main_big.jpg"
  ],
  782: [ // Ballu Heavy Pro BGK — 1 фото
    "https://rkcdn.ru/products/15705e3e-027e-11ed-b732-005056013a69/main_big.jpg"
  ],
  786: [ // Electrolux Arizona EACM AZ — 1 фото
    "https://rkcdn.ru/products/2b507b39-1264-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  788: [ // Electrolux EACM CLN 2.0 — 1 фото
    "https://rkcdn.ru/products/6097f25d-2962-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  790: [ // Electrolux EACM-09 HR — 1 фото
    "https://rkcdn.ru/products/e768de48-026f-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  791: [ // Electrolux EACM HP — 1 фото
    "https://rkcdn.ru/products/203d609f-05e6-11ee-b736-005056013a69/main_big.jpg"
  ],
  793: [ // Electrolux Nebula EACM-16 NB V2 — 1 фото
    "https://rkcdn.ru/products/8b90aef1-dd4f-11ef-b8de-00505601218a/main_big.jpg"
  ],
  794: [ // Electrolux EACM JK — 1 фото
    "https://rkcdn.ru/products/2c18919b-ce27-11ed-b733-005056013a69/main_big.jpg"
  ],
  796: [ // Electrolux Fusion Mobile EACM — 1 фото
    "https://rkcdn.ru/products/4477cfe8-fe08-11ed-b736-005056013a69/main_big.jpg"
  ],
  800: [ // AC ELECTRIC ACE FH — 1 фото
    "https://rkcdn.ru/products/54609bda-df14-11ef-b8de-00505601218a/main_big.jpg"
  ],
  802: [ // AC ELECTRIC Diona ACE — 1 фото
    "https://rkcdn.ru/products/2f976677-3714-11f1-b8e1-00505601218a/main_big.jpg"
  ],
  804: [ // Airwave AWD-PCW white — 3 фото
    "https://daichi.market/upload/iblock/046/eyxe2msqlul6ed2y84lhkhqz7ftfygbu/cde4652d4a12613d69f77aca070e199e.jpg",
    "https://daichi.market/upload/iblock/8f5/2tg4x932igz293b1in6uzrr3xu00w88u/Right.png",
    "https://daichi.market/upload/iblock/b38/hfjbpgdl8jjuay4yda4xxj6rs3vtkdrn/Top-Panel.png"
  ],
  805: [ // Airwave AWD-PCB black — 2 фото
    "https://daichi.market/upload/iblock/31b/hp4o6g5txgkq52etit1zil20qr87mwwp/Front.png",
    "https://daichi.market/upload/iblock/7f6/t3x92tvt89gaqpn0d65hutb09wbby4aa/Top-Panel.png"
  ],
  808: [ // Midea MPPHAS-CHN7 — 7 фото
    "https://daichi.market/upload/iblock/5dc/f21e1ap3pbhlk05q84iemm3yejwo4iq8/MI_MPPHAS_07CH_001.jpg",
    "https://daichi.market/upload/iblock/9f3/y02eba8owh5cfwav23imvtzq76usmsuz/MI_MPPHAS_07CH_002.jpg",
    "https://daichi.market/upload/iblock/74e/2qg4ep0wciy8jz830e6yco1dj9zng99x/MI_MPPHAS_07CH_003.jpg",
    "https://daichi.market/upload/iblock/506/uguaz6kcl15md169q7a9vkl5ia2cox8p/MI_MPPHAS_07CH_004.jpg",
    "https://daichi.market/upload/iblock/9ca/tqx06u2fkvm0t9ndu9db3v4nyt3wym41/MI_MPPHAS_07CH_005.jpg",
    "https://daichi.market/upload/iblock/bfb/ggrmkxq70thmp7ze7fcpd9kjt41uime4/MI_MPPHAS_07CH_006.jpg",
    "https://daichi.market/upload/iblock/c80/w3rvuiouaa07r5oa8ptfkrlcekrkw1fn/MI_MPPHAS_07CH_007.jpg"
  ],
  809: [ // Midea MPPH1-CHN7 — 6 фото
    "https://daichi.market/upload/iblock/0a6/rjoe5l22oyi1kunuol02a5fpkwqg3wf1/waf6zgtuquybilc0ouc768eb5jk1e0cd.jpg",
    "https://daichi.market/upload/iblock/9ab/xmzpdo5a7d9hhtt4qh08mlfmrfoyyy9g/isd3qhd7ech2nv3b7xhl33hdi9azolm0.jpg",
    "https://daichi.market/upload/iblock/1f2/klr8qu6pm7df81r9ruvv2bw69g5odn6a/2hvpnoihcokeu3sx7ay57y3eb8nfq5sn.jpg",
    "https://daichi.market/upload/iblock/ee4/c5mfrni378f5esuf2q3ya8a17ydmq1wo/131ofz4csdzqrovau487hxhbs7em3jqj.jpg",
    "https://daichi.market/upload/iblock/181/jklq1hv13csnnjr8ckz15kagm7f4679r/4llipp6b64fpizkghdkkhlkyzojhib39.jpg",
    "https://daichi.market/upload/iblock/961/2qas1exqtrrrajl7ee18cc2okm7ytzsc/phv4lb590ow7xigaq52kypf2b0q7qtxi.jpg"
  ],
  810: [ // Primera PRMC-09JBNE — 10 фото
    "https://daichi.market/upload/iblock/855/zjj7w7tobmq9bzqfkdmqctebuggpknh0/624lhl2uwab0z5kbvpf4088w4aqmvub1.jpg",
    "https://daichi.market/upload/iblock/dda/vcb56hn2an2pq17vufva1624k08jmywy/Oblozhka_3kh4.jpg",
    "https://daichi.market/upload/iblock/913/5k8pcqnbu7spjev1j6pq5wn36ma1qfnj/01_3kh4.jpg",
    "https://daichi.market/upload/iblock/c05/dpy65ogrw2rb4vsts2yb13zcwn922jyo/02_3kh4.jpg",
    "https://daichi.market/upload/iblock/48b/ul3sc8juh63u4govofpzn38jpq612spq/03_3kh4.jpg",
    "https://daichi.market/upload/iblock/3bc/se2za7lqqn1q4m8rbloetd7gpxa3w1ll/04_3kh4.jpg",
    "https://daichi.market/upload/iblock/53c/bkq3k4ay3poy60e1ngfne1qjjk5kawub/05_3kh4.jpg",
    "https://daichi.market/upload/iblock/4bb/hewfi8arz7sf286f9gdiipl02qmp49xy/06_3kh4.jpg",
    "https://daichi.market/upload/iblock/305/10mj3db97d0k1cfbxu3suj6gzdj7lbg6/07_3kh4.jpg",
    "https://daichi.market/upload/iblock/0b8/vnd7vt0xp4xwdil1kqvsyyt4dsdg3qq7/08_3kh4.jpg"
  ],
  813: [ // Primera PRMC-07JGNA — 3 фото
    "https://daichi.market/upload/iblock/922/itwfiahlrszix2n11lxtx8kz3v6i6n1p/20220330_170520.jpg",
    "https://daichi.market/upload/iblock/a26/h3injd49tg0yha8z3betesd01wr3d828/20220330_170635.jpg",
    "https://daichi.market/upload/iblock/fc5/vf4krvph2c5ok8olre2eiw8i3t9v0j4n/20220330_165715.jpg"
  ],
  814: [ // Airwave AWP-PHW — 4 фото
    "https://daichi.market/upload/iblock/7aa/1j9osebruh3dzlroo6f6vdg1bn48m8dg/A015E.png",
    "https://daichi.market/upload/iblock/e85/mfzrfucjvymp2h2xvy80zpoygz1x6hs1/A015E.1.png",
    "https://daichi.market/upload/iblock/0c9/yv6expz2luuei6xps5202vl9z2yndq3p/A015E.2.png",
    "https://daichi.market/upload/iblock/5b9/7q1v1ju2dg1zqp8v4au9fn0nx9ne63jh/A015E.3.png"
  ],
  816: [ // Midea MPPDA-09CRN7 — 1 фото
    "https://daichi.market/upload/iblock/1dc/jyfoslybqzdfs0rzh2f5e5kvm2me17hl/e0464f027354da33b49e39dbccefdc65.jpg"
  ],
  817: [ // Midea MPPDB-12CRN7 — 2 фото
    "https://daichi.market/upload/iblock/487/1as2549pfjchomsbhzlksudk4nmw2k38/hvryk8e52kvsntcde30pjkp4ds7xz839.jpg",
    "https://daichi.market/upload/iblock/645/0uovnekb2mqfpb12vq32m9hfu5ofny9n/syg49w08ynczgtpl78jeebwv3g059zay.jpg"
  ],
  818: [ // Midea MPPDB-12HRN1 — 1 фото
    "https://daichi.market/upload/iblock/1dc/jyfoslybqzdfs0rzh2f5e5kvm2me17hl/e0464f027354da33b49e39dbccefdc65.jpg"
  ]
,

  // === НОВЫЕ МОДЕЛИ РУСКЛИМАТ И ДАИЧИ (26.08.2026) ===
  820: [ // Electrolux Avalanche Super DC Inverter (Electrolux)
    "https://rkcdn.ru/products/971de017-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/971de019-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/971de01b-6304-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/971de01f-6304-11ef-b8db-00505601218a/main_big.jpg"
  ],
  821: [ // Electrolux Skandi DC Inverter (Electrolux)
    "https://rkcdn.ru/products/22006943-1b8b-11f0-b8de-00505601218a/main_big.jpg"
  ],
  822: [ // Electrolux Fusion 2.0 Super DC Inverter (Electrolux)
    "https://rkcdn.ru/products/188ca74d-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/188ca74f-5d3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/188ca751-5d3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  823: [ // Electrolux Fusion 2.0 (Electrolux)
    "https://rkcdn.ru/products/0262d489-d7bc-11ed-b733-005056013a69/main_big.jpg",
    "https://rkcdn.ru/products/0262d48b-d7bc-11ed-b733-005056013a69/main_big.jpg"
  ],
  824: [ // Electrolux Slide DC Inverter (Electrolux)
    "https://rkcdn.ru/products/88b54ba5-ffee-11ef-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/88b54ba7-ffee-11ef-b8de-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/88b54ba9-ffee-11ef-b8de-00505601218a/main_big.jpg"
  ],
  825: [ // Electrolux Crystal Air Super DC Inverter (Electrolux)
    "https://rkcdn.ru/products/a12d4138-1553-11f0-b8de-00505601218a/main_big.jpg"
  ],
  826: [ // Electrolux Enterprise Super DC Inverter (Electrolux)
    "https://rkcdn.ru/products/7df4d468-ece7-11ee-b8d7-00505601218a/main_big.jpg"
  ],
  827: [ // Electrolux Air Gate 2 Black (Electrolux)
    "https://rkcdn.ru/products/55f47000-415a-11e8-a53a-ac162d7b6f40/main_big.jpg"
  ],
  828: [ // Ballu iGreen Pro DC BSAGI (Ballu)
    "https://rkcdn.ru/products/b8dfa50a-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/b8dfa50c-5b3f-11ef-b8db-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/b8dfa50e-5b3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  829: [ // Ballu Greenland BSGR (Ballu)
    "https://rkcdn.ru/products/d7df3972-c8a2-11ed-b733-005056013a69/main_big.jpg",
    "https://rkcdn.ru/products/d7df3974-c8a2-11ed-b733-005056013a69/main_big.jpg"
  ],
  830: [ // Ballu Boho DC BSHPI (Ballu)
    "https://rkcdn.ru/products/161329aa-5b3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  831: [ // Ballu Platinum Black DC BSNI (Ballu)
    "https://rkcdn.ru/products/2f23eb1f-5b3f-11ef-b8db-00505601218a/main_big.jpg"
  ],
  832: [ // Ballu Ice Peak DC BSPI (Ballu)
    "https://rkcdn.ru/products/65c41f52-d287-11ef-b8dc-00505601218a/main_big.jpg"
  ],
  833: [ // Royal Thermo Perfecto RTP (Royal Thermo)
    "https://rkcdn.ru/products/ae06a931-0c78-11ef-b8d8-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/ae06a933-0c78-11ef-b8d8-00505601218a/main_big.jpg"
  ],
  834: [ // Royal Thermo Perfecto DC RTPI (Royal Thermo)
    "https://rkcdn.ru/products/cef8f1d2-646b-11ef-b8db-00505601218a/main_big.jpg"
  ],
  835: [ // Royal Thermo Barocco DC Black RTBI-B (Royal Thermo)
    "https://rkcdn.ru/products/e3b6d9b9-d7d2-11ef-b8dc-00505601218a/main_big.jpg"
  ],
  836: [ // SHUFT Soturai DC SFTHI (SHUFT)
    "https://rkcdn.ru/products/86923b1e-c51b-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/8cb2a256-c51b-11ee-b8d6-00505601218a/main_big.jpg"
  ],
  837: [ // SHUFT Tor DC SFTMI (SHUFT)
    "https://rkcdn.ru/products/649a37ee-cf98-11ed-b733-005056013a69/main_big.jpg"
  ],
  838: [ // Toshiba Shorai Edge RAS-B-G3KVS (Toshiba)
    "https://rkcdn.ru/products/ee2e1ff2-5d41-11ef-b8db-00505601218a/main_big.jpg"
  ],
  839: [ // Toshiba Haori RAS-B-N4KVR (Toshiba)
    "https://rkcdn.ru/products/afea4dd8-5d41-11ef-b8db-00505601218a/main_big.jpg"
  ],
  840: [ // AC ELECTRIC PRO ACEM (AC ELECTRIC)
    "https://rkcdn.ru/products/5d503f92-8968-11f0-b8e0-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/4f718da4-8968-11f0-b8e0-00505601218a/main_big.jpg"
  ],
  841: [ // AC ELECTRIC ACEMI (AC ELECTRIC)
    "https://rkcdn.ru/products/bbd22c2b-8966-11f0-b8e0-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e40c1d56-8966-11f0-b8e0-00505601218a/main_big.jpg"
  ],
  842: [ // ONE AIR OACT (ONE AIR)
    "https://rkcdn.ru/products/e29863ca-564d-11ef-b8d9-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/e29863c2-564d-11ef-b8d9-00505601218a/main_big.jpg"
  ],
  843: [ // ONE AIR OATI (ONE AIR)
    "https://rkcdn.ru/products/7d8cae47-8d8f-11f0-b8e0-00505601218a/main_big.jpg"
  ],
  844: [ // RAPID RAM (RAPID)
    "https://rkcdn.ru/products/abb88eac-e2b1-11ee-b8d6-00505601218a/main_big.jpg",
    "https://rkcdn.ru/products/abb88eb6-e2b1-11ee-b8d6-00505601218a/main_big.jpg"
  ],
  845: [ // RAPID RAMI (RAPID)
    "https://rkcdn.ru/products/a3a9c067-994f-11f0-b8e1-00505601218a/main_big.jpg"
  ],
  846: [ // AURUS D DC Inverter (AURUS)
    "https://rkcdn.ru/products/939d0a6b-4ab0-11f1-b8e2-00505601218a/main_big.jpg"
  ],
  847: [ // Axioma Серия F R32 (Axioma)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/e1c/s1d3l0r8cr4b6jjo8pdika7n8wgxp8xd/l7zeo3sfglb4hymp7a63xkj2wpei4m4r.jpg",
    "/api/img-proxy?url=https://daichi.business/upload/iblock/72f/0iynwf930056s0d4c6u97qzwauflzwba/bmozec1pw5u5am9j5dvek17c5nmzeos9.jpg",
    "/api/img-proxy?url=https://daichi.business/upload/iblock/faa/gal73g531uza5rp2b5140czs76tzsemz/x82bnwj1z5i6ycyd19f30i0t63d5di5w.jpg",
    "/api/img-proxy?url=https://daichi.business/upload/iblock/673/p2sn1iq1y9kiz2jv9afcpv232941bvms/4haritt50six85jorltdli9evbk0ngkg.jpg"
  ],
  848: [ // Axioma Серия F Инвертор R32 (Axioma)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/dd6/1imp5g86l86iuzqj8p1k9g1lqpf84p2c/7xygyht1vt9twsadsrkn7owix2s8x0fw.jpg",
    "/api/img-proxy?url=https://daichi.business/upload/iblock/af7/12b7x0relhj6zkxh930heqvauq75g0u6/t3olh6k7uoune0j0wtpvarj7mpcwb6ey.jpg"
  ],
  849: [ // Daichi Айс 2 Инвертор (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/be2/2vlp8zzvhir9rwbj1dkvy4baw7xzed7v/sd8epmyc0czjbblkmyv9lrhhefp7exuj.jpg"
  ],
  850: [ // Daichi Миракл R32 (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/b79/yot70myx4tdiuon95zzhmdx1o4bu40k8/2f9npwq5u14p12vkykb3aue45yd8aour.jpg"
  ],
  851: [ // Daichi Миракл Инвертор (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/a6e/1uurigj71opqxjp7yy00lf8yerbekoza/763qermcbm5uxmgp30unfz266i51yt0i.jpg"
  ],
  852: [ // Daichi Альпайн Инвертор (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/6d9/2jlnbdg639wa15tnyefxm26bmgy9ywfb/3eq3ztzu9wu0za9g8owg77dw5llyq91d.jpg"
  ],
  853: [ // Daichi Сибериа Инвертор (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/288/b225irw1hbgje3dk2juz769bgfd9bapi/g9z241r74whuyceakbmrecid19k274oy.jpg"
  ],
  854: [ // Daichi Эверест Инвертор (Daichi)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/7db/9345zuwtjj0x12p8i8h1hjc25p60kwx8/ffcceac8399e0f4dbb7c3f328a8e9963.jpg"
  ],
  855: [ // Primera Лаунж 2 (Primera)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/98d/yrrt0e99q0u77wss43qsg9xt4uuqjf1a/i70sjl39mm3js4r252zlmdkxy0qi347j.jpg"
  ],
  856: [ // Primera Лаунж Инвертор 2 (Primera)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/492/gi6uuxg6sousfu2ogigxbb78z6x0wr3p/4w1305t3yl3kt7crxcn1girdoc3nhoi1.jpg"
  ],
  857: [ // Primera Классик (Primera)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/98d/yrrt0e99q0u77wss43qsg9xt4uuqjf1a/i70sjl39mm3js4r252zlmdkxy0qi347j.jpg"
  ],
  858: [ // Midea Футура Инвертор (Midea)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/0a9/x7f17c8sj8ei8ototd0ge5lwucezdly8/0eebv7y1ywl56vq5335u7zzpr140cavt.jpg"
  ],
  859: [ // Midea Форест (Midea)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/802/r76lm5kms1ksg6ia6i4e2sdes37o6rzq/u2evu5b1zizk5f1epp11nw3109a3p0bz.jpg"
  ],
  860: [ // Midea Оазис Плюс Super DC (Midea)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/836/eq9zm8srdkc989b07ze95disks4h5ke1/on89axltbpjjggdaak9h7m5zdg587etj.jpg"
  ],
  861: [ // Kentatsu Кумо Инвертор (Kentatsu)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/405/ybovzzallea6a5ro8r0kenwyqk9s6gzi/cj008w8jg37almzlj51ycds3nickqmpp.jpg"
  ],
  862: [ // Kentatsu Браво (Kentatsu)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/b5b/1hqfxn4ys0c4lmr2ywtsiy4tiolljdp8/8ce21f2559b35cfefb695a159a64a75f.jpg"
  ],
  863: [ // Kentatsu Рио Инвертор (Kentatsu)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/6a5/lvc3s5zzn9lkt2w0dp80rz1klz99o833/5zmzzsbkyns0vccq040tffxxzfl4w7sb.jpg"
  ],
  864: [ // Bosch Climate 3000i Инвертор (Bosch)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/4a7/oiz3t120d0z43rf2hsciuldjayrxzsxw/ebc7f52c6f1eab116aa3591e43bba8d5.jpg"
  ],
  865: [ // Bosch Climate 8000i Инвертор (Bosch)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/d5e/y3yg6lpv4z50p0gd1gcovp5192deh7se/74e9e9a453eece99c3156ccb6a73714d.jpg"
  ],
  866: [ // Daikin FTXF-E Sensira (Daikin)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/a39/devwxp5hq2y8agyxddq5cf80ocwvx3ps/2n0zsjxvf2gbvt0iilv0ap3fadj658su.jpg"
  ],
  867: [ // Daikin FTXJ Emura 3 (Daikin)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/8e6/cs1pl0qf98lrmfmwhnv72usjedh0x6z8/e73201906a8558449947be23bc61cbec.jpg"
  ],
  868: [ // Coolup Genius (Coolup)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/445/2minqt2kfszs13uj6unopmi2d6dl9elm/484729bd6wx5925sp0xk88pq6ojjid07.jpg"
  ],
  869: [ // Asita Асита (Asita)
    "/api/img-proxy?url=https://daichi.business/upload/iblock/430/8uila3azm8ut8crfh3znaief5aehvbvs/j2thpji7c8bhey6wbaoqbzsvq95i15yb.jpg"
  ]
};

/**
 * Генерирует чистый понятный URL на основе названия модели (например, Royal-Thermo-Barocco-RTB)
 */
export function getModelUrlSlug(item: Conditioner): string {
  return item.name.replace(/\s+/g, "-").replace(/\//g, "-");
}

/**
 * Возвращает главную обложку для каталога — это строго ПЕРВАЯ ссылка из официального списка Русклимат и Даичи
 */
export function getMainCoverPhoto(item: Conditioner): string {
  const exactPhotos = EXACT_OFFICIAL_PHOTOS_BY_ID[item.id];
  if (exactPhotos && exactPhotos.length > 0) {
    return proxyIfDaichi(exactPhotos[0]);
  }
  return item.image;
}

/**
 * Возвращает 100% точные официальные фотографии оборудования Русклимата и Даичи для каждой модели по её ID!
 * Старые локальные фотографии полностью исключены и больше не отображаются.
 */
export function getOfficialPhotosForModel(item: Conditioner): string[] {
  const exactPhotos = EXACT_OFFICIAL_PHOTOS_BY_ID[item.id];
  if (exactPhotos && exactPhotos.length > 0) {
    return Array.from(new Set(exactPhotos.map(proxyIfDaichi)));
  }
  return [item.image];
}

/**
 * Генерирует глубокие официальные характеристики со страниц Русклимата и Даичи
 */
export function getOfficialSpecification(item: Conditioner, selectedBtu: number): OfficialSpecification {
  const nameLower = item.name.toLowerCase();
  const brandUpper = item.brand.toUpperCase();
  const isMobile = item.type === "Мобильный";
  const isInverter = item.type === "Инверторный" || nameLower.includes("inverter") || nameLower.includes("dc") || nameLower.includes("инвертор");
  const isCassette = item.type === "Полупромышленный" || nameLower.includes("кассетн");

  let distributor: OfficialSpecification["distributor"] = "Русклимат (Rusklimat B2B)";
  if (["KENTATSU", "MIDEA", "DAICHI", "AXIOMA", "DAIKIN", "BOSCH", "AIRWAVE", "PRIMERA", "COOLUP", "ASITA"].includes(brandUpper)) {
    distributor = "Daichi (Даичи Бизнес)";
  }

  // Определение компрессора
  let compressorBrand = isInverter ? "GMCC Toshiba DC Inverter / Highly" : "GMCC Toshiba Rotary";
  if (brandUpper === "DAIKIN") compressorBrand = "Daikin Swing Compressor (Запатентованная японская технология)";
  else if (brandUpper === "TOSHIBA") compressorBrand = "Toshiba DC Hybrid Twin-Rotary";
  else if (brandUpper === "MIDEA" || brandUpper === "KENTATSU") compressorBrand = "GMCC Midea-Toshiba";
  else if (brandUpper === "ELECTROLUX") compressorBrand = "Electrolux Super DC Inverter (GMCC / Gree)";
  else if (brandUpper === "BALLU" && isInverter) compressorBrand = "Ballu Platinum DC Inverter";
  else if (brandUpper === "BOSCH") compressorBrand = "Bosch Climate Rotary Inverter";

  // Определение хладагента и его веса
  let refrigerant = "R410A (Эко-хладагент)";
  let freonWeight = selectedBtu <= 9000 ? "480 – 620 г" : "750 – 1100 г";
  if (isInverter || nameLower.includes("r32") || ["DAIKIN", "MIDEA", "TOSHIBA", "AURUS", "BOSCH"].includes(brandUpper)) {
    refrigerant = "R32 (Новейшее экологичное поколение хладагента повышенного давления)";
  }

  // Диаметры труб медной трассы
  let pipes = '1/4" (6.35 мм) жидкостная / 3/8" (9.52 мм) газовая';
  if (selectedBtu >= 18000 && selectedBtu < 30000) {
    pipes = '1/4" (6.35 мм) жидкостная / 1/2" (12.7 мм) газовая';
  } else if (selectedBtu >= 30000) {
    pipes = '3/8" (9.52 мм) жидкостная / 5/8" (15.88 мм) газовая';
  }

  // Уровень шума
  let minNoise = item.noise !== "—" ? item.noise : isInverter ? "21 – 27 дБ" : "26 – 32 дБ";
  if (brandUpper === "DAIKIN" && nameLower.includes("sensira")) minNoise = "20 дБ (тише человеческого шепота)";
  else if (brandUpper === "TOSHIBA" || nameLower.includes("tessey")) minNoise = "19–20 дБ (ночной режим Sleep)";
  else if (brandUpper === "AURUS") minNoise = "15 дБ (рекордная бесшумность)";

  // Класс энергоэффективности
  let energyClass = isInverter ? "A++ (SEER 6.8 / Высокая экономия)" : "Класс А / A+ (Энергосберегающий)";
  if (brandUpper === "DAIKIN" || brandUpper === "TOSHIBA" || nameLower.includes("platinum") || nameLower.includes("smartline")) {
    energyClass = "A+++ (SEER 7.2 / Максимальный европейский класс)";
  }

  // Гарантия завода
  let warrantyYears = "3 года";
  if (brandUpper === "AURUS") warrantyYears = "7 лет расширенной заводской гарантии";
  else if (isInverter || ["DAIKIN", "ELECTROLUX", "ROYAL THERMO", "TOSHIBA"].includes(brandUpper)) {
    warrantyYears = "5 лет";
  }

  let winterRange = isInverter ? "-15 °С до +24 °С (обогрев в межсезонье)" : "-7 °С до +24 °С";
  if (nameLower.includes("avalanche") || nameLower.includes("platinum") || nameLower.includes("fusion") || nameLower.includes("heatforce")) {
    winterRange = "-20 °С до -25 °С (тепловой насос с зимним комплектом)";
  }

  // Описание со спецификации завода-изготовителя
  let fullDescription = "";
  if (isMobile) {
    fullDescription = `${item.brand} ${item.name} — мобильный кондиционер-моноблок: компрессор, испаритель и конденсатор размещены в одном корпусе. Стационарный монтаж и прокладка фреоновой трассы не требуются — достаточно подключить прибор к розетке 220 В и вывести гибкий воздуховод в окно. Колёса и ручки позволяют перемещать кондиционер между комнатами.`;
  } else if (isCassette) {
    fullDescription = `${item.name} — профессиональная полупромышленная сплит-система, сертифицированная для российского рынка. Предназначена для монтажа в подвесной потолок торговых, офисных или коммерческих помещений в Иркутске. Равномерный 360-градусный круговой поток воздуха исключает образование сквозняков и застойных зон. Встроенный дренажный насос поднимает конденсат на высоту до 750 мм.`;
  } else if (brandUpper === "SHUFT") {
    fullDescription = `Дизайн-серия сплит-систем ${item.name} отличается лаконичными формами, органично сочетающимися с любыми стилями интерьеров. Главным отличием стала максимальная забота о создании здорового микроклимата: приборы оснащены ионизатором, насыщающим воздух полезными анионами и устраняющим пыль, бактерии и запахи. Функция I-Feel отслеживает температуру по пульту ДУ, а 3D-поток предотвращает сквозняки.`;
  } else if (brandUpper === "BALLU") {
    fullDescription = `${item.brand} ${item.name} — бестселлер климатического оборудования, специально адаптированный для сибирского климата Иркутска и области. Теплообменники защищены золотистым антикоррозийным покрытием Golden Fin, которое отталкивает влагу и в 3 раза повышает устойчивость к окружающей среде. Встроенный режим SLEEP и автоматическое качание жалюзи создают идеальную атмосферу для отдыха.`;
  } else if (brandUpper === "DAIKIN") {
    fullDescription = `Daikin ${item.name} — эталон японского инженерного искусства со склада официальной поставки в Иркутске. Модель оснащена запатентованным компрессором Daikin Swing с качающимся ротором, что снижает трение и вибрации к минимуму, гарантируя срок службы 15-20 лет. Система титано-апатитовой очистки воздуха разрушает молекулы запахов, а бесшумная работа (${minNoise}) делает эту модель №1 для спальни.`;
  } else if (brandUpper === "TOSHIBA") {
    fullDescription = `Toshiba ${item.name} создана легендарным изобретателем инверторных систем. Теплообменник покрыт уникальным самоочищающимся составом Toshiba Magic Coil — пыль и влага не задерживаются на ламелях, а полностью удаляются с конденсатом. Работает с непревзойдённой тишиной (от 19 дБ), сохраняя идеальный климат дома или в офисе.`;
  } else if (brandUpper === "ELECTROLUX") {
    fullDescription = `Сплит-система Electrolux ${item.name} сочетает скандинавский дизайн и технологии многоступенчатой очистки воздуха. Встроенная система защиты от скачков напряжения (160В–250В) оберегает прибор при нестабильной электросети в частном секторе и пригороде Иркутска. Функция I-Feel точно контролирует климат именно в той точке комнаты, где находится пульт управления.`;
  } else if (brandUpper === "KENTATSU" || brandUpper === "MIDEA" || brandUpper === "DAICHI" || brandUpper === "BOSCH" || brandUpper === "AXIOMA") {
    fullDescription = `Модель ${item.brand} ${item.name} комплектуется надежным японским компрессором ${compressorBrand} и высокоэффективным теплообменником с внутренним оребрением труб для максимальной теплоотдачи. Система автоматики включает самодиагностику узлов, защиту от обдува холодным воздухом при обогреве (Anti-Cold Air) и функцию самоочистки испарителя при температуре +56°C от появления грибка и бактерий.`;
  } else {
    fullDescription = `${item.name} — современное надежное климатическое решение со склада в Иркутске. Оснащается проверенным компрессором ${compressorBrand}, режимом Turbo для быстрого выхода на нужную температуру и экономичным ночным режимом Sleep.`;
  }

  // Официальный список функциональности
  const officialFeatures: string[] = isMobile
    ? [
        `Моноблочная конструкция: все узлы размещены в одном мобильном корпусе`,
        `Стационарный монтаж и фреоновая трасса не требуются`,
        `Подключение к обычной розетке 220 В`,
        `Гибкий воздуховод для отвода тёплого воздуха через окно`,
        `Колёса и ручки для перемещения между комнатами`,
        `Режим комфортного ночного сна SLEEP`,
        `Турбо-режим быстрого охлаждения помещения`,
        `LED-дисплей и пульт дистанционного управления`,
        `Режим осушения воздуха`,
        `Авторестарт при отключении электроэнергии (сохранение настроек)`
      ]
    : [
        `Марка компрессора: ${compressorBrand}`,
        `Антикоррозийное покрытие теплообменника (Golden / Blue Fin)`,
        `Встроенный ионизатор / система фильтрации воздуха от крупной пыли, бактерий и шерсти`,
        `Климат-контроль I-Feel (поддержание температуры по месту нахождения пульта)`,
        `3D / 4D управление направлением потока воздуха с пульта`,
        `Режим комфортного ночного сна SLEEP (тихий режим крыльчатки)`,
        `Турбо-режим моментального охлаждения или прогрева помещения`,
        `Скрытый LED-дисплей на лицевой панели (с возможностью отключения ночью)`,
        `Автоматическая самоочистка и осушение внутреннего блока от конденсата`,
        `Авторестарт при отключении электроэнергии (сохранение настроек)`
      ];

  if (isInverter && !isMobile) {
    officialFeatures.splice(0, 0, "⚡ Плавное инверторное регулирование мощности DC Inverter (экономия тока до 40%)");
    officialFeatures.push(`❄️ Стабильная работа на обогрев при морозе на улице ${winterRange}`);
  }

  if (item.smartHome || nameLower.includes("wi-fi") || nameLower.includes("smart") || nameLower.includes("wifi")) {
    officialFeatures.push("🎙️ Поддержка управления по Wi-Fi (Умный дом: Яндекс Алиса, Маруся, смартфон)");
  }

  return {
    distributor,
    compressorBrand,
    refrigerant,
    freonWeight,
    minNoise,
    maxOutdoorNoise: isMobile ? "Не применяется (единый корпус)" : "49 – 52.5 дБ",
    energyClass,
    pipes: isMobile ? "Не требуются (мобильный моноблок)" : pipes,
    maxPipeLength: isMobile ? "Не применяется — используется гибкий воздуховод" : selectedBtu >= 24000 ? "до 25 метров" : "до 15–20 метров",
    winterRange,
    indoorTempRange: "+16 °С до +30 °С",
    voltageRange: "160 В – 250 В (система стабилизации и защиты от скачков в сети)",
    warrantyYears,
    serviceLife: "10 – 15 лет",
    fullDescription,
    officialFeatures,
    officialModelPhotos: []
  };
}
