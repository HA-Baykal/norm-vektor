// Проверка базы знаний перед сборкой.
//
// Единственный источник правды — тексты статей (articleContent в
// src/pages/BlogArticle.tsx). Карточки списка и src/data/articlesData.ts
// сборка делает из них сама, поэтому разойтись они уже не могут: раньше
// карточки правили руками в BlogPage.tsx, заголовок в списке уезжал от
// заголовка на странице, и статья выпадала из выдачи как дубль.
//
// Что скрипт ловит:
//   • выгруженные файлы (articlesData.ts, blogIndexData.ts) отстали
//     от текстов — значит сборку не запускали после правки статьи;
//   • статью без даты или с темой не из набора сайта;
//   • заголовок, повторённый первым подзаголовком;
//   • первый абзац, дословно повторяющий анонс;
//   • текст короче MIN_WORDS слов — для поиска это не ответ;
//   • адрес, оборванный на полуслове.
//
// Запуск: npm run audit:baza
// Код возврата 1, если есть замечания.

import {
  read,
  readArticleContent,
  buildCards,
  renderArticlesData,
  renderBlogIndexData,
  cardOf,
  ARTICLES_DATA,
  BLOG_INDEX_DATA,
  CATEGORIES,
  INDEX_ICONS,
  ENDING,
  MIN_WORDS,
  sameHeading,
  repeatsLead,
  countWords,
} from "./lib/baza-znaniy.mjs";

// Проиндексированные адреса, которые уже ушли в поисковики с обрывом на
// полуслове. Переименование с 301-редиректом возможно, но это лишняя
// переиндексация, поэтому оставлены как есть.
const INDEXED_TRUNCATED_SLUGS = new Set([
  "energosberegayushhie-okna-dlya-sibiri-kak-vybrat-chtoby-ne-merznut-i-ne-pereplachivat-za-o",
  "kislorodnoe-golodanie-zimoj-pochemu-v-zakrytoj-kvartire-bolit-golova-i-kak-eto-svyazano-s-",
  "pritochnaya-ventilyaciya-dlya-kvartiry-v-irkutske-kak-izbavitsya-ot-duhoty-i-kondensata-na",
  "ventilyaciya-v-novostrojke-irkutska-zimoj-pochemu-zastrojshhik-sdal-kanaly-a-tyagi-net-i-c",
]);

const articles = readArticleContent();
const slugs = Object.keys(articles);
const problems = [];
const say = (slug, text) => problems.push({ slug, text });

for (const slug of slugs) {
  const article = articles[slug];

  let card = null;
  try {
    card = cardOf(slug, article);
  } catch (error) {
    say(slug, error.message);
  }

  if (article.category && !CATEGORIES.includes(article.category)) {
    say(slug, `Тема «${article.category}» не из набора сайта: ${CATEGORIES.join(", ")}`);
  } else if (!(article.category in INDEX_ICONS)) {
    say(slug, `У темы «${article.category}» нет своего значка — карточка покажет серый 📘`);
  }

  if (card) {
    if (!card.excerpt) {
      say(slug, "У статьи нет анонса — в списке будет пустое место");
    } else if (!ENDING.test(card.excerpt.trim())) {
      say(slug, `Анонс оборван на полуслове: «…${card.excerpt.trim().slice(-45)}»`);
    }
  }

  const blocks = article.content || [];
  const first = blocks[0];
  if (first && first.type === "h" && sameHeading(first.text, article.title)) {
    say(slug, "Название повторено первым подзаголовком — в статье видно одну строку дважды");
  }

  const paragraph = blocks.find((b) => b.type === "p");
  if (paragraph && article.summary && repeatsLead(paragraph.text, article.summary)) {
    say(slug, "Первый абзац дословно повторяет анонс");
  }

  const words = countWords(article);
  if (words < MIN_WORDS) say(slug, `В статье ${words} слов — для поиска это не ответ`);

  // Четыре старых адреса обрываются на полуслове, но они уже проиндексированы
  // поисковиками, поэтому оставлены как есть. Новые такие адреса — замечание.
  if (slug.split("-").pop().length <= 2 && !INDEXED_TRUNCATED_SLUGS.has(slug)) {
    say(slug, `Адрес статьи обрывается на полуслове: ${slug}`);
  }

  // Вопросы читают как f.q и f.a — сайт и серверная отрисовка. С другими
  // именами полей блок вопросов выходит пустым, а разметка FAQPage для
  // поисковика остаётся без текста.
  (article.faq || []).forEach((item, i) => {
    const keys = Object.keys(item);
    if (!item.q || !item.a) {
      say(slug, `Вопрос №${i + 1} записан полями ${keys.join(", ")} — нужны q и a, иначе он выйдет пустым`);
    }
  });
}

// Выгруженные файлы должны совпадать с текстами: их читают сборка Vercel
// и серверная отрисовка, и отставший файл — это старые тексты на сайте.
const cards = buildCards(articles);
if (read(ARTICLES_DATA) !== renderArticlesData(articles)) {
  say("—", `${ARTICLES_DATA} отстал от текстов статей — запустите сборку`);
}
if (read(BLOG_INDEX_DATA) !== renderBlogIndexData(cards)) {
  say("—", `${BLOG_INDEX_DATA} отстал от текстов статей — запустите сборку`);
}

// --- отчёт -----------------------------------------------------------------

if (problems.length === 0) {
  console.log(`База знаний в порядке: ${slugs.length} статей, ${cards.length} карточек.`);
  process.exit(0);
}

const grouped = new Map();
for (const { slug, text } of problems) {
  if (!grouped.has(slug)) grouped.set(slug, []);
  grouped.get(slug).push(text);
}

console.log(`Замечаний: ${problems.length} в ${grouped.size} статьях\n`);
for (const [slug, texts] of grouped) {
  console.log(`● ${slug}`);
  for (const text of texts) console.log(`     ${text}`);
}
console.log(`\nВсего статей: ${slugs.length}`);
process.exit(1);
