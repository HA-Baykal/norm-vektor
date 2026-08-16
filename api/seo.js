// Vercel Serverless Function для 100% надёжного парсинга названий моделей и цен для Авито, Яндекс, MAX, CRM, WhatsApp и Google
export default async function handler(req, res) {
  const { slug = "", btu = "" } = req.query || {};
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const targetBtu = parseInt(btu || "0", 10);
  
  // Полная автономная база кондиционеров для облачного сервера Vercel Lambda
  const seoCatalog = [
    { id: "201", name: "SHUFT Berg SFTO", brand: "SHUFT", price: 17351, type: "Обычный", img: "https://rkcdn.ru/products/304ecea4-f226-11f0-b8e1-00505601218a/main_big.jpg" },
    { id: "202", name: "SHUFT TOR SFTM", brand: "SHUFT", price: 20578, type: "Обычный", img: "https://rkcdn.ru/products/ca929e5c-502d-11f0-b8df-00505601218a/main_big.jpg" },
    { id: "203", name: "SHUFT Soturai SFTH", brand: "SHUFT", price: 22694, type: "Обычный", img: "https://rkcdn.ru/products/7264570f-ccd8-11ee-b8d6-00505601218a/main_big.jpg" },
    { id: "301", name: "SHUFT Berg DC SFTOI", brand: "SHUFT", price: 26019, type: "Инверторный", img: "https://rkcdn.ru/products/1a48a1f7-f226-11f0-b8e1-00505601218a/main_big.jpg" },
    { id: "204", name: "Ballu Olympio Pro BSO", brand: "Ballu", price: 24451, type: "Обычный", img: "https://rkcdn.ru/products/3763a5a6-6946-11f1-b8e3-00505601218a/main_big.jpg" },
    { id: "205", name: "Ballu Olympio Edge BSO", brand: "Ballu", price: 25622, type: "Обычный", img: "https://rkcdn.ru/products/03c2c7c2-cf20-11ed-b733-005056013a69/main_big.jpg" },
    { id: "207", name: "Ballu Tessey BST", brand: "Ballu", price: 25622, type: "Обычный", img: "https://rkcdn.ru/products/08e757de-2cf6-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "304", name: "Ballu Tessey DC BSTI", brand: "Ballu", price: 32097, type: "Инверторный", img: "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "305", name: "Ballu Odyssey DC BSOI", brand: "Ballu", price: 31448, type: "Инверторный", img: "https://rkcdn.ru/products/c2baaf40-2cf5-11f1-b8e1-00505601218a/main_big.jpg" },
    { id: "308", name: "Ballu Platinum Evolution DC BSUI", brand: "Ballu", price: 47714, type: "Инверторный", img: "https://rkcdn.ru/products/546d79db-d290-11ef-b8dc-00505601218a/main_big.jpg" },
    { id: "401", name: "Ballu Machine BLC_C кассетная", brand: "Ballu", price: 67512, type: "Полупромышленный", img: "https://rkcdn.ru/products/65fdd6a5-646b-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "209", name: "Royal Thermo Barocco RTB", brand: "Royal Thermo", price: 24638, type: "Обычный", img: "https://rkcdn.ru/products/fe7ca232-5b3f-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "210", name: "Royal Thermo Siena RTS", brand: "Royal Thermo", price: 22791, type: "Обычный", img: "https://rkcdn.ru/products/e6d7f9c1-0c78-11ef-b8d8-00505601218a/main_big.jpg" },
    { id: "311", name: "Royal Thermo Diamond DC RTDI Wi-Fi", brand: "Royal Thermo", price: 28322, type: "Инверторный", img: "https://rkcdn.ru/products/18198e52-4b97-11f0-b8df-00505601218a/main_big.jpg" },
    { id: "312", name: "Royal Thermo Siena DC RTSI", brand: "Royal Thermo", price: 34105, type: "Инверторный", img: "https://rkcdn.ru/products/3e0ffbed-5b40-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "211", name: "Electrolux Skandi EACS-HSK/N3", brand: "Electrolux", price: 25910, type: "Обычный", img: "https://rkcdn.ru/products/e7511050-ece7-11ee-b8d7-00505601218a/main_big.jpg" },
    { id: "212", name: "Electrolux Smartline EACS-HSM/N8", brand: "Electrolux", price: 28410, type: "Обычный", img: "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "213", name: "Electrolux Fusion Wave EACS-HFW/N3", brand: "Electrolux", price: 30391, type: "Обычный", img: "https://rkcdn.ru/products/802b254c-10c4-11f0-b8de-00505601218a/main_big.jpg" },
    { id: "216", name: "Electrolux Nordic EACS-HT/N3", brand: "Electrolux", price: 106550, type: "Обычный", img: "https://rkcdn.ru/products/2e8a20d4-2801-11ef-b8d8-00505601218a/main_big.jpg" },
    { id: "314", name: "Electrolux Smartline DC EACS/I-HSM/N8", brand: "Electrolux", price: 40730, type: "Инверторный", img: "https://rkcdn.ru/products/6e020624-6067-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "315", name: "Electrolux Fusion Wave Super DC EACS/I-HFW/N8", brand: "Electrolux", price: 48490, type: "Инверторный", img: "https://rkcdn.ru/products/2f2b1e80-0b09-11f0-b8de-00505601218a/main_big.jpg" },
    { id: "316", name: "Electrolux Onix Super DC Black", brand: "Electrolux", price: 60470, type: "Инверторный", img: "https://rkcdn.ru/products/0c920006-5d3f-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "102", name: "Kentatsu Кумо KSGKU-HFRN1", brand: "Kentatsu", price: 25736, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/7b2/c5j10n4adp10em9pt66k5j0y8nax98gx/942finr4uomtf9rvijzjbgcw1qcqedqn.jpg" },
    { id: "107", name: "Kentatsu Канами R32 KSGA-HFRN1", brand: "Kentatsu", price: 25046, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/c19/7jle33di9je4o802o87mddzu694wkwca/55507fb2c3118b5bec7567c436d6495c.jpg" },
    { id: "105", name: "Kentatsu Канами Инвертор Wi-Fi", brand: "Kentatsu", price: 37896, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/4bf/ag5ds74v33w169jd9kynxgegm84kbwbu/z8r82162uzfezborqxms4ic3i0foubc1.jpg" },
    { id: "701", name: "Kentatsu Атама (Atama)", brand: "Kentatsu", price: 25210, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/ee8/t7rexgtu91bnpnbfm31mgdysassd0pd6/vp9tk11z6erqnaf304ii24z0wdvys6qf.jpg" },
    { id: "702", name: "Kentatsu Атама Инвертор (Atama Inverter)", brand: "Kentatsu", price: 33716, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/cd7/bi1qr0x2a7e8igc71sb95xy8o9w8k92t/xid6fh9daibmwnse37a00spgsov8q6m3.jpg" },
    { id: "703", name: "Kentatsu Харуки (Haruki)", brand: "Kentatsu", price: 25210, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/57b/38zsy200mt7iu0m3h8xgj4d20cubartk/fgm35i47w6bz5lfwjmluk2ylr6c4rfeh.jpg" },
    { id: "704", name: "Kentatsu Харуки Инвертор (Haruki Inverter)", brand: "Kentatsu", price: 33716, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/35d/i8gppb9juz0c6w2dktcvrdhspglldprk/kvkrs86cnqxa0jbj59057wkr8wq85v3c.jpg" },
    { id: "705", name: "Kentatsu Юки Инвертор (Yuki)", brand: "Kentatsu", price: 32776, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/182/nlwu2e0gjuhcwusny3nz12za1v5jjky8/3hqat1am2vrzrm3lqhxydg1erhr3biy6.jpg" },
    { id: "706", name: "Kentatsu Тиба (Tiba)", brand: "Kentatsu", price: 29366, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/7b3/df23o7hj6c0h8t1kq06gi5e10f2ah7bj/5zmzzsbkyns0vccq040tffxxzfl4w7sb.jpg" },
    { id: "707", name: "Kentatsu Тиба Инвертор (Tiba Inverter)", brand: "Kentatsu", price: 43796, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/a78/ytazgd597v41ilczdrmrrv4syrpuxx8o/d8l5w36v6cbhzzfe03w665m96vml3vml.jpg" },
    { id: "708", name: "Kentatsu Отари Инвертор (Otari)", brand: "Kentatsu", price: 55862, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/bd1/btldz2xh2db6xcmfpkv2ky4ymd9dpepo/2n4j4slqymgf3f9a9vtlzvjn2snageuz.jpg" },
    { id: "709", name: "Kentatsu Семпай Инвертор (Sempai)", brand: "Kentatsu", price: 55766, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/5f7/cq4etos1axlspiy21prliijcaknurk3i/pt627l1g4wvgg977c8zlb9z836ln48eu.jpg" },
    { id: "710", name: "Kentatsu Омори Инвертор (Omori)", brand: "Kentatsu", price: 63831, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/20d/bnrk0pfjyycxogd34r5f6ibeeycq1qdz/s3ocdcm1goojpudn0p7o3zt50137vz3z.jpg" },
    { id: "711", name: "Kentatsu Тамаши Инвертор (Tamashi)", brand: "Kentatsu", price: 71811, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/22c/8xen9zd3mi65cbjemfhrhumiwseerhwh/74tssw48ny4jx3nb0jdfn64u7j50fr98.jpg" },
    { id: "712", name: "Kentatsu Токачи Инвертор (Tokachi)", brand: "Kentatsu", price: 105782, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/63a/np8k2wxvwdtysrt5m16mp1zn5l30xvup/662mnq4x7csfd7r0xs9st1e7441zc2h2.jpg" },
    { id: "713", name: "Kentatsu Ичи Инвертор R32 (Ichi)", brand: "Kentatsu", price: 75991, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/629/47fh7nuvm89kjevtvus0veigy97ak817/1472051cafa413bc982fbc6f387cb4c6.jpg" },
    { id: "601", name: "Kentatsu кассетная KSVB Inverter (R32)", brand: "Kentatsu", price: 125314, type: "Полупромышленный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/bc2/vnbdycr4m92g4cgqqxin08a64435ys9b/h5hwvcm9l2ryn4aw3th4tcvfe3zo8sf7.jpg" },
    { id: "602", name: "Kentatsu кассетная KSVT / KSVG (On/Off)", brand: "Kentatsu", price: 83410, type: "Полупромышленный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/3a2/9iy11ffuroji91vylb0nqsjnpehio98q/2fcvtlh0tdui4hrr3vayrqqxv567oi3t.jpg" },
    { id: "109", name: "Midea Парамаунт R32 MSAG1", brand: "Midea", price: 28410, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/a84/1jv0tyag8mhxoost9mrenn0rxno5m7zx/3qagaezojpctuc631r9cj5iqiok1zttl.jpg" },
    { id: "720", name: "Midea Анлимитед (Unlimited)", brand: "Midea", price: 26591, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/258/bdlxz07diy2b2xmjl6d1045bva3ttd12/0ce9a9d3cffe27d8a1d15c1d56330c7e.jpg" },
    { id: "721", name: "Midea Персона (Persona)", brand: "Midea", price: 31938, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/8de/sw0yaovmpbbnsu4o07nvkabzsnaf2apd/uke0gs7af5e14gf13pwx45d1mr55hclg.jpg" },
    { id: "722", name: "Midea Персона Инвертор Wi-Fi (Persona)", brand: "Midea", price: 45110, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/c20/8y6cdcyh37erhgwtkqchci26g3eg84qo/nms1q5nx2cwgs2z8sd91x89mm5w4xepc.jpg" },
    { id: "723", name: "Midea Breezeless E", brand: "Midea", price: 51982, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/89a/im8aabeni1x8kr5nuun7tzf8go49k9tx/l0l0me23jov1jctumuj4d43o21ug99xh.jpg" },
    { id: "724", name: "Midea Breezeless Wi-Fi", brand: "Midea", price: 71702, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/71e/qao0l5cxixhqgl1znmbwjpvrho9ch0f9/tah8bpmg2q34vv90ntd29vtf47kh1m3f.jpg" },
    { id: "725", name: "Midea ХитФорс (HeatForce)", brand: "Midea", price: 67631, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/849/hy624qiggawuk84n3442mftfoiallyhk/a9fa6gs2f3js8wtif3kil0vtnami558j.jpg" },
    { id: "726", name: "Midea Гайа (Gaia)", brand: "Midea", price: 75158, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/84f/ujkvgz3xq9zcfuuy4e7f1or1ramu3v0c/j3vyj3tlqrvu7gywlb87ic3q08aai9x9.png" },
    { id: "727", name: "Midea Изи Инвертор (Easy Inverter)", brand: "Midea", price: 36268, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/0bd/6srwuc75bh2v76shtfllx87kwinxbrlh/2ncy0wxu52r3b5g0yzs5f32093tend2n.jpg" },
    { id: "603", name: "Midea кассетная MCD Inverter (R32)", brand: "Midea", price: 121754, type: "Полупромышленный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/9f5/mh1xbdjyf8dp09n44pa8gllpj2qvyoa6/0f20438fc20d0288aced2d224525178d.jpg" },
    { id: "604", name: "Midea кассетная MCD (On/Off, R410A)", brand: "Midea", price: 86678, type: "Полупромышленный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/917/j4iyoqyh6vr8qktarcgdf6ia6un21rf7/21988923e1f21957e0ec855c5c2ceb53.jpg" },
    { id: "511", name: "Daikin FTXF Sensira", brand: "Daikin", price: 75810, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/cc6/jm34hyl3p2sxj39pdlpe46fzr56d21kn/7733ead2a8e2b48b0e680ea8b9a65aa7.jpg" },
    { id: "512", name: "Daikin FTXF-F", brand: "Daikin", price: 113715, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/238/s6691tajccy0ton6x3oktjmquou43tbd/nx9knz1eowu2yd1gyg3n963f0x18nvzy.jpg" },
    { id: "513", name: "Daikin FTXS", brand: "Daikin", price: 98067, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/0fc/z4dj26hjdhyuy2iqe7qxr53fuemdpr7j/96f81f5581e5a23877fded7dde9bd161.jpg" },
    { id: "514", name: "Daikin FTYN (On/Off)", brand: "Daikin", price: 47628, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/6fd/1h7ebge4871n6k5jlfdj4lftu1m8rr9y/9400fc8f20307af86600f9c5a6d7e74e.jpg" },
    { id: "515", name: "Daikin FTXJ Emura", brand: "Daikin", price: 198899, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/3c7/rdj04unfv0zjvxzk19x10mogl06oxlcw/5849920929240c4125cdbcba7f4ababc.jpg" },
    { id: "516", name: "Daikin FTXM Perfera", brand: "Daikin", price: 290592, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/8e1/18cuonr7cbh7lew9i624rq94xpzra42w/5ur073eya56kmf8jk8d6bga8nwtjiahe.jpg" },
    { id: "517", name: "Daikin FTXM-A Perfera", brand: "Daikin", price: 224322, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/713/bfow3r76etx8zrwn16at1aa16itub6ce/bd521ea7c974f219c2fc9052b3f145cf.jpg" },
    { id: "518", name: "Daikin FTXJ-AB9", brand: "Daikin", price: 295850, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/790/13thzdv5h53mov9w90oc25mr57g83jar/5c5gt4liasw9y3vpun4vr6yy9xuuv5tk.jpg" },
    { id: "519", name: "Daikin FVXM/RXM (напольная)", brand: "Daikin", price: 408646, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/bdb/yhcea9l1iht209vok0q2jgea8qc9inv1/f2ad1aadbbc3e6e14b0c057d815ad5d2.jpg" },
    { id: "520", name: "Daikin FDXM-F9 (канальная)", brand: "Daikin", price: 353094, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/e5b/gip31spgtz0ffdub0pkfacoiy9pyuisy/66342be67326921674b2d43f50afa5db.jpg" },
    { id: "730", name: "Bosch Climate Line 2000", brand: "Bosch", price: 29750, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/6f2/2pn2gt1eprib2ko14euxtjcgxkimqy6s/55j8bc0p9aul52jzpp7xa0o0p3ujc8ik.jpg" },
    { id: "731", name: "Bosch Climate Line 5000 Инвертор", brand: "Bosch", price: 45110, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg" },
    { id: "732", name: "Bosch Climate 5000 Инвертор", brand: "Bosch", price: 39484, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/653/v1z2i0rg7r2uwy1uh130b46n2stau7vo/65ad09a0d15c6d813071a62646dbf60c.jpg" },
    { id: "733", name: "Bosch Climate 6000i Инвертор", brand: "Bosch", price: 64505, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/32b/0lptf46vnmv7fxubjlaarcvwjtnohd7a/64cf767e224d4b0547533a32da4198f3.jpg" },
    { id: "320", name: "Toshiba Seiya RAS-CVG", brand: "Toshiba", price: 72105, type: "Инверторный", img: "https://rkcdn.ru/products/e90e8f4c-6304-11ef-b8db-00505601218a/main_big.jpg" },
    { id: "108", name: "Daichi Эверест R32 DA-EVQ1R", brand: "Daichi", price: 24490, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/7db/9345zuwtjj0x12p8i8h1hjc25p60kwx8/ffcceac8399e0f4dbb7c3f328a8e9963.jpg" },
    { id: "501", name: "AURUS A DC AAI", brand: "AURUS", price: 117600, type: "Инверторный", img: "https://rkcdn.ru/products/80073bb2-4ab0-11f1-b8e2-00505601218a/main_big.jpg" },
    { id: "106", name: "Axioma Серия H R32 ASX-H1R", brand: "Axioma", price: 20374, type: "Обычный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/729/2yazrrf7llnrycwn7ijzdm3ouy7j3426/ba5f0cb6ed2ca05713043cbbffe9a69e.jpg" },
    { id: "502", name: "Axioma Серия H Инвертор R32", brand: "Axioma", price: 28886, type: "Инверторный", img: "/api/img-proxy?url=https://daichi.business/upload/iblock/b83/5q4sm9gtisizi3ofygnqfn3k1qrgwec7/92e82058c26e611f09bf4655866960ef.jpg" }
  ];
  
  // Полная автономная база SEO-решений по остеклению
  const windowCatalog = [
    { slug: "teploe-osteklenie-lodjii", id: "win-1", title: "Тёплое остекление лоджии и балкона под ключ", price: 38000, unit: "под ключ", desc: "Тёплое остекление пятикамерным профилем VEKA Softline с мультифункциональным стеклопакетом Solar.", img: "/images/windows/window-1.jpg" },
    { slug: "osteklenie-v-dome", id: "win-2", title: "Остекление загородных домов и коттеджей", price: 12800, unit: "за м²", desc: "Специализируемся на остеклении коттеджей из бруса, газобетона и кирпича по трактам Иркутска до 50 км.", img: "/images/windows/window-2.jpg" },
    { slug: "montazh-okon-i-dveri-veka", id: "win-3", title: "Пластиковые окна и балконные двери VEKA (в квартиру)", price: 11000, unit: "за м²", desc: "Замена старых сквозящих окон и балконных блоков на современные тёплые конструкции VEKA с микропроветриванием.", img: "/images/windows/window-3.jpg" },
    { slug: "aluminievoe-osteklenie-doma", id: "win-4", title: "Алюминиевое остекление веранд и зимних садов", price: 14500, unit: "за м²", desc: "Проектирование и сборка алюминиевых конструкций для веранд, террас и беседок в Иркутской области.", img: "/images/windows/window-4.jpg" },
    { slug: "okna-v-dom-panoramy", id: "win-5", title: "Панорамные окна и крупноформатное остекление", price: 16200, unit: "за м²", desc: "Изготовление широкоформатных окон с мультифункциональными энергосберегающими стеклами для коттеджей.", img: "/images/windows/window-5.jpg" },
    { slug: "aluminievyie-konstruktsii", id: "win-6", title: "Алюминиевые входные группы, двери и перегородки", price: 15000, unit: "за м²", desc: "Износостойкие входные группы из теплого алюминия Alutech и усиленного профиля VEKA для бизнеса и коттеджей.", img: "/images/windows/window-6.jpg" }
  ];
  
  // Ищем модель в базе
  const model = seoCatalog.find(c => 
    c.id === slug ||
    c.name.toLowerCase() === decodedSlug ||
    c.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-") === decodedSlug ||
    c.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );
  
  const windowModel = windowCatalog.find(w =>
    w.slug === decodedSlug ||
    w.id.toLowerCase() === decodedSlug ||
    w.title.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );

  // Неизвестный slug → честный 404 с noindex (вместо мягкого 404 на index.html)
  if (!model && !windowModel) {
    const notFoundHtml = `<!doctype html><html lang="ru"><head><meta charset="UTF-8" /><title>Страница не найдена (404) — Вектор Комфорта, Иркутск</title><meta name="robots" content="noindex" /><link rel="canonical" href="https://www.vektor-komforta.ru/" /></head><body><h1>404 — страница не найдена</h1><p>Перейдите на <a href="https://www.vektor-komforta.ru/">главную</a> — окна, кондиционеры и вентиляция в Иркутске.</p></body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(notFoundHtml);
  }
  
  let exactPrice = model ? model.price : windowModel ? windowModel.price : 0;
  let btuText = "";
  if (model && targetBtu > 0) {
    if (targetBtu === 9000) exactPrice = Math.round(model.price * 1.08);
    else if (targetBtu === 12000) exactPrice = Math.round(model.price * 1.25);
    else if (targetBtu === 18000) exactPrice = Math.round(model.price * 1.6);
    else if (targetBtu >= 24000) exactPrice = Math.round(model.price * 2.1);
    btuText = ` (${targetBtu} BTU)`;
  }
  
  // Загружаем актуальный HTML с сервера
  let html = "";
  try {
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "www.vektor-komforta.ru";
    const resp = await fetch(`${proto}://${host}/index.html`);
    if (resp.ok) {
      html = await resp.text();
    }
  } catch (e) {
    console.error("Vercel seo fallback error:", e);
  }
  
  if (!html) {
    html = `<!doctype html><html lang="ru"><head><meta charset="UTF-8" /><title>Вектор Комфорта Иркутск</title></head><body><div id="root"></div></body></html>`;
  }
  
  // Если запрос на кондиционер
  if (model) {
    const title = `${model.name}${btuText}`.trim();
    const desc = `${model.type} сплит-система ${model.brand} ${model.name}${btuText} по оптовой цене со склада в Иркутске. Цена: ${exactPrice.toLocaleString("ru-RU")} ₽. Официальная гарантия до 5 лет!`;
    const pageUrl = `https://www.vektor-komforta.ru/kondicionery/${encodeURIComponent(slug)}${targetBtu > 0 ? `?btu=${targetBtu}` : ""}`;
    const priceStr = exactPrice.toString();
    const canonicalUrl = `https://www.vektor-komforta.ru/kondicionery/${encodeURIComponent(slug)}`;
    
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${model.img}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    
    const seoMetaTags = `
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
  } else if (windowModel) {
    const title = `${windowModel.title}`;
    const desc = `${windowModel.desc} Собственное производство в Иркутске, цена от ${windowModel.price} ₽ ${windowModel.unit}. Монтаж по ГОСТу, гарантия 5 лет!`;
    const pageUrl = `https://www.vektor-komforta.ru/okna/${encodeURIComponent(slug)}`;
    const priceStr = windowModel.price.toString();
    const imgUrl = `https://www.vektor-komforta.ru${windowModel.img}`;
    const canonicalUrl = `https://www.vektor-komforta.ru/okna/${encodeURIComponent(slug)}`;
    
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${desc}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${imgUrl}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    
    const seoMetaTags = `
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
        "image": ["${imgUrl}"],
        "description": "${desc}",
        "sku": "VK-WIN-${windowModel.id}",
        "brand": { "@type": "Brand", "name": "Вектор Комфорта (VEKA / Alutech)" },
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
  }
  
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
}
