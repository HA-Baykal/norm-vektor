// Единый источник контактов и ссылок на мессенджеры.
// Раньше ссылка на MAX была скопирована в Header и MobileBottomBar —
// теперь все кнопки берут адреса отсюда, менять в одном месте.

export const PHONE_MAIN = "+79149146606";
export const PHONE_MAIN_PRETTY = "+7 (914) 914-66-06";

// MAX — официальный профиль компании в мессенджере MAX.
export const MAX_LINK =
  "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";

// WhatsApp — чат по отдельному номеру (там же, где WhatsApp у владельца),
// текст подставляется заранее.
export const WHATSAPP_LINK =
  "https://wa.me/79247116610?text=" +
  encodeURIComponent("Здравствуйте! Пишу с сайта vektor-komforta.ru");

// Telegram — открывает чат с номером компании прямо в приложении.
// Если у компании появится @ник, заменить на "https://t.me/ник":
// по нику ссылка откроется и на компьютере без установленного Telegram.
export const TELEGRAM_LINK = "tg://resolve?phone=79149146606";
