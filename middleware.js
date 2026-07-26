// Vercel Edge Middleware для разделения роботов мессенджеров (WhatsApp, Telegram, VK) и обычных людей
export const config = {
  matcher: ['/kondicionery/:slug*', '/ac/:slug*'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  // Проверяем, является ли посетитель ботом социальных сетей или мессенджеров
  const isBot = /WhatsApp|TelegramBot|Twitterbot|facebookexternalhit|LinkedInBot|Viber|vkShare|VKRobot|Discordbot|Slurp|SkypeUriPreview/i.test(userAgent);

  // Если это бот WhatsApp/Telegram пришел за ссылкой на кондиционер — отправляем его в наш OG-генератор!
  if (isBot) {
    const pathParts = url.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    if (slug && slug !== 'kondicionery' && slug !== 'ac') {
      url.pathname = '/api/bot-og';
      url.searchParams.set('slug', slug);
      return Response.rewrite(url);
    }
  }

  // Обычных людей пропускаем без задержки к скоростному React-приложению
  return undefined;
}
