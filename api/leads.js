export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { name, phone, city = 'Иркутск', service = 'Заявка с сайта', details = '—' } = req.body || {};
  const botToken = '8689073934:AAGt-XGBs6SEjVR_Uzy5vtThvGNc8IY9qAs';
  const chatId = '6567941949';
  const text = `🚨 НОВАЯ ЗАЯВКА С САЙТА! \n\n` +
    `👤 Имя: ${name || 'Не указано'}\n` +
    `📞 Телефон: ${phone}\n` +
    `📍 Город/Район: ${city}\n` +
    `🛠 Услуга: ${service}\n` +
    `💬 Детали расчёта: ${details || '—'}`;

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
