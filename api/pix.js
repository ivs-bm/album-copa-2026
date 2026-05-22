export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  const { userId, email } = req.body;

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': Math.random().toString(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction_amount: 14.90,
        payment_method_id: 'pix',
        payer: { email: email || 'comprador@email.com' },
        external_reference: userId, 
        description: 'Cofre Família Pro - Álbum 2026',
        notification_url: `https://${req.headers.host}/api/webhook`
      })
    });
    
    const data = await response.json();
    return res.status(200).json({ qr_code: data.point_of_interaction?.transaction_data?.qr_code });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar Pix' });
  }
}
