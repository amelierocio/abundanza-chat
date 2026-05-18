export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, profile } = req.body || {};
  const contact = email || phone;
  if (!contact) return res.status(400).json({ error: 'Falta el contacto' });

  const entry = {
    name:      name  || '',
    email:     email || '',
    phone:     phone || '',
    profile:   profile || 'Desconocido',
    timestamp: new Date().toISOString(),
    source:    'Abundanza Chat'
  };

  console.log('[LEAD]', JSON.stringify(entry));

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: 'Abundanza Chat <onboarding@resend.dev>',
          to: 'amelierocioarte@gmail.com',
          subject: `✦ Nuevo lead — ${entry.profile}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px">
              <h2 style="margin:0 0 20px;font-size:1.1rem;color:#111">✦ Nuevo lead del diagnóstico</h2>
              <p style="margin:0 0 10px;color:#333"><strong>Nombre:</strong> ${entry.name || '—'}</p>
              <p style="margin:0 0 10px;color:#333"><strong>Email:</strong> ${entry.email || '—'}</p>
              <p style="margin:0 0 10px;color:#333"><strong>Perfil:</strong> ${entry.profile}</p>
              <p style="margin:0;color:#999;font-size:0.85rem">${entry.timestamp}</p>
            </div>
          `
        })
      });
    } catch (e) {
      console.error('[LEAD] Email error:', e.message);
    }
  }

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
