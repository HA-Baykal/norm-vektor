export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, phone, city = 'Иркутск', service = 'Заявка с сайта', details = '—' } = req.body || {};

  const botToken = '8689073934:AAGt-XGBs6SEjVR_Uzy5vtThvGNc8IY9qAs';
  const chatId = '6567941949';

  const text = `🚨 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n` +
    `👤 <b>Имя:</b> ${name || 'Не указано'}\n` +
    `📞 <b>Телефон:</b> ${phone}\n` +
    `📍 <b>Город/Район:</b> ${city}\n` +
    `🛠 <b>Услуга:</b> ${service}\n` +
    `💬 <b>Детали расчёта:</b> ${details || '—'}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, telegram: data });
  } catch (error) {
    console.error('Vercel API leads error:', error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}