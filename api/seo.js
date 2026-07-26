import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Vercel Serverless Function для 100% точного парсинга названий моделей и цен для Авито, Яндекс, MAX, CRM, WhatsApp и Google
export default async function handler(req, res) {
  const { slug = "", btu = "" } = req.query;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const targetBtu = parseInt(btu || "0", 10);

  // Пытаемся подтянуть полную автоматически сгенерированную базу вариантов со сборки
  let generatedCatalog = [];
  try {
    const dataPath = path.join(process.cwd(), "api", "catalog-data.json");
    if (fs.existsSync(dataPath)) {
      generatedCatalog = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    }
  } catch (e) { /* ignore */ }

  // Полная база всех 70 моделей каталога с их точными ценами со склада и официальными фотографиями
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
    { id: "209", name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", price: 23622, type: "Обычный", img: "https://rkcdn.ru/products/d8cfba4b-5b3f-11ef-b8db-00505601218a/main_big.jpg" },
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
    { id: "102", name: "Kentatsu Кумо KSGKU-HFRN1", brand: "Kentatsu", price: 24900, type: "Обычный", img: "https://daichi.business/upload/iblock/96c/bg2umx5kbfcb43hr78r1jxdeos2pc8s6/5qpuwnoyxh2zw46qmssf7tw9ukqxxj09.jpg" },
    { id: "107", name: "Kentatsu Канами R32 KSGA-HFRN1", brand: "Kentatsu", price: 26900, type: "Обычный", img: "https://daichi.business/upload/iblock/691/j778l2zmqoo2epewkvpj7l17cc9mhl7z/79qkglryk4o5w3bimkgu6jzeoyotoo56.jpg" },
    { id: "105", name: "Kentatsu Канами Инвертор Wi-Fi", brand: "Kentatsu", price: 35900, type: "Инверторный", img: "https://daichi.business/upload/iblock/417/skvyuzkhep5hihzjhelaijjhfszyfh3a/c6r8j5av0in9ub33y6ws3050vhgx7was.jpg" },
    { id: "701", name: "Kentatsu Атама (Atama)", brand: "Kentatsu", price: 25900, type: "Обычный", img: "https://daichi.business/upload/iblock/ee8/t7rexgtu91bnpnbfm31mgdysassd0pd6/vp9tk11z6erqnaf304ii24z0wdvys6qf.jpg" },
    { id: "702", name: "Kentatsu Атама Инвертор (Atama Inverter)", brand: "Kentatsu", price: 34900, type: "Инверторный", img: "https://daichi.business/upload/iblock/cd7/bi1qr0x2a7e8igc71sb95xy8o9w8k92t/xid6fh9daibmwnse37a00spgsov8q6m3.jpg" },
    { id: "703", name: "Kentatsu Харуки (Haruki)", brand: "Kentatsu", price: 26900, type: "Обычный", img: "https://daichi.business/upload/iblock/57b/38zsy200mt7iu0m3h8xgj4d20cubartk/fgm35i47w6bz5lfwjmluk2ylr6c4rfeh.jpg" },
    { id: "704", name: "Kentatsu Харуки Инвертор (Haruki Inverter)", brand: "Kentatsu", price: 36900, type: "Инверторный", img: "https://daichi.business/upload/iblock/35d/i8gppb9juz0c6w2dktcvrdhspglldprk/kvkrs86cnqxa0jbj59057wkr8wq85v3c.jpg" },
    { id: "705", name: "Kentatsu Юки Инвертор (Yuki)", brand: "Kentatsu", price: 37900, type: "Инверторный", img: "https://daichi.business/upload/iblock/182/nlwu2e0gjuhcwusny3nz12za1v5jjky8/3hqat1am2vrzrm3lqhxydg1erhr3biy6.jpg" },
    { id: "706", name: "Kentatsu Тиба (Tiba)", brand: "Kentatsu", price: 25500, type: "Обычный", img: "https://daichi.business/upload/iblock/7b3/df23o7hj6c0h8t1kq06gi5e10f2ah7bj/5zmzzsbkyns0vccq040tffxxzfl4w7sb.jpg" },
    { id: "707", name: "Kentatsu Тиба Инвертор (Tiba Inverter)", brand: "Kentatsu", price: 35500, type: "Инверторный", img: "https://daichi.business/upload/iblock/a78/ytazgd597v41ilczdrmrrv4syrpuxx8o/d8l5w36v6cbhzzfe03w665m96vml3vml.jpg" },
    { id: "708", name: "Kentatsu Отари Инвертор (Otari)", brand: "Kentatsu", price: 38900, type: "Инверторный", img: "https://daichi.business/upload/iblock/bd1/btldz2xh2db6xcmfpkv2ky4ymd9dpepo/2n4j4slqymgf3f9a9vtlzvjn2snageuz.jpg" },
    { id: "709", name: "Kentatsu Семпай Инвертор (Sempai)", brand: "Kentatsu", price: 41900, type: "Инверторный", img: "https://daichi.business/upload/iblock/5f7/cq4etos1axlspiy21prliijcaknurk3i/pt627l1g4wvgg977c8zlb9z836ln48eu.jpg" },
    { id: "710", name: "Kentatsu Омори Инвертор (Omori)", brand: "Kentatsu", price: 42900, type: "Инверторный", img: "https://daichi.business/upload/iblock/20d/bnrk0pfjyycxogd34r5f6ibeeycq1qdz/s3ocdcm1goojpudn0p7o3zt50137vz3z.jpg" },
    { id: "711", name: "Kentatsu Тамаши Инвертор (Tamashi)", brand: "Kentatsu", price: 44900, type: "Инверторный", img: "https://daichi.business/upload/iblock/22c/8xen9zd3mi65cbjemfhrhumiwseerhwh/74tssw48ny4jx3nb0jdfn64u7j50fr98.jpg" },
    { id: "712", name: "Kentatsu Токачи Инвертор (Tokachi)", brand: "Kentatsu", price: 45900, type: "Инверторный", img: "https://daichi.business/upload/iblock/63a/np8k2wxvwdtysrt5m16mp1zn5l30xvup/662mnq4x7csfd7r0xs9st1e7441zc2h2.jpg" },
    { id: "713", name: "Kentatsu Ичи Инвертор R32 (Ichi)", brand: "Kentatsu", price: 43900, type: "Инверторный", img: "https://daichi.business/upload/iblock/629/47fh7nuvm89kjevtvus0veigy97ak817/1472051cafa413bc982fbc6f387cb4c6.jpg" },
    { id: "601", name: "Kentatsu кассетная KSVB Inverter (R32)", brand: "Kentatsu", price: 79900, type: "Полупромышленный", img: "https://daichi.business/upload/iblock/bc2/vnbdycr4m92g4cgqqxin08a64435ys9b/h5hwvcm9l2ryn4aw3th4tcvfe3zo8sf7.jpg" },
    { id: "602", name: "Kentatsu кассетная KSVT / KSVG (On/Off)", brand: "Kentatsu", price: 68900, type: "Полупромышленный", img: "https://daichi.business/upload/iblock/3a2/9iy11ffuroji91vylb0nqsjnpehio98q/2fcvtlh0tdui4hrr3vayrqqxv567oi3t.jpg" },
    { id: "109", name: "Midea Парамаунт R32 MSAG1", brand: "Midea", price: 27900, type: "Обычный", img: "https://daichi.business/upload/iblock/a84/1jv0tyag8mhxoost9mrenn0rxno5m7zx/3qagaezojpctuc631r9cj5iqiok1zttl.jpg" },
    { id: "720", name: "Midea Анлимитед (Unlimited)", brand: "Midea", price: 26900, type: "Обычный", img: "https://daichi.business/upload/iblock/258/bdlxz07diy2b2xmjl6d1045bva3ttd12/0ce9a9d3cffe27d8a1d15c1d56330c7e.jpg" },
    { id: "721", name: "Midea Персона (Persona)", brand: "Midea", price: 28900, type: "Обычный", img: "https://daichi.business/upload/iblock/8de/sw0yaovmpbbnsu4o07nvkabzsnaf2apd/uke0gs7af5e14gf13pwx45d1mr55hclg.jpg" },
    { id: "722", name: "Midea Персона Инвертор Wi-Fi (Persona)", brand: "Midea", price: 37900, type: "Инверторный", img: "https://daichi.business/upload/iblock/c20/8y6cdcyh37erhgwtkqchci26g3eg84qo/nms1q5nx2cwgs2z8sd91x89mm5w4xepc.jpg" },
    { id: "723", name: "Midea Breezeless E", brand: "Midea", price: 44900, type: "Инверторный", img: "https://daichi.business/upload/iblock/89a/im8aabeni1x8kr5nuun7tzf8go49k9tx/l0l0me23jov1jctumuj4d43o21ug99xh.jpg" },
    { id: "724", name: "Midea Breezeless Wi-Fi", brand: "Midea", price: 48900, type: "Инверторный", img: "https://daichi.business/upload/iblock/71e/qao0l5cxixhqgl1znmbwjpvrho9ch0f9/tah8bpmg2q34vv90ntd29vtf47kh1m3f.jpg" },
    { id: "725", name: "Midea ХитФорс (HeatForce)", brand: "Midea", price: 38900, type: "Инверторный", img: "https://daichi.business/upload/iblock/849/hy624qiggawuk84n3442mftfoiallyhk/a9fa6gs2f3js8wtif3kil0vtnami558j.jpg" },
    { id: "726", name: "Midea Гайа (Gaia)", brand: "Midea", price: 46900, type: "Инверторный", img: "https://daichi.business/upload/iblock/84f/ujkvgz3xq9zcfuuy4e7f1or1ramu3v0c/j3vyj3tlqrvu7gywlb87ic3q08aai9x9.png" },
    { id: "727", name: "Midea Изи Инвертор (Easy Inverter)", brand: "Midea", price: 39900, type: "Инверторный", img: "https://daichi.business/upload/iblock/0bd/6srwuc75bh2v76shtfllx87kwinxbrlh/2ncy0wxu52r3b5g0yzs5f32093tend2n.jpg" },
    { id: "603", name: "Midea кассетная MCD Inverter (R32)", brand: "Midea", price: 82900, type: "Полупромышленный", img: "https://daichi.business/upload/iblock/9f5/mh1xbdjyf8dp09n44pa8gllpj2qvyoa6/0f20438fc20d0288aced2d224525178d.jpg" },
    { id: "604", name: "Midea кассетная MCD (On/Off, R410A)", brand: "Midea", price: 71900, type: "Полупромышленный", img: "https://daichi.business/upload/iblock/917/j4iyoqyh6vr8qktarcgdf6ia6un21rf7/21988923e1f21957e0ec855c5c2ceb53.jpg" },
    { id: "511", name: "Daikin FTXF Sensira", brand: "Daikin", price: 79800, type: "Инверторный", img: "https://daichi.business/upload/iblock/cc6/jm34hyl3p2sxj39pdlpe46fzr56d21kn/7733ead2a8e2b48b0e680ea8b9a65aa7.jpg" },
    { id: "512", name: "Daikin FTXF-F", brand: "Daikin", price: 119700, type: "Инверторный", img: "https://daichi.business/upload/iblock/238/s6691tajccy0ton6x3oktjmquou43tbd/nx9knz1eowu2yd1gyg3n963f0x18nvzy.jpg" },
    { id: "513", name: "Daikin FTXS", brand: "Daikin", price: 101100, type: "Инверторный", img: "https://daichi.business/upload/iblock/0fc/z4dj26hjdhyuy2iqe7qxr53fuemdpr7j/96f81f5581e5a23877fded7dde9bd161.jpg" },
    { id: "514", name: "Daikin FTYN (On/Off)", brand: "Daikin", price: 48600, type: "Обычный", img: "https://daichi.business/upload/iblock/6fd/1h7ebge4871n6k5jlfdj4lftu1m8rr9y/9400fc8f20307af86600f9c5a6d7e74e.jpg" },
    { id: "515", name: "Daikin FTXJ Emura", brand: "Daikin", price: 145000, type: "Инверторный", img: "https://daichi.business/upload/iblock/3c7/rdj04unfv0zjvxzk19x10mogl06oxlcw/5849920929240c4125cdbcba7f4ababc.jpg" },
    { id: "516", name: "Daikin FTXM Perfera", brand: "Daikin", price: 135000, type: "Инверторный", img: "https://daichi.business/upload/iblock/8e1/18cuonr7cbh7lew9i624rq94xpzra42w/5ur073eya56kmf8jk8d6bga8nwtjiahe.jpg" },
    { id: "517", name: "Daikin FTXM-A Perfera", brand: "Daikin", price: 139000, type: "Инверторный", img: "https://daichi.business/upload/iblock/713/bfow3r76etx8zrwn16at1aa16itub6ce/bd521ea7c974f219c2fc9052b3f145cf.jpg" },
    { id: "518", name: "Daikin FTXJ-AB9", brand: "Daikin", price: 149000, type: "Инверторный", img: "https://daichi.business/upload/iblock/790/13thzdv5h53mov9w90oc25mr57g83jar/5c5gt4liasw9y3vpun4vr6yy9xuuv5tk.jpg" },
    { id: "519", name: "Daikin FVXM/RXM (напольная)", brand: "Daikin", price: 155000, type: "Инверторный", img: "https://daichi.business/upload/iblock/bdb/yhcea9l1iht209vok0q2jgea8qc9inv1/f2ad1aadbbc3e6e14b0c057d815ad5d2.jpg" },
    { id: "520", name: "Daikin FDXM-F9 (канальная)", brand: "Daikin", price: 142000, type: "Инверторный", img: "https://daichi.business/upload/iblock/e5b/gip31spgtz0ffdub0pkfacoiy9pyuisy/66342be67326921674b2d43f50afa5db.jpg" },
    { id: "730", name: "Bosch Climate Line 2000", brand: "Bosch", price: 29900, type: "Обычный", img: "https://daichi.business/upload/iblock/6f2/2pn2gt1eprib2ko14euxtjcgxkimqy6s/55j8bc0p9aul52jzpp7xa0o0p3ujc8ik.jpg" },
    { id: "731", name: "Bosch Climate Line 5000 Инвертор", brand: "Bosch", price: 42900, type: "Инверторный", img: "https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg" },
    { id: "732", name: "Bosch Climate 5000 Инвертор", brand: "Bosch", price: 44900, type: "Инверторный", img: "https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg" },
    { id: "733", name: "Bosch Climate 6000i Инвертор", brand: "Bosch", price: 52900, type: "Инверторный", img: "https://daichi.business/upload/iblock/32b/0lptf46vnmv7fxubjlaarcvwjtnohd7a/64cf767e224d4b0547533a32da4198f3.jpg" },
    { id: "320", name: "Toshiba Seiya RAS-CVG", brand: "Toshiba", price: 52900, type: "Инверторный", img: "https://rkcdn.ru/products/e90e8f4c-6304-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "108", name: "Daichi Эверест R32 DA-EVQ1R", brand: "Daichi", price: 25900, type: "Обычный", img: "https://daichi.business/upload/iblock/18b/tn0kc79pi43vbeepz83fr5dvlu5njrny/lh1e31gvep7i5vp79lh9ll3zugninmwf.jpg" },
    { id: "501", name: "AURUS A DC AAI", brand: "AURUS", price: 120000, type: "Инверторный", img: "https://rkcdn.ru/products/80073bb2-4ab0-11f1-b8e2-00505601218a/main_big.jpg" },
    { id: "106", name: "Axioma Серия H R32 ASX-H1R", brand: "Axioma", price: 23900, type: "Обычный", img: "https://daichi.business/upload/iblock/b84/heea2h8mlifzpcvd4y5zjbsmexwg1e1b/av3uq0xb13cxqu5geve0ws15970ers72.jpg" },
    { id: "502", name: "Axioma Серия H Инвертор R32", brand: "Axioma", price: 32900, type: "Инверторный", img: "https://daichi.business/upload/iblock/7c8/fry4ctabd8tn9fq3i5ibtgutfvnovmfh/fzd2vdb5t7s35zyu7q2nwabq1zwpg376.jpg" }
  ];

  // Ищем модель в базе (распознает как ID 210, так и "Royal-Thermo-Siena-RTS" или с пробелами)
  const model = seoCatalog.find(c => 
    c.id === slug ||
    c.name.toLowerCase() === decodedSlug ||
    c.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-") === decodedSlug ||
    c.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );

  // Ищем в полной серверной базе со сборки, чтобы взять точную цену за выбранный BTU
  let exactPrice = model ? model.price : 0;
  let btuText = "";
  if (model && generatedCatalog && generatedCatalog.length > 0) {
    const genModel = generatedCatalog.find(g => g.id.toString() === model.id);
    if (genModel && genModel.variants) {
      const variant = genModel.variants.find(v => v.btu === targetBtu) || genModel.variants[0];
      exactPrice = variant.price;
      if (targetBtu > 0 && targetBtu === variant.btu) {
        btuText = ` (${variant.btu} BTU, до ${variant.area} м²)`;
      }
    }
  }

  // Пытаемся прочитать реальный собранный index.html на серверах Vercel
  let html = "";
  const candidatePaths = [
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "dist", "index.html"),
    path.join(process.cwd(), "public", "index.html")
  ];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        html = fs.readFileSync(p, "utf-8");
        break;
      }
    } catch (e) { /* ignore */ }
  }

  // Если локальный файл не найден в песочнице Vercel — делаем быстрый запрос
  if (!html) {
    try {
      const proto = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host || "www.vektor-komforta.ru";
      const resp = await fetch(`${proto}://${host}/index.html`);
      if (resp.ok) html = await resp.text();
    } catch (e) {
      console.error("Ошибка загрузки fallback html:", e);
    }
  }

  // Если всё же HTML пустой, создаем минимальный стартовый каркас для React
  if (!html) {
    html = `<!doctype html><html lang="ru"><head><meta charset="UTF-8" /></head><body><div id="root"></div></body></html>`;
  }

  // Если модель найдена — ВШИВАЕМ ВСЕ ТЕГИ ЦЕНЫ И НАЗВАНИЯ ПРЯМО В HTML!
  if (model) {
    const title = `${model.name}${btuText}`.trim();
    const desc = `${model.type} сплит-система ${model.brand} ${model.name}${btuText} по оптовой цене со склада в Иркутске. Цена: ${exactPrice.toLocaleString("ru-RU")} ₽. Официальная гарантия до 5 лет!`;
    const pageUrl = `https://www.vektor-komforta.ru/kondicionery/${encodeURIComponent(slug)}${targetBtu > 0 ? `?btu=${targetBtu}` : ""}`;
    const priceStr = exactPrice.toString();

    // 1. Заменяем заголовок <title> на чистое название модели
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${model.img}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`);

    // 2. Вставляем полный набор тегов цен и Schema.org Product для всех парсеров
    const seoMetaTags = `
    <!-- Товары и цены для парсеров (Авито, Яндекс Маркет, MAX, DNS, CRM) -->
    <meta property="og:type" content="product" />
    <meta property="product:price:amount" content="${priceStr}" />
    <meta property="product:price:currency" content="RUB" />
    <meta property="og:price:amount" content="${priceStr}" />
    <meta property="og:price:currency" content="RUB" />
    <meta itemprop="name" content="${title}" />
    <meta itemprop="price" content="${priceStr}" />
    <meta itemprop="priceCurrency" content="RUB" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${title}",
        "image": ["${model.img}"],
        "description": "${desc}",
        "sku": "VK-${model.id}",
        "brand": { "@type": "Brand", "name": "${model.brand}" },
        "offers": {
          "@type": "Offer",
          "url": "${pageUrl}",
          "priceCurrency": "RUB",
          "price": "${priceStr}",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock"
        }
      }
    </script>
</head>`;

    html = html.replace("</head>", seoMetaTags);

    // 3. Добавляем скрытую видимую разметку в body для HTML-парсеров
    const bodyFallback = `<body>
    <div id="seo-parser-fallback" style="display:none;" itemscope itemtype="https://schema.org/Product">
      <h1 itemprop="name">${title}</h1>
      <span itemprop="brand">${model.brand}</span>
      <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
        <span itemprop="price" class="price product-price">${priceStr}</span>
        <span itemprop="priceCurrency">RUB</span>
      </div>
      <p class="price-text">${priceStr} ₽</p>
    </div>`;
    
    html = html.replace(/<body>/i, bodyFallback);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}
