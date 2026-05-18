export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, profile } = req.body || {};
  if (!phone) return res.status(400).json({ error: 'Falta el número' });

  const entry = {
    phone,
    profile: profile || 'Desconocido',
    timestamp: new Date().toISOString(),
    source: 'Abundanza Chat'
  };

  // Log visible en Vercel → Functions → Logs
  console.log('[LEAD]', JSON.stringify(entry));

  // Si configurás LEAD_WEBHOOK_URL en Vercel (ej: Make, Zapier, n8n),
  // el lead llega ahí automáticamente sin tocar código.
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(entry)
      });
    } catch (e) {
      console.error('[LEAD] Webhook error:', e.message);
    }
  }

  return res.status(200).json({ ok: true });
}
