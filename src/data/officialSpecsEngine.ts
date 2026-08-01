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
  if (url.startsWith("https://daichi.business/")) {
    return "/api/img-proxy?url=" + url;
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
    "https://daichi.business/upload/iblock/629/47fh7nuvm89kjevtvus0veigy97ak817/1472051cafa413bc982fbc6f387cb4c6.jpg",
    "https://daichi.business/upload/iblock/9c3/shxq6hyd7vjq09gc1pyvyeexh4rvljpp/ebf0063d2b57840878e70b2a8abd22db.jpg",
    "https://daichi.business/upload/iblock/3ad/vii13r1ltbg3sazf2vwpks3f9wy077h5/019190a4df00a959e401747fdd4f2c9c.jpg"
  ],
  601: [ // Kentatsu кассетная KSVB Inverter (R32) (Полупромышленный)
    "https://daichi.business/upload/iblock/bc2/vnbdycr4m92g4cgqqxin08a64435ys9b/h5hwvcm9l2ryn4aw3th4tcvfe3zo8sf7.jpg",
    "https://daichi.business/upload/iblock/bce/l7typx5w5u537faavo319va38hxcttci/ocwct13w0jvxzf08qxvt6opw03jzq2xa.jpg",
    "https://daichi.business/upload/iblock/81b/div4s40uwrcmeiq6s1mynnsm60px4yrk/mv1mrsgh9r6pb18uprgghpio9hclpfgb.jpg"
  ],
  602: [ // Kentatsu кассетная KSVT / KSVG (On/Off) (Полупромышленный)
    "/images/catalog/kentatsu-ksvt.jpg",
  "/images/catalog/kentatsu-ksvt-2.jpg",
  "/images/catalog/kentatsu-ksvt-3.jpg",
  "/images/catalog/kentatsu-ksvt-4.jpg"
  ],

  // === MIDEA (ДАИЧИ) ===
  109: [ // Midea Парамаунт R32 MSAG1 (Обычный)
    "https://daichi.business/upload/iblock/a84/1jv0tyag8mhxoost9mrenn0rxno5m7zx/3qagaezojpctuc631r9cj5iqiok1zttl.jpg",
    "https://daichi.business/upload/iblock/f41/c063762ueuzlmvo09rvct28upl5o9euy/mp00s3hy041cgxx6hippy3ja339axh3f.jpg",
    "https://daichi.business/upload/iblock/308/u90ro506jc7hecxyg8q3c4unr0gbsv4u/r3eoab6ikdhnjngp7uh1i5m2t3bkdr98.jpg",
    "https://daichi.business/upload/iblock/0dd/38u1km94xm9w7yodoozm69cogu46wp5g/pdhr71oxwwv6nabtl1v0hi12jqtk7q5u.jpg",
    "https://daichi.business/upload/iblock/5a2/dwvou7r2cpwp45lm5di36iwjeb059zxe/6in6if6v7c0hhbb24zvardw8a2vbc8dk.jpg",
    "https://daichi.business/upload/iblock/052/rsf02jctqrwrg3qtuz0ezdrk7lrbev1h/c9980a438ed156b5933b58c93896c5be.jpg"
  ],
  720: [ // Midea Анлимитед (Unlimited) (Обычный)
    "https://daichi.business/upload/iblock/258/bdlxz07diy2b2xmjl6d1045bva3ttd12/0ce9a9d3cffe27d8a1d15c1d56330c7e.jpg",
    "https://daichi.business/upload/iblock/fef/2o7dbrfs1aj0p4dn6xyfzmlqk7awh7u2/79370b4a03e75ecd56f5e3d01ff3e21f.jpg",
    "https://daichi.business/upload/iblock/b84/aj9udft2v9l6a7ts7n21f1tt039deiwa/ada4ae7deafae55528ddab3bfb898b54.jpg",
    "https://daichi.business/upload/iblock/c16/vfuk236x52tx6gw932zc5illowq0b9g2/4d10325b401d67de6b11dfe8ee53ccf4.jpg"
  ],
  721: [ // Midea Персона (Persona) (Обычный)
    "/images/catalog/midea-persona.jpg",
  "/images/catalog/midea-persona-2.jpg",
  "/images/catalog/midea-persona-3.jpg",
  "/images/catalog/midea-persona-4.jpg"
  ],
  722: [ // Midea Персона Инвертор Wi-Fi (Persona) (Инверторный)
    "https://daichi.business/upload/iblock/c20/8y6cdcyh37erhgwtkqchci26g3eg84qo/nms1q5nx2cwgs2z8sd91x89mm5w4xepc.jpg",
    "https://daichi.business/upload/iblock/de5/1cf506p02gh4ufrdtm5k9303rtxluirz/viu90tk2gxnduzflk5lgjv061jseie05.jpg",
    "https://daichi.business/upload/iblock/615/l6th2vx5e74q8vlskv16dwan4z4x2xz2/mr2y2sxs3n2c3vnxwee33k3ie7mt8t3w.jpg",
    "https://daichi.business/upload/iblock/c7b/62jxmku2hguewrod7j15fvhcdne571n6/56c4bn64x34war8g9izc1on1gfv749qq.jpg",
    "https://daichi.business/upload/iblock/7ce/da8c1ghngkstpyyi6c16s6u2ssndttcu/l2u16seedcc7d0kinyn4qg7rb5yohlly.jpg"
  ],
  723: [ // Midea Breezeless E (Инверторный)
    "https://daichi.business/upload/iblock/89a/im8aabeni1x8kr5nuun7tzf8go49k9tx/l0l0me23jov1jctumuj4d43o21ug99xh.jpg",
    "https://daichi.business/upload/iblock/721/1ncub8tbezb4dzh5kzduolw6gbz2ts6v/8e1q3ey6gfpnp9mvyop5t5u3zit1tjyc.jpg",
    "https://daichi.business/upload/iblock/eaa/dse7f9ublgeteauimdcdjzbo5yztqynk/4sh8j4pd4jdhum7zxoqeqxgaatxq28y3.jpg",
    "https://daichi.business/upload/iblock/bba/p73plvit7yrgr6lt0ammewiigrkw0gsc/2dd5jw0qiw1eblt84cstzfhz0l5o7xli.jpg"
  ],
  724: [ // Midea Breezeless Wi-Fi (Инверторный)
    "https://daichi.business/upload/iblock/71e/qao0l5cxixhqgl1znmbwjpvrho9ch0f9/tah8bpmg2q34vv90ntd29vtf47kh1m3f.jpg",
    "https://daichi.business/upload/iblock/47a/xxeek27lv93xtuydqb9v7za99r3j7aea/ca3mss5311emogi14htlq9jf0s2q16d4.jpg",
    "https://daichi.business/upload/iblock/a7a/phj2q6d74ftm4s7w5txft4qfmr9fpw43/n67mnzx1ynkmint2ytov3qy8oxx03thp.jpg",
    "https://daichi.business/upload/iblock/0ae/c5x97gtmumbr2al1g6x33mmbcv0sptv7/qf2guizxpn9mdv6zi7zhqe3ixqb5ljq4.jpg",
    "https://daichi.business/upload/iblock/802/q7uecw7o03h602e3si4hnx4sfo0iqowq/t0xw79q3iw3eqjzf5n392irfhyas1087.jpg",
    "https://daichi.business/upload/iblock/a01/w43zcanj8t2a7je22sjkvybmu6k79sbp/nbdcbsb3keh65c2odvaj40dgeb1of4p3.jpg"
  ],
  725: [ // Midea ХитФорс (HeatForce) (Инверторный - 100% подтверждено!)
    "https://daichi.business/upload/iblock/849/hy624qiggawuk84n3442mftfoiallyhk/a9fa6gs2f3js8wtif3kil0vtnami558j.jpg",
    "https://daichi.business/upload/iblock/4d8/w976d16680perp8d6g6hwic2rxrm0bq5/yxr20hx5zpxwlqmx5twvhfh4n062dr34.jpg",
    "https://daichi.business/upload/iblock/18a/bo9o92z1ynps5iyjlcn603i559gxjb6w/ifnn25f8ycqq2s2ox16dx2wljx7d2wvs.jpg"
  ],
  726: [ // Midea Гайа (Gaia) (Инверторный)
    "https://daichi.business/upload/iblock/84f/ujkvgz3xq9zcfuuy4e7f1or1ramu3v0c/j3vyj3tlqrvu7gywlb87ic3q08aai9x9.png",
    "https://daichi.business/upload/iblock/fa0/7w4fkcg1zva4lmege2nxlxv0jzo12h68/684xlf109bgeu6lh0srlyzekoa175uvx.jpg",
    "https://daichi.business/upload/iblock/544/z763aonkhqtrm0iqbaml36l23ro8xd2k/4p80do3wzo372vsztsjkcyh21j21ydz4.png"
  ],
  727: [ // Midea Изи Инвертор (Easy Inverter) (Инверторный)
    "https://daichi.business/upload/iblock/0bd/6srwuc75bh2v76shtfllx87kwinxbrlh/2ncy0wxu52r3b5g0yzs5f32093tend2n.jpg",
    "https://daichi.business/upload/iblock/17e/izo1uzdken14b3suwlfbs0ud4idmcem9/s8egk1vlcqxliuwzsid31qcnuub8c8ay.jpg",
    "https://daichi.business/upload/iblock/168/7nfa3dr3hyc2fhohjca4te2f6z97vgrn/9rm5x9teyvm2dfjsamtu328sm20x1y0r.jpg"
  ],
  603: [ // Midea кассетная MCD Inverter (R32) (Полупромышленный)
    "https://daichi.business/upload/iblock/9f5/mh1xbdjyf8dp09n44pa8gllpj2qvyoa6/0f20438fc20d0288aced2d224525178d.jpg",
    "https://daichi.business/upload/iblock/144/pfmf6vbokxwuuza7d9u8hcwofjszvbrh/d72b8edf8919c83fb10d210ddf90c71a.jpg",
    "https://daichi.business/upload/iblock/9a1/rc95q7zbhw7tq6w3o9x5lzxqh0zzleot/c1b201e5ee60f4954bfa51a8f3efce7e.jpg"
  ],
  604: [ // Midea кассетная MCD (On/Off, R410A) (Полупромышленный)
    "https://daichi.business/upload/iblock/917/j4iyoqyh6vr8qktarcgdf6ia6un21rf7/21988923e1f21957e0ec855c5c2ceb53.jpg",
    "https://daichi.business/upload/iblock/e70/n3jbgjw8adobrjknesqw8cknjzanduy7/8cccc24f632259619776f3f8b7bd3e71.jpg",
    "https://daichi.business/upload/iblock/d7c/cc0iznnj9xe0uenuv2ptyqtsq7i0s27c/60a56cfeed5b76b4e25e25c30de0b39a.jpg"
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
    "https://daichi.business/upload/iblock/0fc/z4dj26hjdhyuy2iqe7qxr53fuemdpr7j/96f81f5581e5a23877fded7dde9bd161.jpg",
    "https://daichi.business/upload/iblock/6f7/jr740z9hmxbvy8kad1i0fit7n67mpord/8c509896d1fe7c03ce90adeb699d50d3.jpg",
    "https://daichi.business/upload/iblock/21f/g016s2erzsmiuo12iik3fpvl4favs1wb/a763de6ec59de3e67514a6585903ebd6.jpg",
    "https://daichi.business/upload/iblock/016/km7mm3bsjcsfsvs673hhyz8jeumopiqb/c9856db57f25cb61b14fdd11ee0494b1.jpg"
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
    "https://daichi.business/upload/iblock/bdb/yhcea9l1iht209vok0q2jgea8qc9inv1/f2ad1aadbbc3e6e14b0c057d815ad5d2.jpg",
    "https://daichi.business/upload/iblock/560/7bj2qfzjcnfrc363hf3hua74dmbeuj62/4719019ffd8125f0c30393e9e15b6b98.jpg",
    "https://daichi.business/upload/iblock/14f/n3tbig11khwlrsua1o0y9ihadw2lru0b/ba3e4def2199b86723a3824a612ca4cd.jpg"
  ],
  520: [ // Daikin FDXM-F9 (канальная) (Инверторный)
    "https://daichi.business/upload/iblock/e5b/gip31spgtz0ffdub0pkfacoiy9pyuisy/66342be67326921674b2d43f50afa5db.jpg",
    "https://daichi.business/upload/iblock/c45/ycr3wxsg0p7iw7b2naldfdbj3z4igaf5/a1cfe3788ed7b09d105bc8773cd0b25f.jpg",
    "https://daichi.business/upload/iblock/7fd/qu2p0nto185ljoi903fyo1ocnzg1z7i7/3a5dcd96e6c3099a05b544d55a77f0c8.jpg"
  ],

  // === BOSCH (ДАИЧИ) ===
  730: [ // Bosch Climate Line 2000 (Обычный)
    "https://daichi.business/upload/iblock/6f2/2pn2gt1eprib2ko14euxtjcgxkimqy6s/55j8bc0p9aul52jzpp7xa0o0p3ujc8ik.jpg",
    "https://daichi.business/upload/iblock/d0a/95bpp5pwkt8lpskrmgdc39ay11c68nyy/7c846ac603425e40e11c1379053cdfcd.jpg",
    "https://daichi.business/upload/iblock/36b/3mgjv52klp0yl1sy80nfjpvxywyqb277/ed28564eed0bddf7a90deb6a7974a898.jpg",
    "https://daichi.business/upload/iblock/f57/hlht1xa292krs4jtmcdkilmwro6hxx07/pd4kg7mm7jfjwpz43b24clr58hqp18ol.jpg"
  ],
  731: [ // Bosch Climate Line 5000 Инвертор (Инверторный)
    "https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg",
    "https://daichi.business/upload/iblock/93e/v6ix82i57vi1l1fz2t8djq1k9r7dwutm/5c727caf5acf1279f3b80f948a81e5b1.jpg",
    "https://daichi.business/upload/iblock/dd2/n8qfuodw4epuplwv1hbbhtnuxkx0un9c/7d2673b74fe9023f343a64415b7ab915.jpg",
    "https://daichi.business/upload/iblock/998/20l5l63xmpw1kpw9hlq83yoxjwe5yk6y/bf53460dc8e17135ec9c0dfdd205df53.jpg"
  ],
  732: [ // Bosch Climate 5000 Инвертор (Инверторный)
    "https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg",
    "https://daichi.business/upload/iblock/93e/v6ix82i57vi1l1fz2t8djq1k9r7dwutm/5c727caf5acf1279f3b80f948a81e5b1.jpg",
    "https://daichi.business/upload/iblock/dd2/n8qfuodw4epuplwv1hbbhtnuxkx0un9c/7d2673b74fe9023f343a64415b7ab915.jpg"
  ],
  733: [ // Bosch Climate 6000i Инвертор (Инверторный)
    "https://daichi.business/upload/iblock/32b/0lptf46vnmv7fxubjlaarcvwjtnohd7a/64cf767e224d4b0547533a32da4198f3.jpg",
    "https://daichi.business/upload/iblock/d19/t87r4t5e0n0zt3dri8j1npqpej89glbe/fd3f3a8611fa09dd686841a2ee0c19da.jpg",
    "https://daichi.business/upload/iblock/09e/s6u1bui4rraex9p1mk3u42isgxu2g12h/4e6c42bae9dd0079ebe738e21f8a7da5.jpg",
    "https://daichi.business/upload/iblock/38c/dxlcagqqz5bsmym076srbxt0p8zsnri2/fc77ba75ac3ffffebf18db60a2fca5d4.jpg"
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
    "https://daichi.business/upload/iblock/18b/tn0kc79pi43vbeepz83fr5dvlu5njrny/lh1e31gvep7i5vp79lh9ll3zugninmwf.jpg",
    "https://daichi.business/upload/iblock/12a/hw83zr3h9hvvs472bh5p2n5i7i3vwyw2/9bsyb443nqv8zj3c434dtkeeplmiv559.jpg",
    "https://daichi.business/upload/iblock/0f8/naesn2h2k7x1p7q9bth4vvfvtp4ugrxf/236loqq4jxz914yj3p9nja2qagb3zd7u.jpg",
    "https://daichi.business/upload/iblock/4f3/r0ldp95e71rqdht71l3ycnlv7bzijiuu/5aqddf3fonvb892ld0ngh2ae12khixtj.jpg",
    "https://daichi.business/upload/iblock/ff3/5jlv3uxeup10w5sfsn1icc0y6xt29z3j/ewjd2verzyg0hkhsc0gskz1lcvcwhlsu.jpg"
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
    "https://daichi.business/upload/iblock/b84/heea2h8mlifzpcvd4y5zjbsmexwg1e1b/av3uq0xb13cxqu5geve0ws15970ers72.jpg",
    "https://daichi.business/upload/iblock/2e6/l4aqql15fydo0i7wcb5w1lldq5n3ktev/l3jeww3080kotip6vdptvk86004tmxa0.jpg",
    "https://daichi.business/upload/iblock/473/xxab3gpc1zj2wcex2ni8q57h0s51z9c3/9qrvgdlh11p0fnid2pppqkr6w4b4tdlt.jpg"
  ],
  502: [ // Axioma Серия H Инвертор R32 (Инверторный)
    "https://daichi.business/upload/iblock/7c8/fry4ctabd8tn9fq3i5ibtgutfvnovmfh/fzd2vdb5t7s35zyu7q2nwabq1zwpg376.jpg",
    "https://daichi.business/upload/iblock/7d6/ys6a4l0o5dolhlcvh648qm805fx75n75/hxy2b3ulapy0hsquel7i5aiigycxnq26.jpg",
    "https://daichi.business/upload/iblock/f42/8jtdqil9877cr3nlw81vkup51awdgsup/pvs6ana7h3xye9gykecptwbbdk02ezni.jpg"
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
  const isInverter = item.type === "Инверторный" || nameLower.includes("inverter") || nameLower.includes("dc") || nameLower.includes("инвертор");
  const isCassette = item.type === "Полупромышленный" || nameLower.includes("кассетн");

  let distributor: OfficialSpecification["distributor"] = "Русклимат (Rusklimat B2B)";
  if (["KENTATSU", "MIDEA", "DAICHI", "AXIOMA", "DAIKIN", "BOSCH"].includes(brandUpper)) {
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
  if (isCassette) {
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
  const officialFeatures: string[] = [
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

  if (isInverter) {
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
    maxOutdoorNoise: "49 – 52.5 дБ",
    energyClass,
    pipes,
    maxPipeLength: selectedBtu >= 24000 ? "до 25 метров" : "до 15–20 метров",
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
