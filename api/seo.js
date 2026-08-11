// Vercel Serverless Function для 100% надёжного парсинга названий моделей и цен для Авито, Яндекс, MAX, CRM, WhatsApp и Google
export default async function handler(req, res) {
  const { slug = "", btu = "" } = req.query || {};
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const targetBtu = parseInt(btu || "0", 10);
  
  // Полная автономная база кондиционеров для облачного сервера Vercel Lambda
  const seoCatalog = [
    { id: "201", name: "SHUFT Berg SFTO", brand: "SHUFT", price: 16636, type: "Обычный", img: "https://rkcdn.ru/products/304ecea4-f226-11f0-b8e1-00505601218a/main_big.jpg" },
    { id: "202", name: "SHUFT TOR SFTM", brand: "SHUFT", price: 19528, type: "Обычный", img: "https://rkcdn.ru/products/ca929e5c-502d-11f0-b8df-00505601218a/main_big.jpg" },
    { id: "203", name: "SHUFT Soturai SFTH", brand: "SHUFT", price: 22216, type: "Обычный", img: "https://rkcdn.ru/products/7264570f-ccd8-11ee-b8d6-00505601218a/main_big.jpg" },
    { id: "301", name: "SHUFT Berg DC SFTOI", brand: "SHUFT", price: 28900, type: "Инверторный", img: "https://rkcdn.ru/products/1a48a1f7-f226-11f0-b8e1-00505601218a/main_big.jpg" },
    { id: "204", name: "Ballu Olympio Pro BSO", brand: "Ballu", price: 23204, type: "Обычный", img: "https://rkcdn.ru/products/3763a5a6-6946-11f1-b8e3-00505601218a/main_big.jpg" },
    { id: "205", name: "Ballu Olympio Edge BSO", brand: "Ballu", price: 24822, type: "Обычный", img: "https://rkcdn.ru/products/03c2c7c2-cf20-11ed-b733-005056013a69/main_big.jpg" },
    { id: "207", name: "Ballu Tessey BST", brand: "Ballu", price: 24822, type: "Обычный", img: "https://rkcdn.ru/products/08e757de-2cf6-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "304", name: "Ballu Tessey DC BSTI", brand: "Ballu", price: 34900, type: "Инверторный", img: "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "305", name: "Ballu Odyssey DC BSOI", brand: "Ballu", price: 36900, type: "Инверторный", img: "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "308", name: "Ballu Platinum Evolution DC BSUI", brand: "Ballu", price: 34500, type: "Инверторный", img: "https://rkcdn.ru/products/546d79db-d290-11ef-b8dc-00505601218a/main_big.jpg" },
    { id: "401", name: "Ballu Machine BLC_C кассетная", brand: "Ballu", price: 64728, type: "Полупромышленный", img: "https://rkcdn.ru/products/65fdd6a5-646b-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "209", name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", price: 23622, type: "Обычный", img: "https://rkcdn.ru/products/fe7ca232-5b3f-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "210", name: "Royal Thermo Siena RTS", brand: "Royal Thermo", price: 23990, type: "Обычный", img: "https://rkcdn.ru/products/e6d7f9c1-0c78-11ef-b8d8-00505601218a/main_big.jpg" },
    { id: "311", name: "Royal Thermo Diamond DC RTDI Wi-Fi", brand: "Royal Thermo", price: 36500, type: "Инверторный", img: "https://rkcdn.ru/products/18198e52-4b97-11f0-b8df-00505601218a/main_big.jpg" },
    { id: "312", name: "Royal Thermo Siena DC RTSI", brand: "Royal Thermo", price: 32900, type: "Инверторный", img: "https://rkcdn.ru/products/3e0ffbed-5b40-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "211", name: "Electrolux Skandi EACS-HSK/N3", brand: "Electrolux", price: 25900, type: "Обычный", img: "https://rkcdn.ru/products/e7511050-ece7-11ee-b8d7-00505601218a/main_big.jpg" },
    { id: "212", name: "Electrolux Smartline EACS-HSM/N8", brand: "Electrolux", price: 27900, type: "Обычный", img: "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "213", name: "Electrolux Fusion Wave EACS-HFW/N3", brand: "Electrolux", price: 28500, type: "Обычный", img: "https://rkcdn.ru/products/802b254c-10c4-11f0-b8de-00505601218a/main_big.jpg" },
    { id: "216", name: "Electrolux Nordic EACS-HT/N3", brand: "Electrolux", price: 24900, type: "Обычный", img: "https://rkcdn.ru/products/2e8a20d4-2801-11ef-b8d8-00505601218a/main_big.jpg" },
    { id: "314", name: "Electrolux Smartline DC EACS/I-HSM/N8", brand: "Electrolux", price: 38900, type: "Инверторный", img: "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "315", name: "Electrolux Fusion Wave Super DC EACS/I-HFW/N8", brand: "Electrolux", price: 39500, type: "Инверторный", img: "https://rkcdn.ru/products/2f2b1e80-0b09-11f0-b8de-00505601218a/main_big.jpg" },
    { id: "316", name: "Electrolux Onix Super DC Black", brand: "Electrolux", price: 44900, type: "Инверторный", img: "https://rkcdn.ru/products/0c920006-5d3f-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "102", name: "Kentatsu Кумо KSGKU-HFRN1", brand: "Kentatsu", price: 24900, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/7b2/c5j10n4adp10em9pt66k5j0y8nax98gx/942finr4uomtf9rvijzjbgcw1qcqedqn.jpg" },
    { id: "107", name: "Kentatsu Канами R32 KSGA-HFRN1", brand: "Kentatsu", price: 26900, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/c19/7jle33di9je4o802o87mddzu694wkwca/55507fb2c3118b5bec7567c436d6495c.jpg" },
    { id: "105", name: "Kentatsu Канами Инвертор Wi-Fi", brand: "Kentatsu", price: 35900, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/4bf/ag5ds74v33w169jd9kynxgegm84kbwbu/z8r82162uzfezborqxms4ic3i0foubc1.jpg" },
    { id: "701", name: "Kentatsu Атама (Atama)", brand: "Kentatsu", price: 25900, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/ee8/t7rexgtu91bnpnbfm31mgdysassd0pd6/vp9tk11z6erqnaf304ii24z0wdvys6qf.jpg" },
    { id: "702", name: "Kentatsu Атама Инвертор (Atama Inverter)", brand: "Kentatsu", price: 34900, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/cd7/bi1qr0x2a7e8igc71sb95xy8o9w8k92t/xid6fh9daibmwnse37a00spgsov8q6m3.jpg" },
    { id: "703", name: "Kentatsu Харуки (Haruki)", brand: "Kentatsu", price: 26900, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/57b/38zsy200mt7iu0m3h8xgj4d20cubartk/fgm35i47w6bz5lfwjmluk2ylr6c4rfeh.jpg" },
    { id: "704", name: "Kentatsu Харуки Инвертор
